'use client';

import { BannerItem } from "@/types/banner";

interface BannerListProps {
  banners: BannerItem[];
  selectedBanner: BannerItem | null;
  onSelect: (banner: BannerItem) => void;
}

export function BannerList({ banners, selectedBanner, onSelect }: BannerListProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
        등록된 배너 리스트
      </h3>
      {banners.map((banner) => (
        <div
          key={banner.id}
          onClick={() => onSelect(banner)}
          className={`group flex flex-col bg-[#1E1E1E] border rounded-xl overflow-hidden transition-all cursor-pointer sm:flex-row ${selectedBanner?.id === banner.id
              ? "border-orange-500 ring-1 ring-orange-500"
              : "border-[#2C2C2C] hover:border-gray-500"
            }`}
        >
          <div className="h-36 w-full shrink-0 overflow-hidden bg-[#242424] sm:h-24 sm:w-44">
            <img
              src={banner.imageUrl}
              alt="banner"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex flex-1 flex-col justify-center p-4 min-w-0">
            <div className="flex justify-between items-center mb-1">
              <h4 className="text-white font-bold text-sm truncate max-w-[200px]">
                {banner.adminTitle}
              </h4>
              <span
                className={`text-[10px] px-1.5 py-0.5 rounded ${banner.status === "노출중"
                    ? "bg-green-900/30 text-green-400"
                    : "bg-gray-800 text-gray-500"
                  }`}
              >
                {banner.status}
              </span>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              우선순위: {banner.priority}번째 노출
            </p>
            <p className="text-[11px] text-gray-400 truncate mt-0.5">
              {banner.linkUrl}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}