import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updatePhotoLabStatus } from "@/apis/photoLab";
import { queryKeys } from "@/hooks/queryKeys";
import type { AdminPhotoLab, PhotoLabStatus } from "@/types/photoLab";

interface Variables {
  id: string;
  status: PhotoLabStatus;
}

/**
 * 상태 토글 mutation.
 *
 * 성공 시 목록 쿼리 invalidate — 변경된 status 가 즉시 반영.
 * (운영 빈도가 낮아 optimistic update 까지 가지 않음.)
 */
export function useUpdatePhotoLabStatus(options?: {
  onSuccess?: (data: AdminPhotoLab, variables: Variables) => void;
  onError?: (error: Error, variables: Variables) => void;
}) {
  const qc = useQueryClient();
  return useMutation<AdminPhotoLab, Error, Variables>({
    mutationFn: ({ id, status }) => updatePhotoLabStatus(id, status),
    onSuccess: (data, variables) => {
      qc.invalidateQueries({ queryKey: queryKeys.photoLabs.all });
      options?.onSuccess?.(data, variables);
    },
    onError: options?.onError,
  });
}
