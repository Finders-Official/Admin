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

    const handleReplySent = useCallback((inquiryId: string) => {
        setInquiries((prev) => prev.map((inq) => inq.id === inquiryId ? { ...inq, status: "답변완료" } : inq));
        setSelectedInquiry((prev) => prev?.id === inquiryId ? { ...prev, status: "답변완료" } : prev);
    }, []);

    if (isLoading) {
        return (
            <div className="flex flex-1 items-center justify-center bg-[#121212] p-4 text-gray-400">
                <p className="animate-pulse">문의 내역을 불러오는 중입니다...</p>
            </div>
        );
    }

    return (
        <main className="flex min-h-full flex-1 flex-col bg-[#121212] text-gray-200 font-sans">
            <header className="p-4 pb-3 sm:p-6 sm:pb-4 lg:p-8 lg:pb-4">
                <h2 className="text-xl font-bold text-white sm:text-2xl">문의 관리</h2>
                <p className="text-sm text-gray-400 mt-2">
                    유저들의 1:1 문의 내역을 확인하고 답변을 전송합니다.
                </p>
            </header>

            <div className="flex flex-1 flex-col gap-4 overflow-y-auto px-4 pb-4 sm:px-6 sm:pb-6 lg:flex-row lg:gap-6 lg:overflow-hidden lg:px-8 lg:pb-8">
                {inquiries.length > 0 ? (
                    <>
                        <InquiryTable
                            inquiries={inquiries}
                            selectedId={selectedInquiry?.id ?? ""}
                            onSelect={handleSelect}
                        />
                        <InquiryDetail selectedInquiry={selectedInquiry} onReplySent={handleReplySent} />
                    </>
                ) : (
                    <div className="flex min-h-64 flex-1 items-center justify-center rounded-lg border border-dashed border-[#2C2C2C] text-gray-500">
                        등록된 1:1 문의가 없습니다.
                    </div>
                )}
            </div>
        </main>
    );
}