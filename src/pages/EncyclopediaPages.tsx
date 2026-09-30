import { useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Search,
  MapPin,
  BookOpen,
  Crown,
  CalendarDays,
  GitBranch,
  ExternalLink,
} from 'lucide-react';
import { dynasties } from '../data/dynasties';
import { emperors } from '../data/emperors';
import { events } from '../data/events';
import { matchesSearch, overlaps, periodLabel } from '../domain/queries';
import type { HistoricalEvent } from '../domain/types';
import { EmperorCard, EmptyState, Sources, go } from '../components/Shared';
import { SpeechButton } from '../components/SpeechButton';
import { BiographySections } from '../components/BiographySections';
import catalog from '../data/generated/manifest.json';

export function PageIntro({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <div className="page-intro">
      <span className="eyebrow">{eyebrow}</span>
      <h1>{title}</h1>
      <p>{description}</p>
    </div>
  );
}

export function DirectoryPage({
  kind,
  params,
}: {
  kind: 'emperors' | 'events';
  params: URLSearchParams;
}) {
  const [query, setQuery] = useState(params.get('q') || '');
  const [dynastyId, setDynastyId] = useState(params.get('dynasty') || 'all');
  const [rangeEnabled, setRangeEnabled] = useState(params.has('start') && params.has('end'));
  const range = { start: Number(params.get('start')), end: Number(params.get('end')) };
  const people = emperors.filter(
    (e) =>
      (dynastyId === 'all' || e.dynastyId === dynastyId) &&
      matchesSearch(
        query,
        e.name,
        e.title,
        e.summary,
        dynasties.find((d) => d.id === e.dynastyId)!.name,
      ),
  );
  const entries = events.filter(
    (e) =>
      (dynastyId === 'all' || e.dynastyId === dynastyId) &&
      (!rangeEnabled || overlaps(e, range)) &&
      matchesSearch(query, e.title, e.summary, e.location, e.category),
  );
  return (
    <>
      <PageIntro
        eyebrow={
          kind === 'emperors' ? 'PEOPLE BEHIND THE DYNASTIES' : 'MOMENTS THAT SHAPED HISTORY'
        }
        title={kind === 'emperors' ? '帝王列传' : '历史事件'}
        description={
          kind === 'emperors'
            ? '越过帝号与年号，走近历史中的人。阅读生平、功绩，以及时间留下的复杂评价。'
            : '循着历史的坐标，回望改变时代的时刻。从一座城出发，理解一段历史。'
        }
      />
      <div className="directory-toolbar">
        <label className="search-input">
          <Search size={18} />
          <input
            aria-label={kind === 'emperors' ? '搜索帝王' : '搜索事件'}
            placeholder={kind === 'emperors' ? '搜索帝号、姓名或生平…' : '搜索事件、地点或类型…'}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          {query && (
            <button aria-label="清除搜索" onClick={() => setQuery('')}>
              ×
            </button>
          )}
        </label>
        <select
          aria-label="筛选朝代"
          value={dynastyId}
          onChange={(e) => setDynastyId(e.target.value)}
        >
          <option value="all">全部朝代</option>
          {dynasties.map((d) => (
            <option key={d.id} value={d.id}>
              {d.name}
            </option>
          ))}
        </select>
        <span className="muted">
          {kind === 'emperors' ? people.length : entries.length}{' '}
          {kind === 'emperors' ? '位人物' : '件事件'}
        </span>
      </div>
      {rangeEnabled && (
        <div className="active-filter">
          时间范围：{periodLabel(range)}{' '}
          <button className="text-button" onClick={() => setRangeEnabled(false)}>
            清除时间筛选 ×
          </button>
        </div>
      )}
      <p className="directory-note">
        已导入公开君主表与人物正文；交接年按年计，支持多段在位与复位。
      </p>
      {kind === 'emperors' ? (
        people.length ? (
          <div className="directory-people">
            {people.map((p) => (
              <EmperorCard key={p.id} emperor={p} />
            ))}
          </div>
        ) : (
          <EmptyState>没有找到匹配的人物，试试姓名、帝号或其他朝代。</EmptyState>
        )
      ) : entries.length ? (
        <div className="event-list">
          {entries.map((event) => (
            <a className="event-list-item" key={event.id} href={`#/events/${event.id}`}>
              <div className="event-year">
                {periodLabel(event)}
                <span>{dynasties.find((d) => d.id === event.dynastyId)!.name}</span>
              </div>
              <div>
                <span className="category">{event.category}</span>
                <h2>{event.title}</h2>
                <p>{event.summary}</p>
                <span className="event-location">
                  <MapPin size={13} />
                  {event.location}
                </span>
              </div>
              <ArrowUpRight size={21} />
            </a>
          ))}
        </div>
      ) : (
        <EmptyState>没有找到匹配的事件，试试地点、事件名称或其他朝代。</EmptyState>
      )}
    </>
  );
}

