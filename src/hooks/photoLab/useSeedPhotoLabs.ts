import { useMutation, useQueryClient } from "@tanstack/react-query";
import { seedPhotoLabs } from "@/apis/photoLab";
import { queryKeys } from "@/hooks/queryKeys";
import type { SeedResult } from "@/types/photoLab";

/**
 * 카탈로그 시딩 mutation.
 *
 * 성공 시 목록 쿼리 전체를 invalidate — 새 row 가 보이도록.
 */
export function useSeedPhotoLabs(options?: {
  onSuccess?: (result: SeedResult) => void;
  onError?: (error: Error) => void;
}) {
  const qc = useQueryClient();
  return useMutation<SeedResult, Error, void>({
    mutationFn: seedPhotoLabs,
    onSuccess: (result) => {
      qc.invalidateQueries({ queryKey: queryKeys.photoLabs.all });
      options?.onSuccess?.(result);
    },
    onError: options?.onError,
  });
}
