"""Rebuild selected teaching-map outlines; these are NOT official GIS coordinates.

Inputs, page numbers, PDF hashes, path IDs and ground control points are versioned
in textbook-maps.json. Only map outlines are exported, not textbook pages. The
source has no projection metadata: a fitted conic projection is an approximation.
Requires pymupdf, numpy, scipy, pyproj, shapely, requests (see requirements-map.txt).
"""
import hashlib
import json
from pathlib import Path

import numpy as np
import pymupdf
import requests
from pyproj import Proj
from scipy.optimize import least_squares
from shapely import Polygon, MultiPolygon, make_valid
from shapely.geometry import mapping, shape
from shapely.ops import unary_union

ROOT = Path(__file__).resolve().parents[1]


def projection(latitude):
    return Proj(proj='lcc', lat_1=latitude, lat_2=latitude, lat_0=0,
                lon_0=105, R=6371008.8, units='m')


def calibrate(controls, limits=None):
    # Page coordinates in points (the review images were rendered at 2x).
    xy = np.array([c['pixel'] for c in controls], dtype=float) / 2
    ll = np.array([c['coordinates'] for c in controls])

    def projected(latitude):
        return np.array(projection(latitude)(ll[:, 0], ll[:, 1])).T / 1e6

    def fit(latitude, indices=None):
        points = np.column_stack([projected(latitude), np.ones(len(ll))])
        chosen = np.arange(len(ll)) if indices is None else indices
        affine = np.linalg.lstsq(points[chosen], xy[chosen], rcond=None)[0]
        return points @ affine, affine

    best = least_squares(lambda v: (fit(v[0])[0] - xy).ravel(), [35.], bounds=([15.], [65.]))
    latitude = float(best.x[0])
    predicted, affine = fit(latitude)
    errors = np.linalg.norm(predicted - xy, axis=1) * 2
    # Leave-one-out error guards against a visually plausible but unstable fit.
    loo = []
    for i in range(len(ll)):
        prediction, _ = fit(latitude, [j for j in range(len(ll)) if j != i])
        loo.append(float(np.linalg.norm(prediction[i] - xy[i]) * 2))
    limits = limits or {'maxPixels': 10, 'leaveOneOutMaxPixels': 18}
    if max(errors) > limits['maxPixels'] or max(loo) > limits['leaveOneOutMaxPixels']:
        raise ValueError(f'Unreliable calibration: residual {errors}, leave-one-out {loo}')
    matrix = np.linalg.inv(affine[:2])
    proj = projection(latitude)

    def inverse(points):
        projected_points = (np.array(points) - affine[2]) @ matrix * 1e6
        lon, lat = proj(projected_points[:, 0], projected_points[:, 1], inverse=True)
        return [[round(x, 5), round(y, 5)] for x, y in zip(lon, lat)]

    report = dict(projection='fitted Lambert conformal conic + affine',
                  standardParallel=round(latitude, 6), controlCount=len(ll),
                  rmsPixels=round(float(np.sqrt(np.mean(errors ** 2))), 3),
                  maxPixels=round(float(max(errors)), 3),
                  leaveOneOutMaxPixels=round(max(loo), 3), renderScale=2,
                  note='配准残差不是历史边界精度；原图为小比例尺教学示意，不能用于测量。')
    return inverse, report


def rings(drawing):
    result, current = [], []
    for item in drawing['items']:
        if item[0] == 'l':
            points = [tuple(item[1]), tuple(item[2])]
        elif item[0] == 'c':
            p = np.array([tuple(v) for v in item[1:]])
            points = [(1-t)**3*p[0] + 3*(1-t)**2*t*p[1] +
                      3*(1-t)*t*t*p[2] + t**3*p[3] for t in np.linspace(0, 1, 7)]
        else:
            raise ValueError(f'Unexpected PDF path command {item[0]}')
        if current and np.linalg.norm(np.array(current[-1]) - points[0]) > 0.02:
            result.append(current)
            current = []
        current.extend(points if not current else points[1:])
    if current:
        result.append(current)
    return result


def extract_geometry(page, path_ids, inverse):
    polygons = []
    def collect(geometry):
        # PDF fill paths can touch themselves at coastline vertices. make_valid
        # may return polygons plus collapsed lines; keep every polygon component.
        if isinstance(geometry, Polygon) and not geometry.is_empty:
            polygons.append(geometry)
        elif hasattr(geometry, 'geoms'):
            for part in geometry.geoms:
                collect(part)
    drawings = page.get_drawings()
    for index in path_ids:
        for ring in rings(drawings[index]):
            if len(ring) >= 4:
                poly = make_valid(Polygon(inverse(ring)))
                collect(poly)
    geometry = unary_union(polygons).simplify(0.015, preserve_topology=True)
    if not isinstance(geometry, (Polygon, MultiPolygon)) or not geometry.is_valid:
        raise ValueError('Invalid extracted polygon')
    return geometry


