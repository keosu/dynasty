import { useEffect, useMemo, useRef, useState } from 'react';
import {
  GitBranch,
  ListOrdered,
  ZoomIn,
  ZoomOut,
  LocateFixed,
  X,
  ArrowUpRight,
  Search,
} from 'lucide-react';
import { dynasties } from '../data/dynasties';
import { emperors } from '../data/emperors';
import type { Emperor } from '../domain/types';
import { periodLabel } from '../domain/queries';
import { Sources, go } from '../components/Shared';
import { SpeechButton } from '../components/SpeechButton';

export function GenealogyPage({ initialDynasty }: { initialDynasty: string }) {
  const [id, setId] = useState(
    dynasties.some((d) => d.id === initialDynasty) ? initialDynasty : 'tang',
  );
  const [mode, setMode] = useState<'succession' | 'family'>('succession');
  const [active, setActive] = useState<Emperor>();
  const [query, setQuery] = useState('');
  const [view, setView] = useState({ zoom: 1, x: 0, y: 0 });
  useEffect(() => {
    if (dynasties.some((d) => d.id === initialDynasty)) {
      setId(initialDynasty);
      setActive(undefined);
      setView({ zoom: 1, x: 0, y: 0 });
    }
  }, [initialDynasty]);
  const drag = useRef<{ x: number; y: number; panX: number; panY: number } | null>(null);
  const dynasty = dynasties.find((d) => d.id === id)!;
  const people = useMemo(
    () =>
      emperors
        .filter((p) => p.dynastyId === id)
        .sort((a, b) => a.reigns[0].start - b.reigns[0].start),
    [id],
  );
  const episodes = useMemo(
    () =>
      people
        .filter((p) => !p.claimant)
        .flatMap((p) =>
          p.reigns.map((r, i) => ({ person: p, period: r, key: p.id + '-' + i, restored: i > 0 })),
        )
        .sort((a, b) => a.period.start - b.period.start || a.period.end - b.period.end),
    [people],
  );
  const familyLinks = useMemo(
    () =>
      people.flatMap((child) => {
        const parent = people.find(
          (p) =>
            p.id !== child.id &&
            child.parentNames?.some(
              (name) =>
                p.name === name ||
                p.title === name ||
                p.sourceTitle === name ||
                p.title + p.name === name,
            ),
        );
        return parent ? [{ from: parent.id, to: child.id }] : [];
      }),
    [people],
  );
  const nodes =
    mode === 'succession'
      ? episodes
      : people.map((p) => ({ person: p, period: p.reigns[0], key: p.id, restored: false }));
  const columns = 5,
    width = 1100,
    height = Math.max(580, Math.ceil(nodes.length / columns) * 125 + 90);
  const position = (index: number) => {
    const row = Math.floor(index / columns);
    return {
      x: 45 + (row % 2 ? columns - 1 - (index % columns) : index % columns) * 210,
      y: 65 + row * 125,
    };
  };
  const nameMatches = (p: Emperor) => !query || [p.title, p.name].some((v) => v.includes(query));
  return (
    <div className="genealogy-app">
      <div className="workspace-toolbar">
        <div className="workspace-context">
          <GitBranch size={18} />
          <strong>世系与更替</strong>
          <span className="toolbar-separator" />
          <select
            aria-label="世系朝代"
            value={id}
            onChange={(e) => {
              setId(e.target.value);
              setActive(undefined);
              setView({ zoom: 1, x: 0, y: 0 });
              go(`/genealogy/${e.target.value}`);
            }}
          >
            {dynasties.map((d) => (
              <option key={d.id} value={d.id}>
                {d.name}
              </option>
            ))}
          </select>
          <span className="workspace-tag">{people.length} 位君主</span>
        </div>
        <div className="segmented-control">
          <button
            className={mode === 'succession' ? 'active' : ''}
            onClick={() => setMode('succession')}
          >
            <ListOrdered size={14} /> 在位顺序
          </button>
          <button className={mode === 'family' ? 'active' : ''} onClick={() => setMode('family')}>
            <GitBranch size={14} /> 血缘关系
          </button>
        </div>
      </div>
      <div className="genealogy-workspace">
        <div className="genealogy-canvas-wrap">
          <div className="graph-caption">
            <div>
              <h1>
                {dynasty.name}
                <span>{mode === 'succession' ? '皇位更替' : '父子关系'}</span>
              </h1>
              <p>
                {mode === 'succession'
                  ? '每段在位单独成节点，复位会再次出现；连线表示资料中的年代顺序。'
                  : '仅连接人物条目明确列出的父亲；没有证据的血缘不作推断。'}
              </p>
            </div>
            <label className="graph-search">
              <Search size={14} />
              <input
                aria-label="查找世系人物"
                placeholder="查找人物"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </label>
          </div>
          <div
            className="genealogy-canvas"
            onWheel={(e) =>
              setView((v) => ({
                ...v,
                zoom: Math.max(0.4, Math.min(2.5, v.zoom * (e.deltaY < 0 ? 1.06 : 0.94))),
              }))
            }
          >
            <svg
              viewBox={`0 0 ${width} ${height}`}
              aria-label={`${dynasty.name}${mode === 'succession' ? '在位更替图' : '父子关系图'}`}
              onPointerDown={(e) => {
                if ((e.target as Element).closest('[role="button"]')) return;
                drag.current = { x: e.clientX, y: e.clientY, panX: view.x, panY: view.y };
                e.currentTarget.setPointerCapture(e.pointerId);
              }}
              onPointerMove={(e) => {
                if (!drag.current) return;
                const rect = e.currentTarget.getBoundingClientRect();
                const unit = width / rect.width;
                setView((v) => ({
                  ...v,
                  x: drag.current!.panX + (e.clientX - drag.current!.x) * unit,
                  y: drag.current!.panY + (e.clientY - drag.current!.y) * unit,
                }));
              }}
              onPointerUp={() => {
                drag.current = null;
              }}
              onPointerCancel={() => {
                drag.current = null;
              }}
            >
              <defs>
                <marker
                  id="graph-arrow"
                  markerWidth="7"
                  markerHeight="7"
                  refX="6"
                  refY="3.5"
                  orient="auto"
                >
                  <path d="M0 0L7 3.5L0 7Z" className="graph-arrow" />
                </marker>
                <pattern id="graph-dots" width="20" height="20" patternUnits="userSpaceOnUse">
                  <circle cx="1" cy="1" r=".7" className="graph-dot" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#graph-dots)" />
              <g transform={`translate(${view.x} ${view.y}) scale(${view.zoom})`}>
                {mode === 'succession'
                  ? nodes.slice(0, -1).map((node, i) => {
                      const a = position(i),
                        b = position(i + 1),
                        same = a.y === b.y,
                        forward = b.x > a.x;
                      const x1 = same ? (forward ? a.x + 160 : a.x) : a.x + 80,
                        y1 = same ? a.y + 34 : a.y + 68,
                        x2 = same ? (forward ? b.x : b.x + 160) : b.x + 80,
                        y2 = same ? b.y + 34 : b.y;
                      const overlap = nodes[i + 1].period.start < node.period.end;
                      return (
                        <path
                          key={node.key}
                          d={`M${x1},${y1} C${same ? (x1 + x2) / 2 : x1},${same ? y1 : (y1 + y2) / 2} ${same ? (x1 + x2) / 2 : x2},${same ? y2 : (y1 + y2) / 2} ${x2},${y2}`}
                          className={`graph-edge ${overlap ? 'uncertain' : ''}`}
                          markerEnd="url(#graph-arrow)"
                        />
                      );
                    })
                  : familyLinks.map((link) => {
                      const a = position(nodes.findIndex((n) => n.person.id === link.from)),
                        b = position(nodes.findIndex((n) => n.person.id === link.to));
                      return (
                        <path
                          key={link.to}
                          d={`M${a.x + 80},${a.y + 68} C${a.x + 80},${a.y + 115} ${b.x + 80},${b.y - 35} ${b.x + 80},${b.y}`}
                          className="graph-edge family"
                          markerEnd="url(#graph-arrow)"
                        />
                      );
                    })}
                {nodes.map((node, i) => {
                  const { x, y } = position(i);
                  return (
                    <g
                      key={node.key}
                      transform={`translate(${x},${y})`}
                      role="button"
                      tabIndex={0}
                      aria-label={`${node.person.title} ${node.person.name} ${periodLabel(node.period)}`}
                      className={`graph-node ${active?.id === node.person.id ? 'selected' : ''} ${nameMatches(node.person) ? '' : 'dimmed'}`}
                      onClick={() => setActive(node.person)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          setActive(node.person);
                        }
                      }}
                    >
                      <rect width="160" height="68" rx="6" />
                      <rect className="graph-node-accent" width="3" height="38" y="15" rx="1" />
                      <text className="graph-node-title" x="13" y="24">
                        {node.person.title.slice(0, 10)}
                      </text>
                      <text className="graph-node-name" x="13" y="43">
                        {node.person.name}
                      </text>
                      <text className="graph-node-dates" x="13" y="59">
                        {periodLabel(node.period)}
                      </text>
                      {node.restored && (
                        <text className="graph-restored" x="127" y="25">
                          复位
                        </text>
                      )}
                    </g>
                  );
                })}
              </g>
            </svg>
          </div>
          <div className="graph-bottom">
            <span>
              {mode === 'succession'
                ? `${episodes.length} 段在位记录 · 交叠区间使用虚线，不表示直接继位`
                : `${familyLinks.length} 条有来源的父子关系 · ${people.length} 个人物节点`}
            </span>
            <div>
              <button
                className="icon-button"
                aria-label="缩小世系图"
                onClick={() => setView((v) => ({ ...v, zoom: Math.max(0.4, v.zoom - 0.15) }))}
              >
                <ZoomOut size={16} />
              </button>
              <span>{Math.round(view.zoom * 100)}%</span>
              <button
                className="icon-button"
                aria-label="放大世系图"
                onClick={() => setView((v) => ({ ...v, zoom: Math.min(2.5, v.zoom + 0.15) }))}
              >
                <ZoomIn size={16} />
              </button>
              <button
                className="icon-button"
                aria-label="重置世系图"
                onClick={() => setView({ zoom: 1, x: 0, y: 0 })}
              >
                <LocateFixed size={16} />
              </button>
            </div>
          </div>
          {people.some((p) => p.claimant) && (
            <div className="claimant-strip">
              <span>另有称帝者 / 支系</span>
              {people
                .filter((p) => p.claimant)
                .map((p) => (
                  <button key={p.id} onClick={() => setActive(p)}>
                    {p.title} · {p.name}
                  </button>
                ))}
            </div>
          )}
        </div>
        {active && (
          <aside className="inspector-panel">
            <div className="inspector-heading">
              <span>君主档案</span>
              <button
                className="icon-button"
                aria-label="关闭世系人物"
                onClick={() => setActive(undefined)}
              >
                <X size={16} />
              </button>
            </div>
            <div className="inspector-content">
              <span className="inspector-kicker">{dynasty.name}</span>
              <h2>
                {active.title}
                <small>{active.name}</small>
              </h2>
              <p>{active.reigns.map(periodLabel).join(' / ')}</p>
              <SpeechButton text={`${active.title}。${active.summary}`} />
              <p className="inspector-summary">{active.summary}</p>
              {active.parentNames?.length ? (
                <>
                  <h3>来源记载的父亲</h3>
                  <p>{active.parentNames.join('、')}</p>
                </>
              ) : null}
              <button className="inspector-related" onClick={() => go(`/emperors/${active.id}`)}>
                完整档案
                <ArrowUpRight size={14} />
              </button>
              <Sources sources={active.sources} />
            </div>
          </aside>
        )}
      </div>
    </div>
  );
}
