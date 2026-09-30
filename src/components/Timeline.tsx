import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { ChevronLeft, ChevronRight, RotateCcw, ZoomIn, ZoomOut, GripVertical } from 'lucide-react';
import { dynasties } from '../data/dynasties';
import type { Dynasty, Period } from '../domain/types';
import { periodLabel, yearLabel } from '../domain/queries';
import conflictPeriods from '../data/generated/conflict-periods.json';

const conflictDynasties = new Set(conflictPeriods.flatMap((s) => s.dynastyIds));

export function Timeline({
  dynasty,
  range,
  onDynasty,
  onRange,
}: {
  dynasty: Dynasty;
  range: Period;
  onDynasty: (id: string) => void;
  onRange: (range: Period) => void;
}) {
  const [focused, setFocused] = useState(false);
  const axis = useRef<HTMLDivElement>(null);
  const [axisWidth, setAxisWidth] = useState(1000);
  useEffect(() => {
    if (!axis.current) return;
    const observer = new ResizeObserver(([entry]) => setAxisWidth(entry.contentRect.width));
    observer.observe(axis.current);
    return () => observer.disconnect();
  }, []);
  const min = focused ? dynasty.start : -221,
    max = focused ? dynasty.end : 1912;
  const percent = (year: number) => Math.max(0, Math.min(100, ((year - min) / (max - min)) * 100));
  const main = dynasties.filter(
    (d) => d.territory.length > 0 || conflictDynasties.has(d.id) || d.id === dynasty.id,
  );
  const laneEnds: number[] = [];
  const lanes = new Map<string, number>();
  for (const d of main) {
    let lane = laneEnds.findIndex((end) => end <= d.start);
    if (lane < 0) lane = laneEnds.length;
    laneEnds[lane] = d.end;
    lanes.set(d.id, lane);
  }
  const laneHeight = 24;
  const bandHeight = laneHeight * Math.max(3, laneEnds.length);
  const contemporary = conflictPeriods.find(
    (p) => p.dynastyIds.includes(dynasty.id) && p.year >= range.start && p.year <= range.end,
  );
  const index = main.findIndex((d) => d.id === dynasty.id);
  function update(which: 'start' | 'end', year: number) {
    const value = Math.max(min, Math.min(max, year === 0 ? 1 : year));
    onRange(
      which === 'start'
        ? { start: Math.min(value, range.end), end: range.end }
        : { start: range.start, end: Math.max(value, range.start) },
    );
  }
  const ticks = focused
    ? Array.from({ length: 7 }, (_, i) => Math.round(min + ((max - min) * i) / 6))
    : [-221, 1, 220, 420, 618, 907, 1127, 1368, 1644, 1912];
  return (
    <section
      className="app-timeline"
      aria-label="历史时间轴"
      style={{ '--timeline-band-height': `${bandHeight}px` } as CSSProperties}
    >
      <div className="timeline-toolbar">
        <div className="timeline-current">
          <button
            className="icon-button"
            aria-label="上一个朝代"
            disabled={index <= 0}
            onClick={() => onDynasty(main[index - 1].id)}
          >
            <ChevronLeft size={15} />
          </button>
          <strong>{dynasty.name}</strong>
          <button
            className="icon-button"
            aria-label="下一个朝代"
            disabled={index === main.length - 1}
            onClick={() => onDynasty(main[index + 1].id)}
          >
            <ChevronRight size={15} />
          </button>
          <span className="timeline-divider" />
          <span className="range-title">{periodLabel(range)}</span>
        </div>
        <div className="timeline-actions">
          <label>
            从{' '}
            <input
              aria-label="精确起始年"
              type="number"
              min={min}
              max={range.end}
              value={range.start}
              onChange={(e) => {
                if (e.target.value) update('start', Number(e.target.value));
              }}
            />
          </label>
          <label>
            至{' '}
            <input
              aria-label="精确结束年"
              type="number"
              min={range.start}
              max={max}
              value={range.end}
              onChange={(e) => {
                if (e.target.value) update('end', Number(e.target.value));
              }}
            />
          </label>
          <button
            className="text-button"
            onClick={() => {
              if (!focused)
                onRange({
                  start: Math.max(dynasty.start, Math.min(dynasty.end, range.start)),
                  end: Math.max(dynasty.start, Math.min(dynasty.end, range.end)),
                });
              setFocused((s) => !s);
            }}
          >
            {focused ? <ZoomOut size={14} /> : <ZoomIn size={14} />}
            <span>{focused ? '全部历史' : '放大本朝'}</span>
          </button>
          <button
            className="icon-button"
            aria-label="重置时间范围"
            onClick={() => onRange({ start: dynasty.start, end: dynasty.end })}
          >
            <RotateCcw size={14} />
          </button>
        </div>
      </div>
      <div className="chronology-axis" ref={axis}>
        <div className="chronology-bands">
          {main
            .filter((d) => d.start <= max && d.end >= min)
            .map((d) => (
              <button
                key={d.id}
                className={`chronology-era ${d.id === dynasty.id ? 'active' : ''} ${contemporary?.dynastyIds.includes(d.id) ? 'contemporary' : ''}`}
                title={`${d.name} ${periodLabel(d)}`}
                aria-label={`${d.name}，${periodLabel(d)}`}
                aria-pressed={d.id === dynasty.id}
                onClick={() => onDynasty(d.id)}
                style={{
                  left: `${percent(d.start)}%`,
                  width: `${Math.max(0.4, percent(d.end) - percent(d.start))}%`,
                  top: (lanes.get(d.id) || 0) * laneHeight,
                  height: laneHeight - 2,
                }}
              >
                {((percent(d.end) - percent(d.start)) * axisWidth) / 100 >= d.short.length * 12 + 4
                  ? d.short
                  : ''}
              </button>
            ))}
        </div>
        <div
          className="range-selection"
          style={{
            left: `${percent(range.start)}%`,
            width: `${percent(range.end) - percent(range.start)}%`,
          }}
        />
        {(['start', 'end'] as const).map((which) => (
          <button
            key={which}
            className={`time-handle ${which}`}
            role="slider"
            aria-label={which === 'start' ? '起始年' : '结束年'}
            aria-valuemin={min}
            aria-valuemax={max}
            aria-valuenow={range[which]}
            aria-valuetext={yearLabel(range[which]) + '年'}
            style={{ left: `${percent(range[which])}%` }}
            onPointerDown={(e) => {
              e.preventDefault();
              e.currentTarget.setPointerCapture(e.pointerId);
            }}
            onPointerMove={(e) => {
              if (!e.currentTarget.hasPointerCapture(e.pointerId) || !axis.current) return;
              const rect = axis.current.getBoundingClientRect();
              update(which, Math.round(min + ((e.clientX - rect.left) / rect.width) * (max - min)));
            }}
            onKeyDown={(e) => {
              if (
                ['ArrowLeft', 'ArrowDown', 'ArrowRight', 'ArrowUp', 'Home', 'End'].includes(e.key)
              ) {
                e.preventDefault();
                update(
                  which,
                  e.key === 'Home'
                    ? min
                    : e.key === 'End'
                      ? max
                      : range[which] +
                        (e.key === 'ArrowLeft' || e.key === 'ArrowDown' ? -1 : 1) *
                          (e.shiftKey ? 10 : 1),
                );
              }
            }}
          >
            <GripVertical size={12} />
            <span>{yearLabel(range[which])}</span>
          </button>
        ))}
        <div className="chronology-ticks">
          {ticks.map((year, i) => (
            <span key={i} style={{ left: `${percent(year)}%` }}>
              {year === 0 ? '1' : yearLabel(year)}
            </span>
          ))}
        </div>
      </div>
      <div className="timeline-footnote">
        <span>拖动左右手柄筛选时间 · Shift + 方向键移动十年</span>
        <span>上下分轨表示部分并立政权</span>
      </div>
    </section>
  );
}
