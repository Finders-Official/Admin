import { NextResponse, type NextRequest } from "next/server";
import { decodeJwt } from "jose";

const PUBLIC_PATHS = /^\/(login|_next|api|favicon\.ico)/;

/**
 * Admin 앱 인증 가드.
 * - /login 과 정적 자원만 무인증 통과.
 * - 그 외 모든 경로는 access_token cookie + JWT payload 검증 (role=ADMIN + 만료).
 * - 검증 실패 시 cookie 삭제 + /login?next=... 으로 redirect.
 *
 * 주의: jose 의 decodeJwt 는 서명을 검증하지 않는다. 실제 권한 인가는 BE 가
 * 매 요청마다 다시 검증한다. 여기서는 "쿠키 존재 + 명백한 만료/role 위반"
 * 을 걸러 즉시 /login 으로 보내 사용자 경험을 깔끔하게 만드는 게 목적.
 */
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (PUBLIC_PATHS.test(pathname)) {
    return NextResponse.next();
  }

  const token = request.cookies.get("access_token")?.value;
  if (!token) {
    return redirectToLogin(request);
  }

  try {
    const payload = decodeJwt(token);
    if (payload.role !== "ADMIN") {
      return redirectToLogin(request, true);
    }
    if (typeof payload.exp === "number" && payload.exp * 1000 <= Date.now()) {
      return redirectToLogin(request, true);
    }
  } catch {
    return redirectToLogin(request, true);
  }

  return NextResponse.next();
}

function redirectToLogin(request: NextRequest, clearToken = false) {
  const url = request.nextUrl.clone();
  url.pathname = "/login";
  url.searchParams.set("next", request.nextUrl.pathname);
  const response = NextResponse.redirect(url);
  if (clearToken) {
    response.cookies.delete("access_token");
  }
  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon\\.ico|.*\\.(?:png|svg|ico|jpg|jpeg|webp)$).*)"],
};
