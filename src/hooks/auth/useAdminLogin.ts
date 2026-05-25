import { useMutation } from "@tanstack/react-query";
import { adminLogin } from "@/apis/auth";
import { tokenStorage } from "@/utils/tokenStorage";
import type { AdminLoginRequest, AdminLoginResponse } from "@/types/auth";

/**
 * Admin 로그인 mutation.
 *
 * 성공 시 accessToken 을 localStorage 에 저장한다. 페이지 이동은 호출 쪽 컴포넌트가
 * onSuccess 콜백에서 처리한다 (UI 효과는 컴포넌트 책임).
 */
export function useAdminLogin(options?: {
  onSuccess?: (data: AdminLoginResponse) => void;
  onError?: (error: Error) => void;
}) {
  return useMutation<AdminLoginResponse, Error, AdminLoginRequest>({
    mutationFn: adminLogin,
    onSuccess: (data) => {
      tokenStorage.setAccessToken(data.accessToken);
      options?.onSuccess?.(data);
    },
    onError: options?.onError,
  });
}
