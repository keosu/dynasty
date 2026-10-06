import { useEffect, useState } from 'react';
import { Maximize, Minimize } from 'lucide-react';
import './fullscreen.css';

export function FullscreenButton() {
  const [fullscreen, setFullscreen] = useState(!!document.fullscreenElement);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const syncFullscreen = () => {
      setFullscreen(!!document.fullscreenElement);
      setError('');
    };
    document.addEventListener('fullscreenchange', syncFullscreen);
    return () => document.removeEventListener('fullscreenchange', syncFullscreen);
  }, []);

  if (!document.fullscreenEnabled || !document.documentElement.requestFullscreen) return null;

  async function toggleFullscreen() {
    setPending(true);
    setError('');
    try {
      if (document.fullscreenElement) await document.exitFullscreen();
      else await document.documentElement.requestFullscreen();
    } catch {
      setError('暂时无法切换全屏，请重试。');
    } finally {
      setPending(false);
    }
  }

  const label = fullscreen ? '退出全屏' : '全屏显示';
  return (
    <span className="fullscreen-control">
      <button
        type="button"
        className="icon-button"
        aria-label={label}
        aria-pressed={fullscreen}
        title={fullscreen ? '退出全屏（Esc）' : label}
        disabled={pending}
        onClick={toggleFullscreen}
      >
        {fullscreen ? <Minimize size={18} /> : <Maximize size={18} />}
      </button>
      {error && (
        <span className="fullscreen-error" role="status">
          {error}
        </span>
      )}
    </span>
  );
}
