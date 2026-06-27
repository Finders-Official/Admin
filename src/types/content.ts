export interface ContentItem {
  id: number;
  title: string;
  subtitle: string;
  thumbnail: string;
  status: "게시중" | "임시저장";
  createdAt: string;
  author: string;
}