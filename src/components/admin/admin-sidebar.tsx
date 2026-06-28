"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Images, LogOut, Headphones, Megaphone, BookOpen, RectangleHorizontal, ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLogout } from "@/hooks/auth/useLogout";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { href: "/dashboard", label: "대시보드", icon: LayoutDashboard },
  { href: "/banners", label: "배너", icon: RectangleHorizontal },
  { href: "/contents", label: "콘텐츠", icon: BookOpen },
  { href: "/photo-labs", label: "사진관", icon: Images },
  { href: "/notices", label: "공지", icon: Megaphone },
  { href: "/inquiries", label: "문의", icon: Headphones },
  { href: "/reports", label: "리포트", icon: ShieldAlert },
] as const;

export function AdminSidebar() {
  const pathname = usePathname();
  const logout = useLogout();

  return (
    <aside className="sticky top-0 z-20 flex w-full shrink-0 flex-col border-b border-border bg-card/95 backdrop-blur md:h-screen md:w-60 md:border-b-0 md:border-r">
      <div className="flex items-center justify-between gap-3 border-b border-border px-4 py-3 md:block md:px-5 md:py-6">
        <div className="min-w-0">
          <span className="block truncate text-sm font-semibold text-foreground md:text-base">Finders Admin</span>
          <p className="mt-0.5 hidden text-xs text-muted-foreground sm:block md:mt-1">필름 현상소 카탈로그 관리</p>
        </div>
        <Button variant="ghost" size="sm" className="shrink-0 gap-1.5 px-2 text-muted-foreground hover:bg-secondary hover:text-foreground md:hidden" onClick={logout}>
          <LogOut className="size-4" />
          로그아웃
        </Button>
      </div>
      <nav className="scrollbar-thin flex gap-1 overflow-x-auto p-2 md:flex-1 md:flex-col md:overflow-x-visible md:overflow-y-auto md:p-3">
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
          const active = pathname?.startsWith(href);
          return (
            <Link key={href} href={href} className={cn("flex shrink-0 items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors", active ? "bg-secondary text-foreground" : "text-muted-foreground hover:bg-secondary hover:text-foreground")}>
              <Icon className="size-4" />
              {label}
            </Link>
          );
        })}
      </nav>
      <div className="hidden border-t border-border p-3 md:block">
        <Button variant="ghost" className="w-full justify-start gap-2 text-muted-foreground hover:bg-secondary hover:text-foreground" onClick={logout}>
          <LogOut className="size-4" />
          로그아웃
        </Button>
      </div>
    </aside>
  );
}
