/**
 * Admin 토큰 영속화 — localStorage 단일 키.
 *
 * Refresh token 흐름은 현재 admin 에서 사용하지 않는다.
 * (TTL 만료 시 그냥 재로그인. 운영자 1명 기준 충분히 단순.)
 */

const ACCESS_KEY = "access_token";

export const tokenStorage = {
  getAccessToken(): string | null {
    if (typeof window === "undefined") return null;
    return window.localStorage.getItem(ACCESS_KEY);
  },

  setAccessToken(token: string | null) {
    if (typeof window === "undefined") return;
    if (token) window.localStorage.setItem(ACCESS_KEY, token);
    else window.localStorage.removeItem(ACCESS_KEY);
  },

  clear() {
    if (typeof window === "undefined") return;
    window.localStorage.removeItem(ACCESS_KEY);
  },
};
