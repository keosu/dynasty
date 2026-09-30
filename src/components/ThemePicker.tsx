import { useEffect, useRef, useState } from 'react';
import { Check, ChevronDown, Palette } from 'lucide-react';
import { applyTheme, readTheme, themes } from '../theme';

export function ThemePicker() {
  const [theme, setTheme] = useState(readTheme);
  const [open, setOpen] = useState(false);
  const container = useRef<HTMLDivElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const current = themes.find((option) => option.id === theme)!;

  useEffect(() => applyTheme(theme), [theme]);
  useEffect(() => {
    if (!open) return;
    container.current?.querySelector<HTMLInputElement>('input:checked')?.focus();
    function dismiss(event: PointerEvent) {
      if (!container.current?.contains(event.target as Node)) setOpen(false);
    }
    document.addEventListener('pointerdown', dismiss);
    return () => document.removeEventListener('pointerdown', dismiss);
  }, [open]);

  return (
    <div
      className="theme-picker"
      ref={container}
      onKeyDown={(event) => {
        if (event.key === 'Escape' && open) {
          event.stopPropagation();
          setOpen(false);
          trigger.current?.focus();
        }
      }}
      onBlur={(event) => {
        // Clicking a label first blurs the current radio with a null target,
        // then forwards the click to its input. Keep it mounted for that click.
        // Outside pointer clicks are handled separately by dismiss().
        if (event.relatedTarget && !event.currentTarget.contains(event.relatedTarget)) {
          setOpen(false);
        }
      }}
    >
      <button
        ref={trigger}
        className="theme-trigger"
        aria-label={`选择主题，当前${current.name}`}
        aria-expanded={open}
        aria-controls="theme-options"
        title={`外观 · ${current.name}`}
        onClick={() => setOpen((value) => !value)}
      >
        <Palette size={16} />
        <span>{current.name}</span>
        <ChevronDown size={12} />
      </button>
      {open && (
        <fieldset className="theme-options" id="theme-options">
          <legend>外观主题</legend>
          {themes.map((option) => (
            <label className="theme-option" key={option.id}>
              <input
                type="radio"
                name="theme"
                value={option.id}
                checked={theme === option.id}
                onChange={() => setTheme(option.id)}
                aria-label={option.name}
              />
              <span className={`theme-preview preview-${option.id}`} aria-hidden="true">
                <i />
                <i />
                <i />
              </span>
              <span className="theme-option-copy">
                <strong>{option.name}</strong>
                <small>{option.description}</small>
              </span>
              <Check className="theme-check" size={15} aria-hidden="true" />
            </label>
          ))}
          <p>选择自动保存，适用于所有页面</p>
        </fieldset>
      )}
    </div>
  );
}
