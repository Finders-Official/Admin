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
  { href: "/photo-labs", label: "사진관 카탈로그", icon: Images },
  { href: "/notices", label: "공지사항", icon: Megaphone },
  { href: "/inquiries", label: "문의", icon: Headphones },
  { href: "/reports", label: "리포트", icon: ShieldAlert },
] as const;

export function AdminSidebar() {
  const pathname = usePathname();
  const logout = useLogout();

  return (
    <aside className="w-60 shrink-0 border-r border-border bg-card flex flex-col">
      <div className="px-5 py-6 border-b border-border">
        <span className="font-semibold text-base text-foreground">Finders Admin</span>
        <p className="mt-1 text-xs text-muted-foreground">필름 현상소 카탈로그 관리</p>
      </div>
      <nav className="flex flex-col gap-1 p-3 flex-1">
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
          const active = pathname?.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-colors",
                active
                  ? "bg-secondary text-foreground"
                  : "text-muted-foreground hover:bg-secondary hover:text-foreground",
              )}
            >
              <Icon className="size-4" />
              {label}
            </Link>
          );
        })}
      </nav>
      <div className="p-3 border-t border-border">
        <Button
          variant="ghost"
          className="w-full justify-start gap-2 text-muted-foreground hover:text-foreground hover:bg-secondary"
          onClick={logout}
        >
          <LogOut className="size-4" />
          로그아웃
        </Button>
      </div>
    </aside>
  );
}