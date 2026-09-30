import { describe, expect, it } from 'vitest';
import { readFileSync, existsSync } from 'node:fs';
import { geoArea } from 'd3-geo';
import { emperors } from '../data/emperors';
import { dynasties } from '../data/dynasties';
import catalog from '../data/generated/catalog.json';
import manifest from '../data/generated/manifest.json';
import { emperorsInRange } from './queries';
import { orientGeometry } from './mapGeometry';
import type { Feature, Geometry } from 'geojson';

describe('公开资料采集与历史快照', () => {
  it('名单、正文、来源与分政权统计一致，没有未抓取正文', () => {
    expect(catalog.length).toBe(392);
    expect(manifest.articleSuccess).toBe(manifest.count);
    expect(manifest.warnings).toHaveLength(0);
    expect(manifest.groups.reduce((sum, g) => sum + g.count, 0)).toBe(catalog.length);
    expect(emperors).toHaveLength(392);
    for (const person of emperors) {
      expect(dynasties.some((d) => d.id === person.dynastyId)).toBe(true);
      expect(person.biographyId).toBeTruthy();
      expect(existsSync(`public/data/biographies/${person.biographyId}.json`)).toBe(true);
    }
  });
  it('主要王朝的名录完整，包含少帝和后期帝王', () => {
    expect(emperors.filter((p) => p.dynastyId === 'ming')).toHaveLength(16);
    expect(emperors.filter((p) => p.dynastyId === 'qing')).toHaveLength(12);
    expect(emperors.filter((p) => p.dynastyId === 'northern-song')).toHaveLength(9);
    expect(emperors.filter((p) => p.dynastyId === 'tang')).toHaveLength(26);
    expect(
      emperorsInRange(emperors, 'tang', { start: 902, end: 903 }).map((p) => p.title),
    ).toContain('唐昭宗');
    const zhaozong = emperors.find((p) => p.title === '唐昭宗')!;
    expect(zhaozong.reigns).toEqual([
      { start: 888, end: 900 },
      { start: 901, end: 904 },
    ]);
  });
  it('同名政权不混淆，不以帝号别名重复收录同一人', () => {
    expect(emperors.filter((p) => p.dynastyId === 'wei')).toHaveLength(5);
    expect(emperors.filter((p) => p.dynastyId === 'northern-wei')).toHaveLength(16);
    expect(emperors.filter((p) => p.dynastyId === 'wu')).toHaveLength(4);
    expect(emperors.filter((p) => p.name === '赵光义' || p.name === '赵炅')).toHaveLength(1);
    expect(dynasties.some((d) => d.name === '西辽')).toBe(true);
    expect(dynasties.some((d) => d.name === '杨吴')).toBe(true);
  });
  it('历史多边形有明确年份、来源与许可，球面方向正确', () => {
    const data = JSON.parse(readFileSync('public/data/historical-boundaries.json', 'utf8'));
    expect(data.snapshots).toHaveLength(18);
    for (const s of data.snapshots as {
      dynastyId: string;
      year: number;
      sourceUrl: string;
      license: string;
      features: Feature<Geometry>[];
    }[]) {
      const dynasty = dynasties.find((d) => d.id === s.dynastyId)!;
      expect(s.year).toBeGreaterThanOrEqual(dynasty.start);
      expect(s.year).toBeLessThanOrEqual(dynasty.end);
      expect(s.sourceUrl).toContain('aourednik/historical-basemaps');
      expect(s.license).toBe('GPL-3.0');
      for (const feature of s.features) {
        expect(geoArea(orientGeometry(feature.geometry))).toBeLessThan(Math.PI * 2);
      }
    }
    expect(existsSync('public/data/licenses/historical-basemaps-GPL-3.0.txt')).toBe(true);
  });
});
