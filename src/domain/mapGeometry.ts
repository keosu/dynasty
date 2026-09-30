import { geoArea } from 'd3-geo';
import type { Polygon, Geometry } from 'geojson';

// D3 spherical polygons use clockwise exterior rings, unlike RFC 7946.
// These East Asian overview territories always occupy less than a hemisphere.
export function territoryPolygon(coordinates: [number, number][]): Polygon {
  const polygon: Polygon = { type: 'Polygon', coordinates: [coordinates] };
  if (geoArea(polygon) > 2 * Math.PI)
    return { type: 'Polygon', coordinates: [[...coordinates].reverse()] };
  return polygon;
}

export function orientGeometry(geometry: Geometry): Geometry {
  if (geometry.type === 'Polygon') {
    return geoArea(geometry) > Math.PI * 2
      ? { ...geometry, coordinates: geometry.coordinates.map((ring) => [...ring].reverse()) }
      : geometry;
  }
  if (geometry.type === 'MultiPolygon') {
    return {
      ...geometry,
      coordinates: geometry.coordinates.map(
        (coordinates) => (orientGeometry({ type: 'Polygon', coordinates }) as Polygon).coordinates,
      ),
    };
  }
  return geometry;
}
