import { useEffect, useState } from 'react';
import { ChevronDown, ChevronUp, X } from 'lucide-react';
import type { BoundarySnapshot } from '../domain/boundaries';
import { emperors } from '../data/emperors';
import { emperorsInRange } from '../domain/queries';
import { SpeechButton } from './SpeechButton';

export function ConflictLegend({
  snapshot,
  activeId,
  onSelect,
  hidden,
  onToggle,
}: {
  snapshot: BoundarySnapshot;
  activeId: string;
  onSelect: (id: string) => void;
  hidden: string[];
  onToggle: (id: string) => void;
}) {
  const [collapsed, setCollapsed] = useState(false);
  const active = snapshot.polities?.find((p) => p.id === activeId);
  useEffect(() => {
    if (activeId) setCollapsed(false);
  }, [activeId]);
  const rulers = active
    ? emperorsInRange(emperors, active.dynastyId, { start: snapshot.year, end: snapshot.year })
    : [];
  return (
    <section className="conflict-legend" aria-label="并立政权图例">
      <button
        className="conflict-legend-heading"
        aria-expanded={!collapsed}
        onClick={() => setCollapsed((value) => !value)}
      >
        <strong>同年并立 · {snapshot.year}</strong>
        {collapsed ? <ChevronDown size={14} /> : <ChevronUp size={14} />}
      </button>
      {!collapsed && (
        <>
          <div className="conflict-legend-list">
            {snapshot.polities?.map((p) => (
              <div className="conflict-legend-row" key={p.id}>
                <input
                  type="checkbox"
                  aria-label={`显示${p.name}疆域`}
                  checked={!hidden.includes(p.id)}
                  onChange={() => onToggle(p.id)}
                />
                <button
                  aria-label={`查看${p.name}资料`}
                  aria-pressed={activeId === p.id}
                  onClick={() => onSelect(activeId === p.id ? '' : p.id)}
                >
                  <i style={{ background: p.color }} />
                  <span>{p.name}</span>
                  <small>{p.capital.split('（')[0]}</small>
                </button>
              </div>
            ))}
          </div>
          {active && (
            <div className="conflict-polity-detail">
              <div className="conflict-detail-title">
                <strong>{active.name}</strong>
                <button
                  className="icon-button"
                  aria-label="关闭政权资料"
                  onClick={() => onSelect('')}
                >
                  <X size={14} />
                </button>
              </div>
              <p>都城：{active.capital}</p>
              <p>{active.note}</p>
              <strong>{snapshot.year} 年在位</strong>
              {rulers.length ? (
                rulers.map((p) => (
                  <a key={p.id} href={`#/emperors/${p.id}`}>
                    {p.title} · {p.name} ↗
                  </a>
                ))
              ) : (
                <p>当前名录暂无可匹配记录。</p>
              )}
              <SpeechButton
                text={`${snapshot.year}年，${active.name}。都城${active.capital}。${active.note}。${rulers.map((p) => `在位君主${p.title}，${p.name}`).join('。')}`}
              />
              <a href={snapshot.archiveUrl || snapshot.sourceUrl} target="_blank" rel="noreferrer">
                教材底本与出处 ↗
              </a>
            </div>
          )}
          <small className="conflict-legend-note">同一参考年 · 点击色块或名称查看资料</small>
        </>
      )}
    </section>
  );
}
