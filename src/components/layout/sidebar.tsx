"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, TrendingUp, Receipt, Target } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/", label: "홈", icon: LayoutDashboard },
  { href: "/revenue", label: "매출", icon: TrendingUp },
  { href: "/cost", label: "비용", icon: Receipt },
  { href: "/goals", label: "목표", icon: Target },
] as const;

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden md:flex fixed inset-y-0 left-0 z-30 w-60 flex-col border-r bg-card">
      <div className="px-4 py-6">
        <h1 className="text-lg font-bold">BubbleShare</h1>
        <p className="text-xs text-muted-foreground">Business Metrics</p>
      </div>

      <nav className="flex-1 space-y-1 px-2">
        {navItems.map(({ href, label, icon: Icon }) => {
          const isActive =
            href === "/" ? pathname === "/" : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-accent text-accent-foreground"
                  : "text-muted-foreground hover:bg-accent/50 hover:text-accent-foreground"
              )}
            >
              <Icon className="h-4 w-4" />
              {label}
            </Link>
          );
        })}
      </nav>

      <div className="px-4 py-4">
        <p className="text-xs text-muted-foreground/60">
          Powered by BubbleShare
        </p>
      </div>
    </aside>
  );
}
