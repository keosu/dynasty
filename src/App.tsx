import { useEffect, useState } from 'react';
import { Map, Crown, BookOpen, GitBranch, Search, ArrowRight, Menu, X } from 'lucide-react';
import { dynasties } from './data/dynasties';
import { events } from './data/events';
import { emperors } from './data/emperors';
import { matchesSearch } from './domain/queries';
import type { HistoricalEvent, Period } from './domain/types';
import { AtlasPage } from './pages/AtlasPage';
import { GenealogyPage } from './pages/GenealogyPage';
import {
  AboutPage,
  DirectoryPage,
  EmperorDetail,
  EventDetail,
  NotFound,
} from './pages/EncyclopediaPages';
import { go } from './components/Shared';
import { ThemePicker } from './components/ThemePicker';
import { PwaControls } from './components/PwaControls';
import { FullscreenButton } from './components/FullscreenButton';

const nav = [
  { path: 'atlas', label: '历史地图', icon: Map },
  { path: 'emperors', label: '帝王列传', icon: Crown },
  { path: 'events', label: '历史事件', icon: BookOpen },
  { path: 'genealogy', label: '世系更替', icon: GitBranch },
];
export default function App() {
  const [hash, setHash] = useState(window.location.hash.slice(1) || '/atlas');
  const [dynastyId, setDynastyId] = useState('tang');
  const [range, setRange] = useState<Period>({ start: 618, end: 907 });
  const [focusEvent, setFocusEvent] = useState<HistoricalEvent>();
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);
  const [path, search = ''] = hash.split('?');
  const [, page, id] = path.split('/');
  const dynasty = dynasties.find((d) => d.id === dynastyId)!;
  useEffect(() => {
    const handler = () => {
      setHash(window.location.hash.slice(1) || '/atlas');
      setMenuOpen(false);
      setSearchOpen(false);
      document.getElementById('main-content')?.scrollTo({ top: 0, behavior: 'instant' });
    };
    window.addEventListener('hashchange', handler);
    return () => window.removeEventListener('hashchange', handler);
  }, []);
  useEffect(() => {
    document.title = `${nav.find((n) => n.path === page)?.label || (page === 'about' ? '关于与资料' : '历史地图')} · 山河纪`;
  }, [page]);
  useEffect(() => {
    if (!searchOpen) return;
    const original = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSearchOpen(false);
    };
    window.addEventListener('keydown', handler);
    return () => {
      document.body.style.overflow = original;
      window.removeEventListener('keydown', handler);
    };
  }, [searchOpen]);
  function changeDynasty(id: string) {
    const d = dynasties.find((d) => d.id === id)!;
    setDynastyId(id);
    setRange({ start: d.start, end: d.end });
    setFocusEvent(undefined);
  }
  function locate(event: HistoricalEvent) {
    changeDynasty(event.dynastyId);
    setRange({ start: event.start, end: event.end });
    setFocusEvent(event);
    go('/atlas');
  }
  const searchPeople = query.trim()
    ? emperors.filter((p) => matchesSearch(query, p.name, p.title, p.summary)).slice(0, 5)
    : [];
  const searchEvents = query.trim()
    ? events.filter((e) => matchesSearch(query, e.title, e.location, e.summary)).slice(0, 5)
    : [];
  let content;
  if (page === 'atlas' || !page)
    content = (
      <AtlasPage
        dynasty={dynasty}
        range={range}
        onDynasty={changeDynasty}
        onRange={(r) => {
          setRange(r);
          setFocusEvent(undefined);
        }}
        focusEvent={focusEvent}
      />
    );
  else if (page === 'emperors')
    content = id ? (
      <EmperorDetail id={id} />
    ) : (
      <DirectoryPage key={hash} kind="emperors" params={new URLSearchParams(search)} />
    );
  else if (page === 'events')
    content = id ? (
      <EventDetail id={id} onLocate={locate} />
    ) : (
      <DirectoryPage
        key={hash}
        kind="events"
        params={new URLSearchParams(search)}
        onLocate={locate}
      />
    );
  else if (page === 'genealogy') content = <GenealogyPage initialDynasty={id || dynastyId} />;
  else if (page === 'about') content = <AboutPage />;
  else content = <NotFound />;
  return (
    <>
      <a
        className="skip-link"
        href="#main-content"
        onClick={(e) => {
          e.preventDefault();
          document.getElementById('main-content')?.focus();
        }}
      >
        跳到主要内容
      </a>
      <header className="site-header">
        <div className="header-inner">
          <a href="#/atlas" className="brand" aria-label="山河纪首页">
            <span className="brand-mark">山</span>
            <div>
              <strong>
                山河纪<span>歷代王朝百科</span>
              </strong>
              <small>历史时空工作台</small>
            </div>
          </a>
          <nav className={menuOpen ? 'open' : ''} aria-label="主导航">
            {nav.map((n) => (
              <a
                key={n.path}
                href={`#/${n.path}`}
                className={page === n.path ? 'active' : ''}
                aria-current={page === n.path ? 'page' : undefined}
              >
                <n.icon size={16} />
                {n.label}
              </a>
            ))}
          </nav>
          <div className="header-actions">
            <ThemePicker />
            <FullscreenButton />
            <PwaControls />
            <button
              className="header-search"
              aria-label="搜索百科"
              onClick={() => {
                setSearchOpen(true);
                setQuery('');
              }}
            >
              <Search size={18} />
              <span>搜索百科</span>
            </button>
            <span className="header-divider" />
            <a href="#/about" className={page === 'about' ? 'active' : ''}>
              关于
            </a>
            <button
              className="mobile-menu icon-button"
              aria-label="切换导航"
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen((s) => !s)}
            >
              {menuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </header>
      <main
        id="main-content"
        tabIndex={-1}
        className={`main-container ${page === 'atlas' || !page ? 'map-page' : page === 'genealogy' ? 'graph-page' : 'library-page'}`}
      >
        {content}
      </main>
      <footer className="site-footer">
        <a href="#/atlas" className="footer-brand">
          山河纪 <span>让历史在山河间展开</span>
        </a>
        <p>历史是一场漫长的回望，探索从此刻开始。</p>
        <a href="#/about">
          史料来源与使用说明 <ArrowRight size={13} />
        </a>
      </footer>
      {searchOpen && (
        <div className="search-overlay" onClick={() => setSearchOpen(false)}>
          <div
            className="search-dialog"
            role="dialog"
            aria-modal="true"
            aria-label="搜索历史百科"
            onClick={(e) => e.stopPropagation()}
            onKeyDown={(e) => {
              if (e.key === 'Tab') {
                const focusable = Array.from(
                  e.currentTarget.querySelectorAll<HTMLElement>('input, button, a[href]'),
                );
                const first = focusable[0],
                  last = focusable[focusable.length - 1];
                if (e.shiftKey && document.activeElement === first) {
                  e.preventDefault();
                  last?.focus();
                } else if (!e.shiftKey && document.activeElement === last) {
                  e.preventDefault();
                  first?.focus();
                }
              }
            }}
          >
            <div className="search-dialog-input">
              <Search size={21} />
              <input
                autoFocus
                aria-label="搜索关键词"
                placeholder="输入人物、事件或历史地点…"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
              <button
                className="icon-button"
                aria-label="关闭搜索"
                onClick={() => setSearchOpen(false)}
              >
                <X size={20} />
              </button>
            </div>
            <div className="search-results">
              {!query.trim() ? (
                <p className="search-hint">试着搜索「李世民」「长安」或「大运河」</p>
              ) : (
                <>
                  {searchPeople.length > 0 && <h3>帝王列传</h3>}
                  {searchPeople.map((p) => (
                    <a key={p.id} href={`#/emperors/${p.id}`} onClick={() => setSearchOpen(false)}>
                      <Crown size={17} />
                      <span>
                        {p.title}
                        <small>{p.name}</small>
                      </span>
                      <ArrowRight size={15} />
                    </a>
                  ))}
                  {searchEvents.length > 0 && <h3>历史事件</h3>}
                  {searchEvents.map((e) => (
                    <a key={e.id} href={`#/events/${e.id}`} onClick={() => setSearchOpen(false)}>
                      <BookOpen size={17} />
                      <span>
                        {e.title}
                        <small>{e.location}</small>
                      </span>
                      <ArrowRight size={15} />
                    </a>
                  ))}
                  {!searchPeople.length && !searchEvents.length && (
                    <p className="search-hint">暂未找到相关记录，换一个关键词试试。</p>
                  )}
                </>
              )}
            </div>
            <div className="search-dialog-footer">
              搜索当前已收录的人物与事件 <kbd>ESC 关闭</kbd>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
