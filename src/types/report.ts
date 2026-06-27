export interface ReportItem {
  id: number;
  type: string; // "게시글" | "댓글"
  targetId: string;
  authorName: string;
  content: string;
  reportCount: number;
  reasonStats: {
    [key: string]: number;
  };
  status: string; // "대기중" | "숨김처리" | "기각됨"
  createdAt: string;
}