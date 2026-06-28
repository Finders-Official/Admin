"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { fetchInquiries } from "@/apis/admin/inquiries.api";
import { fetchReports } from "@/apis/admin/reports.api";
import {
  Images,
  Headphones,
  ShieldAlert,
  Megaphone,
  BookOpen,
  RectangleHorizontal,
  ArrowUpRight
} from "lucide-react";

export default function DashboardPage() {
  // 💡 목데이터 배열이나 하드코딩 숫자를 모두 제거하고 초기값을 0으로 설정합니다.
  const [pendingInquiries, setPendingInquiries] = useState(0);
  const [activeReports, setActiveReports] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchDashboardStats() {
      try {
        setIsLoading(true);

        const [inquiries, reports] = await Promise.all([
          fetchInquiries(),
          fetchReports(),
        ]);

        setPendingInquiries(inquiries.filter((i) => i.status === "대기중").length);
        setActiveReports(
          reports.filter((r) => r.reportCount >= 5 && r.status === "대기중").length,
        );
      } catch (error) {
        console.error("Dashboard stats fetch error:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchDashboardStats();
  }, []);

  return (
    <div className="flex flex-col gap-8 px-4 py-6 sm:px-6 lg:px-10 lg:py-8">
      {/* 1. 헤더 영역 */}
      <header>
        <h1 className="text-2xl font-semibold text-foreground sm:text-3xl">대시보드</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Finders 관리자 콘솔. 오늘의 주요 미처리 업무와 서비스 현황을 한눈에 점검합니다.
        </p>
      </header>

      {/* 2. 오늘의 미처리 할 일 (지표 요약 섹션) */}
      <section className="flex flex-col gap-4">
        <h2 className="text-xs font-bold text-muted-foreground/70 uppercase tracking-wider">
          오늘의 미처리 할 일 ⚡
        </h2>
        <div className="grid gap-4 md:grid-cols-2">
          {/* 문의 관리 배지 */}
          <Link
            href="/inquiries"
            className="group flex items-center justify-between gap-4 rounded-lg border border-border bg-card p-4 transition-colors hover:border-orange-500/50 sm:p-6"
          >
            <div className="flex items-center gap-4">
              <div className="rounded-md bg-orange-500/10 p-3 text-orange-500 group-hover:bg-orange-500/20">
                <Headphones className="size-5" />
              </div>
              <div>
                <p className="text-xs font-medium text-muted-foreground">답변 대기 문의</p>
                <p className={cn(
                  "mt-1 text-2xl font-bold text-foreground transition-opacity",
                  isLoading && "opacity-40 animate-pulse"
                )}>
                  {isLoading ? "-" : `${pendingInquiries}건`}
                </p>
              </div>
            </div>
            <ArrowUpRight className="size-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
          </Link>

          {/* 신고 관리 배지 */}
          <Link
            href="/reports"
            className="group flex items-center justify-between gap-4 rounded-lg border border-border bg-card p-4 transition-colors hover:border-red-500/50 sm:p-6"
          >
            <div className="flex items-center gap-4">
              <div className="rounded-md bg-red-500/10 p-3 text-red-500 group-hover:bg-red-500/20">
                <ShieldAlert className="size-5" />
              </div>
              <div>
                <p className="text-xs font-medium text-muted-foreground">집중 모니터링 신고 (5회 이상)</p>
                <p className={cn(
                  "mt-1 text-2xl font-bold text-foreground transition-opacity",
                  isLoading && "opacity-40 animate-pulse"
                )}>
                  {isLoading ? "-" : `${activeReports}건`}
                </p>
              </div>
            </div>
            <ArrowUpRight className="size-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
          </Link>
        </div>
      </section>

      {/* 3. 서비스 도메인 관리 (전체 메뉴 바로가기 그리드) */}
      <section className="flex flex-col gap-4">
        <h2 className="text-xs font-bold text-muted-foreground/70 uppercase tracking-wider">
          서비스 도메인 관리 🛠️
        </h2>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {/* 카드 1: 사진관 카탈로그 */}
          <Link
            href="/photo-labs"
            className="group rounded-lg border border-border bg-card p-4 transition-colors hover:border-primary sm:p-6"
          >
            <div className="flex items-start gap-4">
              <div className="rounded-md bg-secondary p-3 text-primary group-hover:bg-primary/10">
                <Images className="size-5" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">사진관 카탈로그</h3>
                <p className="mt-1 text-sm text-muted-foreground leading-relaxed">
                  네이버 지도에서 수집한 필름 현상소 카탈로그를 시딩하고 상태를 관리한다.
                </p>
              </div>
            </div>
          </Link>

          {/* 카드 2: 배너 관리 */}
          <Link
            href="/banners"
            className="group rounded-lg border border-border bg-card p-4 transition-colors hover:border-primary sm:p-6"
          >
            <div className="flex items-start gap-4">
              <div className="rounded-md bg-secondary p-3 text-primary group-hover:bg-primary/10">
                <RectangleHorizontal className="size-5" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">홈 배너 관리</h3>
                <p className="mt-1 text-sm text-muted-foreground leading-relaxed">
                  유저 앱 최상단 프로모션용 통 이미지 배너 목록과 활성화 상태, 우선순위를 관리합니다.
                </p>
              </div>
            </div>
          </Link>

          {/* 카드 3: 콘텐츠 관리 */}
          <Link
            href="/contents"
            className="group rounded-lg border border-border bg-card p-4 transition-colors hover:border-primary sm:p-6"
          >
            <div className="flex items-start gap-4">
              <div className="rounded-md bg-secondary p-3 text-primary group-hover:bg-primary/10">
                <BookOpen className="size-5" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">홈 콘텐츠 관리</h3>
                <p className="mt-1 text-sm text-muted-foreground leading-relaxed">
                  유저 홈 피드 매거진 영역에 게재되는 필름 소식 아티클을 기획하고 편집/발행합니다.
                </p>
              </div>
            </div>
          </Link>

          {/* 카드 4: 공지사항 관리 */}
          <Link
            href="/notices"
            className="group rounded-lg border border-border bg-card p-4 transition-colors hover:border-primary sm:p-6"
          >
            <div className="flex items-start gap-4">
              <div className="rounded-md bg-secondary p-3 text-primary group-hover:bg-primary/10">
                <Megaphone className="size-5" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">공지사항 관리</h3>
                <p className="mt-1 text-sm text-muted-foreground leading-relaxed">
                  앱 내 일반공지, 이벤트 안내, 이용약관 정책 등의 카테고리별 공지를 등록하고 관리합니다.
                </p>
              </div>
            </div>
          </Link>
        </div>
      </section>
    </div>
  );
}

// 💡 프로젝트 내부 클래스 병합 유틸이 선언되어 있지 않을 경우를 대비한 가벼운 헬퍼 함수
function cn(...classes: any[]) {
  return classes.filter(Boolean).join(" ");
}