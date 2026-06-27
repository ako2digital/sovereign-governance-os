"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Dot, StatusBadge } from "@/components/ui-system/primitives";

const navigation = [
  { name: "Dashboard", href: "/", group: "Overview" },

  { name: "People", href: "/people", group: "People & Relationships" },
  { name: "Whakapapa", href: "/whakapapa", group: "People & Relationships" },

  { name: "Marae", href: "/marae", group: "Hapū, Marae & Whenua" },
  { name: "Pānui", href: "/panui", group: "Hapū, Marae & Whenua" },
  { name: "Whenua", href: "/whenua", group: "Hapū, Marae & Whenua" },

  { name: "Hui", href: "/hui", group: "Governance Chain" },
  { name: "Minutes", href: "/minutes", group: "Governance Chain" },
  { name: "Decisions", href: "/decisions", group: "Governance Chain" },
  { name: "Tasks", href: "/tasks", group: "Governance Chain" },
  { name: "Governance Records", href: "/governance", group: "Governance Chain" },

  { name: "Library", href: "/library", group: "Library & Evidence" },
  { name: "Documents", href: "/documents", group: "Library & Evidence" },
  { name: "Files", href: "/library/files", group: "Library & Evidence" },
  { name: "Evidence", href: "/library/evidence", group: "Library & Evidence" },

  { name: "Reports", href: "/reports", group: "Intelligence & Outcomes" },
  { name: "Funding Readiness", href: "/reports/funding-readiness", group: "Intelligence & Outcomes" },
  { name: "Governance Chain", href: "/reports/governance-chain", group: "Intelligence & Outcomes" },
  { name: "Hui Participation", href: "/reports/hui-participation", group: "Intelligence & Outcomes" },
  { name: "Marae Governance", href: "/reports/marae-governance", group: "Intelligence & Outcomes" },
  { name: "Document Register", href: "/reports/document-register", group: "Intelligence & Outcomes" },
  { name: "Finance & Funding", href: "/finance", group: "Intelligence & Outcomes" },

  { name: "Activity", href: "/activity", group: "System" },
];

const groups = [
  "Overview",
  "People & Relationships",
  "Hapū, Marae & Whenua",
  "Governance Chain",
  "Library & Evidence",
  "Intelligence & Outcomes",
  "System",
];

function isActivePath(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  if (href === "/reports") return pathname === "/reports";
  if (href === "/library") return pathname === "/library";
  if (href === "/activity") return pathname === "/activity" || pathname.startsWith("/activity/");
  return pathname === href || pathname.startsWith(`${href}/`);
}

function IdentityCard() {
  return (
    <Link
      href="/"
      className="mb-6 flex items-center justify-between rounded-2xl border border-[var(--border)] bg-[var(--surface-raised)] px-4 py-3 shadow-sm transition hover:border-[var(--accent)] dark:bg-white/5"
    >
      <div>
        <p className="text-[11px] font-semibold uppercase tracking-widest text-[var(--muted-foreground)]">
          Tangata
        </p>
        <p className="mt-0.5 text-xs font-medium text-[var(--foreground)]">
          Governance OS
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
    <nav className="space-y-5">
      {groups.map((group) => (
        <div key={group}>
          <p className="mb-1.5 px-2 text-[9px] font-semibold uppercase tracking-widest text-[var(--muted-foreground)]">
            {group}
          </p>
          <div className="space-y-0.5">
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
                    className={`group flex items-center gap-2.5 rounded-lg border px-2.5 py-1.5 text-[13px] transition-colors ${
                      active
                        ? "border-[var(--border)] bg-[var(--surface-raised)] font-medium text-[var(--foreground)]"
                        : "border-transparent text-[var(--muted-foreground)] hover:border-[var(--border)] hover:bg-[var(--surface)] hover:text-[var(--foreground)]"
                    }`}
                  >
                    <Dot
                      muted={!active}
                      className={active ? "" : "opacity-40 group-hover:opacity-70"}
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
        className="fixed left-4 top-4 z-50 flex h-10 w-10 items-center justify-center rounded-xl border border-[var(--border)] bg-[var(--surface)] text-[var(--foreground)] shadow-md shadow-black/10 dark:bg-white/5 lg:hidden"
      >
        <span className="sr-only">Open navigation</span>
        <span className="space-y-[5px]">
          <span className="block h-[2px] w-5 bg-current" />
          <span className="block h-[2px] w-5 bg-current" />
          <span className="block h-[2px] w-5 bg-current" />
        </span>
      </button>

      <aside className="hidden w-60 shrink-0 border-r border-[var(--border)] bg-[var(--surface)] px-3 py-4 dark:bg-white/[0.03] lg:flex lg:flex-col">
        <IdentityCard />
        <div className="flex-1 overflow-y-auto">
          <NavGroups pathname={pathname} />
        </div>
      </aside>

      {open ? (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => setOpen(false)}
            aria-hidden="true"
          />
          <aside className="relative z-10 flex h-full w-60 flex-col border-r border-[var(--border)] bg-[var(--surface)] px-3 py-4 shadow-2xl dark:shadow-black/60">
            <div className="mb-3 flex items-center justify-end">
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-lg border border-[var(--border)] px-2.5 py-1 text-xs font-medium text-[var(--muted-foreground)] transition hover:border-[var(--accent)] hover:text-[var(--accent)]"
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
