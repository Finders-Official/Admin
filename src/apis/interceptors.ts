import type { AxiosError, AxiosInstance, InternalAxiosRequestConfig } from "axios";
import { tokenStorage } from "@/utils/tokenStorage";

const SKIP_AUTH_PATHS = ["/auth/admin/login"];

function shouldSkipAuth(url: string | undefined): boolean {
  if (!url) return false;
  return SKIP_AUTH_PATHS.some((p) => url.startsWith(p));
}

/**
 * Provider 마운트 시 1회 호출.
 *
 * 요청: access_token 이 있으면 Authorization 첨부.
 * 응답: 401 이면 토큰을 비우고 사용자를 /login 으로 보낸다 (다시 로그인 요구).
 *      refresh 흐름은 admin 에 현재 미구현 — 의도적 단순화.
 */
export function setupInterceptors(instance: AxiosInstance, onUnauthorized: () => void) {
  instance.interceptors.request.use((config: InternalAxiosRequestConfig) => {
    if (shouldSkipAuth(config.url)) return config;
    const token = tokenStorage.getAccessToken();
    if (token) {
      config.headers.set("Authorization", `Bearer ${token}`);
    }
    return config;
  });

  instance.interceptors.response.use(
    (response) => response,
    (error: AxiosError) => {
      const status = error.response?.status;
      const url = error.config?.url ?? "";

      // 로그인 요청에서 401 은 단순히 자격증명 오류 — 토큰 정리/리다이렉트 X
      if (status === 401 && !shouldSkipAuth(url)) {
        tokenStorage.clear();
        onUnauthorized();
      }
      return Promise.reject(error);
    },
  );
}
