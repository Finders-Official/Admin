import { http } from "@/apis/http";
import type { ApiResponse } from "@/types/api";
import type { SeedResult } from "@/types/photoLab";

export async function seedPhotoLabs(): Promise<SeedResult> {
  const res = await http.post<ApiResponse<SeedResult>>("/admin/photo-labs/seed");
  const body = res.data;
  if (!body.success) throw new Error(body.message);
  return body.data;
}
