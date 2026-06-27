'use client';

import { useState, useEffect } from "react";

interface Inquiry {
    id: number;
    userName: string;
    userId: string;
    category: string;
    content: string;
    status: string;
    createdAt: string;
    reply: string | null;
}

interface InquiryDetailProps {
    selectedInquiry: Inquiry | null;
}

export function InquiryDetail({ selectedInquiry }: InquiryDetailProps) {
    const [replyText, setReplyText] = useState("");

    // 선택된 문의가 바뀌면 입력창을 초기화합니다.
    useEffect(() => {
        setReplyText("");
    }, [selectedInquiry]);

    if (!selectedInquiry) {
        return (
            <div className="w-1/2 bg-[#1E1E1E] border border-[#2C2C2C] rounded-lg flex items-center justify-center text-gray-500">
                좌측에서 문의 내역을 선택해주세요.
            </div>
        );
    }

    return (
        <div className="w-1/2 bg-[#1E1E1E] border border-[#2C2C2C] rounded-lg flex flex-col">
            <div className="p-6 border-b border-[#2C2C2C]">
                <div className="flex justify-between items-start mb-4">
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

            <div className="p-6 flex-1 flex flex-col">
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
                        <button className="mt-4 bg-white text-black font-medium py-3 rounded-md hover:bg-gray-200 transition-colors">
                            답변 전송하기
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}