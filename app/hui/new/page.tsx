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

type GovernanceRecord = {
  id: string;
  title: string;
};

export default function NewHuiRecordPage() {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [huiDate, setHuiDate] = useState("");
  const [location, setLocation] = useState("");
  const [purpose, setPurpose] = useState("");
  const [agenda, setAgenda] = useState("");
  const [status, setStatus] = useState("planned");

  const [relatedMaraeId, setRelatedMaraeId] = useState("");
  const [relatedWhenuaId, setRelatedWhenuaId] = useState("");
  const [relatedGovernanceRecordId, setRelatedGovernanceRecordId] =
    useState("");

  const [maraeRecords, setMaraeRecords] = useState<MaraeRecord[]>([]);
  const [whenuaRecords, setWhenuaRecords] = useState<WhenuaRecord[]>([]);
  const [governanceRecords, setGovernanceRecords] = useState<
    GovernanceRecord[]
  >([]);

  const [isLoadingRelations, setIsLoadingRelations] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    async function loadRelations() {
      const [maraeResult, whenuaResult, governanceResult] = await Promise.all([
        supabase.from("marae_records").select("id, name").order("name"),
        supabase.from("whenua_records").select("id, title").order("title"),
        supabase
          .from("governance_records")
          .select("id, title")
          .order("title"),
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

      if (governanceResult.error) {
        setErrorMessage(governanceResult.error.message);
        setIsLoadingRelations(false);
        return;
      }

      setMaraeRecords((maraeResult.data ?? []) as MaraeRecord[]);
      setWhenuaRecords((whenuaResult.data ?? []) as WhenuaRecord[]);
      setGovernanceRecords(
        (governanceResult.data ?? []) as GovernanceRecord[]
      );
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

    const { error } = await supabase.from("hui").insert({
      title: title.trim(),
      hui_date: huiDate || null,
      location: location.trim() || null,
      purpose: purpose.trim() || null,
      agenda: agenda.trim() || null,
      status,
      related_marae_id: relatedMaraeId || null,
      related_whenua_id: relatedWhenuaId || null,
      related_governance_record_id: relatedGovernanceRecordId || null,
    });

    setIsSubmitting(false);

    if (error) {
      setErrorMessage(error.message);
      return;
    }

    router.push("/hui");
    router.refresh();
  }

  return (
    <AppShell title="Add Hui Record" eyebrow="Hui Module">
      <section className="rounded-3xl border border-stone-800 bg-stone-900/50 p-8">
        <p className="text-xs uppercase tracking-[0.25em] text-stone-500">
          Create Hui Record
        </p>

        <h1 className="mt-3 text-3xl font-semibold text-white">
          Add Hui Record
        </h1>

        <p className="mt-4 max-w-2xl text-stone-400">
          Create a hui record connected to marae, whenua, governance records,
          agendas, minutes, decisions, documents, and tasks.
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
              placeholder="Example: Test Hui"
            />
          </label>

          <div className="grid gap-5 md:grid-cols-2">
            <label className="grid gap-2">
              <span className="text-sm font-medium text-stone-200">
                Hui date
              </span>
              <input
                type="date"
                value={huiDate}
                onChange={(event) => setHuiDate(event.target.value)}
                className="rounded-xl border border-stone-700 bg-stone-950 px-4 py-3 text-stone-100 outline-none focus:border-stone-500"
              />
            </label>

            <label className="grid gap-2">
              <span className="text-sm font-medium text-stone-200">
                Location
              </span>
              <input
                value={location}
                onChange={(event) => setLocation(event.target.value)}
                className="rounded-xl border border-stone-700 bg-stone-950 px-4 py-3 text-stone-100 outline-none focus:border-stone-500"
                placeholder="Example: Kaikohe"
              />
            </label>
          </div>

          <div className="grid gap-5 md:grid-cols-3">
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
                  {isLoadingRelations ? "Loading..." : "None"}
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
                  {isLoadingRelations ? "Loading..." : "None"}
                </option>
                {whenuaRecords.map((record) => (
                  <option key={record.id} value={record.id}>
                    {record.title}
                  </option>
                ))}
              </select>
            </label>

            <label className="grid gap-2">
              <span className="text-sm font-medium text-stone-200">
                Governance record
              </span>
              <select
                value={relatedGovernanceRecordId}
                onChange={(event) =>
                  setRelatedGovernanceRecordId(event.target.value)
                }
                className="rounded-xl border border-stone-700 bg-stone-950 px-4 py-3 text-stone-100 outline-none focus:border-stone-500"
                disabled={isLoadingRelations}
              >
                <option value="">
                  {isLoadingRelations ? "Loading..." : "None"}
                </option>
                {governanceRecords.map((record) => (
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
              <option value="planned">Planned</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
              <option value="archived">Archived</option>
            </select>
          </label>

          <label className="grid gap-2">
            <span className="text-sm font-medium text-stone-200">Purpose</span>
            <textarea
              value={purpose}
              onChange={(event) => setPurpose(event.target.value)}
              className="min-h-24 rounded-xl border border-stone-700 bg-stone-950 px-4 py-3 text-stone-100 outline-none focus:border-stone-500"
              placeholder="Add the purpose or context for this hui."
            />
          </label>

          <label className="grid gap-2">
            <span className="text-sm font-medium text-stone-200">Agenda</span>
            <textarea
              value={agenda}
              onChange={(event) => setAgenda(event.target.value)}
              className="min-h-32 rounded-xl border border-stone-700 bg-stone-950 px-4 py-3 text-stone-100 outline-none focus:border-stone-500"
              placeholder="Add agenda items or planned discussion points."
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
              {isSubmitting ? "Saving..." : "Create Hui Record"}
            </button>

            <button
              type="button"
              onClick={() => router.push("/hui")}
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
