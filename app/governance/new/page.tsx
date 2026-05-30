"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import AppShell from "@/components/layout/AppShell";
import { supabase } from "@/lib/supabaseClient";

type MaraeRecord = {
  id: string;
  name: string | null;
};

type WhenuaRecord = {
  id: string;
  title: string | null;
};

const futureLinks = [
  "Linked hui records",
  "Meeting minutes",
  "Governance decisions",
  "Supporting documents",
  "Follow-up tasks",
  "Governance activity history",
];

export default function NewGovernanceRecordPage() {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [recordType, setRecordType] = useState("policy");
  const [summary, setSummary] = useState("");
  const [status, setStatus] = useState("active");
  const [effectiveDate, setEffectiveDate] = useState("");
  const [relatedMaraeId, setRelatedMaraeId] = useState("");
  const [relatedWhenuaId, setRelatedWhenuaId] = useState("");

  const [maraeRecords, setMaraeRecords] = useState<MaraeRecord[]>([]);
  const [whenuaRecords, setWhenuaRecords] = useState<WhenuaRecord[]>([]);

  const [isLoadingRelations, setIsLoadingRelations] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    async function loadRelations() {
      setIsLoadingRelations(true);
      setErrorMessage("");

      const [maraeResult, whenuaResult] = await Promise.all([
        supabase.from("marae_records").select("id, name").order("name"),
        supabase.from("whenua_records").select("id, title").order("title"),
      ]);

      if (maraeResult.error) {
        setErrorMessage(maraeResult.error.message);
        setIsLoadingRelations(false);
        return;
      }

      if (whenuaResult.error) {
        setErrorMessage(whenuaResult.error.message);
        setIsLoadingRelations(false);
        return;
      }

      setMaraeRecords((maraeResult.data ?? []) as MaraeRecord[]);
      setWhenuaRecords((whenuaResult.data ?? []) as WhenuaRecord[]);
      setIsLoadingRelations(false);
    }

    loadRelations();
  }, []);

  const selectedMarae = useMemo(() => {
    return maraeRecords.find((record) => record.id === relatedMaraeId) ?? null;
  }, [maraeRecords, relatedMaraeId]);

  const selectedWhenua = useMemo(() => {
    return whenuaRecords.find((record) => record.id === relatedWhenuaId) ?? null;
  }, [whenuaRecords, relatedWhenuaId]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMessage("");

    if (!title.trim()) {
      setErrorMessage("Title is required.");
      return;
    }

    setIsSubmitting(true);

    const { error } = await supabase.from("governance_records").insert({
      title: title.trim(),
      record_type: recordType.trim() || null,
      summary: summary.trim() || null,
      status,
      effective_date: effectiveDate || null,
      related_marae_id: relatedMaraeId || null,
      related_whenua_id: relatedWhenuaId || null,
    });

    setIsSubmitting(false);

    if (error) {
      setErrorMessage(error.message);
      return;
    }

    router.push("/governance");
    router.refresh();
  }

  return (
    <AppShell title="Add Governance Record" eyebrow="Governance / Records">
      <section className="grid gap-6">
        <div className="rounded-3xl border border-stone-800 bg-stone-900/60 p-8">
          <a
            href="/governance"
            className="text-sm font-medium text-stone-500 transition hover:text-white"
          >
            ← Back to Governance Records
          </a>

          <p className="mt-8 font-mono text-xs uppercase tracking-[0.3em] text-stone-500">
            New governance record
          </p>

          <h1 className="mt-5 max-w-5xl text-4xl font-semibold tracking-tight text-white md:text-5xl">
            Create an authority, mandate, policy, or governance context record.
          </h1>

          <p className="mt-5 max-w-3xl text-base leading-8 text-stone-400">
            A governance record should not sit alone. Link it to marae and
            whenua now, then connect hui, minutes, decisions, documents, tasks,
            and activity history as the system expands.
          </p>
        </div>

        <div className="grid gap-6 xl:grid-cols-[1fr_420px]">
          <form
            onSubmit={handleSubmit}
            className="rounded-3xl border border-stone-800 bg-stone-900/60 p-8"
          >
            <div className="border-b border-stone-800 pb-6">
              <p className="font-mono text-xs uppercase tracking-[0.3em] text-stone-500">
                Core details
              </p>

              <h2 className="mt-3 text-2xl font-semibold tracking-tight text-white">
                Define the governance record and its direct links.
              </h2>
            </div>

            <div className="mt-6 grid gap-6">
              <label className="grid gap-3">
                <span className="text-sm font-semibold text-stone-300">
                  Title <span className="text-red-300">*</span>
                </span>

                <input
                  value={title}
                  onChange={(event) => setTitle(event.target.value)}
                  required
                  placeholder="Example: Hapū Data Management Mandate"
                  className="rounded-2xl border border-stone-700 bg-stone-950 px-5 py-4 text-stone-100 outline-none transition placeholder:text-stone-600 focus:border-stone-400"
                />
              </label>

              <div className="grid gap-5 md:grid-cols-2">
                <label className="grid gap-3">
                  <span className="text-sm font-semibold text-stone-300">
                    Record type
                  </span>

                  <select
                    value={recordType}
                    onChange={(event) => setRecordType(event.target.value)}
                    className="rounded-2xl border border-stone-700 bg-stone-950 px-5 py-4 text-stone-100 outline-none transition focus:border-stone-400"
                  >
                    <option value="policy">Policy</option>
                    <option value="mandate">Mandate</option>
                    <option value="resolution">Resolution</option>
                    <option value="trust_deed">Trust deed</option>
                    <option value="committee_record">Committee record</option>
                    <option value="authority_record">Authority record</option>
                    <option value="other">Other</option>
                  </select>
                </label>

                <label className="grid gap-3">
                  <span className="text-sm font-semibold text-stone-300">
                    Effective date
                  </span>

                  <input
                    type="date"
                    value={effectiveDate}
                    onChange={(event) => setEffectiveDate(event.target.value)}
                    className="rounded-2xl border border-stone-700 bg-stone-950 px-5 py-4 text-stone-100 outline-none transition focus:border-stone-400"
                  />
                </label>
              </div>

              <div className="grid gap-5 md:grid-cols-2">
                <label className="grid gap-3">
                  <span className="text-sm font-semibold text-stone-300">
                    Related marae
                  </span>

                  <select
                    value={relatedMaraeId}
                    onChange={(event) => setRelatedMaraeId(event.target.value)}
                    disabled={isLoadingRelations}
                    className="rounded-2xl border border-stone-700 bg-stone-950 px-5 py-4 text-stone-100 outline-none transition focus:border-stone-400 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    <option value="">
                      {isLoadingRelations ? "Loading marae..." : "None"}
                    </option>

                    {maraeRecords.map((record) => (
                      <option key={record.id} value={record.id}>
                        {record.name || "Untitled marae record"}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="grid gap-3">
                  <span className="text-sm font-semibold text-stone-300">
                    Related whenua
                  </span>

                  <select
                    value={relatedWhenuaId}
                    onChange={(event) => setRelatedWhenuaId(event.target.value)}
                    disabled={isLoadingRelations}
                    className="rounded-2xl border border-stone-700 bg-stone-950 px-5 py-4 text-stone-100 outline-none transition focus:border-stone-400 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    <option value="">
                      {isLoadingRelations ? "Loading whenua..." : "None"}
                    </option>

                    {whenuaRecords.map((record) => (
                      <option key={record.id} value={record.id}>
                        {record.title || "Untitled whenua record"}
                      </option>
                    ))}
                  </select>
                </label>
              </div>

              <label className="grid gap-3">
                <span className="text-sm font-semibold text-stone-300">
                  Status
                </span>

                <select
                  value={status}
                  onChange={(event) => setStatus(event.target.value)}
                  className="rounded-2xl border border-stone-700 bg-stone-950 px-5 py-4 text-stone-100 outline-none transition focus:border-stone-400"
                >
                  <option value="active">Active</option>
                  <option value="draft">Draft</option>
                  <option value="under_review">Under review</option>
                  <option value="archived">Archived</option>
                </select>
              </label>

              <label className="grid gap-3">
                <span className="text-sm font-semibold text-stone-300">
                  Summary / mandate
                </span>

                <textarea
                  value={summary}
                  onChange={(event) => setSummary(event.target.value)}
                  placeholder="Add policy, mandate, authority, resolution, responsibility, or governance context."
                  className="min-h-40 rounded-2xl border border-stone-700 bg-stone-950 px-5 py-4 text-stone-100 outline-none transition placeholder:text-stone-600 focus:border-stone-400"
                />
              </label>

              <div className="rounded-2xl border border-stone-800 bg-stone-950 p-5">
                <p className="font-mono text-xs uppercase tracking-[0.25em] text-stone-600">
                  Current schema
                </p>

                <p className="mt-3 text-sm leading-7 text-stone-500">
                  This form writes the current governance columns: title,
                  record_type, summary, status, effective_date,
                  related_marae_id, and related_whenua_id.
                </p>
              </div>

              {errorMessage ? (
                <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-5">
                  <p className="font-semibold text-red-300">
                    Could not create governance record.
                  </p>

                  <p className="mt-3 text-sm leading-7 text-red-200/80">
                    {errorMessage}
                  </p>
                </div>
              ) : null}

              <div className="flex flex-wrap gap-3">
                <button
                  type="submit"
                  disabled={isSubmitting || isLoadingRelations}
                  className="rounded-full bg-stone-100 px-6 py-3 text-sm font-semibold text-stone-950 transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isSubmitting ? "Saving..." : "Create Governance Record"}
                </button>

                <button
                  type="button"
                  onClick={() => router.push("/governance")}
                  className="rounded-full border border-stone-700 px-6 py-3 text-sm font-semibold text-stone-300 transition hover:border-stone-500 hover:text-white"
                >
                  Cancel
                </button>
              </div>
            </div>
          </form>

          <aside className="grid gap-6 content-start">
            <div className="rounded-3xl border border-stone-800 bg-stone-900/60 p-6">
              <p className="font-mono text-xs uppercase tracking-[0.3em] text-stone-500">
                Direct related records
              </p>

              <div className="mt-5 grid gap-3">
                <div className="rounded-2xl border border-stone-800 bg-stone-950 p-4">
                  <p className="font-mono text-xs uppercase tracking-[0.2em] text-stone-600">
                    Related marae
                  </p>

                  {selectedMarae ? (
                    <a
                      href={`/marae/${selectedMarae.id}`}
                      className="mt-3 block text-sm font-semibold text-stone-200 underline decoration-stone-700 underline-offset-4 transition hover:text-white hover:decoration-white"
                    >
                      {selectedMarae.name || selectedMarae.id}
                    </a>
                  ) : (
                    <p className="mt-3 text-sm text-stone-500">
                      No marae selected.
                    </p>
                  )}
                </div>

                <div className="rounded-2xl border border-stone-800 bg-stone-950 p-4">
                  <p className="font-mono text-xs uppercase tracking-[0.2em] text-stone-600">
                    Related whenua
                  </p>

                  {selectedWhenua ? (
                    <a
                      href={`/whenua/${selectedWhenua.id}`}
                      className="mt-3 block text-sm font-semibold text-stone-200 underline decoration-stone-700 underline-offset-4 transition hover:text-white hover:decoration-white"
                    >
                      {selectedWhenua.title || selectedWhenua.id}
                    </a>
                  ) : (
                    <p className="mt-3 text-sm text-stone-500">
                      No whenua selected.
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-stone-800 bg-stone-900/60 p-6">
              <p className="font-mono text-xs uppercase tracking-[0.3em] text-stone-500">
                Future related records
              </p>

              <div className="mt-5 grid gap-3">
                {futureLinks.map((item) => (
                  <div
                    key={item}
                    className="rounded-2xl border border-stone-800 bg-stone-950 p-4"
                  >
                    <p className="text-sm font-semibold text-white">{item}</p>

                    <p className="mt-1 text-xs leading-5 text-stone-600">
                      Available after the governance record exists.
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-3xl border border-stone-800 bg-stone-900/60 p-6">
              <p className="font-mono text-xs uppercase tracking-[0.3em] text-stone-500">
                Record flow
              </p>

              <p className="mt-5 text-sm leading-7 text-stone-400">
                Create the governance record first. Then connect it to hui,
                minutes, decisions, documents, tasks, and the future activity
                log.
              </p>
            </div>

            <div className="rounded-3xl border border-stone-800 bg-stone-900/60 p-6">
              <p className="font-mono text-xs uppercase tracking-[0.3em] text-stone-500">
                Linked actions
              </p>

              <div className="mt-5 grid gap-3">
                <a
                  href="/marae"
                  className="rounded-2xl border border-stone-800 bg-stone-950 p-4 text-sm font-semibold text-stone-300 transition hover:border-stone-600 hover:bg-stone-900 hover:text-white"
                >
                  View Marae
                </a>

                <a
                  href="/whenua"
                  className="rounded-2xl border border-stone-800 bg-stone-950 p-4 text-sm font-semibold text-stone-300 transition hover:border-stone-600 hover:bg-stone-900 hover:text-white"
                >
                  View Whenua
                </a>

                <a
                  href="/decisions"
                  className="rounded-2xl border border-stone-800 bg-stone-950 p-4 text-sm font-semibold text-stone-300 transition hover:border-stone-600 hover:bg-stone-900 hover:text-white"
                >
                  View Decisions
                </a>
              </div>
            </div>
          </aside>
        </div>
      </section>
    </AppShell>
  );
}