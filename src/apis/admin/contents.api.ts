import { http } from "@/apis/http";
import type { ApiResponse } from "@/types/api";
import type { ContentItem } from "@/types/content";

export interface ContentDetail {
  id: number;
  title: string;
  subtitle: string;
  thumbnailUrl: string;
  bodyContent: string;
  status: "PUBLISHED" | "DRAFT" | "HIDDEN";
  authorAdminName: string;
}

function formatDate(isoString: string): string {
  return isoString.replace("T", " ").substring(0, 10);
}

interface BeContentItem {
  id: number;
  title: string;
  subtitle: string | null;
  thumbnailUrl: string | null;
  status: string;
  authorAdminName: string | null;
  createdAt: string;
}

interface BeContentDetail extends BeContentItem {
  bodyContent: string;
  updatedAt: string;
}

function mapToContent(be: BeContentItem): ContentItem {
  return {
    id: be.id,
    title: be.title,
    subtitle: be.subtitle ?? "",
    thumbnail: be.thumbnailUrl ?? "",
    status: be.status === "PUBLISHED" ? "게시중" : "임시저장",
    author: be.authorAdminName ?? "운영팀",
    createdAt: formatDate(be.createdAt),
  };
}

interface BePagedData<T> { data: T[]; }

export async function fetchContents(): Promise<ContentItem[]> {
  const res = await http.get<BePagedData<BeContentItem>>("/admin/contents", {
    params: { size: 50 },
  });
  return (res.data.data ?? []).map(mapToContent);
}

export async function getContentDetail(contentId: number): Promise<ContentDetail> {
  const res = await http.get<ApiResponse<BeContentDetail>>(`/admin/contents/${contentId}`);
  const be = res.data.data;
  return {
    id: be.id,
    title: be.title,
    subtitle: be.subtitle ?? "",
    thumbnailUrl: be.thumbnailUrl ?? "",
    bodyContent: be.bodyContent,
    status: be.status as ContentDetail["status"],
    authorAdminName: be.authorAdminName ?? "",
  };
}

export async function createContent(data: {
  title: string;
  subtitle?: string;
  thumbnailUrl?: string;
  bodyContent: string;
  status: "PUBLISHED" | "DRAFT";
  authorAdminName?: string;
}): Promise<void> {
  await http.post("/admin/contents", data);
}

export async function updateContent(contentId: number, data: {
  title?: string;
  subtitle?: string;
  thumbnailUrl?: string;
  bodyContent?: string;
  status?: "PUBLISHED" | "DRAFT" | "HIDDEN";
}): Promise<void> {
  await http.put(`/admin/contents/${contentId}`, data);
}

export async function deleteContent(contentId: number): Promise<void> {
  await http.delete(`/admin/contents/${contentId}`);
}
