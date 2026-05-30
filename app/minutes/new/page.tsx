"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AppShell from "@/components/layout/AppShell";
import { supabase } from "@/lib/supabaseClient";

type HuiRecord = {
  id: string;
  title: string;
};

export default function NewMinutesRecordPage() {
  const router = useRouter();

  const [huiId, setHuiId] = useState("");
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [fullMinutes, setFullMinutes] = useState("");
  const [recordedBy, setRecordedBy] = useState("");
  const [approvedStatus, setApprovedStatus] = useState("draft");
  const [approvedDate, setApprovedDate] = useState("");

  const [huiRecords, setHuiRecords] = useState<HuiRecord[]>([]);
  const [isLoadingHui, setIsLoadingHui] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    async function loadHuiRecords() {
      const { data, error } = await supabase
        .from("hui")
        .select("id, title")
        .order("title", { ascending: true });

      if (error) {
        setErrorMessage(error.message);
        setIsLoadingHui(false);
        return;
      }

      setHuiRecords((data ?? []) as HuiRecord[]);
      setIsLoadingHui(false);
    }

    loadHuiRecords();
  }, []);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMessage("");

    if (!title.trim()) {
      setErrorMessage("Title is required.");
      return;
    }

    setIsSubmitting(true);

    const { error } = await supabase.from("minutes").insert({
      hui_id: huiId || null,
      title: title.trim(),
      summary: summary.trim() || null,
      full_minutes: fullMinutes.trim() || null,
      recorded_by: recordedBy.trim() || null,
      approved_status: approvedStatus,
      approved_date: approvedDate || null,
    });

    setIsSubmitting(false);

    if (error) {
      setErrorMessage(error.message);
      return;
    }

    router.push("/minutes");
    router.refresh();
  }

  return (
    <AppShell title="Add Minutes Record" eyebrow="Minutes Module">
      <section className="rounded-3xl border border-stone-800 bg-stone-900/50 p-8">
        <p className="text-xs uppercase tracking-[0.25em] text-stone-500">
          Create Minutes Record
        </p>

        <h1 className="mt-3 text-3xl font-semibold text-white">
          Add Minutes Record
        </h1>

        <p className="mt-4 max-w-2xl text-stone-400">
          Create a minutes record connected to a hui, with summary, full
          minutes, recorder details, and approval status.
        </p>
      </section>

      <form
        onSubmit={handleSubmit}
        className="mt-8 max-w-3xl rounded-2xl border border-stone-800 bg-stone-900 p-6"
      >
        <div className="grid gap-5">
          <label className="grid gap-2">
            <span className="text-sm font-medium text-stone-200">
              Related hui
            </span>
            <select
              value={huiId}
              onChange={(event) => setHuiId(event.target.value)}
              className="rounded-xl border border-stone-700 bg-stone-950 px-4 py-3 text-stone-100 outline-none focus:border-stone-500"
              disabled={isLoadingHui}
            >
              <option value="">
                {isLoadingHui ? "Loading hui..." : "None"}
              </option>
              {huiRecords.map((record) => (
                <option key={record.id} value={record.id}>
                  {record.title}
                </option>
              ))}
            </select>
          </label>

          <label className="grid gap-2">
            <span className="text-sm font-medium text-stone-200">Title</span>
            <input
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              className="rounded-xl border border-stone-700 bg-stone-950 px-4 py-3 text-stone-100 outline-none focus:border-stone-500"
              placeholder="Example: Test Minutes"
            />
          </label>

          <label className="grid gap-2">
            <span className="text-sm font-medium text-stone-200">Summary</span>
            <textarea
              value={summary}
              onChange={(event) => setSummary(event.target.value)}
              className="min-h-24 rounded-xl border border-stone-700 bg-stone-950 px-4 py-3 text-stone-100 outline-none focus:border-stone-500"
              placeholder="Summarise the hui discussion and key points."
            />
          </label>

          <label className="grid gap-2">
            <span className="text-sm font-medium text-stone-200">
              Full minutes
            </span>
            <textarea
              value={fullMinutes}
              onChange={(event) => setFullMinutes(event.target.value)}
              className="min-h-40 rounded-xl border border-stone-700 bg-stone-950 px-4 py-3 text-stone-100 outline-none focus:border-stone-500"
              placeholder="Add full meeting minutes."
            />
          </label>

          <div className="grid gap-5 md:grid-cols-2">
            <label className="grid gap-2">
              <span className="text-sm font-medium text-stone-200">
                Recorded by
              </span>
              <input
                value={recordedBy}
                onChange={(event) => setRecordedBy(event.target.value)}
                className="rounded-xl border border-stone-700 bg-stone-950 px-4 py-3 text-stone-100 outline-none focus:border-stone-500"
                placeholder="Example: Test Recorder"
              />
            </label>

            <label className="grid gap-2">
              <span className="text-sm font-medium text-stone-200">
                Approved date
              </span>
              <input
                type="date"
                value={approvedDate}
                onChange={(event) => setApprovedDate(event.target.value)}
                className="rounded-xl border border-stone-700 bg-stone-950 px-4 py-3 text-stone-100 outline-none focus:border-stone-500"
              />
            </label>
          </div>

          <label className="grid gap-2">
            <span className="text-sm font-medium text-stone-200">
              Approval status
            </span>
            <select
              value={approvedStatus}
              onChange={(event) => setApprovedStatus(event.target.value)}
              className="rounded-xl border border-stone-700 bg-stone-950 px-4 py-3 text-stone-100 outline-none focus:border-stone-500"
            >
              <option value="draft">Draft</option>
              <option value="pending_review">Pending review</option>
              <option value="approved">Approved</option>
              <option value="archived">Archived</option>
            </select>
          </label>

          {errorMessage ? (
            <div className="rounded-xl border border-red-900 bg-red-950/40 p-4 text-sm text-red-300">
              {errorMessage}
            </div>
          ) : null}

          <div className="flex items-center gap-3">
            <button
              type="submit"
              disabled={isSubmitting || isLoadingHui}
              className="rounded-xl bg-stone-100 px-5 py-3 text-sm font-semibold text-stone-950 transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting ? "Saving..." : "Create Minutes Record"}
            </button>

            <button
              type="button"
              onClick={() => router.push("/minutes")}
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