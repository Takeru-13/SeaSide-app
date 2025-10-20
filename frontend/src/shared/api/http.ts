// frontend/src/shared/api/http.ts
const BASE = import.meta.env.VITE_API_URL ?? 'http://localhost:3000';
const TOKEN_KEY = 'auth_token';

// トークンの保存・取得・削除
export const tokenStorage = {
  get: () => localStorage.getItem(TOKEN_KEY),
  set: (token: string) => localStorage.setItem(TOKEN_KEY, token),
  clear: () => localStorage.removeItem(TOKEN_KEY),
};

export async function http<T>(path: string, init: RequestInit = {}): Promise<T> {
  const token = tokenStorage.get();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(init.headers as Record<string, string> || {}),
  };

  // トークンがあればAuthorizationヘッダーを追加
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(`${BASE}${path}`, {
    ...init,
    headers,
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`${res.status} ${text}`);
  }
  return res.json() as Promise<T>;
}

// 追加：404は例外にせず null を返すGET
export async function getOrNull<T>(path: string): Promise<T | null> {
  const token = tokenStorage.get();
  const headers: Record<string, string> = { 'Accept': 'application/json' };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(`${BASE}${path}`, {
    method: 'GET',
    headers,
  });
  if (res.status === 404) return null;
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`${res.status} ${text}`);
  }
  // 204などボディ無しにも一応対応
  const ct = res.headers.get('Content-Type') ?? '';
  if (!ct.includes('application/json')) return null;
  return res.json() as Promise<T>;
}

// 既存のラッパーはそのまま
export const get =  <T>(path: string) => http<T>(path, { method: 'GET' });
export const post = <T>(path: string, body?: unknown) =>
  http<T>(path, { method: 'POST', body: body ? JSON.stringify(body) : undefined });
export const put =  <T>(path: string, body?: unknown) =>
  http<T>(path, { method: 'PUT', body: body ? JSON.stringify(body) : undefined });
export const del =  <T>(path: string) => http<T>(path, { method: 'DELETE' });
