"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { tokenStorage } from "@/utils/tokenStorage";

/**
 * Admin 라우트 그룹 가드 (client-side).
 *
 * localStorage 의 access_token 유무로 판정. 없으면 /login?next=<current> 로 redirect.
 * server-side proxy/middleware 는 localStorage 를 못 보므로 client-side 가드만 의미 있다.
 *
 * mount 직후 1 tick 짧은 loading 보이고 → token 있으면 children 렌더, 없으면 redirect.
 */
export function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const token = tokenStorage.getAccessToken();
    if (!token) {
      const next = encodeURIComponent(pathname || "/");
      router.replace(`/login?next=${next}`);
      return;
    }
    setReady(true);
  }, [router, pathname]);

  if (!ready) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-sm text-muted-foreground">불러오는 중…</div>
      </div>
    );
  }

  return <>{children}</>;
}
