'use client';

import { useState, useEffect } from "react";
import { ReportTable } from "@/components/admin/report-table";
import { ReportDetailPanel } from "@/components/admin/report-detail-panel";
import { ReportItem } from "@/types/report";

export default function ReportAdminPage() {
  const [activeTab, setActiveTab] = useState("전체");
  const [selectedReport, setSelectedReport] = useState<ReportItem | null>(null);
  const [filterMinFive, setFilterMinFive] = useState(false);
  const [reports, setReports] = useState<ReportItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    import("@/apis/admin/reports.api").then(({ fetchReports }) =>
      fetchReports()
        .then((data) => {
          setReports(data);
          if (data.length > 0) setSelectedReport(data[0]);
        })
        .catch((err) => console.error("Report fetch error:", err))
        .finally(() => setIsLoading(false))
    );
  }, []);

  // 상위 주입형 필터링 연산 로직
  const filteredReports = reports.filter((report) => {
    const matchTab = activeTab === "전체" || report.type === activeTab;
    const matchCount = !filterMinFive || report.reportCount >= 5;
    return matchTab && matchCount;
  });

  return (
    <main className="flex min-h-full flex-1 flex-col overflow-hidden bg-[#121212] text-gray-200 font-sans">
      <header className="shrink-0 p-4 pb-3 sm:p-6 sm:pb-4 lg:p-8 lg:pb-4">
        <h2 className="text-xl font-bold text-white sm:text-2xl">커뮤니티 신고 관리</h2>
        <p className="text-sm text-gray-400 mt-1">
          유저들이 신고한 게시글 및 댓글을 모니터링하고 처리합니다.
        </p>
      </header>

      <div className="flex shrink-0 flex-col gap-3 border-b border-[#2C2C2C] px-4 py-3 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
        <div className="flex gap-5 overflow-x-auto">
          {["전체", "게시글", "댓글"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-3 text-sm font-medium relative ${activeTab === tab ? "text-orange-500" : "text-gray-500 hover:text-gray-300"
                }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <label className="flex cursor-pointer items-center gap-2 rounded-md border border-[#2C2C2C] bg-[#1E1E1E] px-3 py-1.5 text-xs hover:border-gray-500">
          <input
            type="checkbox"
            checked={filterMinFive}
            onChange={(e) => setFilterMinFive(e.target.checked)}
            className="accent-orange-500"
          />
          <span className="text-gray-300 font-medium">🚨 5회 이상 누적 집중 모니터링</span>
        </label>
      </div>

      <div className="flex flex-1 flex-col gap-4 overflow-y-auto px-4 py-4 sm:px-6 sm:py-6 lg:flex-row lg:gap-6 lg:overflow-hidden lg:px-8">
        {isLoading ? (
          <p className="text-center text-gray-500 m-auto animate-pulse">로딩 중...</p>
        ) : (
          <>
            <ReportTable
              reports={filteredReports}
              selectedReport={selectedReport}
              onSelect={setSelectedReport}
            />
            <ReportDetailPanel selectedReport={selectedReport} />
          </>
        )}
      </div>
    </main>
  );
}