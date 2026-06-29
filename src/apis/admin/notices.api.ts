import { http } from "@/apis/http";
import type { Notice } from "@/types/notice";

const NOTICE_TYPE_LABELS: Record<string, string> = {
  GENERAL: "일반공지",
  EVENT: "이벤트 안내",
  POLICY: "약관/정책",
};

function formatDate(isoString: string): string {
  return isoString.replace("T", " ").substring(0, 10);
}

interface BeNoticeItem {
  id: number;
  title: string;
  type: string;
  createdAt: string;
  isNew: boolean;
}

function mapToNotice(be: BeNoticeItem): Notice {
  return {
    id: be.id,
    category: NOTICE_TYPE_LABELS[be.type] ?? be.type,
    title: be.title,
    content: "",
    createdAt: formatDate(be.createdAt),
    isPinned: false,
  };
}

interface BePagedData<T> { data: T[]; }

export async function fetchNotices(): Promise<Notice[]> {
  const res = await http.get<BePagedData<BeNoticeItem>>("/admin/notices", {
    params: { size: 100 },
  });
  return (res.data.data ?? []).map(mapToNotice);
}

export async function createNotice(data: {
  category: string;
  title: string;
  content: string;
}): Promise<void> {
  const typeMap: Record<string, string> = {
    "일반공지": "GENERAL",
    "이벤트 안내": "EVENT",
    "약관/정책": "POLICY",
  };
  await http.post("/admin/notices", {
    type: typeMap[data.category] ?? "GENERAL",
    title: data.title,
    content: data.content,
  });
}

export async function updateNotice(noticeId: number, data: {
  category?: string;
  title?: string;
  content?: string;
}): Promise<void> {
  const typeMap: Record<string, string> = {
    "일반공지": "GENERAL",
    "이벤트 안내": "EVENT",
    "약관/정책": "POLICY",
  };
  await http.patch(`/admin/notices/${noticeId}`, {
    type: data.category ? (typeMap[data.category] ?? data.category) : undefined,
    title: data.title,
    content: data.content,
  });
}

export async function deleteNotice(noticeId: number): Promise<void> {
  await http.delete(`/admin/notices/${noticeId}`);
}
