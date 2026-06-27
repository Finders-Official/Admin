'use client';

import { useState } from "react";

interface ContentFormProps {
  onCancel: () => void;
}

export function ContentForm({ onCancel }: ContentFormProps) {
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [bodyText, setBodyText] = useState("");

  const handlePublish = (status: "게시중" | "임시저장") => {
    console.log({ title, subtitle, bodyText, status });
  };

  return (
    <div className="max-w-5xl bg-[#1E1E1E] border border-[#2C2C2C] rounded-lg p-8">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-bold text-white">새 콘텐츠 작성</h3>
        <div className="flex gap-3">
          <button type="button" onClick={onCancel} className="px-4 py-2 text-sm text-gray-400 hover:text-white">
            취소
          </button>
          <button type="button" onClick={() => handlePublish("임시저장")} className="border border-gray-600 text-gray-300 px-4 py-2 rounded-md text-sm font-medium hover:bg-[#2C2C2C]">
            임시저장
          </button>
          <button type="button" onClick={() => handlePublish("게시중")} className="bg-white text-black px-6 py-2 rounded-md text-sm font-bold hover:bg-gray-200">
            발행하기
          </button>
        </div>
      </div>

      <div className="space-y-6">
        <div>
          <label className="block text-xs text-gray-500 mb-2 uppercase font-bold">목록 썸네일 (커버 이미지)</label>
          <div className="w-full h-48 border-2 border-dashed border-[#2C2C2C] rounded-lg flex flex-col items-center justify-center bg-[#121212] cursor-pointer hover:border-orange-500 transition-colors">
            <span className="text-2xl mb-2">📸</span>
            <span className="text-sm text-gray-400">클릭하여 이미지 업로드 (권장: 16:9 비율)</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="col-span-2">
            <label className="block text-xs text-gray-500 mb-2 uppercase font-bold">메인 타이틀</label>
            <input
              type="text"
              placeholder="예: 동작구 출사 맛집 best 5."
              className="w-full bg-[#121212] border border-[#2C2C2C] rounded-md p-3 text-white focus:outline-none focus:border-orange-500"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div className="col-span-2">
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