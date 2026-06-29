'use client';

import { ContentItem } from "@/types/content";

interface ContentGridProps {
  contents: ContentItem[];
  onDelete: (id: number) => void;
}

export function ContentGrid({ contents, onDelete }: ContentGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {contents.map((content) => (
        <div
          key={content.id}
          className="bg-[#1E1E1E] border border-[#2C2C2C] rounded-xl overflow-hidden hover:border-gray-500 transition-colors group flex flex-col"
        >
          <div className="h-40 bg-[#242424] relative overflow-hidden">
            <img
              src={content.thumbnail}
              alt="thumbnail"
              className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
            />
            <span
              className={`absolute top-3 right-3 px-2 py-1 text-[10px] font-bold rounded shadow-sm ${content.status === "게시중"
                  ? "bg-orange-500 text-white"
                  : "bg-gray-600 text-gray-200"
                }`}
            >
              {content.status}
            </span>
          </div>
          <div className="p-5 flex-1 flex flex-col">
            <h4 className="text-white font-bold text-lg leading-tight mb-2 group-hover:text-orange-500 transition-colors line-clamp-2">
              {content.title}
            </h4>
            <p className="text-sm text-gray-400 line-clamp-2 mb-4 flex-1">
              {content.subtitle}
            </p>
            <div className="flex justify-between items-center text-xs text-gray-500 pt-4 border-t border-[#2C2C2C]">
              <span>{content.createdAt}</span>
              <div className="flex gap-3">
                <button className="hover:text-white cursor-not-allowed opacity-40" title="콘텐츠 수정은 상세 조회 후 지원 예정">수정</button>
                <button
                  onClick={() => onDelete(content.id)}
                  className="hover:text-red-400"
                >
                  삭제
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}