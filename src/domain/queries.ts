import type { Emperor, HistoricalEvent, Period } from './types';
export const yearLabel = (year: number) => (year < 0 ? `前${Math.abs(year)}` : `${year}`);
export const periodLabel = (period: Period) =>
  `${yearLabel(period.start)} — ${yearLabel(period.end)} 年`;
export const overlaps = (a: Period, b: Period) => a.start <= b.end && a.end >= b.start;
export const emperorsInRange = (items: Emperor[], dynastyId: string, range: Period) =>
  items
    .filter((e) => e.dynastyId === dynastyId && e.reigns.some((r) => overlaps(r, range)))
    .sort(
      (a, b) =>
        Math.min(...a.reigns.filter((r) => overlaps(r, range)).map((r) => r.start)) -
        Math.min(...b.reigns.filter((r) => overlaps(r, range)).map((r) => r.start)),
    );
export const eventsInRange = (items: HistoricalEvent[], dynastyId: string, range: Period) =>
  items.filter((e) => e.dynastyId === dynastyId && overlaps(e, range));
export const matchesSearch = (query: string, ...fields: string[]) =>
  fields.join(' ').toLowerCase().includes(query.trim().toLowerCase());
