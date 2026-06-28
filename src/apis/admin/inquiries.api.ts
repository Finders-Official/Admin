import { http } from "@/apis/http";
import type { ApiResponse } from "@/types/api";
import type { Inquiry } from "@/types/inquiry";

const INQUIRY_TYPE_LABELS: Record<string, string> = {
  SERVICE_ERROR: "서비스 오류",
  MEMBER_INFO: "회원정보",
  PROMOTION: "프로모션",
  PAYMENT: "결제문의",
};

function formatDate(isoString: string): string {
  return isoString.replace("T", " ").substring(0, 16);
}

interface BeInquiryItem {
  id: string;
  type: string;
  content: string;
  status: string;
  memberName: string;
  photoLabName: string | null;
  createdAt: string;
  hasReply: boolean;
}

interface BeInquiryListData {
  inquiries: BeInquiryItem[];
  totalCount: number;
  page: number;
  size: number;
}

interface BeReply {
  id: string;
  content: string;
  replierName: string;
  createdAt: string;
}

interface BeInquiryDetail {
  id: string;
  type: string;
  content: string;
  status: string;
  member: { id: string; name: string } | null;
  imageUrls: string[];
  createdAt: string;
  replies: BeReply[];
}

function mapStatus(status: string): string {
  if (status === "PENDING") return "대기중";
  if (status === "ANSWERED" || status === "CLOSED") return "답변완료";
  return status;
}

function mapListItem(be: BeInquiryItem): Inquiry {
  return {
    id: Number(be.id),
    userName: be.memberName ?? "알 수 없음",
    userId: "",
    category: INQUIRY_TYPE_LABELS[be.type] ?? be.type,
    content: be.content,
    status: mapStatus(be.status),
    createdAt: formatDate(be.createdAt),
    reply: null,
  };
}

export async function fetchInquiries(status?: string): Promise<Inquiry[]> {
  const params: Record<string, string | number> = { size: 50 };
  if (status) params.status = status;
  const res = await http.get<ApiResponse<BeInquiryListData>>("/admin/inquiries", { params });
  return (res.data.data?.inquiries ?? []).map(mapListItem);
}

export async function fetchInquiryDetail(inquiryId: number | string): Promise<Inquiry> {
  const res = await http.get<ApiResponse<BeInquiryDetail>>(`/admin/inquiries/${inquiryId}`);
  const be = res.data.data;
  return {
    id: Number(be.id),
    userName: be.member?.name ?? "알 수 없음",
    userId: be.member?.id ? String(be.member.id) : "",
    category: INQUIRY_TYPE_LABELS[be.type] ?? be.type,
    content: be.content,
    status: mapStatus(be.status),
    createdAt: formatDate(be.createdAt),
    reply: be.replies.length > 0 ? be.replies[be.replies.length - 1].content : null,
  };
}

export async function submitInquiryReply(inquiryId: number | string, replyContent: string): Promise<void> {
  await http.post(`/admin/inquiries/${inquiryId}/replies`, { replyContent });
}
