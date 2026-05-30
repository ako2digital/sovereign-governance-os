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

type HuiRecord = {
  id: string;
  title: string;
};

export default function NewPanuiRecordPage() {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [panuiType, setPanuiType] = useState("");
  const [publishedDate, setPublishedDate] = useState("");
  const [status, setStatus] = useState("draft");

  const [relatedMaraeId, setRelatedMaraeId] = useState("");
  const [relatedWhenuaId, setRelatedWhenuaId] = useState("");
  const [relatedHuiId, setRelatedHuiId] = useState("");

  const [maraeRecords, setMaraeRecords] = useState<MaraeRecord[]>([]);
  const [whenuaRecords, setWhenuaRecords] = useState<WhenuaRecord[]>([]);
  const [huiRecords, setHuiRecords] = useState<HuiRecord[]>([]);

  const [isLoadingRelations, setIsLoadingRelations] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    async function loadRelations() {
      const [maraeResult, whenuaResult, huiResult] = await Promise.all([
        supabase.from("marae_records").select("id, name").order("name", {
          ascending: true,
        }),
        supabase.from("whenua_records").select("id, title").order("title", {
          ascending: true,
        }),
        supabase.from("hui").select("id, title").order("title", {
          ascending: true,
        }),
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

      if (huiResult.error) {
        setErrorMessage(huiResult.error.message);
        setIsLoadingRelations(false);
        return;
      }

      setMaraeRecords((maraeResult.data ?? []) as MaraeRecord[]);
      setWhenuaRecords((whenuaResult.data ?? []) as WhenuaRecord[]);
      setHuiRecords((huiResult.data ?? []) as HuiRecord[]);
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

    const { error } = await supabase.from("panui").insert({
      title: title.trim(),
      message: message.trim() || null,
      panui_type: panuiType.trim() || null,
      related_marae_id: relatedMaraeId || null,
      related_whenua_id: relatedWhenuaId || null,
      related_hui_id: relatedHuiId || null,
      published_date: publishedDate || null,
      status,
    });

    setIsSubmitting(false);

    if (error) {
      setErrorMessage(error.message);
      return;
    }

    router.push("/panui");
    router.refresh();
  }

  return (
    <AppShell title="Add Pānui Record" eyebrow="Pānui Module">
      <section className="rounded-3xl border border-stone-800 bg-stone-900/50 p-8">
        <p className="text-xs uppercase tracking-[0.25em] text-stone-500">
          Create Pānui Record
        </p>

        <h1 className="mt-3 text-3xl font-semibold text-white">
          Add Pānui Record
        </h1>

        <p className="mt-4 max-w-2xl text-stone-400">
          Create a communication record connected to marae, whenua, or hui.
        </p>
      </section>

      <form
        onSubmit={handleSubmit}
        className="mt-8 max-w-4xl rounded-2xl border border-stone-800 bg-stone-900 p-6"
      >
        <div className="grid gap-5">
          <label className="grid gap-2">
            <span className="text-sm font-medium text-stone-200">Title</span>
            <input
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              className="rounded-xl border border-stone-700 bg-stone-950 px-4 py-3 text-stone-100 outline-none focus:border-stone-500"
              placeholder="Example: Test Pānui"
            />
          </label>

          <div className="grid gap-5 md:grid-cols-3">
            <label className="grid gap-2">
              <span className="text-sm font-medium text-stone-200">
                Pānui type
              </span>
              <input
                value={panuiType}
                onChange={(event) => setPanuiType(event.target.value)}
                className="rounded-xl border border-stone-700 bg-stone-950 px-4 py-3 text-stone-100 outline-none focus:border-stone-500"
                placeholder="Example: General Update"
              />
            </label>

            <label className="grid gap-2">
              <span className="text-sm font-medium text-stone-200">
                Published date
              </span>
              <input
                type="date"
                value={publishedDate}
                onChange={(event) => setPublishedDate(event.target.value)}
                className="rounded-xl border border-stone-700 bg-stone-950 px-4 py-3 text-stone-100 outline-none focus:border-stone-500"
              />
            </label>

            <label className="grid gap-2">
              <span className="text-sm font-medium text-stone-200">
                Status
              </span>
              <select
                value={status}
                onChange={(event) => setStatus(event.target.value)}
                className="rounded-xl border border-stone-700 bg-stone-950 px-4 py-3 text-stone-100 outline-none focus:border-stone-500"
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
                <option value="scheduled">Scheduled</option>
                <option value="archived">Archived</option>
              </select>
            </label>
          </div>

          <div className="rounded-2xl border border-stone-800 bg-stone-950 p-5">
            <h2 className="text-sm font-semibold text-stone-100">
              Related records
            </h2>

            <p className="mt-1 text-sm text-stone-500">
              Optional links. Select the marae, whenua, or hui this pānui
              relates to.
            </p>

            <div className="mt-5 grid gap-5 md:grid-cols-3">
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

              <label className="grid gap-2">
                <span className="text-sm font-medium text-stone-200">
                  Related hui
                </span>
                <select
                  value={relatedHuiId}
                  onChange={(event) => setRelatedHuiId(event.target.value)}
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
            </div>
          </div>

          <label className="grid gap-2">
            <span className="text-sm font-medium text-stone-200">Message</span>
            <textarea
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              className="min-h-40 rounded-xl border border-stone-700 bg-stone-950 px-4 py-3 text-stone-100 outline-none focus:border-stone-500"
              placeholder="Write the pānui message."
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
              {isSubmitting ? "Saving..." : "Create Pānui Record"}
            </button>

            <button
              type="button"
              onClick={() => router.push("/panui")}
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