export function EmperorDetail({ id }: { id: string }) {
  const person = emperors.find((p) => p.id === id);
  if (!person) return <NotFound />;
  const dynasty = dynasties.find((d) => d.id === person.dynastyId)!;
  const related = events.filter((e) => e.emperorIds.includes(id));
  return (
    <article className="detail-page">
      <a href={`#/emperors?dynasty=${dynasty.id}`} className="back-link">
        <ArrowLeft size={15} /> 返回帝王列传
      </a>
      <div className="detail-hero">
        <div>
          <span className="eyebrow">{dynasty.name} · 帝王列传</span>
          <h1>
            {person.title}
            <span>{person.name}</span>
          </h1>
          <div className="detail-meta">
            <span>
              <Crown size={15} /> 在位 {person.reigns.map(periodLabel).join('、')}
            </span>
            <span>
              <CalendarDays size={15} /> 生卒 {person.lifespan}
            </span>
          </div>
        </div>
        <span className="detail-seal">{dynasty.short}</span>
      </div>
      <div className="detail-layout">
        <div className="article-content">
          <section>
            <h2>人物简介</h2>
            <p className="lead-paragraph">{person.summary}</p>
            <SpeechButton
              text={`${person.title}，${person.name}。${person.summary}。主要功绩。${person.achievements.join('。')}。历史评价。${person.assessment}`}
            />
          </section>
          {person.achievements.length > 0 && (
            <section>
              <h2>主要功绩</h2>
              <ol className="achievement-list">
                {person.achievements.map((a, i) => (
                  <li key={a}>
                    <span>{String(i + 1).padStart(2, '0')}</span>
                    <p>{a}</p>
                  </li>
                ))}
              </ol>
            </section>
          )}
          {person.assessment && (
            <section>
              <h2>历史评价</h2>
              <blockquote>{person.assessment}</blockquote>
              <p className="muted small">
                评价为本站基于参考条目的概括，不是对单一史家的直接引述。
              </p>
            </section>
          )}
          <BiographySections person={person} />
          <Sources sources={person.sources} />
        </div>
        <aside className="detail-aside">
          <h3>
            <BookOpen size={17} /> 相关历史事件
          </h3>
          {related.length ? (
            related.map((e) => (
              <a className="related-event" href={`#/events/${e.id}`} key={e.id}>
                <span>{periodLabel(e)}</span>
                <strong>
                  {e.title}
                  <ArrowUpRight size={14} />
                </strong>
                <p>{e.location}</p>
              </a>
            ))
          ) : (
            <p className="muted">相关事件尚待收录。</p>
          )}
          <a href={`#/genealogy/${dynasty.id}`} className="aside-link">
            <GitBranch size={17} /> 查看{dynasty.name}世系 <ArrowRight size={15} />
          </a>
        </aside>
      </div>
    </article>
  );
}

