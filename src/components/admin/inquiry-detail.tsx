'use client';

import { useState, useEffect } from "react";
import { submitInquiryReply } from "@/apis/admin/inquiries.api";
import type { Inquiry } from "@/types/inquiry";

interface InquiryDetailProps {
    selectedInquiry: Inquiry | null;
    onReplySent?: (inquiryId: string) => void;
}

export function InquiryDetail({ selectedInquiry, onReplySent }: InquiryDetailProps) {
    const [replyText, setReplyText] = useState("");
    const [isSending, setIsSending] = useState(false);

    useEffect(() => {
        setReplyText("");
    }, [selectedInquiry]);

    async function handleSendReply() {
        if (!selectedInquiry || !replyText.trim()) return;
        setIsSending(true);
        try {
            await submitInquiryReply(selectedInquiry.id, replyText.trim());
            setReplyText("");
            onReplySent?.(selectedInquiry.id);
        } catch (err) {
            console.error("Reply send error:", err);
        } finally {
            setIsSending(false);
        }
    }

    if (!selectedInquiry) {
        return (
            <div className="flex min-h-56 w-full items-center justify-center rounded-lg border border-[#2C2C2C] bg-[#1E1E1E] text-gray-500 lg:w-1/2">
                좌측에서 문의 내역을 선택해주세요.
            </div>
        );
    }

    return (
        <div className="flex min-h-[520px] w-full flex-col rounded-lg border border-[#2C2C2C] bg-[#1E1E1E] lg:min-h-0 lg:w-1/2">
            <div className="border-b border-[#2C2C2C] p-4 sm:p-6">
                <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                        <span className="text-xs text-orange-500 font-medium border border-orange-500/30 bg-orange-500/10 px-2 py-1 rounded-md mb-2 inline-block">
                            {selectedInquiry.category}
                        </span>
                        <h3 className="text-lg text-white font-medium">
                            {selectedInquiry.userName}{" "}
                            <span className="text-gray-500 text-sm">({selectedInquiry.userId})</span>
                        </h3>
                    </div>
                    <span className="text-sm text-gray-500">{selectedInquiry.createdAt}</span>
                </div>
                <div className="bg-[#242424] p-4 rounded-md text-gray-300 min-h-[120px] whitespace-pre-wrap">
                    {selectedInquiry.content}
                </div>
            </div>

            <div className="flex flex-1 flex-col p-4 sm:p-6">
                <h4 className="text-sm font-medium text-gray-400 mb-3">답변 작성</h4>
                {selectedInquiry.status === "답변완료" ? (
                    <div className="bg-blue-900/10 border border-blue-900/30 p-4 rounded-md text-gray-300 flex-1 whitespace-pre-wrap">
                        {selectedInquiry.reply}
                    </div>
                ) : (
                    <div className="flex-1 flex flex-col">
                        <textarea
                            className="flex-1 bg-[#121212] border border-[#2C2C2C] rounded-md p-4 text-gray-300 focus:outline-none focus:border-gray-500 resize-none"
                            placeholder="문의에 대한 답변을 입력해주세요."
                            value={replyText}
                            onChange={(e) => setReplyText(e.target.value)}
                        ></textarea>
                        <button
                            onClick={handleSendReply}
                            disabled={isSending || !replyText.trim()}
                            className="mt-4 bg-white text-black font-medium py-3 rounded-md hover:bg-gray-200 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                            {isSending ? "전송 중..." : "답변 전송하기"}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}