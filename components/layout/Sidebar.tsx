"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Dot, StatusBadge } from "@/components/ui-system/primitives";

const navigation = [
  { name: "Dashboard", href: "/", group: "Overview" },
  { name: "People", href: "/people", group: "Core Records" },
  { name: "Whakapapa", href: "/whakapapa", group: "Core Records" },
  { name: "Whenua", href: "/whenua", group: "Core Records" },
  { name: "Marae", href: "/marae", group: "Governance" },
  { name: "Governance", href: "/governance", group: "Governance" },
  { name: "Hui", href: "/hui", group: "Governance" },
  { name: "Minutes", href: "/minutes", group: "Governance" },
  { name: "Decisions", href: "/decisions", group: "Governance" },
  { name: "Documents", href: "/documents", group: "Records" },
  { name: "Pānui", href: "/panui", group: "Records" },
  { name: "Tasks", href: "/tasks", group: "Records" },
  { name: "Activity", href: "/activity", group: "Records" },
];

const groups = ["Overview", "Core Records", "Governance", "Records"];

function isActivePath(pathname: string, href: string) {
  if (href === "/") {
    return pathname === "/";
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}

function IdentityCard() {
  return (
    <Link
      href="/"
      className="mb-8 flex items-center justify-between rounded-2xl border border-[var(--border)] bg-[var(--surface-raised)] px-4 py-4 shadow-sm transition hover:border-[var(--accent)] dark:bg-white/5 dark:backdrop-blur-sm dark:shadow-[inset_0_1px_0_0_rgba(255,255,255,0.05)]"
    >
      <div>
        <p className="text-xs font-medium uppercase tracking-wide text-[var(--muted-foreground)]">
          Sovereign OS
        </p>

        <p className="mt-1 text-sm font-semibold text-[var(--foreground)]">
          Governance Registry
        </p>
      </div>

      <StatusBadge>
        <Dot />
        Live
      </StatusBadge>
    </Link>
  );
}

function NavGroups({
  pathname,
  onNavigate,
}: {
  pathname: string;
  onNavigate?: () => void;
}) {
  return (
    <nav className="space-y-8">
      {groups.map((group) => (
        <div key={group}>
          <p className="mb-3 px-3 text-xs font-medium uppercase tracking-wide text-[var(--muted-foreground)]">
            {group}
          </p>

          <div className="space-y-1">
            {navigation
              .filter((item) => item.group === group)
              .map((item) => {
                const active = isActivePath(pathname, item.href);

                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={onNavigate}
                    aria-current={active ? "page" : undefined}
                    className={`group flex items-center gap-3 rounded-xl border px-3 py-2.5 text-sm transition-colors ${
                      active
                        ? "border-[var(--border)] bg-[var(--surface-raised)] text-[var(--foreground)]"
                        : "border-transparent text-[var(--muted-foreground)] hover:border-[var(--border)] hover:bg-[var(--surface)] hover:text-[var(--foreground)]"
                    }`}
                  >
                    <Dot
                      muted={!active}
                      className={
                        active ? "" : "group-hover:bg-[var(--muted-foreground)]"
                      }
                    />
                    {item.name}
                  </Link>
                );
              })}
          </div>
        </div>
      ))}
    </nav>
  );
}

export default function Sidebar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Open navigation"
        className="fixed left-4 top-4 z-50 flex h-11 w-11 items-center justify-center rounded-xl border border-[var(--border)] bg-[var(--surface)] text-[var(--foreground)] shadow-lg shadow-black/10 dark:bg-white/5 dark:backdrop-blur-sm dark:shadow-black/40 lg:hidden"
      >
        <span className="sr-only">Open navigation</span>
        <span className="space-y-1">
          <span className="block h-0.5 w-5 bg-[var(--foreground)]" />
          <span className="block h-0.5 w-5 bg-[var(--foreground)]" />
          <span className="block h-0.5 w-5 bg-[var(--foreground)]" />
        </span>
      </button>

      <aside className="hidden w-72 shrink-0 border-r border-[var(--border)] bg-[var(--surface)] px-5 py-5 dark:bg-white/5 dark:backdrop-blur-sm lg:block">
        <IdentityCard />
        <NavGroups pathname={pathname} />
      </aside>

      {open ? (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div
            className="absolute inset-0 bg-black/70"
            onClick={() => setOpen(false)}
            aria-hidden="true"
          />

          <aside className="relative z-10 flex h-full w-72 flex-col border-r border-[var(--border)] bg-[var(--surface)] px-5 py-5 shadow-2xl shadow-black/30 dark:shadow-black/60">
            <div className="mb-4 flex items-center justify-end">
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close navigation"
                className="rounded-lg border border-[var(--border)] px-3 py-1.5 text-xs font-medium text-[var(--muted-foreground)] transition-colors hover:border-[var(--accent)] hover:text-[var(--accent)]"
              >
                Close
              </button>
            </div>

            <IdentityCard />

            <div className="flex-1 overflow-y-auto">
              <NavGroups pathname={pathname} onNavigate={() => setOpen(false)} />
            </div>
          </aside>
        </div>
      ) : null}
    </>
  );
}
