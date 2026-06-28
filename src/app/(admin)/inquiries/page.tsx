'use client';

import { useState, useEffect, useCallback } from "react";
import { InquiryTable } from "@/components/admin/inquiry-table";
import { InquiryDetail } from "@/components/admin/inquiry-detail";
import { Inquiry } from "@/types/inquiry";
import { fetchInquiries, fetchInquiryDetail } from "@/apis/admin/inquiries.api";

export default function InquiryAdminPage() {
    const [inquiries, setInquiries] = useState<Inquiry[]>([]);
    const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect(() => {
        fetchInquiries()
            .then((data) => {
                setInquiries(data);
                if (data.length > 0) {
                    fetchInquiryDetail(data[0].id).then(setSelectedInquiry).catch(() => setSelectedInquiry(data[0]));
                }
            })
            .catch((err) => console.error("Inquiry fetch error:", err))
            .finally(() => setIsLoading(false));
    }, []);

    const handleSelect = useCallback((inquiry: Inquiry) => {
        setSelectedInquiry(inquiry);
        fetchInquiryDetail(inquiry.id)
            .then(setSelectedInquiry)
            .catch(() => {});
    }, []);

    const handleReplySent = useCallback((inquiryId: number) => {
        setInquiries((prev) => prev.map((inq) => inq.id === inquiryId ? { ...inq, status: "답변완료" } : inq));
        setSelectedInquiry((prev) => prev?.id === inquiryId ? { ...prev, status: "답변완료" } : prev);
    }, []);

    if (isLoading) {
        return (
            <div className="flex-1 flex items-center justify-center bg-[#121212] text-gray-400">
                <p className="animate-pulse">문의 내역을 불러오는 중입니다...</p>
            </div>
        );
    }

    return (
        <main className="flex-1 flex flex-col h-full bg-[#121212] text-gray-200 font-sans">
            <header className="p-8 pb-4">
                <h2 className="text-2xl font-bold text-white">문의 관리</h2>
                <p className="text-sm text-gray-400 mt-2">
                    유저들의 1:1 문의 내역을 확인하고 답변을 전송합니다.
                </p>
            </header>

            <div className="flex-1 flex px-8 pb-8 gap-6 overflow-hidden">
                {inquiries.length > 0 ? (
                    <>
                        <InquiryTable
                            inquiries={inquiries}
                            selectedId={selectedInquiry?.id ?? 0}
                            onSelect={handleSelect}
                        />
                        <InquiryDetail selectedInquiry={selectedInquiry} onReplySent={handleReplySent} />
                    </>
                ) : (
                    <div className="flex-1 flex items-center justify-center border border-dashed border-[#2C2C2C] rounded-lg m-8 text-gray-500">
                        등록된 1:1 문의가 없습니다.
                    </div>
                )}
            </div>
        </main>
    );
}