export function EventDetail({
  id,
  onLocate,
}: {
  id: string;
  onLocate: (event: HistoricalEvent) => void;
}) {
  const event = events.find((e) => e.id === id);
  if (!event) return <NotFound />;
  const dynasty = dynasties.find((d) => d.id === event.dynastyId)!;
  return (
    <article className="detail-page">
      <a href={`#/events?dynasty=${dynasty.id}`} className="back-link">
        <ArrowLeft size={15} /> 返回历史事件
      </a>
      <div className="detail-hero">
        <div>
          <span className="eyebrow">
            {dynasty.name} · {event.category}
          </span>
          <h1>{event.title}</h1>
          <div className="detail-meta">
            <span>
              <CalendarDays size={15} />
              {periodLabel(event)}
            </span>
            <span>
              <MapPin size={15} />
              {event.location}
            </span>
          </div>
        </div>
        <span className="detail-seal">纪事</span>
      </div>
      <div className="detail-layout">
        <div className="article-content">
          <section>
            <p className="event-lead">{event.summary}</p>
            <SpeechButton
              text={`${event.title}。${periodLabel(event)}。${event.location}。${event.content}`}
            />
          </section>
          <section>
            <h2>事件始末</h2>
            <p>{event.content}</p>
          </section>
          <section className="location-card">
            <div>
              <MapPin size={24} />
              <div>
                <h3>{event.location}</h3>
                <p>历史地点为概略定位，详细说明见上文。</p>
              </div>
            </div>
            <button className="primary-button" onClick={() => onLocate(event)}>
              在地图上查看 <ArrowUpRight size={15} />
            </button>
          </section>
          <Sources sources={event.sources} />
        </div>
        <aside className="detail-aside">
          <h3>
            <Crown size={17} /> 相关帝王
          </h3>
          {event.emperorIds.length ? (
            event.emperorIds.map((personId) => (
              <EmperorCard
                key={personId}
                emperor={emperors.find((p) => p.id === personId)!}
                compact
              />
            ))
          ) : (
            <p className="muted">相关帝王尚未收录。</p>
          )}
          <div className="reading-note">
            <BookOpen size={19} />
            <h3>读史，也读背景</h3>
            <p>
              一处地图标记，只是进入历史的入口。时间跨度、相关地点与人物关系，请结合事件正文阅读。
            </p>
          </div>
        </aside>
      </div>
    </article>
  );
}

