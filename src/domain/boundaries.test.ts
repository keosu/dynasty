import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { geoContains, geoArea } from 'd3-geo';
import { mergeBoundarySources, selectBoundary } from './boundaries';
import { westernRegionEvents } from '../data/westernRegions';
import { eventsInRange } from './queries';

const textbook = JSON.parse(readFileSync('public/data/textbook-boundaries.json', 'utf8')).snapshots;
const legacy = JSON.parse(readFileSync('public/data/historical-boundaries.json', 'utf8')).snapshots;
const snapshots = mergeBoundarySources(textbook, legacy);
const contains = (id: string, point: [number, number]) =>
  snapshots.find((s) => s.id === id)!.features.some((f) => geoContains(f, point));

describe('教材疆域与西域回归检查', () => {
  it('汉唐清均包含西域的关键地点，且未错误填满地球', () => {
    for (const id of ['western-han-textbook', 'tang-669-textbook', 'qing-1820-textbook']) {
      for (const point of [
        [82.96, 41.72],
        [84.25, 41.78],
        [79.93, 37.12],
      ] as [number, number][])
        expect(contains(id, point), `${id}: ${point}`).toBe(true);
      expect(contains(id, [0, 0])).toBe(false);
      for (const f of snapshots.find((s) => s.id === id)!.features)
        expect(geoArea(f)).toBeLessThan(Math.PI * 2);
    }
    expect(contains('tang-669-textbook', [89.21, 44])).toBe(true);
    expect(contains('tang-669-textbook', [91.13, 29.65])).toBe(false); // 吐蕃不能随西域扩张一并涂色
    expect(contains('qing-1820-textbook', [81.0, 44.0])).toBe(true);
    expect(contains('qing-1820-textbook', [91.13, 29.65])).toBe(true);
  });
  it('不将669年套到800年，也不将1820年套到清初或新疆建省时', () => {
    expect(selectBoundary(snapshots, 'tang', { start: 618, end: 907 })?.year).toBe(669);
    expect(selectBoundary(snapshots, 'tang', { start: 800, end: 800 })).toBeUndefined();
    expect(selectBoundary(snapshots, 'qing', { start: 1644, end: 1644 })).toBeUndefined();
    expect(selectBoundary(snapshots, 'qing', { start: 1884, end: 1884 })).toBeUndefined();
    expect(selectBoundary(snapshots, 'qing', { start: 1810, end: 1830 })?.year).toBe(1820);
    expect(selectBoundary(snapshots, 'western-han', { start: -100, end: -100 })).toBeUndefined();
    expect(selectBoundary(snapshots, 'western-han', { start: -50, end: -40 })?.temporalScope).toBe(
      'period',
    );
  });
  it('新资料缺失也不恢复已淘汰的汉唐清旧图', () => {
    const withoutNew = mergeBoundarySources([], legacy);
    expect(withoutNew.some((s) => ['western-han', 'tang', 'qing'].includes(s.dynastyId))).toBe(
      false,
    );
  });
  it('来源可追溯，明确区分教材地图与官方GIS，配准有独立误差记录', () => {
    for (const s of textbook) {
      expect(s.citation).toContain('页');
      expect(s.precision).toContain('非官方 GIS');
      expect(s.archiveUrl).toContain('5a80345f2043ba6f8db8d7be9cf3db82725ff1f7');
      expect(s.calibration.controlCount).toBeGreaterThanOrEqual(10);
      expect(s.calibration.leaveOneOutMaxPixels).toBeLessThan(18);
    }
  });
  it('官方资料事件按设立年份出现，北庭702年不提前到669年', () => {
    expect(eventsInRange(westernRegionEvents, 'tang', { start: 669, end: 669 })).toHaveLength(0);
    expect(
      eventsInRange(westernRegionEvents, 'tang', { start: 702, end: 702 }).map((e) => e.id),
    ).toContain('beiting-protectorate');
    expect(
      eventsInRange(westernRegionEvents, 'western-han', { start: -60, end: -60 }).map((e) => e.id),
    ).toContain('western-regions-protectorate');
    expect(
      westernRegionEvents.every((e) =>
        e.sources.some((s) => s.url.startsWith('https://www.gov.cn/')),
      ),
    ).toBe(true);
  });
});
