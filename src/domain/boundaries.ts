import type { Feature, Geometry } from 'geojson';
import type { Period } from './types';
import { overlaps, yearLabel } from './queries';
import { orientGeometry } from './mapGeometry';

export interface ConflictPolity {
  id: string;
  dynastyId: string;
  name: string;
  color: string;
  label: [number, number];
  capital: string;
  capitalCoordinates: [number, number];
  note: string;
  feature: Feature<Geometry>;
}

export interface ConflictScene {
  id: string;
  name: string;
  year: number;
  polities: ConflictPolity[];
  sourceType: 'textbook-derived';
  sourceName: string;
  sourceUrl: string;
  archiveUrl: string;
  citation: string;
  precision: string;
  coverageNote: string;
}

export interface BoundarySnapshot {
  id: string;
  dynastyId: string;
  year: number;
  period: Period;
  temporalScope: 'snapshot' | 'period';
  yearLabel: string;
  sourceType: 'textbook-derived' | 'legacy';
  sourceName: string;
  sourceUrl: string;
  archiveUrl?: string;
  citation?: string;
  precision: string;
  coverageNote?: string;
  features: Feature<Geometry>[];
  sceneName?: string;
  dynastyIds?: string[];
  polities?: ConflictPolity[];
}

// Never silently reinstate the superseded polygons if the new file fails to load.
export const replacedDynasties = new Set(['western-han', 'tang', 'qing']);

export function mergeBoundarySources(
  textbook: BoundarySnapshot[],
  legacy: Omit<BoundarySnapshot, 'id' | 'period' | 'temporalScope' | 'yearLabel' | 'sourceType'>[],
  scenes: ConflictScene[] = [],
): BoundarySnapshot[] {
  return [
    ...textbook,
    ...scenes.map((scene) => ({
      ...scene,
      dynastyId: scene.polities[0].dynastyId,
      dynastyIds: scene.polities.map((p) => p.dynastyId),
      sceneName: scene.name,
      period: { start: scene.year, end: scene.year },
      temporalScope: 'snapshot' as const,
      yearLabel: `${scene.year} 年`,
      features: scene.polities.map((p) => p.feature),
    })),
    ...legacy
      .filter((s) => !replacedDynasties.has(s.dynastyId))
      .map((s) => ({
        ...s,
        id: `${s.dynastyId}-${s.year}-legacy`,
        period: { start: s.year, end: s.year },
        temporalScope: 'snapshot' as const,
        yearLabel: `${yearLabel(s.year)} 年`,
        sourceType: 'legacy' as const,
        sourceName: 'Historical Basemaps · 旧版未校订',
        coverageNote: '第三方社区数据，尚未按中国出版的历史地图校订；可能遗漏边疆管理区域。',
      })),
  ].map((s) => ({
    ...s,
    features: s.features.map((f) => ({ ...f, geometry: orientGeometry(f.geometry) })),
    polities: s.polities?.map((p) => ({
      ...p,
      feature: { ...p.feature, geometry: orientGeometry(p.feature.geometry) },
    })),
  }));
}

export function boundaryMatchesDynasty(snapshot: BoundarySnapshot, dynastyId: string) {
  return snapshot.dynastyId === dynastyId || !!snapshot.dynastyIds?.includes(dynastyId);
}

export function selectBoundary(snapshots: BoundarySnapshot[], dynastyId: string, range: Period) {
  const midpoint = (range.start + range.end) / 2;
  return snapshots
    .filter((s) => boundaryMatchesDynasty(s, dynastyId) && overlaps(s.period, range))
    .sort(
      (a, b) =>
        Number(a.sourceType === 'legacy') - Number(b.sourceType === 'legacy') ||
        Math.abs(a.year - midpoint) - Math.abs(b.year - midpoint),
    )[0];
}
