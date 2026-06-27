'use client';

import { Notice } from "@/types/notice";

interface NoticeListProps {
  notices: Notice[];
  activeTab: string;
}

export function NoticeList({ notices, activeTab }: NoticeListProps) {
  const filteredNotices = notices.filter((n) => n.category === activeTab);

  if (filteredNotices.length === 0) {
    return (
      <div className="py-20 text-center text-gray-600 border-2 border-dashed border-[#2C2C2C] rounded-lg">
        등록된 공지사항이 없습니다.
      </div>
    );
  }

  return (
    <div className="grid gap-4">
      {filteredNotices.map((notice) => (
        <div
          key={notice.id}
          className="bg-[#1E1E1E] border border-[#2C2C2C] p-6 rounded-lg flex justify-between items-center hover:border-gray-600 transition-all group"
        >
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              {notice.isPinned && (
                <span className="bg-orange-500/10 text-orange-500 text-[10px] px-1.5 py-0.5 rounded border border-orange-500/20">
                  중요
                </span>
              )}
              <h4 className="text-white font-medium group-hover:text-orange-500 transition-colors">
                {notice.title}
              </h4>
            </div>
            <p className="text-xs text-gray-500">
              {notice.createdAt} | {notice.category}
            </p>
          </div>
          <div className="flex gap-4">
            <button className="text-xs text-gray-500 hover:text-white underline">
              수정
            </button>
            <button className="text-xs text-red-500/70 hover:text-red-400 underline">
              삭제
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}