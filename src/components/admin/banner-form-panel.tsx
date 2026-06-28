'use client';

import { useEffect, useState } from "react";
import { BannerItem } from "@/types/banner";

interface BannerFormPanelProps {
  isEditing: boolean;
  selectedBanner: BannerItem | null;
  onCancel: () => void;
}

export function BannerFormPanel({ isEditing, selectedBanner, onCancel }: BannerFormPanelProps) {
  // 선언적 제어를 위해 key 값을 이용하거나 defaultValue를 동기화하기 위해 로컬 state를 둡니다.
  const [adminTitle, setAdminTitle] = useState("");
  const [linkUrl, setLinkUrl] = useState("");
  const [status, setStatus] = useState("노출중");
  const [priority, setPriority] = useState(1);

  useEffect(() => {
    if (selectedBanner) {
      setAdminTitle(selectedBanner.adminTitle);
      setLinkUrl(selectedBanner.linkUrl);
      setStatus(selectedBanner.status);
      setPriority(selectedBanner.priority);
    } else {
      setAdminTitle("");
      setLinkUrl("");
      setStatus("노출중");
      setPriority(1);
    }
  }, [selectedBanner]);

  return (
    <div
      className={`bg-[#1E1E1E] border border-[#2C2C2C] rounded-xl p-4 transition-opacity sm:p-8 ${isEditing ? "opacity-100" : "opacity-30 pointer-events-none"
        }`}
    >
      <h3 className="text-lg font-bold text-white mb-6">
        {selectedBanner ? "배너 설정 변경" : "새 통배너 등록"}
      </h3>

      <div className="space-y-5">
        <div>
          <label className="block text-xs text-gray-500 mb-2 uppercase font-bold">
            관리용 배너 제목
          </label>
          <input
            type="text"
            placeholder="어드민 관리용 명칭을 입력하세요"
            value={adminTitle}
            onChange={(e) => setAdminTitle(e.target.value)}
            className="w-full bg-[#121212] border border-[#2C2C2C] rounded-md p-2.5 text-sm text-white focus:border-orange-500 outline-none"
          />
        </div>

        <div>
          <label className="block text-xs text-gray-500 mb-2 uppercase font-bold">
            배너 이미지 파일
          </label>
          <div className="w-full h-40 border-2 border-dashed border-[#2C2C2C] rounded-lg flex flex-col items-center justify-center bg-[#121212] cursor-pointer hover:border-orange-500 transition-colors">
            {selectedBanner ? (
              <img
                src={selectedBanner.imageUrl}
                className="w-full h-full object-cover rounded-lg opacity-40"
                alt="preview"
              />
            ) : (
              <>
                <span className="text-xl mb-1">🖼️</span>
                <span className="text-xs text-gray-400">
                  통 이미지 파일 등록 (16:9 또는 배너 규격 비율)
                </span>
              </>
            )}
          </div>
        </div>

        <div>
          <label className="block text-xs text-gray-500 mb-2 uppercase font-bold">
            클릭 시 이동할 링크 URL
          </label>
          <input
            type="text"
            value={linkUrl}
            onChange={(e) => setLinkUrl(e.target.value)}
            placeholder="앱 내부 경로(/studios/123) 또는 외부 URL"
            className="w-full bg-[#121212] border border-[#2C2C2C] rounded-md p-2.5 text-sm text-gray-300 focus:border-orange-500 outline-none"
          />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-xs text-gray-500 mb-2 uppercase font-bold">
              노출 상태 설정
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full bg-[#121212] border border-[#2C2C2C] rounded-md p-2.5 text-sm focus:border-orange-500 outline-none"
            >
              <option value="노출중">노출중</option>
              <option value="중지됨">중지됨</option>
            </select>
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-2 uppercase font-bold">
              롤링 순서 (우선순위)
            </label>
            <input
              type="number"
              value={priority}
              onChange={(e) => setPriority(Number(e.target.value))}
              className="w-full bg-[#121212] border border-[#2C2C2C] rounded-md p-2.5 text-sm focus:border-orange-500 outline-none"
            />
          </div>
        </div>

        <div className="flex flex-col gap-3 pt-4 sm:flex-row">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 border border-gray-600 text-gray-400 py-2.5 rounded-md text-sm hover:text-white transition-colors"
          >
            취소
          </button>
          <button type="button" className="flex-1 bg-white text-black py-2.5 rounded-md text-sm font-bold hover:bg-gray-200 transition-colors">
            저장하기
          </button>
        </div>
      </div>
    </div>
  );
}