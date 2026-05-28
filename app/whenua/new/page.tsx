"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import AppShell from "@/components/layout/AppShell";
import { supabase } from "@/lib/supabaseClient";

export default function NewWhenuaRecordPage() {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [blockName, setBlockName] = useState("");
  const [location, setLocation] = useState("");
  const [legalDescription, setLegalDescription] = useState("");
  const [externalReference, setExternalReference] = useState("");
  const [historicalNotes, setHistoricalNotes] = useState("");
  const [status, setStatus] = useState("active");
  const [sensitivityLevel, setSensitivityLevel] = useState("standard");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMessage("");

    if (!title.trim()) {
      setErrorMessage("Title is required.");
      return;
    }

    setIsSubmitting(true);

    const { error } = await supabase.from("whenua_records").insert({
      title: title.trim(),
      block_name: blockName.trim() || null,
      location: location.trim() || null,
      legal_description: legalDescription.trim() || null,
      external_reference: externalReference.trim() || null,
      historical_notes: historicalNotes.trim() || null,
      status,
      sensitivity_level: sensitivityLevel,
    });

    setIsSubmitting(false);

    if (error) {
      setErrorMessage(error.message);
      return;
    }

    router.push("/whenua");
    router.refresh();
  }

  return (
    <AppShell title="Add Whenua Record" eyebrow="Whenua Module">
      <section className="rounded-3xl border border-stone-800 bg-stone-900/50 p-8">
        <p className="text-xs uppercase tracking-[0.25em] text-stone-500">
          Create Whenua Record
        </p>

        <h1 className="mt-3 text-3xl font-semibold text-white">
          Add Whenua Record
        </h1>

        <p className="mt-4 max-w-2xl text-stone-400">
          Create a whenua record that can later connect to documents, hui,
          decisions, governance records, tasks, and historical notes.
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
              placeholder="Example: Test Whenua Record"
            />
          </label>

          <label className="grid gap-2">
            <span className="text-sm font-medium text-stone-200">
              Block name
            </span>
            <input
              value={blockName}
              onChange={(event) => setBlockName(event.target.value)}
              className="rounded-xl border border-stone-700 bg-stone-950 px-4 py-3 text-stone-100 outline-none focus:border-stone-500"
              placeholder="Example: Test Block"
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

          <label className="grid gap-2">
            <span className="text-sm font-medium text-stone-200">
              Legal description
            </span>
            <textarea
              value={legalDescription}
              onChange={(event) => setLegalDescription(event.target.value)}
              className="min-h-24 rounded-xl border border-stone-700 bg-stone-950 px-4 py-3 text-stone-100 outline-none focus:border-stone-500"
              placeholder="Add legal description or land reference."
            />
          </label>

          <label className="grid gap-2">
            <span className="text-sm font-medium text-stone-200">
              External reference
            </span>
            <input
              value={externalReference}
              onChange={(event) => setExternalReference(event.target.value)}
              className="rounded-xl border border-stone-700 bg-stone-950 px-4 py-3 text-stone-100 outline-none focus:border-stone-500"
              placeholder="Example: TEST-WHENUA-001"
            />
          </label>

          <div className="grid gap-5 md:grid-cols-2">
            <label className="grid gap-2">
              <span className="text-sm font-medium text-stone-200">
                Status
              </span>
              <select
                value={status}
                onChange={(event) => setStatus(event.target.value)}
                className="rounded-xl border border-stone-700 bg-stone-950 px-4 py-3 text-stone-100 outline-none focus:border-stone-500"
              >
                <option value="active">Active</option>
                <option value="under_review">Under review</option>
                <option value="archived">Archived</option>
              </select>
            </label>

            <label className="grid gap-2">
              <span className="text-sm font-medium text-stone-200">
                Sensitivity
              </span>
              <select
                value={sensitivityLevel}
                onChange={(event) => setSensitivityLevel(event.target.value)}
                className="rounded-xl border border-stone-700 bg-stone-950 px-4 py-3 text-stone-100 outline-none focus:border-stone-500"
              >
                <option value="standard">Standard</option>
                <option value="sensitive">Sensitive</option>
                <option value="restricted">Restricted</option>
              </select>
            </label>
          </div>

          <label className="grid gap-2">
            <span className="text-sm font-medium text-stone-200">
              Historical notes
            </span>
            <textarea
              value={historicalNotes}
              onChange={(event) => setHistoricalNotes(event.target.value)}
              className="min-h-32 rounded-xl border border-stone-700 bg-stone-950 px-4 py-3 text-stone-100 outline-none focus:border-stone-500"
              placeholder="Add history, context, source notes, or internal explanation."
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
              disabled={isSubmitting}
              className="rounded-xl bg-stone-100 px-5 py-3 text-sm font-semibold text-stone-950 transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting ? "Saving..." : "Create Whenua Record"}
            </button>

            <button
              type="button"
              onClick={() => router.push("/whenua")}
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
