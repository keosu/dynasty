import { describe, expect, it } from 'vitest';
import { geoArea, geoContains } from 'd3-geo';
import { dynasties } from '../data/dynasties';
import { emperors } from '../data/emperors';
import { events } from '../data/events';
import { successions } from '../data/succession';
import { emperorsInRange, eventsInRange, matchesSearch, overlaps, yearLabel } from './queries';
import { territoryPolygon } from './mapGeometry';

describe('历史纪年与时间筛选', () => {
  it('公元前年份和跨纪元区间正确比较', () => {
    expect(yearLabel(-221)).toBe('前221');
    expect(overlaps({ start: -202, end: 9 }, { start: -10, end: 5 })).toBe(true);
    expect(emperorsInRange(emperors, 'qin', { start: -211, end: -209 }).map((p) => p.id)).toEqual([
      'qin-shi-huang',
      'qin-er-shi',
    ]);
  });
  it('交接年包含两位已收录帝王', () => {
    expect(emperorsInRange(emperors, 'tang', { start: 649, end: 649 }).map((p) => p.id)).toEqual([
      'tang-tai-zong',
      'tang-gao-zong',
    ]);
  });
  it('多次在位不把被废期间计入', () => {
    expect(
      emperorsInRange(emperors, 'ming', { start: 1452, end: 1452 }).some(
        (p) => p.id === 'ming-ying-zong',
      ),
    ).toBe(false);
    expect(
      emperorsInRange(emperors, 'ming', { start: 1457, end: 1457 }).some(
        (p) => p.id === 'ming-ying-zong',
      ),
    ).toBe(true);
    expect(emperorsInRange(emperors, 'tang', { start: 700, end: 700 }).map((p) => p.id)).toEqual([
      'wu-ze-tian',
    ]);
    expect(emperorsInRange(emperors, 'tang', { start: 705, end: 705 }).map((p) => p.id)).toContain(
      'tang-zhong-zong',
    );
  });
  it('持续事件按区间相交筛选，不只匹配起始年', () => {
    expect(eventsInRange(events, 'tang', { start: 760, end: 760 }).map((e) => e.id)).toContain(
      'an-shi',
    );
    expect(eventsInRange(events, 'tang', { start: 764, end: 765 })).toHaveLength(0);
  });
  it('搜索支持地点、帝号和空格处理', () => {
    expect(matchesSearch(' 李世民 ', '唐太宗', '李世民')).toBe(true);
    expect(matchesSearch('洛阳', '长安', '洛阳')).toBe(true);
    expect(matchesSearch('郑和', '李世民')).toBe(false);
  });
});

describe('种子数据完整性', () => {
  it('ID 唯一，来源均存在，纪年有效', () => {
    for (const collection of [dynasties, emperors, events]) {
      expect(new Set(collection.map((item) => item.id)).size).toBe(collection.length);
      for (const item of collection) {
        expect(item.sources.length).toBeGreaterThan(0);
        item.sources.forEach((s) => expect(new URL(s.url).protocol).toBe('https:'));
        const periods = 'reigns' in item ? item.reigns : [item];
        periods.forEach((p) => {
          expect(p.start).not.toBe(0);
          expect(p.end).not.toBe(0);
          expect(p.start).toBeLessThanOrEqual(p.end);
        });
      }
    }
  });
  it('人物、事件和世系引用不存在悬空 ID', () => {
    for (const person of emperors) {
      const dynasty = dynasties.find((d) => d.id === person.dynastyId);
      expect(dynasty).toBeDefined();
      if (!person.imported)
        person.reigns.forEach((r) => {
          expect(r.start).toBeGreaterThanOrEqual(dynasty!.start);
          expect(r.end).toBeLessThanOrEqual(dynasty!.end);
        });
    }
    for (const event of events) {
      expect(dynasties.some((d) => d.id === event.dynastyId)).toBe(true);
      event.emperorIds.forEach((id) => expect(emperors.some((p) => p.id === id)).toBe(true));
      expect(Math.abs(event.coordinates[0])).toBeLessThanOrEqual(180);
      expect(Math.abs(event.coordinates[1])).toBeLessThanOrEqual(90);
    }
    for (const relation of successions) {
      const from = emperors.find((p) => p.id === relation.from),
        to = emperors.find((p) => p.id === relation.to);
      expect(from).toBeDefined();
      expect(to).toBeDefined();
      expect(from!.dynastyId).toBe(to!.dynastyId);
      expect(relation.from).not.toBe(relation.to);
      expect(relation.note.length).toBeGreaterThan(5);
    }
  });
  it('疆域投影方向正确，没有错误填满地球', () => {
    for (const dynasty of dynasties) {
      if (!dynasty.territory.length) continue;
      const polygon = territoryPolygon(dynasty.territory);
      expect(dynasty.territory[0]).toEqual(dynasty.territory.at(-1));
      expect(geoArea(polygon)).toBeGreaterThan(0);
      expect(geoArea(polygon)).toBeLessThan(2 * Math.PI);
      expect(
        geoContains(polygon, dynasty.capitalCoord),
        `${dynasty.name}的都城应在示意范围内`,
      ).toBe(true);
      expect(dynasty.territoryYear).toBeGreaterThanOrEqual(dynasty.start);
      expect(dynasty.territoryYear).toBeLessThanOrEqual(dynasty.end);
    }
  });
});