def run():
    spec = json.loads((ROOT / 'scripts/textbook-maps.json').read_text(encoding='utf-8'))
    documents = {}
    for key, book in spec['books'].items():
        dest = ROOT / '.cache' / book['cacheFile']
        if not dest.exists():
            dest.parent.mkdir(parents=True, exist_ok=True)
            response = requests.get(book['archiveUrl'], timeout=90)
            response.raise_for_status()
            dest.write_bytes(response.content)
        if hashlib.sha256(dest.read_bytes()).hexdigest() != book['sha256']:
            raise ValueError(f'PDF changed: {key}; recheck path IDs and control points')
        documents[key] = pymupdf.open(dest)
    snapshots = []
    for item in spec['maps']:
        book = spec['books'][item['book']]
        page = documents[item['book']][item['pdfPage'] - 1]
        inverse, report = calibrate(item['controls'], item.get('calibrationLimits'))
        geometry = extract_geometry(page, item['pathIds'], inverse)
        snapshots.append({
            'id': item['id'], 'dynastyId': item['dynastyId'],
            'year': item['year'], 'period': item['period'], 'temporalScope': item['temporalScope'],
            'yearLabel': item['yearLabel'], 'sourceType': 'textbook-derived',
            'sourceName': '教育部组织编写 · 人民教育出版社',
            'sourceUrl': book['publisherUrl'], 'archiveUrl': book['archiveUrl'],
            'citation': f'{book["title"]}，第 {item["printedPage"]} 页，{item["mapTitle"]}',
            'license': '教材原图著作权归原权利人；本站仅提供局部地图轮廓的配准参考，不声明原图开放许可。',
            'precision': '教材地图数字化参考，非官方 GIS；含投影拟合和原图概化误差。',
            'coverageNote': item['coverageNote'], 'calibration': report,
            'features': [{'type': 'Feature', 'properties': {'name': item['mapTitle']},
                          'geometry': mapping(geometry)}],
        })
        print(item['id'], geometry.bounds, report)
    target = ROOT / 'public/data/textbook-boundaries.json'
    target.write_text(json.dumps({'schemaVersion': 1, 'sourcePolicy': spec['sourcePolicy'],
                                 'snapshots': snapshots}, ensure_ascii=False, separators=(',', ':')),
                      encoding='utf-8')
    scene_spec = json.loads((ROOT / 'scripts/conflict-maps.json').read_text(encoding='utf-8'))
    scenes = []
    for item in scene_spec['scenes']:
        book = spec['books'][item['book']]
        page = documents[item['book']][item['pdfPage'] - 1]
        inverse, report = calibrate(item['controls'], item.get('calibrationLimits'))
        polities = []
        for polity in item['polities']:
            geometry = extract_geometry(page, polity['pathIds'], inverse)
            polities.append({k: v for k, v in polity.items() if k != 'pathIds'} | {
                'feature': {'type': 'Feature', 'properties': {'name': polity['name']},
                            'geometry': mapping(geometry)},
            })
        # Printed fills/strokes sometimes overlap at shared borders. Respect the
        # explicit scene layer order (small enclaves last) rather than double-fill.
        covered = Polygon()
        for polity in reversed(polities):
            geometry = shape(polity['feature']['geometry']).difference(covered)
            polity['feature']['geometry'] = mapping(geometry)
            covered = covered.union(geometry)
        scenes.append({k: item[k] for k in ['id', 'name', 'year', 'coverageNote']} | {
            'sourceType': 'textbook-derived', 'sourceName': '教育部组织编写 · 人民教育出版社',
            'sourceUrl': book['publisherUrl'], 'archiveUrl': book['archiveUrl'],
            'citation': f'{book["title"]}，第 {item["printedPage"]} 页，{item["mapTitle"]}',
            'precision': '教材主图数字化参考，非官方 GIS；只表示标示年份，不逐年插值。',
            'calibration': report, 'polities': polities,
        })
        print(item['id'], len(polities), report)
    (ROOT / 'public/data/conflict-boundaries.json').write_text(
        json.dumps({'schemaVersion': 1, 'scenes': scenes}, ensure_ascii=False, separators=(',', ':')),
        encoding='utf-8')
    (ROOT / 'src/data/generated/conflict-periods.json').write_text(json.dumps([
        {'id': s['id'], 'name': s['name'], 'year': s['year'],
         'dynastyIds': list(dict.fromkeys(p['dynastyId'] for p in s['polities']))}
        for s in scenes], ensure_ascii=False, indent=2) + '\n', encoding='utf-8')


if __name__ == '__main__':
    run()
