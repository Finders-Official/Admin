import { http } from "@/apis/http";
import type { ApiResponse } from "@/types/api";
import type { AdminPhotoLab, PhotoLabStatus } from "@/types/photoLab";

export async function updatePhotoLabStatus(
  id: string,
  status: PhotoLabStatus,
): Promise<AdminPhotoLab> {
  const res = await http.patch<ApiResponse<AdminPhotoLab>>(
    `/admin/photo-labs/${id}/status`,
    { status },
  );
  const body = res.data;
  if (!body.success) throw new Error(body.message);
  return body.data;
}
