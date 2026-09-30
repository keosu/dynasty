import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { geoContains, geoArea } from 'd3-geo';
import { mergeBoundarySources, selectBoundary, boundaryMatchesDynasty } from './boundaries';
import type { ConflictScene } from './boundaries';
import { dynasties } from '../data/dynasties';
import { emperors } from '../data/emperors';
import { emperorsInRange } from './queries';
import index from '../data/generated/conflict-periods.json';

const scenes: ConflictScene[] = JSON.parse(
  readFileSync('public/data/conflict-boundaries.json', 'utf8'),
).scenes;
const legacy = JSON.parse(readFileSync('public/data/historical-boundaries.json', 'utf8')).snapshots;
const snapshots = mergeBoundarySources([], legacy, scenes);

describe('并立时期的同年疆域', () => {
  it('四个参考年和对应政权齐全，图例不以不同年代拼接', () => {
    expect(scenes.map((s) => s.year)).toEqual([262, 572, 1111, 1142]);
    expect(scenes.map((s) => s.polities.length)).toEqual([3, 4, 3, 3]);
    expect(index.map((s) => s.id)).toEqual(scenes.map((s) => s.id));
    expect(scenes[2].polities.map((p) => p.name)).toEqual(['北宋', '辽', '西夏']);
    expect(scenes[3].polities.map((p) => p.name)).toEqual(['南宋', '金', '西夏']);
    expect(scenes[3].polities.find((p) => p.id === 'jin')?.capital).toBe('上京会宁府');
    expect(scenes[1].polities.find((p) => p.id === 'western-liang')?.note).toContain('五代后梁');
  });
  it('每个政权都能进入同一场景，且只在有参考年份的范围内自动显示', () => {
    for (const scene of scenes) {
      for (const p of scene.polities) {
        const snapshot = selectBoundary(snapshots, p.dynastyId, {
          start: scene.year,
          end: scene.year,
        });
        expect(snapshot?.id).toBe(scene.id);
        expect(boundaryMatchesDynasty(snapshot!, p.dynastyId)).toBe(true);
        const dynasty = dynasties.find((d) => d.id === p.dynastyId)!;
        expect(dynasty).toBeDefined();
        expect(scene.year).toBeGreaterThanOrEqual(dynasty.start);
        expect(scene.year).toBeLessThanOrEqual(dynasty.end);
        expect(
          emperorsInRange(emperors, p.dynastyId, { start: scene.year, end: scene.year }).length,
        ).toBeGreaterThan(0);
      }
    }
    expect(selectBoundary(snapshots, 'shu', { start: 220, end: 230 })).toBeUndefined();
    expect(selectBoundary(snapshots, 'northern-song', { start: 960, end: 1127 })?.year).toBe(1111);
    expect(selectBoundary(snapshots, 'southern-song', { start: 1127, end: 1279 })?.year).toBe(1142);
  });
  it('轮廓非空、球面方向正确、都城和名称在对应疆域内', () => {
    for (const snapshot of snapshots.filter((s) => s.polities)) {
      for (const p of snapshot.polities!) {
        expect(['Polygon', 'MultiPolygon']).toContain(p.feature.geometry.type);
        expect(geoArea(p.feature), p.name).toBeGreaterThan(0.0001);
        expect(geoArea(p.feature)).toBeLessThan(Math.PI);
        expect(geoContains(p.feature, p.capitalCoordinates), `${snapshot.year} ${p.name}都城`).toBe(
          true,
        );
        expect(geoContains(p.feature, p.label), `${snapshot.year} ${p.name}标签`).toBe(true);
        expect(
          snapshot.polities!.filter((other) => geoContains(other.feature, p.capitalCoordinates)),
        ).toHaveLength(1);
      }
      expect(new Set(snapshot.polities!.map((p) => p.color)).size).toBe(snapshot.polities!.length);
      expect(snapshot.citation).toContain('页');
      expect(snapshot.precision).toContain('非官方 GIS');
    }
  });
});
