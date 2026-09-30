import { useEffect, useMemo, useRef, useState } from 'react';
import { geoMercator, geoPath, geoGraticule } from 'd3-geo';
import type { GeoPermissibleObjects } from 'd3-geo';
import { feature } from 'topojson-client';
import type { Topology } from 'topojson-specification';
import { Plus, Minus, LocateFixed, Layers, X, ArrowUpRight, MapPin, BookOpen } from 'lucide-react';
import type { Dynasty, HistoricalEvent, Period } from '../domain/types';
import { yearLabel } from '../domain/queries';
import { boundaryMatchesDynasty, mergeBoundarySources, selectBoundary } from '../domain/boundaries';
import type { BoundarySnapshot } from '../domain/boundaries';
import { ConflictLegend } from './ConflictLegend';
const cities: [string, number, number][] = [
  ['长安', 108.94, 34.26],
  ['洛阳', 112.45, 34.62],
  ['敦煌', 94.66, 40.14],
  ['龟兹', 82.96, 41.72],
  ['疏勒', 75.99, 39.47],
  ['于阗', 79.93, 37.12],
  ['高昌', 89.53, 42.87],
  ['伊犁', 81.0, 44.0],
  ['成都', 104.07, 30.67],
  ['扬州', 119.42, 32.39],
  ['广州', 113.26, 23.13],
  ['逻些', 91.13, 29.65],
  ['平城', 113.3, 40.08],
  ['开封', 114.31, 34.8],
  ['临安', 120.15, 30.27],
  ['建康', 118.8, 32.06],
];
export function HistoryMap({
  dynasty,
  events,
  focusEvent,
  onSelectEvent,
  range,
}: {
  dynasty: Dynasty;
  events: HistoricalEvent[];
  focusEvent?: HistoricalEvent;
  onSelectEvent?: (event: HistoricalEvent) => void;
  range?: Period;
}) {
  const host = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ width: 1000, height: 650 });
  const [base, setBase] = useState<{
    land: GeoPermissibleObjects;
    rivers: GeoPermissibleObjects;
    lakes: GeoPermissibleObjects;
  }>();
  const [snapshots, setSnapshots] = useState<BoundarySnapshot[]>([]);
  const [boundaryError, setBoundaryError] = useState('');
  const [boundariesLoaded, setBoundariesLoaded] = useState(false);
  const [sourcePanel, setSourcePanel] = useState(false);
  const [pinnedId, setPinnedId] = useState('');
  const [activePolityId, setActivePolityId] = useState('');
  const [hiddenPolities, setHiddenPolities] = useState<string[]>([]);
  const dragDistance = useRef(0);
  const [mapError, setMapError] = useState('');
  const [view, setView] = useState({ zoom: 1, x: 0, y: 0 });
  const viewRef = useRef(view);
  viewRef.current = view;
  const drag = useRef<{ x: number; y: number; panX: number; panY: number } | null>(null);
  const [layers, setLayers] = useState({ territory: true, water: true, events: true, grid: false });
  const [layerPanel, setLayerPanel] = useState(false);
  const [cluster, setCluster] = useState<HistoricalEvent[]>([]);
  useEffect(() => {
    const observer = new ResizeObserver((entries) => {
      const r = entries[0].contentRect;
      setSize({ width: r.width, height: r.height });
    });
    if (host.current) observer.observe(host.current);
    return () => observer.disconnect();
  }, []);
  useEffect(() => {
    let canceled = false;
    async function json(path: string) {
      const response = await fetch(`${import.meta.env.BASE_URL}data/${path}`);
      if (!response.ok) throw Error(path);
      return response.json();
    }
    Promise.all([json('land-50m.json'), json('rivers-50m.geojson'), json('lakes-50m.geojson')])
      .then(([land, rivers, lakes]) => {
        if (!canceled)
          setBase({ land: feature(land as Topology, land.objects.land), rivers, lakes });
      })
      .catch(() => {
        if (!canceled) setMapError('地理底图加载失败，请刷新重试。');
      });
    Promise.allSettled([
      json('textbook-boundaries.json'),
      json('historical-boundaries.json'),
      json('conflict-boundaries.json'),
    ]).then(([textbook, legacy, conflicts]) => {
      if (canceled) return;
      setSnapshots(
        mergeBoundarySources(
          textbook.status === 'fulfilled' ? textbook.value.snapshots : [],
          legacy.status === 'fulfilled' ? legacy.value.snapshots : [],
          conflicts.status === 'fulfilled' ? conflicts.value.scenes : [],
        ),
      );
      setBoundariesLoaded(true);
      if (
        textbook.status === 'rejected' ||
        legacy.status === 'rejected' ||
        conflicts.status === 'rejected'
      )
        setBoundaryError('部分疆域资料加载失败，请刷新重试。未恢复已淘汰的旧图。');
    });
    return () => {
      canceled = true;
    };
  }, []);
  const choices = useMemo(
    () => snapshots.filter((s) => boundaryMatchesDynasty(s, dynasty.id)),
    [snapshots, dynasty.id],
  );
  const automatic = selectBoundary(snapshots, dynasty.id, range ?? dynasty);
  const snapshot = choices.find((s) => s.id === pinnedId) ?? automatic;
  const isPinned = !!pinnedId && snapshot?.id === pinnedId;
  const geometry = useMemo<GeoPermissibleObjects | undefined>(
    () => (snapshot ? { type: 'FeatureCollection', features: snapshot.features } : undefined),
    [snapshot],
  );
  const projection = useMemo(
    () =>
      geoMercator().fitExtent(
        [
          [35, 75],
          [Math.max(75, size.width - 55), Math.max(120, size.height - 65)],
        ],
        geometry ?? {
          type: 'MultiPoint',
          coordinates: [[60, 15], [145, 58], dynasty.capitalCoord],
        },
      ),
    [geometry, size, dynasty.capitalCoord],
  );
  const path = useMemo(() => geoPath(projection), [projection]);
  useEffect(() => {
    setPinnedId('');
  }, [dynasty.id, range?.start, range?.end]);
  useEffect(() => {
    setView({ zoom: 1, x: 0, y: 0 });
    setCluster([]);
    setActivePolityId('');
    setHiddenPolities([]);
  }, [dynasty.id, snapshot?.id]);
  useEffect(() => {
    if (!focusEvent) return;
    const p = projection(focusEvent.coordinates)!;
    setView({ zoom: 1.55, x: (size.width / 2 - p[0]) * 1.55, y: (size.height / 2 - p[1]) * 1.55 });
    setCluster([]);
  }, [focusEvent, projection, size]);
  useEffect(() => {
    setCluster((current) => current.filter((e) => events.some((item) => item.id === e.id)));
  }, [events]);
  function zoom(factor: number, point?: { x: number; y: number }) {
    setView((v) => {
      const next = Math.max(0.65, Math.min(8, v.zoom * factor));
      const ratio = next / v.zoom;
      const px = (point?.x ?? size.width / 2) - size.width / 2,
        py = (point?.y ?? size.height / 2) - size.height / 2;
      return { zoom: next, x: px - (px - v.x) * ratio, y: py - (py - v.y) * ratio };
    });
  }
  useEffect(() => {
    const el = host.current;
    if (!el) return;
    const handler = (e: WheelEvent) => {
      if (
        (e.target as Element).closest(
          'button,.layer-panel,.map-popup,.map-source-panel,.conflict-legend',
        )
      )
        return;
      e.preventDefault();
      const r = el.getBoundingClientRect();
      zoom(e.deltaY < 0 ? 1.15 : 1 / 1.15, { x: e.clientX - r.left, y: e.clientY - r.top });
    };
    el.addEventListener('wheel', handler, { passive: false });
    return () => el.removeEventListener('wheel', handler);
  }, [size]);
  const groups = useMemo(() => {
    const result: HistoricalEvent[][] = [];
    for (const event of events) {
      const p = projection(event.coordinates)!;
      const group = result.find((g) => {
        const q = projection(g[0].coordinates)!;
        return Math.hypot(p[0] - q[0], p[1] - q[1]) * view.zoom < 30;
      });
      if (group) group.push(event);
      else result.push([event]);
    }
    return result;
  }, [events, projection, view.zoom]);
  const capital = projection(dynasty.capitalCoord)!;
  const transform = `translate(${size.width / 2 + view.x},${size.height / 2 + view.y}) scale(${view.zoom}) translate(${-size.width / 2},${-size.height / 2})`;
  return (
    <div
      ref={host}
      className="history-map"
      tabIndex={0}
      aria-label="历史地图画布，方向键移动，加减号缩放"
      onKeyDown={(e) => {
        if (e.target !== e.currentTarget) return;
        if (e.key === '+' || e.key === '=') zoom(1.25);
        else if (e.key === '-') zoom(0.8);
        else if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(e.key)) {
          e.preventDefault();
          setView((v) => ({
            ...v,
            x: v.x + (e.key === 'ArrowLeft' ? 40 : e.key === 'ArrowRight' ? -40 : 0),
            y: v.y + (e.key === 'ArrowUp' ? 40 : e.key === 'ArrowDown' ? -40 : 0),
          }));
        }
      }}
    >
      <svg
        className="map-svg"
        viewBox={`0 0 ${size.width} ${size.height}`}
        aria-label={`${snapshot?.sceneName || dynasty.name}疆域与事件地图`}
        onDoubleClick={(e) => {
          const r = e.currentTarget.getBoundingClientRect();
          zoom(1.5, { x: e.clientX - r.left, y: e.clientY - r.top });
        }}
        onPointerDown={(e) => {
          if ((e.target as Element).closest('.hotspot,[data-map-label]')) return;
          dragDistance.current = 0;
          drag.current = { x: e.clientX, y: e.clientY, panX: view.x, panY: view.y };
          const captureTarget =
            (e.target as Element).closest('.polity-territory') ?? e.currentTarget;
          captureTarget.setPointerCapture(e.pointerId);
        }}
        onPointerMove={(e) => {
          if (!drag.current) return;
          const d = drag.current;
          dragDistance.current = Math.max(
            dragDistance.current,
            Math.hypot(e.clientX - d.x, e.clientY - d.y),
          );
          setView((v) => ({ ...v, x: d.panX + e.clientX - d.x, y: d.panY + e.clientY - d.y }));
        }}
        onPointerUp={() => {
          drag.current = null;
        }}
        onPointerCancel={() => {
          drag.current = null;
        }}
      >
        <defs>
          <pattern id="sea-dots" width="12" height="12" patternUnits="userSpaceOnUse">
            <circle cx="1" cy="1" r=".5" className="sea-dot" />
          </pattern>
        </defs>
        <rect width={size.width} height={size.height} className="map-sea" />
        <rect width={size.width} height={size.height} fill="url(#sea-dots)" />
        <g transform={transform} className="map-content">
          {base && <path d={path(base.land) || ''} className="map-land" />}
          {layers.grid && (
            <path d={path(geoGraticule().step([5, 5])()) || ''} className="map-graticule" />
          )}
          {geometry && layers.territory && !snapshot?.polities && (
            <path
              d={path(geometry) || ''}
              className={`map-territory sourced ${snapshot?.sourceType === 'legacy' ? 'approximate' : 'textbook'}`}
              vectorEffect="non-scaling-stroke"
            />
          )}
          {layers.territory &&
            snapshot?.polities
              ?.filter((p) => !hiddenPolities.includes(p.id))
              .map((p) => (
                <path
                  key={p.id}
                  d={path(p.feature) || ''}
                  role="button"
                  tabIndex={0}
                  aria-label={`${p.name}疆域，${snapshot.year}年`}
                  aria-pressed={activePolityId === p.id}
                  className={`map-territory sourced textbook polity-territory ${activePolityId === p.id ? 'selected' : ''}`}
                  data-polity={p.id}
                  vectorEffect="non-scaling-stroke"
                  style={{ fill: p.color, stroke: p.color }}
                  onClick={() => {
                    if (dragDistance.current < 5) setActivePolityId(p.id);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      setActivePolityId(p.id);
                    }
                  }}
                >
                  <title>
                    {p.name} · {snapshot.year}年 · 都城：{p.capital}
                  </title>
                </path>
              ))}
          {base && layers.water && (
            <>
              <path d={path(base.lakes) || ''} className="map-lakes" />
              <path
                d={path(base.rivers) || ''}
                className="map-rivers"
                vectorEffect="non-scaling-stroke"
              />
            </>
          )}
          {!snapshot?.polities &&
            cities.map(([name, lon, lat]) => {
              const [x, y] = projection([lon, lat])!;
              return (
                <g
                  key={name}
                  transform={`translate(${x},${y}) scale(${1 / view.zoom})`}
                  className="map-city"
                >
                  <circle r="2" />
                  <text x="6" y="-5">
                    {name}
                  </text>
                </g>
              );
            })}
          {geometry && !snapshot?.polities && (
            <g
              transform={`translate(${capital[0] - 35},${capital[1] - 58}) scale(${1 / view.zoom})`}
              className="map-dynasty-label"
            >
              <text textAnchor="middle">{dynasty.name}</text>
              <text y="18" className="map-dynasty-year" textAnchor="middle">
                {snapshot?.yearLabel}参考图层
              </text>
            </g>
          )}
          {dynasty.territory.length > 0 && !snapshot?.polities && (
            <g
              transform={`translate(${capital[0]},${capital[1]}) scale(${1 / view.zoom})`}
              className="capital-marker"
            >
              <path d="M0 -6L6 0L0 6L-6 0Z" />
              <text x="10" y="15">
                {dynasty.capital.split('（')[0]}
              </text>
            </g>
          )}
          {layers.territory &&
            snapshot?.polities
              ?.filter((p) => !hiddenPolities.includes(p.id))
              .map((p) => {
                const label = projection(p.label)!;
                const cap = projection(p.capitalCoordinates)!;
                return (
                  <g key={`label-${p.id}`} className="polity-annotations">
                    <g
                      transform={`translate(${label[0]},${label[1]}) scale(${1 / view.zoom})`}
                      className="polity-label"
                      role="button"
                      tabIndex={0}
                      data-map-label="true"
                      aria-label={`查看${p.name}地图资料`}
                      onClick={() => setActivePolityId(p.id)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          setActivePolityId(p.id);
                        }
                      }}
                    >
                      <text
                        textAnchor="middle"
                        style={{ fill: p.color }}
                        fontSize={p.id === 'western-liang' ? 12 : 21}
                      >
                        {p.name}
                      </text>
                    </g>
                    <g
                      transform={`translate(${cap[0]},${cap[1]}) scale(${1 / view.zoom})`}
                      className="polity-capital"
                    >
                      <circle r="4" style={{ stroke: p.color }} />
                      <circle r="1.5" style={{ fill: p.color }} />
                      <text x="8" y="14">
                        {p.capital}
                      </text>
                    </g>
                  </g>
                );
              })}
          {layers.events &&
            groups.map((group) => {
              const first = group[0],
                point = projection(first.coordinates)!;
              const selected = group.some((e) => e.id === focusEvent?.id);
              return (
                <g
                  key={first.id}
                  transform={`translate(${point[0]},${point[1]}) scale(${1 / view.zoom})`}
                  className={`hotspot ${selected ? 'selected' : ''} ${first.category === '战争' ? 'war' : ''}`}
                  data-category={first.category}
                  role="button"
                  tabIndex={0}
                  aria-label={`${first.location}：${group.map((e) => e.title).join('、')}`}
                  onClick={() => {
                    if (group.length === 1) onSelectEvent?.(first);
                    else setCluster(group);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      if (group.length === 1) onSelectEvent?.(first);
                      else setCluster(group);
                    }
                  }}
                >
                  <title>{group.map((e) => `${e.start}年 ${e.title}`).join('\n')}</title>
                  <circle className="hotspot-halo" r={selected ? 24 : 21} />
                  <circle className="hotspot-core" r={group.length > 1 ? 14 : 10} />
                  <text textAnchor="middle" y="4">
                    {group.length > 1 ? group.length : '•'}
                  </text>
                  {(selected || view.zoom > 1.2) && (
                    <g className="hotspot-label">
                      <rect
                        x="19"
                        y="-12"
                        width={Math.min(first.title.length * 12 + 16, 210)}
                        height="25"
                        rx="4"
                      />
                      <text x="27" y="5">
                        {first.title}
                      </text>
                    </g>
                  )}
                </g>
              );
            })}
        </g>
      </svg>
      <div className="map-reference">
        <span className="status-dot" />
        <strong>{snapshot?.sceneName || dynasty.name}</strong>
        <span>
          {snapshot
            ? `${snapshot.yearLabel} · ${snapshot.sourceType === 'textbook-derived' ? '教材地图数字化参考' : '旧版未校订 · 非官方'}${isPinned ? ' · 手动参考' : ''}`
            : boundariesLoaded
              ? '所选时段暂无疆域参考图'
              : '正在加载疆域资料…'}
        </span>
      </div>
      {snapshot?.polities && (
        <ConflictLegend
          key={snapshot.id}
          snapshot={snapshot}
          activeId={activePolityId}
          onSelect={setActivePolityId}
          hidden={hiddenPolities}
          onToggle={(id) =>
            setHiddenPolities((current) =>
              current.includes(id) ? current.filter((v) => v !== id) : [...current, id],
            )
          }
        />
      )}
      {!snapshot && boundariesLoaded && choices.length > 0 && (
        <button className="map-reference-action" onClick={() => setSourcePanel(true)}>
          选择其他年代参考图（{choices.length}）
        </button>
      )}
      {boundaryError && (
        <div className="map-boundary-error" role="alert">
          {boundaryError}
        </div>
      )}
      <div className="map-compass">
        <b>N</b>
        <span>▲</span>
      </div>
      <div className="map-tools">
        <button aria-label="放大地图" disabled={view.zoom >= 8} onClick={() => zoom(1.3)}>
          <Plus size={17} />
        </button>
        <button aria-label="缩小地图" disabled={view.zoom <= 0.65} onClick={() => zoom(1 / 1.3)}>
          <Minus size={17} />
        </button>
        <button aria-label="重置地图缩放" onClick={() => setView({ zoom: 1, x: 0, y: 0 })}>
          <LocateFixed size={17} />
        </button>
        <button
          aria-label="地图图层"
          aria-expanded={layerPanel}
          onClick={() => {
            setLayerPanel((s) => !s);
            setSourcePanel(false);
          }}
        >
          <Layers size={17} />
        </button>
        <button
          aria-label="疆域依据与参考年份"
          aria-expanded={sourcePanel}
          onClick={() => {
            setSourcePanel((s) => !s);
            setLayerPanel(false);
          }}
        >
          <BookOpen size={17} />
        </button>
      </div>
      {sourcePanel && (
        <section className="map-source-panel" aria-label="疆域依据">
          <div className="map-source-heading">
            <strong>疆域依据</strong>
            <button
              className="icon-button"
              aria-label="关闭疆域依据"
              onClick={() => setSourcePanel(false)}
            >
              <X size={15} />
            </button>
          </div>
          <label htmlFor="boundary-reference">参考图年代</label>
          <select
            id="boundary-reference"
            value={pinnedId}
            onChange={(e) => setPinnedId(e.target.value)}
          >
            <option value="">跟随时间范围</option>
            {choices.map((s) => (
              <option key={s.id} value={s.id}>
                {s.yearLabel} · {s.sourceType === 'textbook-derived' ? '教材参考' : '旧版未校订'}
              </option>
            ))}
          </select>
          <p>仅自动选取范围内的参考图；手动参考不改变事件筛选时间。单张地图不代表整个朝代。</p>
          {snapshot ? (
            <>
              <strong>{snapshot.sourceName}</strong>
              <p>{snapshot.citation || `${snapshot.yearLabel}第三方社区快照`}</p>
              <p>{snapshot.precision}</p>
              <p>{snapshot.coverageNote}</p>
              <a href={snapshot.sourceUrl} target="_blank" rel="noreferrer">
                {snapshot.sourceType === 'textbook-derived' ? '出版机构官网' : '原始数据与许可'} ↗
              </a>
              {snapshot.archiveUrl && (
                <a href={snapshot.archiveUrl} target="_blank" rel="noreferrer">
                  所用教材电子本存档（PDF） ↗
                </a>
              )}
            </>
          ) : (
            <p>本时段没有可用图层，不使用手绘多边形补齐。</p>
          )}
          <a
            href="https://www.gov.cn/zhengce/2019-07/21/content_5412300.htm"
            target="_blank"
            rel="noreferrer"
          >
            国务院新闻办《新疆的若干历史问题》 ↗
          </a>
          <a href="#/about">完整来源与覆盖说明 ↗</a>
        </section>
      )}
      {layerPanel && (
        <div className="layer-panel">
          <strong>地图图层</strong>
          {(
            [
              ['territory', '历史疆域'],
              ['water', '河流与湖泊'],
              ['events', '事件热点'],
              ['grid', '经纬网'],
            ] as const
          ).map(([key, label]) => (
            <label key={key}>
              <input
                type="checkbox"
                checked={layers[key]}
                onChange={() => setLayers((v) => ({ ...v, [key]: !v[key] }))}
              />
              {label}
            </label>
          ))}
          <small>
            以标示年代为准；教材图含都护府等管理范围，不能全部理解为内地州县。底图为现代自然地理。
          </small>
        </div>
      )}
      {cluster.length > 0 && (
        <div className="map-popup">
          <div>
            <strong>
              <MapPin size={14} />
              同地事件 · {cluster.length}
            </strong>
            <button
              className="icon-button"
              aria-label="关闭地点事件"
              onClick={() => setCluster([])}
            >
              <X size={14} />
            </button>
          </div>
          {cluster.map((e) => (
            <button
              key={e.id}
              onClick={() => {
                onSelectEvent?.(e);
                setCluster([]);
              }}
            >
              <span>
                <small>{yearLabel(e.start)} 年</small>
                {e.title}
              </span>
              <ArrowUpRight size={14} />
            </button>
          ))}
        </div>
      )}
      {!base && (
        <div className="map-status" role="status">
          {mapError || '正在加载精细地理数据…'}
        </div>
      )}
      <div className="map-bottom-controls">
        <span>
          {Math.round(view.zoom * 100)}% <i />
          滚轮缩放 · 拖动平移 · 点击热点
        </span>
        <span className="map-layer-badge">
          <Layers size={12} />
          {snapshot?.sourceType === 'textbook-derived'
            ? '教材参考'
            : snapshot
              ? '待校订旧图'
              : '暂无疆域'}{' '}
          / 自然地理
        </span>
      </div>
      <div className="map-credit">
        <a href="https://www.naturalearthdata.com/" target="_blank" rel="noreferrer">
          Natural Earth 1:50m
        </a>
        {snapshot && (
          <>
            {' '}
            ·{' '}
            <a href={snapshot.sourceUrl} target="_blank" rel="noreferrer">
              {snapshot.sourceType === 'textbook-derived'
                ? '教育部编写 · 人教社教材（数字化参考）'
                : 'Historical Basemaps · GPL-3.0 · 未校订'}
            </a>
          </>
        )}{' '}
        · <a href="#/about">来源与精度</a>
      </div>
    </div>
  );
}
