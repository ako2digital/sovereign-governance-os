import AppShell from "@/components/layout/AppShell";
import { supabase } from "@/lib/supabaseClient";

type MaraeDetailPageProps = {
  params: Promise<{
    id: string;
  }>;
};

type MaraeRecord = {
  id: string;
  created_at?: string | null;
  name?: string | null;
  title?: string | null;
  marae_name?: string | null;
  location?: string | null;
  rohe?: string | null;
  address?: string | null;
  hapu?: string | null;
  hapū?: string | null;
  iwi?: string | null;
  description?: string | null;
  notes?: string | null;
  historical_notes?: string | null;
  status?: string | null;
  sensitivity_level?: string | null;
};

const relatedRecordLinks = [
  {
    label: "Whenua",
    description: "Land records connected to marae, whenua, and place.",
    href: "/whenua",
  },
  {
    label: "Hui",
    description: "Future hui records hosted at or connected to this marae.",
    href: "/hui",
  },
  {
    label: "Governance",
    description: "Mandates, roles, authority, and decision context.",
    href: "/governance",
  },
  {
    label: "Documents",
    description: "Photos, records, maps, minutes, and supporting files.",
    href: "/documents",
  },
];

const linkedActions = [
  {
    label: "Record hui",
    href: "/hui",
  },
  {
    label: "Attach document",
    href: "/documents",
  },
  {
    label: "Create task",
    href: "/tasks",
  },
];

function getMaraeName(record?: MaraeRecord | null) {
  if (!record) {
    return "Marae record unavailable";
  }

  return record.name || record.marae_name || record.title || "Untitled marae record";
}

function getLocation(record?: MaraeRecord | null) {
  if (!record) {
    return "Not available";
  }

  return record.location || record.rohe || record.address || "Location not recorded";
}

function getAffiliation(record?: MaraeRecord | null) {
  if (!record) {
    return "Not available";
  }

  return record.hapu || record.hapū || record.iwi || "Affiliation not recorded";
}

function getDescription(record?: MaraeRecord | null) {
  if (!record) {
    return "Not available";
  }

  return (
    record.description ||
    record.notes ||
    record.historical_notes ||
    "No description recorded."
  );
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

  if (status === "under_review") {
    return "text-stone-100";
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

export default async function MaraeDetailPage({
  params,
}: MaraeDetailPageProps) {
  const { id } = await params;

  const { data, error } = await supabase
    .from("marae_records")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  const record = data as MaraeRecord | null;

  return (
    <AppShell title="Marae Detail" eyebrow="Governance / Marae">
      <section className="grid gap-6">
        <div className="rounded-3xl border border-stone-800 bg-stone-900/60 p-8">
          <a
            href="/marae"
            className="text-sm font-medium text-stone-500 transition hover:text-white"
          >
            ← Back to Marae Records
          </a>

          <p className="mt-8 font-mono text-xs uppercase tracking-[0.3em] text-stone-500">
            Marae record
          </p>

          {error ? (
            <>
              <h1 className="mt-5 text-4xl font-semibold tracking-tight text-red-300 md:text-5xl">
                Marae record could not be loaded.
              </h1>

              <p className="mt-5 text-sm leading-7 text-red-200/80">
                {error.message}
              </p>
            </>
          ) : !record ? (
            <>
              <h1 className="mt-5 text-4xl font-semibold tracking-tight text-white md:text-5xl">
                Marae record not found.
              </h1>

              <p className="mt-5 max-w-2xl text-base leading-8 text-stone-400">
                No marae record exists for this ID. Return to the marae register
                and select an existing record.
              </p>
            </>
          ) : (
            <>
              <h1 className="mt-5 max-w-5xl text-4xl font-semibold tracking-tight text-white md:text-5xl">
                {getMaraeName(record)}
              </h1>

              <p className="mt-5 max-w-3xl text-base leading-8 text-stone-400">
                This marae record acts as a community anchor. It should later
                connect to whenua, hui, governance records, documents,
                decisions, tasks, and activity history.
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
                  Marae record fields
                </h2>
              </div>

              <div className="mt-5 grid gap-4 md:grid-cols-2">
                <div className="rounded-2xl border border-stone-800 bg-stone-950 p-5">
                  <p className="font-mono text-xs uppercase tracking-[0.2em] text-stone-600">
                    Name
                  </p>

                  <p className="mt-3 text-lg font-semibold text-stone-200">
                    {getMaraeName(record)}
                  </p>
                </div>

                <div className="rounded-2xl border border-stone-800 bg-stone-950 p-5">
                  <p className="font-mono text-xs uppercase tracking-[0.2em] text-stone-600">
                    Location
                  </p>

                  <p className="mt-3 text-lg font-semibold text-stone-200">
                    {getLocation(record)}
                  </p>
                </div>

                <div className="rounded-2xl border border-stone-800 bg-stone-950 p-5">
                  <p className="font-mono text-xs uppercase tracking-[0.2em] text-stone-600">
                    Affiliation
                  </p>

                  <p className="mt-3 text-lg font-semibold text-stone-200">
                    {getAffiliation(record)}
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
                Description / notes
              </p>

              <p className="mt-5 whitespace-pre-wrap text-sm leading-7 text-stone-400">
                {getDescription(record)}
              </p>
            </div>
          </section>

          <aside className="grid gap-6 content-start">
            <div className="rounded-3xl border border-stone-800 bg-stone-900/60 p-6">
              <p className="font-mono text-xs uppercase tracking-[0.3em] text-stone-500">
                Related records
              </p>

              <div className="mt-5 grid gap-3">
                {relatedRecordLinks.map((link) => (
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
                Activity
              </p>

              <div className="mt-5 rounded-2xl border border-stone-800 bg-stone-950 p-4">
                <p className="text-sm font-semibold text-white">
                  Marae record viewed
                </p>

                <p className="mt-1 text-xs leading-5 text-stone-600">
                  This models the future activity log for this marae record.
                </p>
              </div>
            </div>
          </aside>
        </div>
      </section>
    </AppShell>
  );
}