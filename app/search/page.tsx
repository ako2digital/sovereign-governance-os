import Link from "next/link";
import AppShell from "@/components/layout/AppShell";
import { supabase } from "@/lib/supabaseClient";

type SearchPageProps = {
  searchParams: Promise<{ q?: string; type?: string }>;
};

type SearchResult = {
  id: string;
  title: string;
  meta: string;
  href: string;
};

type ResultGroup = {
  key: string;
  label: string;
  listHref: string;
  results: SearchResult[];
};

const REGISTER_CONFIG: Record<
  string,
  { label: string; listHref: string }
> = {
  people: { label: "People", listHref: "/people" },
  whenua: { label: "Whenua", listHref: "/whenua" },
  marae: { label: "Marae", listHref: "/marae" },
  governance: { label: "Governance Records", listHref: "/governance" },
  hui: { label: "Hui", listHref: "/hui" },
  minutes: { label: "Minutes", listHref: "/minutes" },
  decisions: { label: "Decisions", listHref: "/decisions" },
  tasks: { label: "Tasks", listHref: "/tasks" },
  documents: { label: "Documents", listHref: "/documents" },
  panui: { label: "Pānui", listHref: "/panui" },
};

function safeQ(raw: string): string {
  return raw.trim().slice(0, 200);
}

