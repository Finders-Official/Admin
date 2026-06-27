'use client';

import { ReportItem } from "@/types/report";

interface ReportTableProps {
  reports: ReportItem[];
  selectedReport: ReportItem | null;
  onSelect: (report: ReportItem) => void;
}

export function ReportTable({ reports, selectedReport, onSelect }: ReportTableProps) {
  return (
    <div className="w-7/12 bg-[#1E1E1E] border border-[#2C2C2C] rounded-xl overflow-y-auto">
      <table className="w-full text-left border-collapse">
        <thead className="bg-[#242424] text-xs uppercase text-gray-400 sticky top-0 z-10">
          <tr>
            <th className="p-4 font-medium">상태</th>
            <th className="p-4 font-medium">구분</th>
            <th className="p-4 font-medium">신고수</th>
            <th className="p-4 font-medium">본문 요약</th>
            <th className="p-4 font-medium">최근 신고일</th>
          </tr>
        </thead>
        <tbody className="text-sm divide-y divide-[#2C2C2C]">
          {reports.map((report) => (
            <tr
              key={report.id}
              onClick={() => onSelect(report)}
              className={`cursor-pointer hover:bg-[#2A2A2A] transition-colors ${selectedReport?.id === report.id ? "bg-[#2A2A2A]" : ""
                }`}
            >
              <td className="p-4">
                <span
                  className={`px-2 py-0.5 text-xs rounded ${report.status === "대기중"
                      ? "bg-amber-900/30 text-amber-400"
                      : report.status === "숨김처리"
                        ? "bg-red-900/30 text-red-400"
                        : "bg-gray-800 text-gray-400"
                    }`}
                >
                  {report.status}
                </span>
              </td>
              <td className="p-4 text-gray-400">{report.type}</td>
              <td className="p-4">
                <span
                  className={`font-bold ${report.reportCount >= 5
                      ? "text-red-500 bg-red-500/10 px-1.5 py-0.5 rounded"
                      : "text-gray-300"
                    }`}
                >
                  {report.reportCount}회
                </span>
              </td>
              <td className="p-4 text-gray-300 truncate max-w-[180px]">
                {report.content}
              </td>
              <td className="p-4 text-gray-500 text-xs">
                {report.createdAt.split(" ")[0]}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}