import { http } from "@/apis/http";
import type { ApiResponse } from "@/types/api";
import type { AdminLoginRequest, AdminLoginResponse } from "@/types/auth";

export async function adminLogin(payload: AdminLoginRequest): Promise<AdminLoginResponse> {
  const res = await http.post<ApiResponse<AdminLoginResponse>>("/auth/admin/login", payload);
  const body = res.data;
  if (!body.success) {
    throw new Error(body.message || "로그인에 실패했습니다.");
  }
  return body.data;
}
