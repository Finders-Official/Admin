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
    <main className="flex-1 flex flex-col overflow-hidden bg-[#121212] text-gray-200 font-sans">
      <header className="p-8 pb-4 flex justify-between items-center shrink-0">
        <div>
          <h2 className="text-2xl font-bold text-white">홈 배너 관리</h2>
          <p className="text-sm text-gray-400 mt-1">
            유저 앱 최상단에 게재될 통 이미지 배너를 관리합니다.
          </p>
        </div>
        <button
          onClick={handleAddNewBanner}
          className="bg-orange-600 text-white px-5 py-2.5 rounded-md text-sm font-medium hover:bg-orange-500 transition-colors"
        >
          + 새 배너 추가
        </button>
      </header>

      <div className="flex-1 overflow-y-auto p-8 pt-4">
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