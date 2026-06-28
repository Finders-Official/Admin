'use client';

import { ReportItem } from "@/types/report";

const REPORT_REASONS = [
  "스팸/홍보",
  "음란물",
  "욕설/혐오",
  "개인정보 노출",
  "불법 정보",
];

interface ReportDetailPanelProps {
  selectedReport: ReportItem | null;
}

export function ReportDetailPanel({ selectedReport }: ReportDetailPanelProps) {
  if (!selectedReport) {
    return (
      <div className="w-5/12 bg-[#1E1E1E] border border-[#2C2C2C] rounded-xl flex items-center justify-center text-gray-500 text-sm">
        조사할 신고 대상을 목록에서 선택하세요.
      </div>
    );
  }

  return (
    <div className="w-5/12 bg-[#1E1E1E] border border-[#2C2C2C] rounded-xl flex flex-col overflow-hidden">
      <div className="p-6 flex flex-col h-full justify-between">
        <div>
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-2">
              <span className="text-xs bg-[#242424] px-2 py-1 rounded text-gray-400">
                {selectedReport.type}
              </span>
              <span className="text-xs text-gray-500">
                ID: {selectedReport.targetId}
              </span>
            </div>
            <span className="text-xs text-gray-500">
              {selectedReport.createdAt}
            </span>
          </div>

          <div className="mb-6">
            <h4 className="text-xs text-gray-500 uppercase font-bold mb-2">
              작성자: {selectedReport.authorName}
            </h4>
            <div className="bg-[#121212] border border-[#2C2C2C] p-4 rounded-lg text-sm text-gray-200 leading-relaxed whitespace-pre-wrap">
              {selectedReport.content}
            </div>
          </div>

          <div>
            <h4 className="text-xs text-gray-500 uppercase font-bold mb-3">
              누적 신고 사유 통계
            </h4>
            <div className="space-y-2.5">
              {REPORT_REASONS.map((reason) => {
                const count = selectedReport.reasonStats[reason] || 0;
                return (
                  <div key={reason} className="flex items-center justify-between text-xs">
                    <span className="text-gray-400 w-24">{reason}</span>
                    <div className="flex-1 mx-3 bg-[#242424] h-2 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${count > 0 ? "bg-orange-500" : "bg-transparent"}`}
                        style={{
                          width: `${selectedReport.reportCount > 0
                              ? (count / selectedReport.reportCount) * 100
                              : 0
                            }%`,
                        }}
                      />
                    </div>
                    <span className={`w-8 text-right font-medium ${count > 0 ? "text-white" : "text-gray-600"}`}>
                      {count}건
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="pt-6 border-t border-[#2C2C2C]">
          {selectedReport.status === "대기중" ? (
            <div className="flex flex-col gap-3 sm:flex-row sm:gap-4">
              <button className="flex-1 border border-gray-600 text-gray-300 py-3 rounded-md text-sm font-medium hover:bg-[#242424] transition-colors">
                신고 기각 (유지)
              </button>
              <button className="flex-1 bg-red-600 text-white py-3 rounded-md text-sm font-bold hover:bg-red-500 transition-colors">
                ⚠️ 블라인드 (숨김)
              </button>
            </div>
          ) : (
            <div className="text-center py-2 bg-[#242424] rounded-md text-sm text-gray-400 font-medium">
              이 대상은 이미 <span className="text-white">[{selectedReport.status}]</span> 처리가 완료되었습니다.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}