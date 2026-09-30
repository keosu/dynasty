import type { CSSProperties } from 'react';

// Stable visual identity across filtering, chronology and person views.
// These are presentation colors, not historical classifications.
export function identityColor(id: string): CSSProperties {
  let hash = 0;
  for (const character of id) hash = (hash * 31 + character.charCodeAt(0)) >>> 0;
  return { '--item-color': `var(--spectrum-${hash % 6})` } as CSSProperties;
}

// IDs remain stable so saved preferences survive theme and palette updates.
export const themes = [
  { id: 'light', name: '青瓷亮色', description: '瓷白 · 湖蓝 · 温润纸感', chrome: '#f4f5f1' },
  { id: 'dark', name: '静夜暗色', description: '深蓝 · 银灰 · 安静阅读', chrome: '#111c2e' },
  {
    id: 'colorful',
    name: '琉璃夜色',
    description: '六色琉璃 · 彩色卡片与时间轴',
    chrome: '#181c26',
  },
] as const;

export type Theme = (typeof themes)[number]['id'];

export function readTheme(): Theme {
  try {
    const stored = localStorage.getItem('shanhe-theme');
    return themes.find((theme) => theme.id === stored)?.id ?? 'light';
  } catch {
    return 'light';
  }
}

export function applyTheme(theme: Theme) {
  document.documentElement.dataset.theme = theme;
  document
    .querySelector('meta[name="theme-color"]')
    ?.setAttribute('content', themes.find((option) => option.id === theme)!.chrome);
  try {
    localStorage.setItem('shanhe-theme', theme);
  } catch {
    // The current session can still change themes when storage is unavailable.
  }
}
