"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, Package, FileText, Image as ImageIcon, Mail, Users, LogOut } from "lucide-react";
import { authClient } from "@/lib/auth-client";

const NAV_ITEMS = [
  { href: "/studio", label: "Overview", icon: LayoutDashboard },
  { href: "/studio/pages", label: "Pages", icon: FileText },
  { href: "/studio/products", label: "Products", icon: Package },
  { href: "/studio/media", label: "Media Library", icon: ImageIcon },
  { href: "/studio/contact", label: "Contact Messages", icon: Mail },
  { href: "/studio/team", label: "Team", icon: Users },
];

export function StudioShell({
  userName,
  children,
}: {
  userName: string;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();

  async function handleSignOut() {
    await authClient.signOut();
    router.push("/studio/login");
    router.refresh();
  }

  return (
    <div className="flex min-h-screen bg-bg">
      <aside className="flex w-64 shrink-0 flex-col border-r border-border bg-surface px-4 py-6">
        <div className="mb-8 px-2">
          <p className="font-display text-lg font-medium tracking-tight text-white">Falcotrix</p>
          <p className="text-xs text-text-faint">Studio</p>
        </div>

        <nav className="flex flex-1 flex-col gap-1">
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 rounded-none px-3 py-2.5 text-sm transition-colors duration-150 ${
                  isActive
                    ? "bg-accent-faint text-white"
                    : "text-text-muted hover:bg-surface-elevated hover:text-text"
                }`}
              >
                <Icon className="h-4 w-4" strokeWidth={2} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto border-t border-border pt-4">
          <p className="mb-2 px-3 text-xs text-text-faint">{userName}</p>
          <button
            type="button"
            onClick={handleSignOut}
            className="flex w-full items-center gap-3 rounded-none px-3 py-2.5 text-sm text-text-muted transition-colors duration-150 hover:bg-surface-elevated hover:text-text"
          >
            <LogOut className="h-4 w-4" strokeWidth={2} />
            Sign out
          </button>
        </div>
      </aside>

      <main className="flex-1 px-10 py-8">{children}</main>
    </div>
  );
}
