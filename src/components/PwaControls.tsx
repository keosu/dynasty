import { useEffect, useState } from 'react';
import { Download, WifiOff, X } from 'lucide-react';
import { useRegisterSW } from 'virtual:pwa-register/react';
import './pwa.css';

interface InstallPrompt extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export function PwaControls() {
  const [installPrompt, setInstallPrompt] = useState<InstallPrompt>();
  const [offline, setOffline] = useState(!navigator.onLine);
  const [updateError, setUpdateError] = useState(false);
  const {
    offlineReady: [offlineReady, setOfflineReady],
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW();

  useEffect(() => {
    const offerInstall = (event: Event) => {
      if (window.matchMedia('(display-mode: standalone)').matches) return;
      event.preventDefault();
      setInstallPrompt(event as InstallPrompt);
    };
    const installed = () => setInstallPrompt(undefined);
    const connectionChanged = () => setOffline(!navigator.onLine);
    window.addEventListener('beforeinstallprompt', offerInstall);
    window.addEventListener('appinstalled', installed);
    window.addEventListener('online', connectionChanged);
    window.addEventListener('offline', connectionChanged);
    // Recheck when returning to an installed app that has stayed open for days.
    const checkUpdate = () => {
      if (document.visibilityState === 'visible' && navigator.onLine) {
        navigator.serviceWorker
          ?.getRegistration()
          .then((registration) => registration?.update())
          .catch(() => {});
      }
    };
    document.addEventListener('visibilitychange', checkUpdate);
    return () => {
      window.removeEventListener('beforeinstallprompt', offerInstall);
      window.removeEventListener('appinstalled', installed);
      window.removeEventListener('online', connectionChanged);
      window.removeEventListener('offline', connectionChanged);
      document.removeEventListener('visibilitychange', checkUpdate);
    };
  }, []);

  async function install() {
    if (!installPrompt) return;
    try {
      await installPrompt.prompt();
      await installPrompt.userChoice;
    } finally {
      setInstallPrompt(undefined);
    }
  }

  function dismiss() {
    setOfflineReady(false);
    setNeedRefresh(false);
    setUpdateError(false);
  }

  return (
    <>
      {installPrompt && (
        <button
          className="icon-button pwa-install"
          aria-label="安装山河纪"
          title="安装山河纪"
          onClick={() => void install().catch(() => {})}
        >
          <Download size={18} />
        </button>
      )}
      {offline && (
        <span
          className="pwa-connection"
          role="status"
          aria-label="当前离线，使用已保存的资料"
          title="当前离线，使用已保存的资料"
        >
          <WifiOff size={18} />
        </span>
      )}
      {(offlineReady || needRefresh) && (
        <aside className="pwa-notice" aria-label="应用提示">
          <div role="status">
            <strong>{needRefresh ? '山河纪有新版本' : '已可离线使用'}</strong>
            <p>
              {needRefresh
                ? '更新将重新打开当前页面。'
                : '地图和目录已保存，人物正文阅读后可离线查看。'}
            </p>
            {updateError && <p>暂时无法更新，请联网后重试。</p>}
          </div>
          <div className="pwa-notice-actions">
            {needRefresh && (
              <button
                className="pwa-update"
                onClick={() => void updateServiceWorker(true).catch(() => setUpdateError(true))}
              >
                立即更新
              </button>
            )}
            <button className="icon-button" aria-label="关闭应用提示" onClick={dismiss}>
              <X size={18} />
            </button>
          </div>
        </aside>
      )}
    </>
  );
}
