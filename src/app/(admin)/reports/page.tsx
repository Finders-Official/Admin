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
    async function fetchReports() {
      try {
        setIsLoading(true);
        const response = await fetch('/api/admin/reports');
        if (response.ok) {
          const data: ReportItem[] = await response.json();
          setReports(data);
          if (data.length > 0) {
            setSelectedReport(data[0]);
          }
        }
      } catch (error) {
        console.error("Report fetch error:", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchReports();
  }, []);

  // 상위 주입형 필터링 연산 로직
  const filteredReports = reports.filter((report) => {
    const matchTab = activeTab === "전체" || report.type === activeTab;
    const matchCount = !filterMinFive || report.reportCount >= 5;
    return matchTab && matchCount;
  });

  return (
    <main className="flex-1 flex flex-col overflow-hidden bg-[#121212] text-gray-200 font-sans">
      <header className="p-8 pb-4 shrink-0">
        <h2 className="text-2xl font-bold text-white">커뮤니티 신고 관리</h2>
        <p className="text-sm text-gray-400 mt-1">
          유저들이 신고한 게시글 및 댓글을 모니터링하고 처리합니다.
        </p>
      </header>

      <div className="px-8 py-2 flex justify-between items-center border-b border-[#2C2C2C] shrink-0">
        <div className="flex gap-6">
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

        <label className="flex items-center gap-2 cursor-pointer text-xs bg-[#1E1E1E] border border-[#2C2C2C] px-3 py-1.5 rounded-md hover:border-gray-500">
          <input
            type="checkbox"
            checked={filterMinFive}
            onChange={(e) => setFilterMinFive(e.target.checked)}
            className="accent-orange-500"
          />
          <span className="text-gray-300 font-medium">🚨 5회 이상 누적 집중 모니터링</span>
        </label>
      </div>

      <div className="flex-1 flex px-8 py-6 gap-6 overflow-hidden">
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