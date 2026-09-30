import { ArrowUpRight, BookOpen, ChevronRight } from 'lucide-react';
import type { Emperor, Source } from '../domain/types';
import { periodLabel } from '../domain/queries';
import { dynasties } from '../data/dynasties';
import { identityColor } from '../theme';

export const go = (path: string) => {
  window.location.hash = path;
};
export function Sources({ sources }: { sources: Source[] }) {
  return (
    <section className="sources">
      <h3>
        <BookOpen size={17} /> 参考资料
      </h3>
      <p>内容为资料摘要；可沿条目参考文献继续核对原始史料。</p>
      {sources.map((s) => (
        <a key={s.url} href={s.url} target="_blank" rel="noreferrer">
          {s.title}
          <ArrowUpRight size={14} />
        </a>
      ))}
      {sources.some((s) => s.url.includes('wikipedia.org')) && (
        <a href="https://creativecommons.org/licenses/by-sa/4.0/" target="_blank" rel="noreferrer">
          维基百科摘录许可：CC BY-SA 4.0
        </a>
      )}
    </section>
  );
}
export function EmperorCard({ emperor, compact = false }: { emperor: Emperor; compact?: boolean }) {
  const dynasty = dynasties.find((d) => d.id === emperor.dynastyId)!;
  return (
    <button
      className={`emperor-card ${compact ? 'compact' : ''}`}
      style={identityColor(emperor.id)}
      onClick={() => go(`/emperors/${emperor.id}`)}
    >
      <div
        className="emperor-seal"
        style={{ '--dynasty-color': dynasty.color } as React.CSSProperties}
      >
        <span>{emperor.title.includes('帝') ? '帝' : emperor.title.slice(0, 1)}</span>
        <small>{dynasty.short}</small>
      </div>
      <div className="emperor-card-copy">
        <span className="eyebrow">
          {dynasty.name} · {emperor.reigns.map(periodLabel).join('、')}
        </span>
        <h3>
          {emperor.title}
          <span>{emperor.name}</span>
        </h3>
        {!compact && <p>{emperor.summary}</p>}
      </div>
      <ChevronRight className="card-chevron" size={17} />
    </button>
  );
}
export function EmptyState({ children }: { children: React.ReactNode }) {
  return (
    <div className="empty-state">
      <BookOpen size={28} />
      <h3>这一页，留待续写</h3>
      <p>{children}</p>
    </div>
  );
}
