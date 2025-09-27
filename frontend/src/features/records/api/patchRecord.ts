// src/features/records/api/patchRecord.ts
const BASE = import.meta.env.VITE_API_URL ?? "http://localhost:3000";

export async function patchRecord(dateKey: string, body: unknown) {
  const res = await fetch(`${BASE}/records/${dateKey}`, {
    method: "PATCH",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error("記録の更新に失敗しました");
  return res.json();
}
