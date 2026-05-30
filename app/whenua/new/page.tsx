"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import AppShell from "@/components/layout/AppShell";
import { supabase } from "@/lib/supabaseClient";

const futureLinks = [
  "Supporting documents",
  "Governance decisions",
  "Marae connections",
  "Whenua activity history",
];

export default function NewWhenuaPage() {
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
      <section className="grid gap-6">
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

          <h1 className="mt-5 max-w-5xl text-4xl font-semibold tracking-tight text-white md:text-5xl">
            Add a land record with legal, historical, and reference context.
          </h1>

          <p className="mt-5 max-w-3xl text-base leading-8 text-stone-400">
            A whenua record should become more than a static note. It should
            later connect to documents, maps, decisions, governance authority,
            marae, tasks, and activity history.
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
                Use the confirmed whenua_records schema.
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
                  placeholder="Example: Kaikohe Aerodrome Whenua Record"
                  className="rounded-2xl border border-stone-700 bg-stone-950 px-5 py-4 text-stone-100 outline-none transition placeholder:text-stone-600 focus:border-stone-400"
                />
              </label>

              <div className="grid gap-5 md:grid-cols-2">
                <label className="grid gap-3">
                  <span className="text-sm font-semibold text-stone-300">
                    Block name
                  </span>

                  <input
                    value={blockName}
                    onChange={(event) => setBlockName(event.target.value)}
                    placeholder="Example: Motatau No. 2 Block"
                    className="rounded-2xl border border-stone-700 bg-stone-950 px-5 py-4 text-stone-100 outline-none transition placeholder:text-stone-600 focus:border-stone-400"
                  />
                </label>

                <label className="grid gap-3">
                  <span className="text-sm font-semibold text-stone-300">
                    Location
                  </span>

                  <input
                    value={location}
                    onChange={(event) => setLocation(event.target.value)}
                    placeholder="Example: Kaikohe, Northland"
                    className="rounded-2xl border border-stone-700 bg-stone-950 px-5 py-4 text-stone-100 outline-none transition placeholder:text-stone-600 focus:border-stone-400"
                  />
                </label>
              </div>

              <div className="grid gap-5 md:grid-cols-2">
                <label className="grid gap-3">
                  <span className="text-sm font-semibold text-stone-300">
                    External reference
                  </span>

                  <input
                    value={externalReference}
                    onChange={(event) =>
                      setExternalReference(event.target.value)
                    }
                    placeholder="Example: LINZ, council, court, archive reference"
                    className="rounded-2xl border border-stone-700 bg-stone-950 px-5 py-4 text-stone-100 outline-none transition placeholder:text-stone-600 focus:border-stone-400"
                  />
                </label>

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
              </div>

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

              <label className="grid gap-3">
                <span className="text-sm font-semibold text-stone-300">
                  Legal description
                </span>

                <textarea
                  value={legalDescription}
                  onChange={(event) => setLegalDescription(event.target.value)}
                  placeholder="Add legal description, ownership reference, title information, or formal record details."
                  className="min-h-32 rounded-2xl border border-stone-700 bg-stone-950 px-5 py-4 text-stone-100 outline-none transition placeholder:text-stone-600 focus:border-stone-400"
                />
              </label>

              <label className="grid gap-3">
                <span className="text-sm font-semibold text-stone-300">
                  Historical notes
                </span>

                <textarea
                  value={historicalNotes}
                  onChange={(event) => setHistoricalNotes(event.target.value)}
                  placeholder="Add historical notes, acquisition history, whānau context, dispute context, or source notes."
                  className="min-h-40 rounded-2xl border border-stone-700 bg-stone-950 px-5 py-4 text-stone-100 outline-none transition placeholder:text-stone-600 focus:border-stone-400"
                />
              </label>

              <div className="rounded-2xl border border-stone-800 bg-stone-950 p-5">
                <p className="font-mono text-xs uppercase tracking-[0.25em] text-stone-600">
                  Current schema
                </p>

                <p className="mt-3 text-sm leading-7 text-stone-500">
                  This form only writes confirmed columns: title, block_name,
                  location, legal_description, external_reference,
                  historical_notes, status, and sensitivity_level.
                </p>
              </div>

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

          <aside className="grid gap-6 content-start">
            <div className="rounded-3xl border border-stone-800 bg-stone-900/60 p-6">
              <p className="font-mono text-xs uppercase tracking-[0.3em] text-stone-500">
                Related records
              </p>

              <div className="mt-5 grid gap-3">
                {futureLinks.map((item) => (
                  <div
                    key={item}
                    className="rounded-2xl border border-stone-800 bg-stone-950 p-4"
                  >
                    <p className="text-sm font-semibold text-white">{item}</p>

                    <p className="mt-1 text-xs leading-5 text-stone-600">
                      Available after the whenua record exists.
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
                Create the whenua record first. Then attach supporting
                documents, link governance decisions, connect relevant marae,
                and log future activity against this record.
              </p>
            </div>

            <div className="rounded-3xl border border-stone-800 bg-stone-900/60 p-6">
              <p className="font-mono text-xs uppercase tracking-[0.3em] text-stone-500">
                Linked actions
              </p>

              <div className="mt-5 grid gap-3">
                <a
                  href="/documents"
                  className="rounded-2xl border border-stone-800 bg-stone-950 p-4 text-sm font-semibold text-stone-300 transition hover:border-stone-600 hover:bg-stone-900 hover:text-white"
                >
                  View Documents
                </a>

                <a
                  href="/governance"
                  className="rounded-2xl border border-stone-800 bg-stone-950 p-4 text-sm font-semibold text-stone-300 transition hover:border-stone-600 hover:bg-stone-900 hover:text-white"
                >
                  View Governance
                </a>
              </div>
            </div>
          </aside>
        </div>
      </section>
    </AppShell>
  );
}