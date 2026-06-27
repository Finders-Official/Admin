export interface BannerItem {
  id: number;
  adminTitle: string;
  imageUrl: string;
  linkUrl: string;
  status: "노출중" | "중지됨";
  priority: number;
  createdAt: string;
}