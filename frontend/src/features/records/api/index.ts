// 記録データ用 API（UI 依存なし）
// 空ボディ（204/ボディ長0）を許容する

import type { RecordInput, RecordView } from '../types';

const BASE = import.meta.env.VITE_API_URL ?? 'http://localhost:3000';

export type MonthlyDayScore = { date: string; score?: number };

/** 単日取得（モーダル既定値用）。無ければ null */
export async function getRecordByDate(dateYMD: string): Promise<RecordView | null> {
  const res = await fetch(`${BASE}/records/${dateYMD}`, {
    method: 'GET',
    credentials: 'include',
  });

  if (!res.ok) {
    // 404などを使っていない設計なら基本ここは通らない想定
    throw new Error(`GET /records/${dateYMD} failed: ${res.status}`);
  }

  // 空ボディ（204やContent-Length: 0）を許容
  const text = await res.text();
  if (text.trim() === '') return null;

  try {
    return JSON.parse(text) as RecordView | null;
  } catch {
    // 何かしらJSON以外が返ってきた場合も安全側で null 扱い
    return null;
  }
}

/** 月次取得（カレンダードット/色分け用） */
export async function getMonthly(
  ym: string,
  scope: 'me' | 'pair' = 'me',
): Promise<MonthlyDayScore[]> {
  const qs = new URLSearchParams({ ym, scope });
  const res = await fetch(`${BASE}/records?${qs.toString()}`, {
    method: 'GET',
    credentials: 'include',
  });
  if (!res.ok) throw new Error(`GET /records?${qs.toString()} failed: ${res.status}`);
  return res.json();
}

/** 単日 upsert（新規/更新どちらも） */
export async function upsertRecordByDate(
  dateYMD: string,
  input: RecordInput,
): Promise<RecordView> {
  const res = await fetch(`${BASE}/records/${dateYMD}`, {
    method: 'PUT',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });
  if (!res.ok) throw new Error(`PUT /records/${dateYMD} failed: ${res.status}`);
  return res.json();
}
