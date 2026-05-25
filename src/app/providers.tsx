"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Toaster } from "@/components/ui/sonner";
import { http } from "@/apis/http";
import { setupInterceptors } from "@/apis/interceptors";

/**
 * 클라이언트 전역 Provider.
 *
 * - QueryClient 는 컴포넌트 인스턴스당 1개 (React strict mode 안전).
 * - axios interceptors 는 mount 시 1회 — 401 발생 시 next/navigation router 로 /login.
 */
export function Providers({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 30_000,
            retry: 1,
            refetchOnWindowFocus: false,
          },
        },
      }),
  );

  useEffect(() => {
    setupInterceptors(http, () => router.replace("/login"));
  }, [router]);

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <Toaster richColors position="top-right" />
      {process.env.NODE_ENV === "development" && (
        <ReactQueryDevtools initialIsOpen={false} buttonPosition="bottom-right" />
      )}
    </QueryClientProvider>
  );
}
