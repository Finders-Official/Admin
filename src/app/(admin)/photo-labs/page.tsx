import { Toaster } from "@/components/ui/sonner";
import { apiJson } from "@/lib/api";
import { PhotoLabsClient } from "./photo-labs-client";
import type { AdminPhotoLabResponse } from "./types";

interface PageResponse {
  content: AdminPhotoLabResponse[];
  totalPages: number;
  totalElements: number;
  number: number;
}

interface PageProps {
  searchParams: Promise<{ page?: string; status?: string }>;
}

export default async function PhotoLabsPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const page = Number(params.page ?? 0);
  const status = params.status;

  const query = new URLSearchParams({ page: String(page), size: "50" });
  if (status) query.set("status", status);

  let data: PageResponse = { content: [], totalPages: 0, totalElements: 0, number: 0 };
  try {
    data = await apiJson<PageResponse>(`/admin/photo-labs?${query.toString()}`);
  } catch {
    // 서버 미기동 상태에서도 페이지 렌더 허용
  }

  return (
    <>
      <Toaster richColors />
      <PhotoLabsClient
        labs={data.content}
        totalPages={data.totalPages}
        currentPage={data.number}
      />
    </>
  );
}
