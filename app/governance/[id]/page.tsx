import AppShell from "@/components/layout/AppShell";
import { supabase } from "@/lib/supabaseClient";

type GovernanceDetailPageProps = {
  params: Promise<{
    id: string;
  }>;
};

type GovernanceRecord = {
  id: string;
  created_at?: string | null;
  title?: string | null;
  name?: string | null;
  governance_title?: string | null;
  record_type?: string | null;
  type?: string | null;
  category?: string | null;
  summary?: string | null;
  description?: string | null;
  notes?: string | null;
  mandate?: string | null;
  status?: string | null;
  effective_date?: string | null;
  sensitivity_level?: string | null;
  related_marae_id?: string | null;
  related_whenua_id?: string | null;
};

type MaraeRecord = {
  id: string;
  name?: string | null;
  title?: string | null;
  marae_name?: string | null;
  location?: string | null;
  description?: string | null;
};

type WhenuaRecord = {
  id: string;
  title?: string | null;
  block_name?: string | null;
  location?: string | null;
  status?: string | null;
};

function getTitle(record?: GovernanceRecord | null) {
  if (!record) {
    return "Governance record unavailable";
  }

  return (
    record.title ||
    record.governance_title ||
    record.name ||
    "Untitled governance record"
  );
}

function getType(record?: GovernanceRecord | null) {
  if (!record) {
    return "Not available";
  }

  return record.record_type || record.type || record.category || "Governance";
}

function getSummary(record?: GovernanceRecord | null) {
  if (!record) {
    return "Not available";
  }

  return (
    record.summary ||
    record.description ||
    record.mandate ||
    record.notes ||
    "No summary recorded."
  );
}

function getMaraeName(record?: MaraeRecord | null) {
  if (!record) {
    return "No marae linked";
  }

  return record.name || record.marae_name || record.title || "Untitled marae";
}

function getWhenuaName(record?: WhenuaRecord | null) {
  if (!record) {
    return "No whenua linked";
  }

  return record.title || record.block_name || "Untitled whenua";
}

