// backend/src/auth/auth.const.ts
export const COOKIE_NAME = 'access_token';
export const SLIDING_MAX_AGE_MS = 1000 * 60 * 60 * 48; // 48h
export const REFRESH_THRESHOLD_SEC = 60 * 60 * 12;     // 残り12hで延長
