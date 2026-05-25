import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { listPhotoLabs, type ListPhotoLabsParams } from "@/apis/photoLab";
import { queryKeys } from "@/hooks/queryKeys";

/**
 * 사진관 카탈로그 목록.
 *
 * 페이지네이션은 placeholderData 로 매끄럽게 (페이지 전환 시 이전 페이지 잠깐 유지).
 * 운영 데이터라 staleTime 30s — 너무 자주 refetch 도, 영원히 stale 도 아닌 적당히.
 */
export function usePhotoLabs(params: ListPhotoLabsParams = {}) {
  return useQuery({
    queryKey: queryKeys.photoLabs.list(params),
    queryFn: () => listPhotoLabs(params),
    placeholderData: keepPreviousData,
    staleTime: 30_000,
  });
}
