"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

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
      className="mb-8 flex items-center justify-between rounded-2xl border border-stone-700/80 bg-gradient-to-br from-stone-900 to-stone-950 px-4 py-4 shadow-lg shadow-black/30 transition hover:border-stone-600"
    >
      <div>
        <p className="font-mono text-xs uppercase tracking-[0.25em] text-stone-500">
          Sovereign OS
        </p>

        <p className="mt-1 text-sm font-semibold text-white">
          Governance Registry
        </p>
      </div>

      <span className="flex items-center gap-1.5 rounded-full border border-green-900 bg-green-950/40 px-3 py-1 font-mono text-[11px] text-green-400">
        <span className="h-1.5 w-1.5 rounded-full bg-green-400" />
        Live
      </span>
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
          <p className="mb-3 px-3 font-mono text-[11px] uppercase tracking-[0.25em] text-stone-600">
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
                    className={`group flex items-center justify-between rounded-xl border px-3 py-2.5 text-sm transition ${
                      active
                        ? "border-stone-700 bg-stone-800/80 text-white shadow-sm shadow-black/30"
                        : "border-transparent text-stone-400 hover:border-stone-800 hover:bg-stone-900 hover:text-white"
                    }`}
                  >
                    <span className="flex items-center gap-3">
                      <span
                        className={`h-1.5 w-1.5 rounded-full transition ${
                          active
                            ? "bg-green-400"
                            : "bg-stone-700 group-hover:bg-stone-400"
                        }`}
                      />
                      {item.name}
                    </span>

                    {active ? (
                      <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-green-400">
                        Active
                      </span>
                    ) : null}
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
        className="fixed left-4 top-4 z-50 flex h-11 w-11 items-center justify-center rounded-xl border border-stone-700 bg-stone-950/90 text-stone-200 shadow-lg shadow-black/40 lg:hidden"
      >
        <span className="sr-only">Open navigation</span>
        <span className="space-y-1">
          <span className="block h-0.5 w-5 bg-stone-200" />
          <span className="block h-0.5 w-5 bg-stone-200" />
          <span className="block h-0.5 w-5 bg-stone-200" />
        </span>
      </button>

      <aside className="hidden w-72 shrink-0 border-r border-stone-800 bg-stone-950/90 px-5 py-5 lg:block">
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

          <aside className="relative z-10 flex h-full w-72 flex-col border-r border-stone-800 bg-stone-950 px-5 py-5 shadow-2xl shadow-black/60">
            <div className="mb-4 flex items-center justify-end">
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close navigation"
                className="rounded-lg border border-stone-700 px-3 py-1.5 text-xs font-medium text-stone-300 transition hover:border-stone-500 hover:text-white"
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
