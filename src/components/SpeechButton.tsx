import { useEffect, useRef, useState } from 'react';
import { Volume2, Pause, Square, Play } from 'lucide-react';

export function SpeechButton({ text, label = '语音讲解' }: { text: string; label?: string }) {
  const [status, setStatus] = useState<'idle' | 'playing' | 'paused'>('idle');
  const [error, setError] = useState('');
  const utterance = useRef<SpeechSynthesisUtterance | null>(null);
  const supported = typeof window !== 'undefined' && 'speechSynthesis' in window;
  useEffect(() => {
    setStatus('idle');
    setError('');
    return () => {
      if (supported) window.speechSynthesis.cancel();
    };
  }, [text, supported]);
  function toggle() {
    if (!supported) {
      setError('此浏览器不支持语音合成，请阅读页面中的讲解文本。');
      return;
    }
    const synth = window.speechSynthesis;
    if (status === 'playing') {
      synth.pause();
      setStatus('paused');
      return;
    }
    if (status === 'paused') {
      synth.resume();
      setStatus('playing');
      return;
    }
    synth.cancel();
    setError('');
    const speech = new SpeechSynthesisUtterance(text);
    speech.lang = 'zh-CN';
    speech.rate = 0.9;
    const voice = synth.getVoices().find((v) => v.lang.toLowerCase().startsWith('zh'));
    if (voice) speech.voice = voice;
    speech.onend = () => setStatus('idle');
    speech.onerror = (event) => {
      setStatus('idle');
      if (event.error !== 'canceled' && event.error !== 'interrupted')
        setError('语音服务暂不可用，请检查系统中文语音包或浏览器设置。讲解文本已显示在页面中。');
    };
    utterance.current = speech;
    setStatus('playing');
    synth.speak(speech);
  }
  return (
    <div className="speech-wrap">
      <div className="speech-controls">
        <button className={`speech-button ${status !== 'idle' ? 'active' : ''}`} onClick={toggle}>
          {status === 'playing' ? (
            <Pause size={15} />
          ) : status === 'paused' ? (
            <Play size={15} />
          ) : (
            <Volume2 size={15} />
          )}{' '}
          {status === 'playing' ? '暂停讲解' : status === 'paused' ? '继续讲解' : label}
        </button>
        {status !== 'idle' && (
          <button
            className="icon-button"
            aria-label="停止讲解"
            onClick={() => {
              window.speechSynthesis.cancel();
              setStatus('idle');
            }}
          >
            <Square size={14} />
          </button>
        )}
      </div>
      {error && (
        <p className="speech-error" role="status">
          {error}
        </p>
      )}
    </div>
  );
}
