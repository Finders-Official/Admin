'use client';

import { useState } from "react";

interface NoticeFormProps {
  categories: string[];
  onCancel: () => void;
}

export function NoticeForm({ categories, onCancel }: NoticeFormProps) {
  const [selectedCategory, setSelectedCategory] = useState(categories[0]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // 추후 POST API 연동 위치
    console.log({ selectedCategory, title, content });
  };

  return (
    <div className="max-w-4xl bg-[#1E1E1E] border border-[#2C2C2C] rounded-lg p-8">
      <h3 className="text-lg font-bold text-white mb-6">공지사항 등록</h3>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-xs text-gray-500 mb-2 uppercase font-bold">카테고리</label>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full bg-[#121212] border border-[#2C2C2C] rounded-md p-3 text-sm focus:outline-none focus:border-orange-500"
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs text-gray-500 mb-2 uppercase font-bold">제목</label>
          <input
            type="text"
            placeholder="공지사항 제목을 입력하세요"
            className="w-full bg-[#121212] border border-[#2C2C2C] rounded-md p-3 text-sm focus:outline-none focus:border-orange-500"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <div>
          <label className="block text-xs text-gray-500 mb-2 uppercase font-bold">상세 내용</label>
          <textarea
            rows={12}
            placeholder="내용을 입력하세요"
            className="w-full bg-[#121212] border border-[#2C2C2C] rounded-md p-3 text-sm focus:outline-none focus:border-orange-500 resize-none"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          ></textarea>
        </div>
        <div className="flex justify-end gap-3 pt-4">
          <button type="button" onClick={onCancel} className="px-6 py-2 text-sm text-gray-400 hover:text-white">
            취소
          </button>
          <button type="submit" className="bg-white text-black px-8 py-2 rounded-md text-sm font-bold hover:bg-gray-200">
            저장하기
          </button>
        </div>
      </form>
    </div>
  );
}