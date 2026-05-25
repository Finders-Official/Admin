"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { API_BASE } from "@/lib/api";

export async function loginAction(
  _prev: { error?: string } | null,
  formData: FormData
): Promise<{ error?: string }> {
  const username = formData.get("username") as string;
  const password = formData.get("password") as string;
  const next = (formData.get("next") as string) || "/photo-labs";

  if (!username || !password) {
    return { error: "아이디와 비밀번호를 입력해주세요." };
  }

  // BE 응답은 ApiResponse 래퍼: { success, code, message, data: { accessToken, username } }
  interface AdminLoginResponse {
    success?: boolean;
    code?: string;
    message?: string;
    data?: { accessToken?: string; username?: string };
    // 혹시 모를 unwrap 변형 대비
    accessToken?: string;
  }

  let body: AdminLoginResponse;
  try {
    const res = await fetch(`${API_BASE}/auth/admin/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    const text = await res.text();
    try {
      body = JSON.parse(text);
    } catch {
      body = {};
    }

    if (!res.ok) {
      return { error: body.message || `로그인 실패 (HTTP ${res.status})` };
    }
  } catch {
    return { error: "서버에 연결할 수 없습니다." };
  }

  const accessToken = body.data?.accessToken ?? body.accessToken;
  if (!accessToken) {
    return { error: "인증 토큰을 받지 못했습니다." };
  }

  const cookieStore = await cookies();
  cookieStore.set("access_token", accessToken, {
    httpOnly: true,
    path: "/",
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24,
  });

  redirect(next);
}
