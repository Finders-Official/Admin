"use client";

import { useCallback, useMemo, useState } from "react";
import { useInfinitePhotoLabs } from "@/hooks/photoLab/usePhotoLabs";
import { PhotoLabsTable } from "@/components/photo-labs/photo-labs-table";
import { PhotoLabsSearch } from "@/components/photo-labs/photo-labs-search";
import { SeedButton } from "@/components/photo-labs/seed-button";

/** 사진관 이름(대소문자/공백 무시) 매칭. */
function matchesName(name: string | null, q: string): boolean {
  if (!q) return true;
  const norm = (s: string) => s.replace(/\s+/g, "").toLowerCase();
  return norm(name ?? "").includes(norm(q));
}

export default function PhotoLabsPage() {
  const [search, setSearch] = useState("");

  const {
    labs,
    total,
    error,
    isLoading,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
  } = useInfinitePhotoLabs({ pageSize: 30 });

  const filtered = useMemo(
    () => labs.filter((lab) => matchesName(lab.name, search)),
    [labs, search],
  );

  const handleLoadMore = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) fetchNextPage();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  return (
    <div className="flex flex-col gap-5 px-4 py-6 sm:px-6 lg:px-10 lg:py-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between sm:gap-6">
        <div>
          <h1 className="text-2xl font-semibold text-foreground sm:text-3xl">사진관 카탈로그</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            네이버 지도에서 수집한 필름 현상소. 시딩을 실행하면 신규 등록/업데이트가 진행된다.
          </p>
        </div>
        <SeedButton />
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
        <PhotoLabsSearch value={search} onChange={setSearch} />
        <p className="text-sm text-muted-foreground tabular-nums">
          {search
            ? `${filtered.length}건 검색 · 누적 ${labs.length} / 전체 ${total}건`
            : `${labs.length} / 전체 ${total}건`}
        </p>
      </div>

      {error && (
        <p className="text-sm text-red-500">
          목록을 불러오지 못했습니다: {error.message}
        </p>
      )}

      <PhotoLabsTable
        labs={filtered}
        isLoading={isLoading}
        hasNextPage={hasNextPage && !search}
        isFetchingNextPage={isFetchingNextPage}
        onLoadMore={handleLoadMore}
        emptyHint={
          search
            ? "검색 결과가 없습니다."
            : "데이터가 없습니다. 시딩을 실행해주세요."
        }
      />
    </div>
  );
}
