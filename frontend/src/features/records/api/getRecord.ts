// src/features/records/api/getRecord.ts
const BASE = import.meta.env.VITE_API_URL ?? "http://localhost:3000";

export async function getRecord(dateKey: string, userId?: number) {
  const url = new URL(`${BASE}/records/${dateKey}`);
  if (userId) url.searchParams.set("userId", String(userId));
  const res = await fetch(url, { credentials: "include" });
  if (!res.ok) throw new Error("記録の取得に失敗しました");
  return res.json();
}
