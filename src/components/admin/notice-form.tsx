'use client';

import { useState } from "react";
import { Notice } from "@/types/notice";
import { createNotice, updateNotice } from "@/apis/admin/notices.api";

interface NoticeFormProps {
  categories: string[];
  onCancel: () => void;
  editingNotice?: Notice | null;
}

export function NoticeForm({ categories, onCancel, editingNotice }: NoticeFormProps) {
  const [selectedCategory, setSelectedCategory] = useState(editingNotice?.category ?? categories[0]);
  const [title, setTitle] = useState(editingNotice?.title ?? "");
  const [content, setContent] = useState(editingNotice?.content ?? "");
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) { setError("제목을 입력해주세요."); return; }
    if (!content.trim()) { setError("내용을 입력해주세요."); return; }
    setIsSaving(true);
    setError(null);
    try {
      if (editingNotice) {
        await updateNotice(editingNotice.id, { category: selectedCategory, title: title.trim(), content: content.trim() });
      } else {
        await createNotice({ category: selectedCategory, title: title.trim(), content: content.trim() });
      }
      onCancel();
    } catch (err) {
      console.error("Notice save error:", err);
      setError("저장에 실패했습니다. 다시 시도해주세요.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-4xl bg-[#1E1E1E] border border-[#2C2C2C] rounded-lg p-8">
      <h3 className="text-lg font-bold text-white mb-6">{editingNotice ? "공지사항 수정" : "공지사항 등록"}</h3>
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
        {error && <p className="text-xs text-red-400">{error}</p>}
        <div className="flex justify-end gap-3 pt-4">
          <button type="button" onClick={onCancel} disabled={isSaving} className="px-6 py-2 text-sm text-gray-400 hover:text-white disabled:opacity-40">
            취소
          </button>
          <button type="submit" disabled={isSaving} className="bg-white text-black px-8 py-2 rounded-md text-sm font-bold hover:bg-gray-200 disabled:opacity-40">
            {isSaving ? "저장 중..." : editingNotice ? "수정하기" : "저장하기"}
          </button>
        </div>
      </form>
    </div>
  );
}