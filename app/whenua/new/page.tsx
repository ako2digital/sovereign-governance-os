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
    <AppShell title="Add Whenua Record" eyebrow="Core Records / Whenua">
      <section className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="rounded-3xl border border-stone-800 bg-stone-900/60 p-8">
          <a
            href="/whenua"
            className="text-sm font-medium text-stone-500 transition hover:text-white"
          >
            ← Back to Whenua Records
          </a>

          <p className="mt-8 font-mono text-xs uppercase tracking-[0.3em] text-stone-500">
            New whenua record
          </p>

          <h1 className="mt-5 text-4xl font-semibold tracking-tight text-white md:text-5xl">
            Create a land record that can connect to evidence and governance.
          </h1>

          <p className="mt-5 text-lg leading-8 text-stone-400">
            This form creates a whenua record using the actual database fields
            already working in Supabase. Later, each record can connect to
            documents, maps, hui, decisions, whakapapa, marae, claims, and
            activity history.
          </p>

          <div className="mt-8 rounded-2xl border border-stone-800 bg-stone-950 p-5">
            <p className="font-mono text-xs uppercase tracking-[0.25em] text-stone-600">
              Current rule
            </p>

            <p className="mt-3 text-sm leading-7 text-stone-400">
              The required field is the title. Other fields can remain blank
              until the whenua register structure is tested and agreed.
            </p>
          </div>

          <div className="mt-4 rounded-2xl border border-stone-800 bg-stone-950 p-5">
            <p className="font-mono text-xs uppercase tracking-[0.25em] text-stone-600">
              Insert columns
            </p>

            <p className="mt-3 text-sm leading-7 text-stone-400">
              title, block_name, location, legal_description,
              external_reference, historical_notes, status, sensitivity_level.
            </p>
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-3xl border border-stone-800 bg-stone-900/60 p-8"
        >
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-stone-500">
            Create record
          </p>

          <div className="mt-8 grid gap-6">
            <label className="grid gap-3">
              <span className="text-sm font-semibold text-stone-300">
                Title <span className="text-red-300">*</span>
              </span>

              <input
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                required
                className="rounded-2xl border border-stone-700 bg-stone-950 px-5 py-4 text-stone-100 outline-none transition placeholder:text-stone-600 focus:border-stone-400"
                placeholder="Example: Kaikohe Aerodrome whenua record"
              />
            </label>

            <div className="grid gap-6 md:grid-cols-2">
              <label className="grid gap-3">
                <span className="text-sm font-semibold text-stone-300">
                  Block name
                </span>

                <input
                  value={blockName}
                  onChange={(event) => setBlockName(event.target.value)}
                  className="rounded-2xl border border-stone-700 bg-stone-950 px-5 py-4 text-stone-100 outline-none transition placeholder:text-stone-600 focus:border-stone-400"
                  placeholder="Example: Māori land block name"
                />
              </label>

              <label className="grid gap-3">
                <span className="text-sm font-semibold text-stone-300">
                  Location
                </span>

                <input
                  value={location}
                  onChange={(event) => setLocation(event.target.value)}
                  className="rounded-2xl border border-stone-700 bg-stone-950 px-5 py-4 text-stone-100 outline-none transition placeholder:text-stone-600 focus:border-stone-400"
                  placeholder="Example: Kaikohe"
                />
              </label>
            </div>

            <label className="grid gap-3">
              <span className="text-sm font-semibold text-stone-300">
                Legal description
              </span>

              <textarea
                value={legalDescription}
                onChange={(event) => setLegalDescription(event.target.value)}
                className="min-h-28 rounded-2xl border border-stone-700 bg-stone-950 px-5 py-4 text-stone-100 outline-none transition placeholder:text-stone-600 focus:border-stone-400"
                placeholder="Add legal description, LINZ reference, land title notes, or official record reference."
              />
            </label>

            <label className="grid gap-3">
              <span className="text-sm font-semibold text-stone-300">
                External reference
              </span>

              <input
                value={externalReference}
                onChange={(event) => setExternalReference(event.target.value)}
                className="rounded-2xl border border-stone-700 bg-stone-950 px-5 py-4 text-stone-100 outline-none transition placeholder:text-stone-600 focus:border-stone-400"
                placeholder="Example: WHN-001, council ref, LINZ ref, file number"
              />
            </label>

            <div className="grid gap-6 md:grid-cols-2">
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
                  <option value="under_review">Under review</option>
                  <option value="archived">Archived</option>
                </select>
              </label>

              <label className="grid gap-3">
                <span className="text-sm font-semibold text-stone-300">
                  Sensitivity
                </span>

                <select
                  value={sensitivityLevel}
                  onChange={(event) => setSensitivityLevel(event.target.value)}
                  className="rounded-2xl border border-stone-700 bg-stone-950 px-5 py-4 text-stone-100 outline-none transition focus:border-stone-400"
                >
                  <option value="standard">Standard</option>
                  <option value="sensitive">Sensitive</option>
                  <option value="restricted">Restricted</option>
                </select>
              </label>
            </div>

            <label className="grid gap-3">
              <span className="text-sm font-semibold text-stone-300">
                Historical notes
              </span>

              <textarea
                value={historicalNotes}
                onChange={(event) => setHistoricalNotes(event.target.value)}
                className="min-h-36 rounded-2xl border border-stone-700 bg-stone-950 px-5 py-4 text-stone-100 outline-none transition placeholder:text-stone-600 focus:border-stone-400"
                placeholder="Add history, context, source notes, whānau knowledge, or internal explanation."
              />
            </label>

            {errorMessage ? (
              <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-5">
                <p className="font-semibold text-red-300">
                  Could not create whenua record.
                </p>

                <p className="mt-3 text-sm leading-7 text-red-200/80">
                  {errorMessage}
                </p>
              </div>
            ) : null}

            <div className="rounded-2xl border border-stone-800 bg-stone-950 p-5">
              <p className="text-sm leading-7 text-stone-500">
                After submission, this record will be inserted into the
                Supabase whenua_records table and the app will return to the
                Whenua Records page.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                type="submit"
                disabled={isSubmitting}
                className="rounded-full bg-stone-100 px-6 py-3 text-sm font-semibold text-stone-950 transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSubmitting ? "Saving..." : "Create Whenua Record"}
              </button>

              <button
                type="button"
                onClick={() => router.push("/whenua")}
                className="rounded-full border border-stone-700 px-6 py-3 text-sm font-semibold text-stone-300 transition hover:border-stone-500 hover:text-white"
              >
                Cancel
              </button>
            </div>
          </div>
        </form>
      </section>
    </AppShell>
  );
}