'use client';

import { useState, useEffect, useCallback } from "react";
import { NoticeList } from "@/components/admin/notice-list";
import { NoticeForm } from "@/components/admin/notice-form";
import { Notice } from "@/types/notice";
import { fetchNotices } from "@/apis/admin/notices.api";

const CATEGORIES = ["일반공지", "이벤트 안내", "약관/정책"];

export default function NoticeAdminPage() {
  const [activeTab, setActiveTab] = useState("일반공지");
  const [isCreating, setIsCreating] = useState(false);
  const [notices, setNotices] = useState<Notice[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadNotices = useCallback(() => {
    setIsLoading(true);
    fetchNotices()
      .then(setNotices)
      .catch((err) => console.error("Notice fetch error:", err))
      .finally(() => setIsLoading(false));
  }, []);

  useEffect(() => { loadNotices(); }, [loadNotices]);

  return (
    <main className="flex-1 flex flex-col overflow-hidden bg-[#121212] text-gray-200 font-sans">
      <header className="p-8 flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-white">공지사항 관리</h2>
          <p className="text-sm text-gray-400 mt-1">
            앱 내 공지사항 카테고리별 등록 및 관리를 진행합니다.
          </p>
        </div>
        {!isCreating && (
          <button
            onClick={() => setIsCreating(true)}
            className="bg-orange-600 text-white px-5 py-2.5 rounded-md text-sm font-medium hover:bg-orange-500 transition-colors"
          >
            + 새 공지 등록
          </button>
        )}
      </header>

      {/* 폼을 열었을 때는 탭 메뉴 감추기 */}
      {!isCreating && (
        <div className="px-8 border-b border-[#2C2C2C] flex gap-8">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveTab(cat)}
              className={`pb-4 text-sm font-medium transition-colors relative ${activeTab === cat ? "text-orange-500" : "text-gray-500 hover:text-gray-300"
                }`}
            >
              {cat}
              {activeTab === cat && (
                <div className="absolute bottom-0 left-0 w-full h-0.5 bg-orange-500" />
              )}
            </button>
          ))}
        </div>
      )}

      <div className="flex-1 p-8 overflow-y-auto">
        {isLoading ? (
          <p className="text-center text-gray-500 animate-pulse">로딩 중...</p>
        ) : isCreating ? (
          <NoticeForm categories={CATEGORIES} onCancel={() => { setIsCreating(false); loadNotices(); }} />
        ) : (
          <NoticeList notices={notices} activeTab={activeTab} />
        )}
      </div>
    </main>
  );
}