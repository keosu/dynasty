import { useEffect, useState } from 'react';
import type { Emperor } from '../domain/types';

const cache = new Map<string, Emperor>();
export function BiographySections({ person }: { person: Emperor }) {
  const [record, setRecord] = useState<Emperor>();
  const [error, setError] = useState(false);
  useEffect(() => {
    setRecord(undefined);
    setError(false);
    if (!person.biographyId) return;
    const key = person.biographyId;
    if (cache.has(key)) {
      setRecord(cache.get(key));
      return;
    }
    const controller = new AbortController();
    fetch(`${import.meta.env.BASE_URL}data/biographies/${key}.json`, { signal: controller.signal })
      .then((response) => {
        if (!response.ok) throw Error('biography');
        return response.json();
      })
      .then((data) => {
        cache.set(key, data);
        setRecord(data);
      })
      .catch((e) => {
        if (e.name !== 'AbortError') setError(true);
      });
    return () => controller.abort();
  }, [person.biographyId]);
  if (!person.biographyId) return null;
  return (
    <section className="biography-sections">
      <h2>公开资料摘录</h2>
      <p className="import-attribution">
        摘自该人物的维基百科条目 · CC BY-SA 4.0 · 已作繁简转换和节选，保留来源原意。
      </p>
      {error ? (
        <p role="status">正文暂时无法加载，请通过下方来源阅读。</p>
      ) : !record ? (
        <p role="status">正在加载人物资料…</p>
      ) : (
        <>
          <details open={person.imported}>
            <summary>概述</summary>
            <p>{record.summary}</p>
          </details>
          {record.articleSections?.map((section, i) => (
            <details key={i}>
              <summary>{section.title}</summary>
              <p>{section.content}</p>
            </details>
          ))}
          {record.reignText?.length ? (
            <details>
              <summary>来源记载的在位时间</summary>
              {record.reignText.map((text) => (
                <p key={text}>{text}</p>
              ))}
              <p className="muted">
                来源可能同时包含称王、称帝与复辟阶段；本站已校订条目优先采用校订后的在位区间。
              </p>
            </details>
          ) : null}
        </>
      )}
    </section>
  );
}
