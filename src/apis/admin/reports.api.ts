import { http } from "@/apis/http";
import type { ApiResponse } from "@/types/api";
import type { ReportItem } from "@/types/report";
import { reportStatusCache } from "@/utils/reportStatusCache";

const REASON_LABEL_MAP: Record<string, string> = {
  SPAM: "스팸/홍보",
  PORN: "음란물",
  ABUSE: "욕설/혐오",
  PRIVACY: "개인정보 노출",
  ILLEGAL: "불법 정보",
};

function formatDate(isoString: string | null): string {
  if (!isoString) return "";
  return isoString.replace("T", " ").substring(0, 16);
}

function mapStatus(status: string): string {
  if (status === "PENDING") return "대기중";
  if (status === "HIDE") return "숨김처리";
  if (status === "DISMISS") return "기각됨";
  return status;
}

interface BeReportListItem {
  targetType: string;
  targetId: string;
  authorMemberId?: string | null;
  authorName?: string | null;
  contentSummary: string | null;
  totalReportCount: number;
  status: string;
  lastReportedAt: string | null;
}

interface BeReportDetail {
  targetType: string;
  targetId: string;
  authorMemberId?: string | null;
  authorName?: string | null;
  contentSummary?: string | null;
  totalReportCount: number;
  status: string;
  reasonStats: Record<string, number>;
  processedAt: string | null;
}

function mapListItem(be: BeReportListItem, index: number): ReportItem {
  const type = be.targetType === "POST" ? "게시글" : "댓글";
  const targetId = String(be.targetId);
  const cachedStatus = reportStatusCache.get(type, targetId);
  return {
    id: index,
    type,
    targetId,
    authorMemberId: be.authorMemberId ?? null,
    authorName: be.authorName ?? "",
    content: be.contentSummary ?? "(내용 없음)",
    reportCount: be.totalReportCount,
    reasonStats: {},
    status: cachedStatus ?? mapStatus(be.status),
    createdAt: formatDate(be.lastReportedAt),
  };
}

interface BePagedData<T> { data: T[]; }

export async function fetchReports(targetType?: string): Promise<ReportItem[]> {
  const params: Record<string, string | number> = { size: 50 };
  if (targetType) params.targetType = targetType;
  const res = await http.get<BePagedData<BeReportListItem>>("/admin/reports", { params });
  return (res.data.data ?? []).map((item, i) => mapListItem(item, i));
}

export async function fetchReportDetail(targetType: string, targetId: string): Promise<Partial<ReportItem>> {
  const beTargetType = targetType === "게시글" ? "POST" : "COMMENT";
  const res = await http.get<ApiResponse<BeReportDetail>>(
    `/admin/reports/${beTargetType}/${targetId}`
  );
  const be = res.data.data;
  const reasonStats: Record<string, number> = {};
  Object.entries(be.reasonStats ?? {}).forEach(([key, val]) => {
    const label = REASON_LABEL_MAP[key] ?? key;
    reasonStats[label] = val;
  });
  const cachedStatus = reportStatusCache.get(targetType, String(targetId));
  return {
    authorMemberId: be.authorMemberId ?? null,
    authorName: be.authorName ?? "",
    content: be.contentSummary ?? "(내용 없음)",
    totalReportCount: be.totalReportCount,
    reasonStats,
    status: cachedStatus ?? mapStatus(be.status),
  } as Partial<ReportItem>;
}

export async function processReport(
  type: string,
  targetId: string,
  action: "HIDE" | "DISMISS",
  comment?: string
): Promise<void> {
  const beTargetType = type === "게시글" ? "POST" : "COMMENT";
  await http.post(`/admin/reports/${beTargetType}/${targetId}/process`, { action, comment });
  reportStatusCache.set(type, String(targetId), action === "HIDE" ? "숨김처리" : "기각됨");
}
