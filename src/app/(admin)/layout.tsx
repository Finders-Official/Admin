import { AuthGuard } from "@/components/auth-guard";
import { AdminSidebar } from "@/components/admin/admin-sidebar";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard>
      <div className="flex min-h-dvh flex-col bg-background text-foreground md:flex-row">
        <AdminSidebar />
        <main className="min-w-0 flex-1 overflow-auto">{children}</main>
      </div>
    </AuthGuard>
  );
}
