import { useInfiniteQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { listPhotoLabs } from "@/apis/photoLab";
import { queryKeys } from "@/hooks/queryKeys";
import type { AdminPhotoLab, PhotoLabStatus } from "@/types/photoLab";

interface Options {
  status?: PhotoLabStatus;
  pageSize?: number;
}

/**
 * 사진관 카탈로그 무한 스크롤 쿼리.
 *
 * BE 의 Spring Data Page<T>(`{content, last, number, totalPages, ...}`) 응답을
 * `useInfiniteQuery` 로 page 를 증가시키며 누적한다.
 * getNextPageParam 은 `last` 플래그로 종료 판정.
 */
export function useInfinitePhotoLabs({ status, pageSize = 30 }: Options = {}) {
  const params = { size: pageSize, status };

  const query = useInfiniteQuery({
    queryKey: queryKeys.photoLabs.list(params),
    queryFn: ({ pageParam }) => listPhotoLabs({ ...params, page: pageParam }),
    initialPageParam: 0,
    getNextPageParam: (lastPage) => (lastPage.last ? undefined : lastPage.number + 1),
    staleTime: 30_000,
  });

  /** 모든 페이지의 content 를 평탄화한 배열. */
  const labs = useMemo<AdminPhotoLab[]>(
    () => query.data?.pages.flatMap((p) => p.content) ?? [],
    [query.data],
  );

  /** 첫 페이지 응답의 totalElements (BE 가 전체 개수 제공). */
  const total = query.data?.pages[0]?.totalElements ?? 0;

  return {
    ...query,
    labs,
    total,
  };
}