async function runSearchQueries(
  q: string,
  typeFilter: string
): Promise<ResultGroup[]> {
  const lq = `%${q}%`;
  const skip = (key: string) => typeFilter !== "" && typeFilter !== key;

  const [
    peopleRes,
    whenuaRes,
    maraeRes,
    governanceRes,
    huiRes,
    minutesRes,
    decisionsRes,
    tasksRes,
    documentsRes,
    panuiRes,
  ] = await Promise.all([
    skip("people")
      ? Promise.resolve({ data: [] })
      : supabase
          .from("people")
          .select("id, full_name, preferred_name, role_title")
          .ilike("full_name", lq)
          .limit(10),

    skip("whenua")
      ? Promise.resolve({ data: [] })
      : supabase
          .from("whenua_records")
          .select("id, title, block_name, location, status")
          .ilike("title", lq)
          .limit(10),

    skip("marae")
      ? Promise.resolve({ data: [] })
      : supabase
          .from("marae_records")
          .select("id, name, title, location, status")
          .ilike("name", lq)
          .limit(10),

    skip("governance")
      ? Promise.resolve({ data: [] })
      : supabase
          .from("governance_records")
          .select("id, title, record_type, status")
          .ilike("title", lq)
          .limit(10),

    skip("hui")
      ? Promise.resolve({ data: [] })
      : supabase
          .from("hui")
          .select("id, title, location, hui_date, date, status")
          .ilike("title", lq)
          .limit(10),

    skip("minutes")
      ? Promise.resolve({ data: [] })
      : supabase
          .from("minutes")
          .select("id, title, minutes_date, date, status")
          .ilike("title", lq)
          .limit(10),

    skip("decisions")
      ? Promise.resolve({ data: [] })
      : supabase
          .from("decisions")
          .select("id, title, status, decision_date")
          .ilike("title", lq)
          .limit(10),

    skip("tasks")
      ? Promise.resolve({ data: [] })
      : supabase
          .from("tasks")
          .select("id, title, status, priority")
          .ilike("title", lq)
          .limit(10),

    skip("documents")
      ? Promise.resolve({ data: [] })
      : supabase
          .from("documents")
          .select("id, title, name, document_type, status")
          .ilike("title", lq)
          .limit(10),

    skip("panui")
      ? Promise.resolve({ data: [] })
      : supabase
          .from("panui")
          .select("id, title, status, publish_date, published_at")
          .ilike("title", lq)
          .limit(10),
  ]);

  type Row = Record<string, string | null | undefined>;

  function mapPeople(rows: Row[]): SearchResult[] {
    return rows.map((r) => ({
      id: r.id as string,
      title: (r.full_name as string) || "Unknown person",
      meta: [r.preferred_name, r.role_title].filter(Boolean).join(" · ") || "",
      href: `/people/${r.id}`,
    }));
  }

  function mapTitled(
    rows: Row[],
    route: string,
    fallbackField = "block_name",
    metaField?: string
  ): SearchResult[] {
    return rows.map((r) => ({
      id: r.id as string,
      title:
        (r.title as string) ||
        (r[fallbackField] as string) ||
        "Untitled record",
      meta: (metaField ? (r[metaField] as string) : r.status as string) || "",
      href: `/${route}/${r.id}`,
    }));
  }

  function mapMarae(rows: Row[]): SearchResult[] {
    return rows.map((r) => ({
      id: r.id as string,
      title:
        (r.name as string) || (r.title as string) || "Untitled marae record",
      meta: [(r.location as string), (r.status as string)]
        .filter(Boolean)
        .join(" · "),
      href: `/marae/${r.id}`,
    }));
  }

  function mapGovernance(rows: Row[]): SearchResult[] {
    return rows.map((r) => ({
      id: r.id as string,
      title: (r.title as string) || "Untitled governance record",
      meta: [(r.record_type as string), (r.status as string)]
        .filter(Boolean)
        .join(" · "),
      href: `/governance/${r.id}`,
    }));
  }

  const groups: ResultGroup[] = [
    {
      key: "people",
      label: "People",
      listHref: "/people",
      results: mapPeople((peopleRes.data ?? []) as Row[]),
    },
    {
      key: "whenua",
      label: "Whenua",
      listHref: "/whenua",
      results: mapTitled(
        (whenuaRes.data ?? []) as Row[],
        "whenua",
        "block_name",
        "location"
      ),
    },
    {
      key: "marae",
      label: "Marae",
      listHref: "/marae",
      results: mapMarae((maraeRes.data ?? []) as Row[]),
    },
    {
      key: "governance",
      label: "Governance Records",
      listHref: "/governance",
      results: mapGovernance((governanceRes.data ?? []) as Row[]),
    },
    {
      key: "hui",
      label: "Hui",
      listHref: "/hui",
      results: mapTitled((huiRes.data ?? []) as Row[], "hui", "purpose", "location"),
    },
    {
      key: "minutes",
      label: "Minutes",
      listHref: "/minutes",
      results: mapTitled((minutesRes.data ?? []) as Row[], "minutes", "summary"),
    },
    {
      key: "decisions",
      label: "Decisions",
      listHref: "/decisions",
      results: mapTitled(
        (decisionsRes.data ?? []) as Row[],
        "decisions",
        "decision_text"
      ),
    },
    {
      key: "tasks",
      label: "Tasks",
      listHref: "/tasks",
      results: mapTitled((tasksRes.data ?? []) as Row[], "tasks", "description", "priority"),
    },
    {
      key: "documents",
      label: "Documents",
      listHref: "/documents",
      results: mapTitled(
        (documentsRes.data ?? []) as Row[],
        "documents",
        "name",
        "document_type"
      ),
    },
    {
      key: "panui",
      label: "Pānui",
      listHref: "/panui",
      results: mapTitled((panuiRes.data ?? []) as Row[], "panui", "message"),
    },
  ];

  return groups.filter((g) => g.results.length > 0);
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const sp = await searchParams;
  const rawQ = typeof sp.q === "string" ? safeQ(sp.q) : "";
  const typeFilter = typeof sp.type === "string" ? sp.type : "";

  const groups = rawQ.length >= 2 ? await runSearchQueries(rawQ, typeFilter) : [];

  const totalResults = groups.reduce((sum, g) => sum + g.results.length, 0);
  const hasResults = groups.length > 0;
  const registersMatched = groups.length;

  function typeHref(key: string) {
    const params = new URLSearchParams({ q: rawQ });
    if (key) params.set("type", key);
    return `/search?${params.toString()}`;
  }

  return (
    <AppShell title="Search" eyebrow="Sovereign Governance OS">
      <section className="rounded-2xl border border-[var(--border)] bg-[var(--surface-raised)] p-8">
        <p className="text-xs font-medium uppercase tracking-wide text-[var(--muted-foreground)]">
          Registry Search
        </p>

        {rawQ ? (
          <>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight text-[var(--foreground)]">
              &ldquo;{rawQ}&rdquo;
            </h1>
            <p className="mt-3 text-sm text-[var(--muted-foreground)]">
              {hasResults
                ? `${totalResults} result${totalResults !== 1 ? "s" : ""} across ${registersMatched} register${registersMatched !== 1 ? "s" : ""}`
                : "No results found in any register."}
            </p>
          </>
        ) : (
          <>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight text-[var(--foreground)]">
              Search all registers
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-[var(--muted-foreground)]">
              Search across people, whenua, marae, governance records, hui,
              minutes, decisions, tasks, documents, and pānui in a single
              query.
            </p>
          </>
        )}
      </section>

      {/* Search form */}
      <section className="mt-6 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6">
        <form action="/search" method="GET" className="flex items-center gap-3">
          <div className="relative flex-1">
            <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--muted-foreground)]">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path
                  d="M10.5 10.5L14 14M6.5 12a5.5 5.5 0 1 0 0-11 5.5 5.5 0 0 0 0 11Z"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
            </span>
            <input
              type="search"
              name="q"
              defaultValue={rawQ}
              autoFocus
              placeholder="Search by title, name, or keyword…"
              className="h-11 w-full rounded-xl border border-[var(--border)] bg-[var(--surface-raised)] pl-10 pr-4 text-sm text-[var(--foreground)] outline-none transition placeholder:text-[var(--muted-foreground)] focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)]"
            />
          </div>
          <button
            type="submit"
            className="h-11 shrink-0 rounded-xl bg-[var(--foreground)] px-6 text-sm font-semibold text-[var(--background)] transition hover:opacity-90"
          >
            Search
          </button>
        </form>
      </section>

      {/* Type filter chips */}
      {rawQ && hasResults && (
        <section className="mt-5 flex flex-wrap gap-2">
          <Link
            href={typeHref("")}
            className={`rounded-full border px-3 py-1.5 text-xs font-medium transition ${
              !typeFilter
                ? "border-[var(--accent)] bg-[var(--accent)] text-[var(--background)]"
                : "border-[var(--border)] text-[var(--muted-foreground)] hover:border-[var(--accent)] hover:text-[var(--accent)]"
            }`}
          >
            All ({totalResults})
          </Link>
          {groups.map((g) => (
            <Link
              key={g.key}
              href={typeHref(g.key)}
              className={`rounded-full border px-3 py-1.5 text-xs font-medium transition ${
                typeFilter === g.key
                  ? "border-[var(--accent)] bg-[var(--accent)] text-[var(--background)]"
                  : "border-[var(--border)] text-[var(--muted-foreground)] hover:border-[var(--accent)] hover:text-[var(--accent)]"
              }`}
            >
              {g.label} ({g.results.length})
            </Link>
          ))}
        </section>
      )}

      {/* Results */}
      {rawQ && !hasResults && rawQ.length >= 2 && (
        <section className="mt-8 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-10 text-center">
          <p className="text-base font-semibold text-[var(--foreground)]">
            No results for &ldquo;{rawQ}&rdquo;
          </p>
          <p className="mt-2 text-sm text-[var(--muted-foreground)]">
            Try a different spelling, a shorter keyword, or a broader term. Search
            matches on record titles and names only.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            {Object.entries(REGISTER_CONFIG).map(([key, cfg]) => (
              <Link
                key={key}
                href={cfg.listHref}
                className="rounded-xl border border-[var(--border)] px-4 py-2 text-sm font-medium text-[var(--muted-foreground)] transition hover:border-[var(--accent)] hover:text-[var(--accent)]"
              >
                Browse {cfg.label}
              </Link>
            ))}
          </div>
        </section>
      )}

      {rawQ.length === 1 && (
        <section className="mt-8 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-8 text-center">
          <p className="text-sm text-[var(--muted-foreground)]">
            Enter at least 2 characters to search.
          </p>
        </section>
      )}

      {rawQ && hasResults && (
        <div className="mt-8 space-y-8">
          {groups.map((group) => (
            <section
              key={group.key}
              className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6"
            >
              <div className="flex items-center justify-between gap-4">
                <h2 className="text-base font-semibold text-[var(--foreground)]">
                  {group.label}
                  <span className="ml-2 text-sm font-normal text-[var(--muted-foreground)]">
                    {group.results.length} result
                    {group.results.length !== 1 ? "s" : ""}
                  </span>
                </h2>
                <Link
                  href={group.listHref}
                  className="shrink-0 text-xs font-medium text-[var(--muted-foreground)] transition hover:text-[var(--accent)]"
                >
                  View register →
                </Link>
              </div>

              <div className="mt-4 divide-y divide-[var(--border)]">
                {group.results.map((result) => (
                  <Link
                    key={result.id}
                    href={result.href}
                    className="group flex items-start justify-between gap-4 py-3 transition first:pt-0 last:pb-0 hover:opacity-80"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-[var(--foreground)]">
                        {result.title}
                      </p>
                      {result.meta && (
                        <p className="mt-0.5 truncate text-xs text-[var(--muted-foreground)]">
                          {result.meta}
                        </p>
                      )}
                    </div>
                    <span className="mt-0.5 shrink-0 text-xs text-[var(--muted-foreground)] transition group-hover:text-[var(--accent)]">
                      →
                    </span>
                  </Link>
                ))}
              </div>
            </section>
          ))}
        </div>
      )}

      {!rawQ && (
        <section className="mt-8 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-8">
          <h2 className="text-base font-semibold text-[var(--foreground)]">
            Registers
          </h2>
          <p className="mt-1 text-sm text-[var(--muted-foreground)]">
            Or browse directly:
          </p>
          <div className="mt-5 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {Object.entries(REGISTER_CONFIG).map(([key, cfg]) => (
              <Link
                key={key}
                href={cfg.listHref}
                className="flex items-center justify-between rounded-xl border border-[var(--border)] bg-[var(--surface-raised)] px-4 py-3 text-sm font-medium text-[var(--foreground)] transition hover:border-[var(--accent)] hover:text-[var(--accent)]"
              >
                {cfg.label}
                <span className="text-[var(--muted-foreground)]">→</span>
              </Link>
            ))}
          </div>
        </section>
      )}
    </AppShell>
  );
}
