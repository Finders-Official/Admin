'use client';

import { useState, useEffect } from "react";
import { BannerList } from "@/components/admin/banner-list";
import { BannerFormPanel } from "@/components/admin/banner-form-panel";
import { BannerItem } from "@/types/banner";

export default function BannerAdminPage() {
  const [isEditing, setIsEditing] = useState(false);
  const [selectedBanner, setSelectedBanner] = useState<BannerItem | null>(null);
  const [banners, setBanners] = useState<BannerItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    import("@/apis/admin/banners.api").then(({ fetchBanners }) =>
      fetchBanners()
        .then(setBanners)
        .catch((err) => console.error("Banner fetch error:", err))
        .finally(() => setIsLoading(false))
    );
  }, []);

  const handleSelectBanner = (banner: BannerItem) => {
    setSelectedBanner(banner);
    setIsEditing(true);
  };

  const handleAddNewBanner = () => {
    setSelectedBanner(null);
    setIsEditing(true);
  };

  return (
    <main className="flex min-h-full flex-1 flex-col overflow-hidden bg-[#121212] text-gray-200 font-sans">
      <header className="flex shrink-0 flex-col gap-4 p-4 pb-3 sm:p-6 sm:pb-4 lg:flex-row lg:items-center lg:justify-between lg:p-8 lg:pb-4">
        <div>
          <h2 className="text-xl font-bold text-white sm:text-2xl">홈 배너 관리</h2>
          <p className="text-sm text-gray-400 mt-1">
            유저 앱 최상단에 게재될 통 이미지 배너를 관리합니다.
          </p>
        </div>
        <button
          onClick={handleAddNewBanner}
          className="w-full rounded-md bg-orange-600 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-orange-500 sm:w-auto"
        >
          + 새 배너 추가
        </button>
      </header>

      <div className="flex-1 overflow-y-auto p-4 pt-3 sm:p-6 sm:pt-4 lg:p-8 lg:pt-4">
        {isLoading ? (
          <p className="text-center text-gray-500 animate-pulse">로딩 중...</p>
        ) : (
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
            {/* 배너 리스트 */}
            <BannerList
              banners={banners}
              selectedBanner={selectedBanner}
              onSelect={handleSelectBanner}
            />

            {/* 에디터/생성 폼 패널 */}
            <BannerFormPanel
              isEditing={isEditing}
              selectedBanner={selectedBanner}
              onCancel={() => setIsEditing(false)}
            />
          </div>
        )}
      </div>
    </main>
  );
}