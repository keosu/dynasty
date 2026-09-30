import { useEffect, useMemo, useState } from 'react';
import {
  MapPin,
  Crown,
  Zap,
  PanelLeftClose,
  PanelLeftOpen,
  X,
  ArrowUpRight,
  GitBranch,
  Info,
  Search,
  ChevronRight,
  BookOpen,
} from 'lucide-react';
import type { Dynasty, HistoricalEvent, Period, Emperor } from '../domain/types';
import { dynasties } from '../data/dynasties';
import { emperors } from '../data/emperors';
import { events } from '../data/events';
import conflictPeriods from '../data/generated/conflict-periods.json';
import { overlaps, periodLabel, yearLabel, matchesSearch } from '../domain/queries';
import { HistoryMap } from '../components/HistoryMap';
import { Timeline } from '../components/Timeline';
import { SpeechButton } from '../components/SpeechButton';
import { Sources, go } from '../components/Shared';
import { identityColor } from '../theme';

export function AtlasPage({
  dynasty,
  range,
  onDynasty,
  onRange,
  focusEvent,
}: {
  dynasty: Dynasty;
  range: Period;
  onDynasty: (id: string) => void;
  onRange: (r: Period) => void;
  focusEvent?: HistoricalEvent;
}) {
  const [leftOpen, setLeftOpen] = useState(() => window.innerWidth >= 900);
  const [tab, setTab] = useState<'events' | 'people'>('events');
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('全部');
  const [activeEvent, setActiveEvent] = useState<HistoricalEvent | undefined>(focusEvent);
  const [person, setPerson] = useState<Emperor>();
  const [info, setInfo] = useState(false);
  useEffect(() => {
    setActiveEvent(focusEvent);
    setPerson(undefined);
  }, [focusEvent, dynasty.id]);
  const filteredEvents = useMemo(
    () =>
      events.filter(
        (e) =>
          overlaps(e, range) &&
          (category === '全部' || e.category === category) &&
          matchesSearch(query, e.title, e.location),
      ),
    [range, category, query],
  );
  const people = useMemo(
    () =>
      emperors
        .filter(
          (e) => e.reigns.some((r) => overlaps(r, range)) && matchesSearch(query, e.title, e.name),
        )
        .sort((a, b) => a.reigns[0].start - b.reigns[0].start),
    [range, query],
  );
  function selectEvent(event: HistoricalEvent) {
    setActiveEvent(event);
    setPerson(undefined);
  }
  return (
    <div className="atlas-workspace">
      <div className="workspace-toolbar">
        <div className="workspace-context">
          <button
            className="icon-button"
            aria-label={leftOpen ? '收起探索面板' : '展开探索面板'}
            aria-expanded={leftOpen}
            onClick={() => setLeftOpen((s) => !s)}
          >
            {leftOpen ? <PanelLeftClose size={18} /> : <PanelLeftOpen size={18} />}
          </button>
          <span className="toolbar-separator" />
          <select
            aria-label="地图朝代"
            value={dynasty.id}
            onChange={(e) => onDynasty(e.target.value)}
          >
            {dynasties.map((d) => (
              <option key={d.id} value={d.id}>
                {d.name} · {periodLabel(d)}
              </option>
            ))}
          </select>
          <span className="workspace-tag">历史地图</span>
        </div>
        <div className="workspace-toolbar-right">
          <span className="toolbar-period">{periodLabel(range)}</span>
          <button
            className="icon-button"
            aria-label="查看朝代资料"
            aria-expanded={info}
            onClick={() => setInfo((s) => !s)}
          >
            <Info size={16} />
          </button>
          <button className="text-button" onClick={() => go(`/genealogy/${dynasty.id}`)}>
            <GitBranch size={15} />
            <span>世系</span>
          </button>
        </div>
      </div>
      <div className="conflict-shortcuts" role="group" aria-label="并立时期">
        <span>并立时期</span>
        {conflictPeriods.map((period) => (
          <button
            key={period.id}
            aria-label={`${period.name}，${period.year}年`}
            aria-pressed={
              range.start === period.year &&
              range.end === period.year &&
              period.dynastyIds.includes(dynasty.id)
            }
            onClick={() => {
              onDynasty(period.dynastyIds[0]);
              onRange({ start: period.year, end: period.year });
              setActiveEvent(undefined);
              setPerson(undefined);
              setQuery('');
              setCategory('全部');
              setTab('people');
            }}
          >
            {period.name}
            <small>{period.year}</small>
          </button>
        ))}
      </div>
      <div
        className={`map-workspace ${leftOpen ? 'with-sidebar' : ''} ${activeEvent || person ? 'with-inspector' : ''}`}
      >
        {leftOpen && (
          <aside className="explorer-panel">
            <div className="explorer-heading">
              <strong>探索历史</strong>
              <span>
                {people.length} 位君主 / {filteredEvents.length} 件事件
              </span>
            </div>
            <div className="explorer-tabs">
              <button className={tab === 'events' ? 'active' : ''} onClick={() => setTab('events')}>
                <Zap size={14} /> 热点事件 <b>{filteredEvents.length}</b>
              </button>
              <button className={tab === 'people' ? 'active' : ''} onClick={() => setTab('people')}>
                <Crown size={14} /> 在位君主 <b>{people.length}</b>
              </button>
            </div>
            <label className="explorer-search">
              <Search size={14} />
              <input
                aria-label="搜索当前范围"
                placeholder={tab === 'events' ? '事件 / 地点' : '帝号 / 姓名'}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
              {query && (
                <button aria-label="清除范围搜索" onClick={() => setQuery('')}>
                  <X size={12} />
                </button>
              )}
            </label>
            {tab === 'events' && (
              <div className="event-categories">
                {['全部', '政治', '战争', '交流', '文化', '建设'].map((c) => (
                  <button
                    key={c}
                    data-category={c}
                    className={category === c ? 'active' : ''}
                    onClick={() => setCategory(c)}
                  >
                    {c}
                  </button>
                ))}
              </div>
            )}
            <div className="explorer-list">
              {tab === 'events'
                ? filteredEvents.map((e) => (
                    <button
                      key={e.id}
                      data-category={e.category}
                      className={`explorer-event ${activeEvent?.id === e.id ? 'selected' : ''}`}
                      onClick={() => selectEvent(e)}
                    >
                      <div className={`event-symbol ${e.category === '战争' ? 'war' : ''}`}>
                        <Zap size={15} />
                      </div>
                      <div>
                        <div className="explorer-row-title">
                          <strong>{e.title}</strong>
                          <span>{yearLabel(e.start)}</span>
                        </div>
                        <p>
                          <MapPin size={10} />
                          {e.location}
                        </p>
                      </div>
                      <ChevronRight size={13} />
                    </button>
                  ))
                : people.map((p) => (
                    <button
                      key={p.id}
                      style={identityColor(p.id)}
                      className={`explorer-person ${person?.id === p.id ? 'selected' : ''}`}
                      onClick={() => {
                        setPerson(p);
                        setActiveEvent(undefined);
                      }}
                    >
                      <span className="person-monogram">{p.name.slice(0, 1)}</span>
                      <div>
                        <strong>
                          {p.title}
                          <small>{p.name}</small>
                        </strong>
                        <p>{p.reigns.map(periodLabel).join(' / ')}</p>
                      </div>
                      <ChevronRight size={13} />
                    </button>
                  ))}
              {!(tab === 'events' ? filteredEvents : people).length && (
                <div className="panel-empty">
                  <Search size={23} />
                  <p>当前范围没有匹配记录</p>
                  <button
                    className="text-button"
                    onClick={() => {
                      setQuery('');
                      setCategory('全部');
                      onRange({ start: dynasty.start, end: dynasty.end });
                    }}
                  >
                    重置筛选
                  </button>
                </div>
              )}
            </div>
            <div className="explorer-footer">
              <span className="status-dot" />
              范围内所有已收录政权 · 按年相交
            </div>
          </aside>
        )}
        <div className="map-stage">
          <HistoryMap
            dynasty={dynasty}
            events={filteredEvents}
            focusEvent={activeEvent}
            onSelectEvent={selectEvent}
            range={range}
          />
          {info && (
            <div className="dynasty-info-popover">
              <div>
                <strong>{dynasty.name}</strong>
                <button
                  className="icon-button"
                  aria-label="关闭朝代资料"
                  onClick={() => setInfo(false)}
                >
                  <X size={15} />
                </button>
              </div>
              <p>{dynasty.summary}</p>
              <SpeechButton text={`${dynasty.name}。${dynasty.summary}`} />
              <Sources sources={dynasty.sources} />
            </div>
          )}
        </div>
        {(activeEvent || person) && (
          <aside className="inspector-panel">
            <div className="inspector-heading">
              <span>{person ? '君主档案' : '历史现场'}</span>
              <button
                className="icon-button"
                aria-label="关闭详情面板"
                onClick={() => {
                  setPerson(undefined);
                  setActiveEvent(undefined);
                }}
              >
                <X size={17} />
              </button>
            </div>
            <div className="inspector-content">
              {activeEvent ? (
                <>
                  <span className="inspector-kicker">
                    {activeEvent.category} / {periodLabel(activeEvent)}
                  </span>
                  <h2>{activeEvent.title}</h2>
                  <span className="inspector-location">
                    <MapPin size={13} />
                    {activeEvent.location}
                  </span>
                  <p className="inspector-summary">{activeEvent.summary}</p>
                  <SpeechButton text={`${activeEvent.title}。${activeEvent.content}`} />
                  <h3>事件经过</h3>
                  <p>{activeEvent.content}</p>
                  <h3>关联人物</h3>
                  {activeEvent.emperorIds.map((id) => {
                    const p = emperors.find((e) => e.id === id)!;
                    return (
                      <button
                        className="inspector-related"
                        key={id}
                        onClick={() => {
                          setPerson(p);
                          setActiveEvent(undefined);
                        }}
                      >
                        <Crown size={14} />
                        {p.title} · {p.name}
                        <ArrowUpRight size={13} />
                      </button>
                    );
                  })}
                  <Sources sources={activeEvent.sources} />
                </>
              ) : person ? (
                <>
                  <span className="inspector-kicker">
                    {dynasties.find((d) => d.id === person.dynastyId)?.name} / 君主档案
                  </span>
                  <h2>
                    {person.title}
                    <small>{person.name}</small>
                  </h2>
                  <span className="inspector-location">
                    <Crown size={13} />
                    {person.reigns.map(periodLabel).join(' / ')}
                  </span>
                  <p className="inspector-summary">{person.summary}</p>
                  <SpeechButton text={`${person.title}。${person.summary}`} />
                  {person.achievements.length > 0 && (
                    <>
                      <h3>主要功绩</h3>
                      {person.achievements.map((a) => (
                        <p key={a}>{a}</p>
                      ))}
                    </>
                  )}
                  {person.assessment && (
                    <>
                      <h3>历史评价</h3>
                      <p>{person.assessment}</p>
                    </>
                  )}
                  <button
                    className="inspector-related"
                    onClick={() => go(`/emperors/${person.id}`)}
                  >
                    <BookOpen size={14} />
                    打开完整档案
                    <ArrowUpRight size={13} />
                  </button>
                  <Sources sources={person.sources} />
                </>
              ) : null}
            </div>
          </aside>
        )}
      </div>
      <Timeline
        dynasty={dynasty}
        range={range}
        onDynasty={onDynasty}
        onRange={(r) => {
          onRange(r);
          setActiveEvent(undefined);
          setPerson(undefined);
        }}
      />
    </div>
  );
}
