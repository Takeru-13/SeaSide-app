const BASE = import.meta.env.VITE_API_URL ?? 'http://localhost:3000';

export async function http<T>(path: string, init: RequestInit = {}): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    ...init,
    headers: { 'Content-Type': 'application/json', ...(init.headers || {}) },
    credentials: 'include',
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`${res.status} ${text}`);
  }
  return res.json() as Promise<T>;
}

// --- ここから追加 ---
export const get = <T>(path: string) =>
  http<T>(path, { method: 'GET' });

export const post = <T>(path: string, body?: unknown) =>
  http<T>(path, {
    method: 'POST',
    body: body ? JSON.stringify(body) : undefined,
  });

export const put = <T>(path: string, body?: unknown) =>
  http<T>(path, {
    method: 'PUT',
    body: body ? JSON.stringify(body) : undefined,
  });

export const del = <T>(path: string) =>
  http<T>(path, { method: 'DELETE' });
