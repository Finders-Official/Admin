import Link from "next/link";
import { Images } from "lucide-react";

export default function DashboardPage() {
  return (
    <div className="px-10 py-8 flex flex-col gap-8">
      <header>
        <h1 className="text-3xl font-semibold text-foreground">대시보드</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Finders 관리자 콘솔. 좌측 메뉴에서 카탈로그를 관리한다.
        </p>
      </header>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <Link
          href="/photo-labs"
          className="group rounded-lg border border-border bg-card p-6 transition-colors hover:border-primary"
        >
          <div className="flex items-start gap-4">
            <div className="rounded-md bg-secondary p-3 text-primary group-hover:bg-primary/10">
              <Images className="size-5" />
            </div>
            <div>
              <h2 className="font-semibold text-foreground">사진관 카탈로그</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                네이버 지도에서 수집한 필름 현상소 카탈로그를 시딩하고 상태를 관리한다.
              </p>
            </div>
          </div>
        </Link>
      </section>
    </div>
  );
}
