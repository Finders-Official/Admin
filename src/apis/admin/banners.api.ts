import { http } from "@/apis/http";
import type { ApiResponse } from "@/types/api";
import type { BannerItem } from "@/types/banner";

function formatDate(isoString: string): string {
  return isoString.replace("T", " ").substring(0, 10);
}

interface BeBannerItem {
  id: number;
  adminTitle: string;
  imageUrl: string;
  linkUrl: string | null;
  priority: number;
  isActive: boolean;
  createdAt: string;
}

function mapToBanner(be: BeBannerItem): BannerItem {
  return {
    id: be.id,
    adminTitle: be.adminTitle,
    imageUrl: be.imageUrl,
    linkUrl: be.linkUrl ?? "",
    status: be.isActive ? "노출중" : "중지됨",
    priority: be.priority,
    createdAt: formatDate(be.createdAt),
  };
}

export async function fetchBanners(): Promise<BannerItem[]> {
  const res = await http.get<ApiResponse<BeBannerItem[]>>("/admin/banners");
  return (res.data.data ?? []).map(mapToBanner);
}

export async function createBanner(data: {
  adminTitle: string;
  imageUrl: string;
  linkUrl: string;
  priority: number;
  isActive: boolean;
}): Promise<void> {
  await http.post("/admin/banners", data);
}

export async function updateBanner(
  bannerId: number,
  data: {
    adminTitle?: string;
    imageUrl?: string;
    linkUrl?: string;
    priority?: number;
    isActive?: boolean;
  }
): Promise<void> {
  await http.put(`/admin/banners/${bannerId}`, data);
}

export async function deleteBanner(bannerId: number): Promise<void> {
  await http.delete(`/admin/banners/${bannerId}`);
}
