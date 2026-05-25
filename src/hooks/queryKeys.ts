import type { ListPhotoLabsParams } from "@/apis/photoLab";

/** React Query key factory — TkDodo 권장 패턴 (모든 키를 한 곳에서). */
export const queryKeys = {
  photoLabs: {
    all: ["photo-labs"] as const,
    list: (params: ListPhotoLabsParams) =>
      [...queryKeys.photoLabs.all, "list", params] as const,
  },
} as const;
