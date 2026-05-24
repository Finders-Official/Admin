"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080";

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

  let data: { accessToken?: string };
  try {
    const res = await fetch(`${API_URL}/auth/admin/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    if (!res.ok) {
      const text = await res.text().catch(() => "");
      return { error: text || "아이디 또는 비밀번호가 올바르지 않습니다." };
    }

    data = await res.json();
  } catch {
    return { error: "서버에 연결할 수 없습니다." };
  }

  if (!data.accessToken) {
    return { error: "인증 토큰을 받지 못했습니다." };
  }

  const cookieStore = await cookies();
  cookieStore.set("access_token", data.accessToken, {
    httpOnly: true,
    path: "/",
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24,
  });

  redirect(next);
}
