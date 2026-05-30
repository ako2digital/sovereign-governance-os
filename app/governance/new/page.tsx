"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AppShell from "@/components/layout/AppShell";
import { supabase } from "@/lib/supabaseClient";

type MaraeRecord = {
  id: string;
  name: string;
};

type WhenuaRecord = {
  id: string;
  title: string;
};

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
    <AppShell title="Add Governance Record" eyebrow="Governance Module">
      <section className="rounded-3xl border border-stone-800 bg-stone-900/50 p-8">
        <p className="text-xs uppercase tracking-[0.25em] text-stone-500">
          Create Governance Record
        </p>

        <h1 className="mt-3 text-3xl font-semibold text-white">
          Add Governance Record
        </h1>

        <p className="mt-4 max-w-2xl text-stone-400">
          Create a governance record that can connect to marae, whenua, hui,
          minutes, decisions, documents, and tasks.
        </p>
      </section>

      <form
        onSubmit={handleSubmit}
        className="mt-8 max-w-3xl rounded-2xl border border-stone-800 bg-stone-900 p-6"
      >
        <div className="grid gap-5">
          <label className="grid gap-2">
            <span className="text-sm font-medium text-stone-200">Title</span>
            <input
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              className="rounded-xl border border-stone-700 bg-stone-950 px-4 py-3 text-stone-100 outline-none focus:border-stone-500"
              placeholder="Example: Test Governance Record"
            />
          </label>

          <div className="grid gap-5 md:grid-cols-2">
            <label className="grid gap-2">
              <span className="text-sm font-medium text-stone-200">
                Record type
              </span>
              <select
                value={recordType}
                onChange={(event) => setRecordType(event.target.value)}
                className="rounded-xl border border-stone-700 bg-stone-950 px-4 py-3 text-stone-100 outline-none focus:border-stone-500"
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

            <label className="grid gap-2">
              <span className="text-sm font-medium text-stone-200">
                Effective date
              </span>
              <input
                type="date"
                value={effectiveDate}
                onChange={(event) => setEffectiveDate(event.target.value)}
                className="rounded-xl border border-stone-700 bg-stone-950 px-4 py-3 text-stone-100 outline-none focus:border-stone-500"
              />
            </label>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <label className="grid gap-2">
              <span className="text-sm font-medium text-stone-200">
                Related marae
              </span>
              <select
                value={relatedMaraeId}
                onChange={(event) => setRelatedMaraeId(event.target.value)}
                className="rounded-xl border border-stone-700 bg-stone-950 px-4 py-3 text-stone-100 outline-none focus:border-stone-500"
                disabled={isLoadingRelations}
              >
                <option value="">
                  {isLoadingRelations ? "Loading marae..." : "None"}
                </option>
                {maraeRecords.map((record) => (
                  <option key={record.id} value={record.id}>
                    {record.name}
                  </option>
                ))}
              </select>
            </label>

            <label className="grid gap-2">
              <span className="text-sm font-medium text-stone-200">
                Related whenua
              </span>
              <select
                value={relatedWhenuaId}
                onChange={(event) => setRelatedWhenuaId(event.target.value)}
                className="rounded-xl border border-stone-700 bg-stone-950 px-4 py-3 text-stone-100 outline-none focus:border-stone-500"
                disabled={isLoadingRelations}
              >
                <option value="">
                  {isLoadingRelations ? "Loading whenua..." : "None"}
                </option>
                {whenuaRecords.map((record) => (
                  <option key={record.id} value={record.id}>
                    {record.title}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <label className="grid gap-2">
            <span className="text-sm font-medium text-stone-200">Status</span>
            <select
              value={status}
              onChange={(event) => setStatus(event.target.value)}
              className="rounded-xl border border-stone-700 bg-stone-950 px-4 py-3 text-stone-100 outline-none focus:border-stone-500"
            >
              <option value="active">Active</option>
              <option value="draft">Draft</option>
              <option value="under_review">Under review</option>
              <option value="archived">Archived</option>
            </select>
          </label>

          <label className="grid gap-2">
            <span className="text-sm font-medium text-stone-200">Summary</span>
            <textarea
              value={summary}
              onChange={(event) => setSummary(event.target.value)}
              className="min-h-32 rounded-xl border border-stone-700 bg-stone-950 px-4 py-3 text-stone-100 outline-none focus:border-stone-500"
              placeholder="Add policy, mandate, authority, decision, or governance context."
            />
          </label>

          {errorMessage ? (
            <div className="rounded-xl border border-red-900 bg-red-950/40 p-4 text-sm text-red-300">
              {errorMessage}
            </div>
          ) : null}

          <div className="flex items-center gap-3">
            <button
              type="submit"
              disabled={isSubmitting || isLoadingRelations}
              className="rounded-xl bg-stone-100 px-5 py-3 text-sm font-semibold text-stone-950 transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting ? "Saving..." : "Create Governance Record"}
            </button>

            <button
              type="button"
              onClick={() => router.push("/governance")}
              className="rounded-xl border border-stone-700 px-5 py-3 text-sm font-semibold text-stone-300 transition hover:border-stone-500 hover:text-white"
            >
              Cancel
            </button>
          </div>
        </div>
      </form>
    </AppShell>
  );
}