export function AboutPage() {
  return (
    <>
      <PageIntro
        eyebrow="ABOUT THE PROJECT"
        title="让历史，有迹可循。"
        description="山河纪是一个以地图与时间为线索的中国历史百科原型。每一个入口，都指向可以继续阅读与核对的资料。"
      />
      <div className="about-grid">
        <section className="panel about-card">
          <BookOpen />
          <h2>资料范围与来源</h2>
          <p>
            当前收录 {dynasties.length} 个朝代或政权专题、{emperors.length} 位君主、
            {events.length}{' '}
            件历史事件。人物数据采集自《中国君主列表》的秦至清主表，包含并立、前身和延续政权；涵盖范围与来源表一致，不包含传说、先秦诸侯和所有地方自立政权。
          </p>
          <p>
            采集人物与在位表 {catalog.count} 条，人物正文成功获取 {catalog.articleSuccess}{' '}
            条。导入摘录按 CC BY-SA 4.0
            标注来源，作繁简转换、脚注清理与段落节选；原有校订内容优先保留。自动采集不等于学术审订，异说与年表误差需结合原文核对。
          </p>
        </section>
        <section className="panel about-card">
          <MapPin />
          <h2>如何阅读地图</h2>
          <p>
            并立时期提供四个同年场景：262年魏、蜀汉、吴；572年北周、北齐、陈与后梁（西梁）；1111年北宋、辽、西夏；1142年南宋、金、西夏。各政权独立着色，名称、都城与当年在位者可点选查看，图例可单独隐藏图层。四图均依据人教社《中外历史纲要（上）》相应教材主图数字化，不能当作整个时期的逐年疆域。
          </p>
          <p>
            西汉、唐、清已改用教育部组织编写、人民教育出版社出版的教材地图作为底本，分别展示西汉后期、669年、1820年的数字化参考轮廓，包含西域。原图电子本经公开存档核验；坐标由本站配准转换，并非国家机关或出版社发布的官方GIS数据。
          </p>
          <p>
            西汉原图没有单一年份；公元前60年仅作为西域都护府设立后的检索起点，不表示原图精确对应该年。唐代图包含都护府等管理范围，不能全部理解为直接州县统治。三张地图的南海附图尚未配准，主图不构成全部岛屿清单，严肃使用应查看原图。
          </p>
          <p>
            其余已有图层仍来自Historical Basemaps，明确标为“旧版未校订 ·
            非官方”，本次未将这些图层宣称为官方资料。所选范围内没有参考图时不自动套用邻近年份，也不补绘缺失疆域；可在“疆域依据”面板手动指定其他年代比较。
          </p>
          <p>
            教材原图权利归原权利人，原教材审图号不适用于本站转换结果。复旦CHGIS是学术数据，本次核查的政权界线包不含汉唐西域，且限制再发布，未导入。Natural
            Earth 1:50m仅作现代自然地理底图；未校订旧数据仍保留GPL-3.0许可。
          </p>
          <a
            href="https://www.gov.cn/zhengce/2019-07/21/content_5412300.htm"
            target="_blank"
            rel="noreferrer"
          >
            国务院新闻办《新疆的若干历史问题》 <ExternalLink size={14} />
          </a>
          <a href="https://www.pep.com.cn/" target="_blank" rel="noreferrer">
            人民教育出版社 · 教材出版机构 <ExternalLink size={14} />
          </a>
          <a href="https://yugong.fudan.edu.cn/CHGIS/bqsm.htm" target="_blank" rel="noreferrer">
            复旦CHGIS · 数据使用说明 <ExternalLink size={14} />
          </a>
          <a
            href="https://www.naturalearthdata.com/about/terms-of-use/"
            target="_blank"
            rel="noreferrer"
          >
            Natural Earth · 公有领域说明 <ExternalLink size={14} />
          </a>
          <a href="https://github.com/topojson/world-atlas" target="_blank" rel="noreferrer">
            World Atlas · 底图数据分发 <ExternalLink size={14} />
          </a>
        </section>
        <section className="panel about-card">
          <CalendarDays />
          <h2>年代与关系的约定</h2>
          <p>
            公元前年份以「前」标记，无公元0年。在位时间按年记录，交接年可能同时出现两位帝王。存在复位的君主按多段区间存储。
          </p>
          <p>
            唐专题包含武周，并明确690—705年的国号变化。秦始皇从前221年称帝算起，元世祖从1271年定国号算起。世系分为在位顺序与父子关系两个视图。前者逐段展示在位与复位，日期交叠采用虚线；后者仅根据人物条目明确列出的父亲连接，不推断未知血缘。
          </p>
        </section>
        <section className="panel about-card">
          <Crown />
          <h2>语音与维护</h2>
          <p>
            语音使用浏览器 Web Speech
            API，支持播放、暂停、继续与停止。声音与可用性取决于浏览器、操作系统和中文语音包，部分语音服务需要联网。所有讲解内容也以文字形式保留。
          </p>
          <p>
            项目将结构化史料、领域查询与界面分离，便于新增朝代、校订数据，以及未来接入审核后台和专业疆域数据。架构与维护方法可查看项目中的
            docs/ARCHITECTURE.md 和 README.md。
          </p>
        </section>
      </div>
    </>
  );
}
export function NotFound() {
  return (
    <div className="not-found">
      <span className="eyebrow">PAGE NOT FOUND</span>
      <h1>此处，尚无记载。</h1>
      <p>这个页面或条目不存在，请回到地图继续探索。</p>
      <a href="#/atlas" className="primary-button">
        返回历史地图 <ArrowRight size={15} />
      </a>
    </div>
  );
}
