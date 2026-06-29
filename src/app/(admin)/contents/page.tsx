'use client';

import { useState, useEffect, useCallback } from "react";
import { ContentGrid } from "@/components/admin/content-grid";
import { ContentForm } from "@/components/admin/content-form";
import { ContentDetail } from "@/apis/admin/contents.api";
import { ContentItem } from "@/types/content";

export default function ContentAdminPage() {
  const [formState, setFormState] = useState<{ open: boolean; editing: ContentDetail | null }>({ open: false, editing: null });
  const [contents, setContents] = useState<ContentItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadContents = useCallback(() => {
    import("@/apis/admin/contents.api").then(({ fetchContents }) =>
      fetchContents()
        .then(setContents)
        .catch((err) => console.error("Content fetch error:", err))
        .finally(() => setIsLoading(false))
    );
  }, []);

  useEffect(() => { loadContents(); }, [loadContents]);

  const handleEdit = useCallback(async (id: number) => {
    const { getContentDetail } = await import("@/apis/admin/contents.api");
    try {
      const detail = await getContentDetail(id);
      setFormState({ open: true, editing: detail });
    } catch (err) {
      console.error("Content detail error:", err);
    }
  }, []);

  const handleDelete = useCallback(async (id: number) => {
    if (!window.confirm("콘텐츠를 삭제하시겠습니까?")) return;
    const { deleteContent } = await import("@/apis/admin/contents.api");
    try {
      await deleteContent(id);
      loadContents();
    } catch (err) {
      console.error("Content delete error:", err);
    }
  }, [loadContents]);

  return (
    <main className="flex min-h-full flex-1 flex-col overflow-hidden bg-[#121212] text-gray-200 font-sans">
      <header className="flex shrink-0 flex-col gap-4 p-4 pb-3 sm:p-6 sm:pb-4 lg:flex-row lg:items-center lg:justify-between lg:p-8 lg:pb-4">
        <div>
          <h2 className="text-xl font-bold text-white sm:text-2xl">홈 콘텐츠 관리</h2>
          <p className="text-sm text-gray-400 mt-1">
            유저 홈 화면에 노출되는 '꼭 알아야 할 필름 소식' 아티클을 관리합니다.
          </p>
        </div>
        {!formState.open && (
          <button
            onClick={() => setFormState({ open: true, editing: null })}
            className="w-full rounded-md bg-orange-600 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-orange-500 sm:w-auto"
          >
            + 새 콘텐츠 작성
          </button>
        )}
      </header>

      <div className="flex-1 overflow-y-auto p-4 pt-3 sm:p-6 sm:pt-4 lg:p-8 lg:pt-4">
        {isLoading ? (
          <p className="text-center text-gray-500 animate-pulse">로딩 중...</p>
        ) : formState.open ? (
          <ContentForm
            editingContent={formState.editing}
            onCancel={() => { setFormState({ open: false, editing: null }); loadContents(); }}
          />
        ) : (
          <ContentGrid contents={contents} onEdit={handleEdit} onDelete={handleDelete} />
        )}
      </div>
    </main>
  );
}