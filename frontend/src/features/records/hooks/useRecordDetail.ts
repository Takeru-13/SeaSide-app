// src/features/records/detail/hooks/useRecordDetail.ts
import { useEffect, useState } from "react";
import { getRecord } from "../../api/getRecord";
import { patchRecord } from "../../api/patchRecord";
import type { EditFormValue } from '../types';

type Opts = { userId?: number };

export function useRecordDetail(dateKey: string, opts: Opts = {}) {
  const [data, setData] = useState<EditFormValue | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let ignore = false;
    setLoading(true);
    setError(null);
    getRecord(dateKey, opts.userId)
      .then((rec) => {
        if (ignore) return;
        
        if (rec === null) {
          // レコードが存在しない場合はハリボテを生成
          const emptyRecord: EditFormValue = {
            date: dateKey,
            meal: { breakfast: false, lunch: false, dinner: false },
            sleep: { time: '' },
            medicine: { items: [] },
            period: 'none',
            emotion: 5,
            exercise: { items: [] },
            memo: { content: '' }
          };
          setData(emptyRecord);
        } else {
          // 既存レコードがある場合は型マッピング
          const mappedRecord: EditFormValue = {
            ...rec,
            exercise: rec.exercise ?? { items: [] },
            memo: rec.memo ?? { content: '' }
          };
          setData(mappedRecord);
        }
      })
      .catch((e) => !ignore && setError(e?.message ?? "取得に失敗しました"))
      .finally(() => !ignore && setLoading(false));
    return () => { ignore = true; };
  }, [dateKey, opts.userId]);

  const save = async (v: EditFormValue) => {
    await patchRecord(dateKey, v); // 自分の記録のみ更新（userIdは送らない）
    const rec = await getRecord(dateKey, opts.userId);
    setData(rec as EditFormValue);
  };

  return { data, loading, error, save };
}
