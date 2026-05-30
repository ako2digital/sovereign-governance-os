"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AppShell from "@/components/layout/AppShell";
import { supabase } from "@/lib/supabaseClient";

type HuiRecord = {
  id: string;
  title: string;
};

type MinutesRecord = {
  id: string;
  title: string;
};

export default function NewDecisionRecordPage() {
  const router = useRouter();

  const [huiId, setHuiId] = useState("");
  const [minutesId, setMinutesId] = useState("");
  const [title, setTitle] = useState("");
  const [decisionText, setDecisionText] = useState("");
  const [decisionDate, setDecisionDate] = useState("");

  const [huiRecords, setHuiRecords] = useState<HuiRecord[]>([]);
  const [minutesRecords, setMinutesRecords] = useState<MinutesRecord[]>([]);

  const [isLoadingRelations, setIsLoadingRelations] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    async function loadRelations() {
      const [huiResult, minutesResult] = await Promise.all([
        supabase.from("hui").select("id, title").order("title", {
          ascending: true,
        }),
        supabase.from("minutes").select("id, title").order("title", {
          ascending: true,
        }),
      ]);

      if (huiResult.error) {
        setErrorMessage(huiResult.error.message);
        setIsLoadingRelations(false);
        return;
      }

      if (minutesResult.error) {
        setErrorMessage(minutesResult.error.message);
        setIsLoadingRelations(false);
        return;
      }

      setHuiRecords((huiResult.data ?? []) as HuiRecord[]);
      setMinutesRecords((minutesResult.data ?? []) as MinutesRecord[]);
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

    const { error } = await supabase.from("decisions").insert({
      hui_id: huiId || null,
      minutes_id: minutesId || null,
      title: title.trim(),
      decision_text: decisionText.trim() || null,
      decision_date: decisionDate || null,
    });

    setIsSubmitting(false);

    if (error) {
      setErrorMessage(error.message);
      return;
    }

    router.push("/decisions");
    router.refresh();
  }

  return (
    <AppShell title="Add Decision Record" eyebrow="Decisions Module">
      <section className="rounded-3xl border border-stone-800 bg-stone-900/50 p-8">
        <p className="text-xs uppercase tracking-[0.25em] text-stone-500">
          Create Decision Record
        </p>

        <h1 className="mt-3 text-3xl font-semibold text-white">
          Add Decision Record
        </h1>

        <p className="mt-4 max-w-2xl text-stone-400">
          Create a formal decision record connected to a hui and/or minutes
          record.
        </p>
      </section>

      <form
        onSubmit={handleSubmit}
        className="mt-8 max-w-3xl rounded-2xl border border-stone-800 bg-stone-900 p-6"
      >
        <div className="grid gap-5">
          <div className="grid gap-5 md:grid-cols-2">
            <label className="grid gap-2">
              <span className="text-sm font-medium text-stone-200">
                Related hui
              </span>
              <select
                value={huiId}
                onChange={(event) => setHuiId(event.target.value)}
                className="rounded-xl border border-stone-700 bg-stone-950 px-4 py-3 text-stone-100 outline-none focus:border-stone-500"
                disabled={isLoadingRelations}
              >
                <option value="">
                  {isLoadingRelations ? "Loading hui..." : "None"}
                </option>

                {huiRecords.map((record) => (
                  <option key={record.id} value={record.id}>
                    {record.title}
                  </option>
                ))}
              </select>
            </label>

            <label className="grid gap-2">
              <span className="text-sm font-medium text-stone-200">
                Related minutes
              </span>
              <select
                value={minutesId}
                onChange={(event) => setMinutesId(event.target.value)}
                className="rounded-xl border border-stone-700 bg-stone-950 px-4 py-3 text-stone-100 outline-none focus:border-stone-500"
                disabled={isLoadingRelations}
              >
                <option value="">
                  {isLoadingRelations ? "Loading minutes..." : "None"}
                </option>

                {minutesRecords.map((record) => (
                  <option key={record.id} value={record.id}>
                    {record.title}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <label className="grid gap-2">
            <span className="text-sm font-medium text-stone-200">Title</span>
            <input
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              className="rounded-xl border border-stone-700 bg-stone-950 px-4 py-3 text-stone-100 outline-none focus:border-stone-500"
              placeholder="Example: Approve whenua research plan"
            />
          </label>

          <label className="grid gap-2">
            <span className="text-sm font-medium text-stone-200">
              Decision date
            </span>
            <input
              type="date"
              value={decisionDate}
              onChange={(event) => setDecisionDate(event.target.value)}
              className="rounded-xl border border-stone-700 bg-stone-950 px-4 py-3 text-stone-100 outline-none focus:border-stone-500"
            />
          </label>

          <label className="grid gap-2">
            <span className="text-sm font-medium text-stone-200">
              Decision text
            </span>
            <textarea
              value={decisionText}
              onChange={(event) => setDecisionText(event.target.value)}
              className="min-h-40 rounded-xl border border-stone-700 bg-stone-950 px-4 py-3 text-stone-100 outline-none focus:border-stone-500"
              placeholder="Write the decision exactly as agreed."
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
              {isSubmitting ? "Saving..." : "Create Decision Record"}
            </button>

            <button
              type="button"
              onClick={() => router.push("/decisions")}
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