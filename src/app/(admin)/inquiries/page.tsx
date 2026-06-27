'use client';

import { useState, useEffect } from "react";
import { InquiryTable } from "@/components/admin/inquiry-table";
import { InquiryDetail } from "@/components/admin/inquiry-detail";
import { Inquiry } from "@/types/inquiry";

export default function InquiryAdminPage() {
    const [inquiries, setInquiries] = useState<Inquiry[]>([]);
    const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect(() => {
        async function fetchInquiries() {
            try {
                setIsLoading(true);
                const response = await fetch('/api/admin/inquiries');

                if (!response.ok) {
                    throw new Error('데이터를 불러오는데 실패했습니다.');
                }

                const data: Inquiry[] = await response.json();
                setInquiries(data);

                if (data.length > 0) {
                    setSelectedInquiry(data[0]);
                }
            } catch (error) {
                console.error("Inquiry fetch error:", error);
            } finally {
                setIsLoading(false);
            }
        }

        fetchInquiries();
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
                            onSelect={setSelectedInquiry}
                        />
                        <InquiryDetail selectedInquiry={selectedInquiry} />
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