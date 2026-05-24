import Link from "next/link";
import { LayoutDashboard, Images, LogOut } from "lucide-react";
import { logoutAction } from "@/app/actions/logout";
import { Button } from "@/components/ui/button";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-background text-foreground">
      <aside className="w-60 shrink-0 border-r border-border bg-card flex flex-col">
        <div className="px-5 py-6 border-b border-border">
          <span className="font-semibold text-base text-foreground">Finders Admin</span>
          <p className="mt-1 text-xs text-muted-foreground">필름 현상소 카탈로그 관리</p>
        </div>
        <nav className="flex flex-col gap-1 p-3 flex-1">
          <NavItem href="/dashboard" icon={<LayoutDashboard className="size-4" />} label="대시보드" />
          <NavItem href="/photo-labs" icon={<Images className="size-4" />} label="사진관 카탈로그" />
        </nav>
        <div className="p-3 border-t border-border">
          <form action={logoutAction}>
            <Button
              type="submit"
              variant="ghost"
              className="w-full justify-start gap-2 text-muted-foreground hover:text-foreground hover:bg-secondary"
            >
              <LogOut className="size-4" />
              로그아웃
            </Button>
          </form>
        </div>
      </aside>
      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  );
}

function NavItem({
  href,
  icon,
  label,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <Link
      href={href}
      className="flex items-center gap-2 px-3 py-2 rounded-md text-sm text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
    >
      {icon}
      {label}
    </Link>
  );
}
