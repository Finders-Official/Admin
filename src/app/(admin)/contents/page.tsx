'use client';

import { useState, useEffect } from "react";
import { ContentGrid } from "@/components/admin/content-grid";
import { ContentForm } from "@/components/admin/content-form";
import { ContentItem } from "@/types/content";

export default function ContentAdminPage() {
  const [isCreating, setIsCreating] = useState(false);
  const [contents, setContents] = useState<ContentItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    import("@/apis/admin/contents.api").then(({ fetchContents }) =>
      fetchContents()
        .then(setContents)
        .catch((err) => console.error("Content fetch error:", err))
        .finally(() => setIsLoading(false))
    );
  }, []);

  return (
    <main className="flex-1 flex flex-col overflow-hidden bg-[#121212] text-gray-200 font-sans">
      <header className="p-8 pb-4 flex justify-between items-center shrink-0">
        <div>
          <h2 className="text-2xl font-bold text-white">홈 콘텐츠 관리</h2>
          <p className="text-sm text-gray-400 mt-1">
            유저 홈 화면에 노출되는 '꼭 알아야 할 필름 소식' 아티클을 관리합니다.
          </p>
        </div>
        {!isCreating && (
          <button
            onClick={() => setIsCreating(true)}
            className="bg-orange-600 text-white px-5 py-2.5 rounded-md text-sm font-medium hover:bg-orange-500 transition-colors"
          >
            + 새 콘텐츠 작성
          </button>
        )}
      </header>

      <div className="flex-1 overflow-y-auto p-8 pt-4">
        {isLoading ? (
          <p className="text-center text-gray-500 animate-pulse">로딩 중...</p>
        ) : isCreating ? (
          <ContentForm onCancel={() => setIsCreating(false)} />
        ) : (
          <ContentGrid contents={contents} />
        )}
      </div>
    </main>
  );
}