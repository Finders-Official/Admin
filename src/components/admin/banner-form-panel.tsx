'use client';

import { useEffect, useState } from "react";
import { BannerItem } from "@/types/banner";
import { createBanner, updateBanner } from "@/apis/admin/banners.api";

interface BannerFormPanelProps {
  isEditing: boolean;
  selectedBanner: BannerItem | null;
  onCancel: () => void;
  onSaved: () => void;
}

export function BannerFormPanel({ isEditing, selectedBanner, onCancel, onSaved }: BannerFormPanelProps) {
  const [adminTitle, setAdminTitle] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [linkUrl, setLinkUrl] = useState("");
  const [status, setStatus] = useState("노출중");
  const [priority, setPriority] = useState(1);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (selectedBanner) {
      setAdminTitle(selectedBanner.adminTitle);
      setImageUrl(selectedBanner.imageUrl);
      setLinkUrl(selectedBanner.linkUrl);
      setStatus(selectedBanner.status);
      setPriority(selectedBanner.priority);
    } else {
      setAdminTitle("");
      setImageUrl("");
      setLinkUrl("");
      setStatus("노출중");
      setPriority(1);
    }
    setError(null);
  }, [selectedBanner]);

  async function handleSave() {
    if (!adminTitle.trim()) { setError("관리용 명칭을 입력해주세요."); return; }
    if (!imageUrl.trim()) { setError("이미지 URL을 입력해주세요."); return; }
    setIsSaving(true);
    setError(null);
    try {
      if (selectedBanner) {
        await updateBanner(selectedBanner.id, {
          adminTitle: adminTitle.trim(),
          objectPath: imageUrl.trim(),
          linkUrl: linkUrl.trim(),
          priority,
          isActive: status === "노출중",
        });
      } else {
        await createBanner({
          adminTitle: adminTitle.trim(),
          objectPath: imageUrl.trim(),
          linkUrl: linkUrl.trim(),
          priority,
          isActive: status === "노출중",
        });
      }
      onSaved();
      onCancel();
    } catch (err) {
      console.error("Banner save error:", err);
      setError("저장에 실패했습니다. 다시 시도해주세요.");
    } finally {
      setIsSaving(false);
    }
  }

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
            배너 이미지 URL
          </label>
          <input
            type="url"
            placeholder="https://... 이미지 URL을 입력하세요"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            className="w-full bg-[#121212] border border-[#2C2C2C] rounded-md p-2.5 text-sm text-gray-300 focus:border-orange-500 outline-none"
          />
          {imageUrl && (
            <div className="mt-2 h-32 w-full overflow-hidden rounded-md border border-[#2C2C2C] bg-[#121212]">
              <img
                src={imageUrl}
                alt="preview"
                className="h-full w-full object-cover"
                onError={(e) => (e.currentTarget.style.display = "none")}
              />
            </div>
          )}
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
              min={1}
              value={priority}
              onChange={(e) => setPriority(Number(e.target.value))}
              className="w-full bg-[#121212] border border-[#2C2C2C] rounded-md p-2.5 text-sm focus:border-orange-500 outline-none"
            />
          </div>
        </div>

        {error && <p className="text-xs text-red-400">{error}</p>}

        <div className="flex flex-col gap-3 pt-4 sm:flex-row">
          <button
            type="button"
            onClick={onCancel}
            disabled={isSaving}
            className="flex-1 border border-gray-600 text-gray-400 py-2.5 rounded-md text-sm hover:text-white transition-colors disabled:opacity-40"
          >
            취소
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={isSaving}
            className="flex-1 bg-white text-black py-2.5 rounded-md text-sm font-bold hover:bg-gray-200 transition-colors disabled:opacity-40"
          >
            {isSaving ? "저장 중..." : "저장하기"}
          </button>
        </div>
      </div>
    </div>
  );
}