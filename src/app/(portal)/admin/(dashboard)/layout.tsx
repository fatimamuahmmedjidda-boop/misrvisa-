import Link from "next/link";
import Image from "next/image";
import type { ReactNode } from "react";
import { redirect } from "next/navigation";
import { getActiveAdmin } from "@/lib/authz";
import LogoutButton from "@/components/admin/LogoutButton";

const navItems = [
  { href: "/admin", label: "Overview" },
  { href: "/admin/applications", label: "Applications" },
  { href: "/admin/payments", label: "Payments & Invoices" },
  { href: "/admin/pricing", label: "Pricing & Currencies" },
  { href: "/admin/partners", label: "Partner Leads" },
  { href: "/admin/partner-accounts", label: "Partner Accounts" },
  { href: "/admin/blog", label: "Blog" },
  { href: "/admin/testimonials", label: "Testimonials" },
  { href: "/admin/password-resets", label: "Password Resets" },
  { href: "/admin/audit-log", label: "Audit Log" },
];

export default async function AdminDashboardLayout({ children }: { children: ReactNode }) {
  // Every admin screen runs through this shell, so a revoked or disabled admin
  // session cannot render any dashboard page.
  const session = await getActiveAdmin();
  if (!session) redirect("/admin/login");

  return (
    <div className="flex min-h-[calc(100vh-64px)] bg-ivory">
      <aside className="hidden w-60 shrink-0 flex-col bg-emerald-dark px-4 py-8 sm:flex">
        <Link href="/admin" className="flex items-center gap-2.5 px-2">
          <Image src="/brand/logo-mark.png" alt="MISR VISA" width={28} height={28} className="rounded-md" />
          <span className="font-display text-sm font-semibold text-white">Admin</span>
        </Link>
        <nav className="mt-10 flex flex-1 flex-col gap-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-lg px-3 py-2.5 text-sm font-medium text-white/70 transition-colors hover:bg-white/10 hover:text-white"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="border-t border-white/10 pt-4">
          <p className="truncate px-2 text-xs text-white/40">{session.email}</p>
          <div className="mt-2 px-2">
            <LogoutButton />
          </div>
        </div>
      </aside>
      <div className="flex-1 px-5 py-8 sm:px-8">{children}</div>
    </div>
  );
}
