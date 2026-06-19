"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { TRACKS } from "@/lib/tracks";

const baseItems = [
  { href: "/", label: "Home" },
  { href: "/dsa", label: "DSA" },
];

const trackItems = TRACKS.map((t) => ({ href: `/learn/${t.slug}`, label: t.name }));

function isActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    let active = true;
    fetch("/api/auth/session")
      .then((r) => r.json())
      .then((d) => {
        if (active) setIsAdmin(Boolean(d.isAdmin));
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, [pathname]);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    setIsAdmin(false);
    router.push("/");
    router.refresh();
  };

  const navItems = [...baseItems, ...trackItems];

  return (
    <header className="sticky top-0 z-50 border-b border-[var(--card-border)] bg-[var(--card)]/70 backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3.5">
        <Link href="/" className="flex flex-shrink-0 items-center gap-2.5">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--accent)] text-sm font-bold text-white">
            AL
          </span>
          <span className="hidden text-base font-semibold tracking-tight sm:inline">
            Abhishek Learns
          </span>
        </Link>

        <nav className="flex items-center gap-1 overflow-x-auto">
          {navItems.map((item) => {
            const active = isActive(pathname, item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`whitespace-nowrap rounded-lg px-2.5 py-1.5 text-sm font-medium transition ${
                  active
                    ? "bg-[var(--accent-soft)] text-[var(--accent)]"
                    : "text-[var(--muted)] hover:bg-[var(--background-subtle)] hover:text-[var(--foreground)]"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex flex-shrink-0 items-center gap-1">
          <Link
            href="/admin"
            className={`whitespace-nowrap rounded-lg px-2.5 py-1.5 text-sm font-medium transition ${
              isActive(pathname, "/admin")
                ? "bg-[var(--accent-soft)] text-[var(--accent)]"
                : "text-[var(--muted)] hover:bg-[var(--background-subtle)] hover:text-[var(--foreground)]"
            }`}
          >
            Admin
          </Link>
          {isAdmin && (
            <button
              type="button"
              onClick={handleLogout}
              className="whitespace-nowrap rounded-lg px-2.5 py-1.5 text-sm font-medium text-[var(--muted)] transition hover:bg-[var(--background-subtle)] hover:text-[var(--foreground)]"
            >
              Log out
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