function formatDate(date?: string | null) {
  if (!date) {
    return "Date unavailable";
  }

  return new Date(date).toLocaleDateString("en-NZ", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function formatValue(value?: string | null) {
  if (!value) {
    return "Not recorded";
  }

  return value;
}

function statusClass(status?: string | null) {
  if (status === "active") {
    return "text-green-400";
  }

  if (status === "draft") {
    return "text-stone-100";
  }

  if (status === "under_review") {
    return "text-yellow-300";
  }

  if (status === "archived") {
    return "text-stone-500";
  }

  return "text-stone-300";
}

function sensitivityClass(level?: string | null) {
  if (level === "restricted") {
    return "text-red-300";
  }

  if (level === "sensitive") {
    return "text-yellow-300";
  }

  return "text-stone-300";
}

export default async function GovernanceDetailPage({
  params,
}: GovernanceDetailPageProps) {
  const { id } = await params;

  const { data, error } = await supabase
    .from("governance_records")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  const record = data as GovernanceRecord | null;

  let relatedMarae: MaraeRecord | null = null;
  let relatedWhenua: WhenuaRecord | null = null;
  let relationError = "";

  if (record?.related_marae_id) {
    const maraeResult = await supabase
      .from("marae_records")
      .select("*")
      .eq("id", record.related_marae_id)
      .maybeSingle();

    if (maraeResult.error) {
      relationError = maraeResult.error.message;
    } else {
      relatedMarae = maraeResult.data as MaraeRecord | null;
    }
  }

  if (record?.related_whenua_id) {
    const whenuaResult = await supabase
      .from("whenua_records")
      .select("id, title, block_name, location, status")
      .eq("id", record.related_whenua_id)
      .maybeSingle();

    if (whenuaResult.error) {
      relationError = whenuaResult.error.message;
    } else {
      relatedWhenua = whenuaResult.data as WhenuaRecord | null;
    }
  }

  const linkedActions = [
    {
      label: "Create linked hui",
      href: `/hui/new?governance_id=${id}`,
    },
    {
      label: "Create decision",
      href: `/decisions/new?governance_id=${id}`,
    },
    {
      label: "Attach document",
      href: `/documents/new?governance_id=${id}`,
    },
    {
      label: "Create task",
      href: `/tasks/new?governance_id=${id}`,
    },
  ];

  const futureRelatedRecords = [
    {
      label: "Hui",
      description: "Future hui connected to this governance record.",
      href: `/hui?governance_id=${id}`,
    },
    {
      label: "Minutes",
      description: "Future minutes created from linked hui.",
      href: `/minutes?governance_id=${id}`,
    },
    {
      label: "Decisions",
      description: "Future decisions created from this governance record.",
      href: `/decisions?governance_id=${id}`,
    },
    {
      label: "Documents",
      description: "Future documents and evidence attached to this record.",
      href: `/documents?governance_id=${id}`,
    },
    {
      label: "Tasks",
      description: "Future actionables created from this governance record.",
      href: `/tasks?governance_id=${id}`,
    },
    {
      label: "Activity",
      description: "Future audit trail for this governance record.",
      href: `/activity?governance_id=${id}`,
    },
  ];

  return (
    <AppShell title="Governance Detail" eyebrow="Governance / Record Detail">
      <section className="grid gap-6">
        <div className="rounded-3xl border border-stone-800 bg-stone-900/60 p-8">
          <a
            href="/governance"
            className="text-sm font-medium text-stone-500 transition hover:text-white"
          >
            ← Back to Governance Records
          </a>

          <p className="mt-8 font-mono text-xs uppercase tracking-[0.3em] text-stone-500">
            Governance record
          </p>

          {error ? (
            <>
              <h1 className="mt-5 text-4xl font-semibold tracking-tight text-red-300 md:text-5xl">
                Governance record could not be loaded.
              </h1>

              <p className="mt-5 text-sm leading-7 text-red-200/80">
                {error.message}
              </p>
            </>
          ) : !record ? (
            <>
              <h1 className="mt-5 text-4xl font-semibold tracking-tight text-white md:text-5xl">
                Governance record not found.
              </h1>

              <p className="mt-5 max-w-2xl text-base leading-8 text-stone-400">
                No governance record exists for this ID. Return to the
                governance register and select an existing record.
              </p>
            </>
          ) : (
            <>
              <h1 className="mt-5 max-w-5xl text-4xl font-semibold tracking-tight text-white md:text-5xl">
                {getTitle(record)}
              </h1>

              <p className="mt-5 max-w-3xl text-base leading-8 text-stone-400">
                This governance record is an authority anchor. It should connect
                to marae, whenua, hui, minutes, decisions, documents, tasks, and
                activity history.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                {linkedActions.map((action, index) => (
                  <a
                    key={action.label}
                    href={action.href}
                    className={`rounded-full px-5 py-3 text-sm font-semibold transition ${
                      index === 0
                        ? "bg-stone-100 text-stone-950 hover:bg-white"
                        : "border border-stone-700 text-stone-300 hover:border-stone-500 hover:text-white"
                    }`}
                  >
                    {action.label}
                  </a>
                ))}
              </div>
            </>
          )}
        </div>

        <div className="grid gap-6 xl:grid-cols-[1fr_420px]">
          <section className="grid gap-6">
            <div className="rounded-3xl border border-stone-800 bg-stone-900/60 p-6">
              <div className="border-b border-stone-800 pb-5">
                <p className="font-mono text-xs uppercase tracking-[0.3em] text-stone-500">
                  Core details
                </p>

                <h2 className="mt-3 text-2xl font-semibold tracking-tight text-white">
                  Governance record fields
                </h2>
              </div>

              <div className="mt-5 grid gap-4 md:grid-cols-2">
                <div className="rounded-2xl border border-stone-800 bg-stone-950 p-5">
                  <p className="font-mono text-xs uppercase tracking-[0.2em] text-stone-600">
                    Title
                  </p>

                  <p className="mt-3 text-lg font-semibold text-stone-200">
                    {getTitle(record)}
                  </p>
                </div>

                <div className="rounded-2xl border border-stone-800 bg-stone-950 p-5">
                  <p className="font-mono text-xs uppercase tracking-[0.2em] text-stone-600">
                    Record type
                  </p>

                  <p className="mt-3 text-lg font-semibold text-stone-200">
                    {getType(record)}
                  </p>
                </div>

                <div className="rounded-2xl border border-stone-800 bg-stone-950 p-5">
                  <p className="font-mono text-xs uppercase tracking-[0.2em] text-stone-600">
                    Status
                  </p>

                  <p
                    className={`mt-3 text-lg font-semibold ${statusClass(
                      record?.status
                    )}`}
                  >
                    {formatValue(record?.status)}
                  </p>
                </div>

                <div className="rounded-2xl border border-stone-800 bg-stone-950 p-5">
                  <p className="font-mono text-xs uppercase tracking-[0.2em] text-stone-600">
                    Sensitivity
                  </p>

                  <p
                    className={`mt-3 text-lg font-semibold ${sensitivityClass(
                      record?.sensitivity_level
                    )}`}
                  >
                    {formatValue(record?.sensitivity_level)}
                  </p>
                </div>

                <div className="rounded-2xl border border-stone-800 bg-stone-950 p-5">
                  <p className="font-mono text-xs uppercase tracking-[0.2em] text-stone-600">
                    Effective date
                  </p>

                  <p className="mt-3 text-lg font-semibold text-stone-200">
                    {formatDate(record?.effective_date)}
                  </p>
                </div>

                <div className="rounded-2xl border border-stone-800 bg-stone-950 p-5">
                  <p className="font-mono text-xs uppercase tracking-[0.2em] text-stone-600">
                    Created
                  </p>

                  <p className="mt-3 text-lg font-semibold text-stone-200">
                    {formatDate(record?.created_at)}
                  </p>
                </div>

                <div className="rounded-2xl border border-stone-800 bg-stone-950 p-5 md:col-span-2">
                  <p className="font-mono text-xs uppercase tracking-[0.2em] text-stone-600">
                    Record ID
                  </p>

                  <p className="mt-3 break-all font-mono text-sm text-stone-300">
                    {id}
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-stone-800 bg-stone-900/60 p-6">
              <p className="font-mono text-xs uppercase tracking-[0.3em] text-stone-500">
                Summary / mandate
              </p>

              <p className="mt-5 whitespace-pre-wrap text-sm leading-7 text-stone-400">
                {getSummary(record)}
              </p>
            </div>

            <div className="rounded-3xl border border-stone-800 bg-stone-900/60 p-6">
              <div className="border-b border-stone-800 pb-5">
                <p className="font-mono text-xs uppercase tracking-[0.3em] text-stone-500">
                  Direct related records
                </p>

                <h2 className="mt-3 text-2xl font-semibold tracking-tight text-white">
                  Linked marae and whenua
                </h2>
              </div>

              {relationError ? (
                <div className="mt-5 rounded-2xl border border-red-500/30 bg-red-500/10 p-5">
                  <p className="font-semibold text-red-300">
                    Related record lookup failed.
                  </p>

                  <p className="mt-3 text-sm leading-7 text-red-200/80">
                    {relationError}
                  </p>
                </div>
              ) : null}

              <div className="mt-5 grid gap-4 md:grid-cols-2">
                <div className="rounded-2xl border border-stone-800 bg-stone-950 p-5">
                  <p className="font-mono text-xs uppercase tracking-[0.2em] text-stone-600">
                    Related marae
                  </p>

                  {relatedMarae ? (
                    <>
                      <a
                        href={`/marae/${relatedMarae.id}`}
                        className="mt-3 block text-lg font-semibold text-stone-200 underline decoration-stone-700 underline-offset-4 transition hover:text-white hover:decoration-white"
                      >
                        {getMaraeName(relatedMarae)}
                      </a>

                      <p className="mt-2 text-sm text-stone-600">
                        {relatedMarae.location || "Location not recorded"}
                      </p>
                    </>
                  ) : (
                    <p className="mt-3 text-sm text-stone-500">
                      No marae linked to this governance record.
                    </p>
                  )}
                </div>

                <div className="rounded-2xl border border-stone-800 bg-stone-950 p-5">
                  <p className="font-mono text-xs uppercase tracking-[0.2em] text-stone-600">
                    Related whenua
                  </p>

                  {relatedWhenua ? (
                    <>
                      <a
                        href={`/whenua/${relatedWhenua.id}`}
                        className="mt-3 block text-lg font-semibold text-stone-200 underline decoration-stone-700 underline-offset-4 transition hover:text-white hover:decoration-white"
                      >
                        {getWhenuaName(relatedWhenua)}
                      </a>

                      <p className="mt-2 text-sm text-stone-600">
                        {relatedWhenua.location || "Location not recorded"}
                      </p>
                    </>
                  ) : (
                    <p className="mt-3 text-sm text-stone-500">
                      No whenua linked to this governance record.
                    </p>
                  )}
                </div>
              </div>
            </div>
          </section>

          <aside className="grid gap-6 content-start">
            <div className="rounded-3xl border border-stone-800 bg-stone-900/60 p-6">
              <p className="font-mono text-xs uppercase tracking-[0.3em] text-stone-500">
                Related records
              </p>

              <div className="mt-5 grid gap-3">
                {futureRelatedRecords.map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    className="rounded-2xl border border-stone-800 bg-stone-950 p-4 transition hover:border-stone-600 hover:bg-stone-900"
                  >
                    <p className="text-sm font-semibold text-white">
                      {link.label}
                    </p>

                    <p className="mt-1 text-xs leading-5 text-stone-600">
                      {link.description}
                    </p>
                  </a>
                ))}
              </div>
            </div>

            <div className="rounded-3xl border border-stone-800 bg-stone-900/60 p-6">
              <p className="font-mono text-xs uppercase tracking-[0.3em] text-stone-500">
                Linked actions
              </p>

              <div className="mt-5 grid gap-3">
                {linkedActions.map((action) => (
                  <a
                    key={action.label}
                    href={action.href}
                    className="rounded-2xl border border-stone-800 bg-stone-950 p-4 text-sm font-semibold text-stone-300 transition hover:border-stone-600 hover:bg-stone-900 hover:text-white"
                  >
                    {action.label}
                  </a>
                ))}
              </div>
            </div>

            <div className="rounded-3xl border border-stone-800 bg-stone-900/60 p-6">
              <p className="font-mono text-xs uppercase tracking-[0.3em] text-stone-500">
                Activity
              </p>

              <div className="mt-5 rounded-2xl border border-stone-800 bg-stone-950 p-4">
                <p className="text-sm font-semibold text-white">
                  Governance record viewed
                </p>

                <p className="mt-1 text-xs leading-5 text-stone-600">
                  This models the future activity log for this governance
                  record.
                </p>
              </div>
            </div>
          </aside>
        </div>
      </section>
    </AppShell>
  );
}