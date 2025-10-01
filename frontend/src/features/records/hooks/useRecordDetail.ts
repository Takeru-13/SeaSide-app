// src/features/records/hooks/useRecordDetail.ts
import { useEffect, useState } from 'react';
import { getRecordByDate, upsertRecordByDate } from '../api';
import type { RecordView, UpsertPayload, DateKey } from '../types';

type Opts = { userId?: number }; // 指定時はペア閲覧（readOnly想定）

function makeEmpty(date: DateKey): RecordView {
  return {
    date,
    meal: { breakfast: false, lunch: false, dinner: false },
    sleep: { time: '00:00' },
    medicine: { items: [] },
    period: 'none',
    emotion: 5,
    exercise: { items: [] },
    memo: { content: '' },
  };
}

/**
 * 詳細ページ用フック
 * - userId 指定時：ペア閲覧（保存は呼び出し側で抑制する想定）
 * - userId 未指定：自分の記録（保存可）
 */
export function useRecordDetail(dateKey: DateKey, opts: Opts = {}) {
  const [data, setData] = useState<RecordView | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let ignore = false;
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const rec = await getRecordByDate(
          dateKey,
          opts.userId != null ? String(opts.userId) : undefined,
        );
        if (ignore) return;
        setData(rec ?? makeEmpty(dateKey));
      } catch (e: any) {
        if (ignore) return;
        setError(e?.message ?? '取得に失敗しました');
        setData(makeEmpty(dateKey));
      } finally {
        if (!ignore) setLoading(false);
      }
    })();
    return () => {
      ignore = true;
    };
  }, [dateKey, opts.userId]);

  /** 差分パッチで保存（自分のみ・userIdは付けない） */
  const save = async (patch: UpsertPayload) => {
    // ペア閲覧時は BE で 403 になるので、呼び出し側でボタン無効化しておくのが吉
    await upsertRecordByDate(dateKey, patch);
    const rec = await getRecordByDate(dateKey); // 自分の最新値で再読込
    setData(rec ?? makeEmpty(dateKey));
  };

  return { data, loading, error, save };
}
