"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, LayoutDashboard, TrendingUp, Receipt, Users } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/", label: "홈", icon: LayoutDashboard },
  { href: "/revenue", label: "매출", icon: TrendingUp },
  { href: "/cost", label: "비용", icon: Receipt },
  { href: "/resources", label: "리소스", icon: Users },
] as const;

export function MobileNav() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="md:hidden fixed top-4 left-4 z-50 rounded-md border bg-background p-2 shadow-sm"
        aria-label="메뉴 열기"
      >
        <Menu className="h-5 w-5" />
      </button>

      {open && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/50 md:hidden"
            onClick={() => setOpen(false)}
          />
          <aside className="fixed inset-y-0 left-0 z-50 w-60 flex flex-col border-r bg-card md:hidden">
            <div className="flex items-center justify-between px-4 py-6">
              <div>
                <h1 className="text-lg font-bold">BubbleShare</h1>
                <p className="text-xs text-muted-foreground">Business Metrics</p>
              </div>
              <button onClick={() => setOpen(false)} aria-label="메뉴 닫기">
                <X className="h-5 w-5" />
              </button>
            </div>

            <nav className="flex-1 space-y-1 px-2">
              {navItems.map(({ href, label, icon: Icon }) => {
                const isActive =
                  href === "/" ? pathname === "/" : pathname.startsWith(href);
                return (
                  <Link
                    key={href}
                    href={href}
                    onClick={() => setOpen(false)}
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
        </>
      )}
    </>
  );
}
