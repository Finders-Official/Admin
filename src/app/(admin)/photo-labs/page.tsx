"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";
import { usePhotoLabs } from "@/hooks/photoLab/usePhotoLabs";
import { PhotoLabsTable } from "@/components/photo-labs/photo-labs-table";
import { PhotoLabsPagination } from "@/components/photo-labs/photo-labs-pagination";
import { SeedButton } from "@/components/photo-labs/seed-button";
import type { PhotoLabStatus } from "@/types/photoLab";

const ALLOWED_STATUS: PhotoLabStatus[] = ["PENDING", "ACTIVE", "SUSPENDED", "CLOSED"];

function parseStatus(raw: string | null): PhotoLabStatus | undefined {
  if (!raw) return undefined;
  return (ALLOWED_STATUS as string[]).includes(raw) ? (raw as PhotoLabStatus) : undefined;
}

export default function PhotoLabsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const page = Math.max(0, Number(searchParams.get("page") ?? 0));
  const status = parseStatus(searchParams.get("status"));

  const { data, isLoading, isFetching, error } = usePhotoLabs({ page, status });

  const setPage = useCallback(
    (nextPage: number) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set("page", String(nextPage));
      router.replace(`/photo-labs?${params.toString()}`);
    },
    [router, searchParams],
  );

  return (
    <div className="px-10 py-8 flex flex-col gap-6">
      <div className="flex items-start justify-between gap-6">
        <div>
          <h1 className="text-3xl font-semibold text-foreground">사진관 카탈로그</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            네이버 지도에서 수집한 필름 현상소. 시딩을 실행하면 신규 등록/업데이트가 진행된다.
          </p>
        </div>
        <SeedButton />
      </div>

      {error && (
        <p className="text-sm text-red-500">
          목록을 불러오지 못했습니다: {error.message}
        </p>
      )}

      <PhotoLabsTable labs={data?.content ?? []} isLoading={isLoading} />

      <PhotoLabsPagination
        currentPage={data?.number ?? 0}
        totalPages={data?.totalPages ?? 0}
        onChange={setPage}
        isFetching={isFetching}
      />
    </div>
  );
}
