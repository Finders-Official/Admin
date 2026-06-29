'use client';

import { useRef, useState } from "react";
import { ContentDetail, createContent, updateContent } from "@/apis/admin/contents.api";

interface ContentFormProps {
  onCancel: () => void;
  editingContent?: ContentDetail | null;
}

export function ContentForm({ onCancel, editingContent }: ContentFormProps) {
  const [title, setTitle] = useState(editingContent?.title ?? "");
  const [subtitle, setSubtitle] = useState(editingContent?.subtitle ?? "");
  const [thumbnailUrl, setThumbnailUrl] = useState(editingContent?.thumbnailUrl ?? "");
  const [thumbnailPreview, setThumbnailPreview] = useState(editingContent?.thumbnailUrl ?? "");
  const [bodyText, setBodyText] = useState(editingContent?.bodyContent ?? "");
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const localUrl = URL.createObjectURL(file);
    setThumbnailPreview(localUrl);
    // 로컬 프리뷰용 — 실제 저장 시 URL을 직접 입력하거나 GCS 업로드 후 URL 입력
  }

  const handlePublish = async (status: "게시중" | "임시저장") => {
    if (!title.trim()) { setError("제목을 입력해주세요."); return; }
    if (!bodyText.trim()) { setError("본문을 입력해주세요."); return; }
    setIsSaving(true);
    setError(null);
    try {
      const beStatus = status === "게시중" ? "PUBLISHED" : "DRAFT";
      if (editingContent) {
        await updateContent(editingContent.id, {
          title: title.trim(),
          subtitle: subtitle.trim() || undefined,
          thumbnailUrl: thumbnailUrl.trim() || undefined,
          bodyContent: bodyText.trim(),
          status: beStatus,
        });
      } else {
        await createContent({
          title: title.trim(),
          subtitle: subtitle.trim() || undefined,
          thumbnailUrl: thumbnailUrl.trim() || undefined,
          bodyContent: bodyText.trim(),
          status: beStatus,
        });
      }
      onCancel();
    } catch (err) {
      console.error("Content save error:", err);
      setError("저장에 실패했습니다. 다시 시도해주세요.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-5xl rounded-lg border border-[#2C2C2C] bg-[#1E1E1E] p-4 sm:p-8">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h3 className="text-lg font-bold text-white">{editingContent ? "콘텐츠 수정" : "새 콘텐츠 작성"}</h3>
        <div className="flex flex-wrap gap-3">
          <button type="button" onClick={onCancel} disabled={isSaving} className="px-4 py-2 text-sm text-gray-400 hover:text-white disabled:opacity-40">
            취소
          </button>
          <button type="button" onClick={() => handlePublish("임시저장")} disabled={isSaving} className="border border-gray-600 text-gray-300 px-4 py-2 rounded-md text-sm font-medium hover:bg-[#2C2C2C] disabled:opacity-40">
            {isSaving ? "저장 중..." : "임시저장"}
          </button>
          <button type="button" onClick={() => handlePublish("게시중")} disabled={isSaving} className="bg-white text-black px-6 py-2 rounded-md text-sm font-bold hover:bg-gray-200 disabled:opacity-40">
            {isSaving ? "저장 중..." : "발행하기"}
          </button>
        </div>
        {error && <p className="text-xs text-red-400">{error}</p>}
      </div>

      <div className="space-y-6">
        <div>
          <label className="block text-xs text-gray-500 mb-2 uppercase font-bold">목록 썸네일 (커버 이미지)</label>
          <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
          <div
            onClick={() => fileInputRef.current?.click()}
            className="w-full h-48 border-2 border-dashed border-[#2C2C2C] rounded-lg flex flex-col items-center justify-center bg-[#121212] cursor-pointer hover:border-orange-500 transition-colors overflow-hidden relative"
          >
            {thumbnailPreview ? (
              <img src={thumbnailPreview} alt="preview" className="w-full h-full object-cover" onError={() => setThumbnailPreview("")} />
            ) : (
              <>
                <span className="text-2xl mb-2">📸</span>
                <span className="text-sm text-gray-400">클릭하여 이미지 선택 (권장: 16:9 비율)</span>
              </>
            )}
          </div>
          <input
            type="url"
            placeholder="또는 이미지 URL 직접 입력"
            value={thumbnailUrl}
            onChange={(e) => { setThumbnailUrl(e.target.value); setThumbnailPreview(e.target.value); }}
            className="mt-2 w-full bg-[#121212] border border-[#2C2C2C] rounded-md p-2.5 text-xs text-gray-400 focus:outline-none focus:border-orange-500"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <label className="block text-xs text-gray-500 mb-2 uppercase font-bold">메인 타이틀</label>
            <input
              type="text"
              placeholder="예: 동작구 출사 맛집 best 5."
              className="w-full bg-[#121212] border border-[#2C2C2C] rounded-md p-3 text-white focus:outline-none focus:border-orange-500"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-xs text-gray-500 mb-2 uppercase font-bold">서브 타이틀 (설명)</label>
            <input
              type="text"
              placeholder="예: 추운 날씨도 따뜻해보이게 만드는 사진 명소 추천합니다"
              className="w-full bg-[#121212] border border-[#2C2C2C] rounded-md p-3 text-sm text-gray-300 focus:outline-none focus:border-orange-500"
              value={subtitle}
              onChange={(e) => setSubtitle(e.target.value)}
            />
          </div>
        </div>

        <div>
          <label className="block text-xs text-gray-500 mb-2 uppercase font-bold">본문 에디터</label>
          <div className="border border-[#2C2C2C] rounded-md overflow-hidden">
            <div className="bg-[#242424] p-2 flex gap-2 border-b border-[#2C2C2C]">
              <button type="button" className="p-1 px-3 text-sm text-gray-400 hover:text-white bg-[#1E1E1E] rounded">B</button>
              <button type="button" className="p-1 px-3 text-sm text-gray-400 hover:text-white bg-[#1E1E1E] rounded">사진 첨부</button>
              <button type="button" className="p-1 px-3 text-sm text-gray-400 hover:text-white bg-[#1E1E1E] rounded">구분선</button>
            </div>
            <textarea
              rows={15}
              placeholder="본문 내용을 작성해주세요. HTML 태그 또는 마크다운이 적용됩니다."
              className="w-full bg-[#121212] p-4 text-sm text-gray-300 focus:outline-none resize-none"
              value={bodyText}
              onChange={(e) => setBodyText(e.target.value)}
            ></textarea>
          </div>
        </div>
      </div>
    </div>
  );
}