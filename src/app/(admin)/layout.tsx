import Link from "next/link";
import { LayoutDashboard, Images, LogOut } from "lucide-react";
import { logoutAction } from "@/app/actions/logout";
import { Button } from "@/components/ui/button";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen">
      <aside className="w-56 shrink-0 border-r bg-slate-50 flex flex-col">
        <div className="px-4 py-5 border-b">
          <span className="font-semibold text-sm text-slate-800">Finders Admin</span>
        </div>
        <nav className="flex flex-col gap-1 p-2 flex-1">
          <NavItem href="/dashboard" icon={<LayoutDashboard className="size-4" />} label="대시보드" />
          <NavItem href="/photo-labs" icon={<Images className="size-4" />} label="사진관 카탈로그" />
        </nav>
        <div className="p-2 border-t">
          <form action={logoutAction}>
            <Button
              type="submit"
              variant="ghost"
              className="w-full justify-start gap-2 text-slate-600 hover:text-slate-900"
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
      className="flex items-center gap-2 px-3 py-2 rounded-md text-sm text-slate-700 hover:bg-slate-200 transition-colors"
    >
      {icon}
      {label}
    </Link>
  );
}
