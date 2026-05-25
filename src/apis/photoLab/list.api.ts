import { http } from "@/apis/http";
import type { ApiResponse, PageResponse } from "@/types/api";
import type { AdminPhotoLab, PhotoLabStatus } from "@/types/photoLab";

export interface ListPhotoLabsParams {
  page?: number;
  size?: number;
  status?: PhotoLabStatus;
}

export async function listPhotoLabs(
  params: ListPhotoLabsParams = {},
): Promise<PageResponse<AdminPhotoLab>> {
  const res = await http.get<ApiResponse<PageResponse<AdminPhotoLab>>>(
    "/admin/photo-labs",
    {
      params: {
        page: params.page ?? 0,
        size: params.size ?? 50,
        ...(params.status ? { status: params.status } : {}),
      },
    },
  );
  const body = res.data;
  if (!body.success) throw new Error(body.message);
  return body.data;
}
