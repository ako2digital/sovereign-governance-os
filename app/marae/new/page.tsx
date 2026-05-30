"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import AppShell from "@/components/layout/AppShell";
import { supabase } from "@/lib/supabaseClient";

export default function NewMaraeRecordPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [hapuAffiliation, setHapuAffiliation] = useState("");
  const [iwiAffiliation, setIwiAffiliation] = useState("");
  const [governanceNotes, setGovernanceNotes] = useState("");
  const [contactNotes, setContactNotes] = useState("");
  const [status, setStatus] = useState("active");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMessage("");

    if (!name.trim()) {
      setErrorMessage("Marae name is required.");
      return;
    }

    setIsSubmitting(true);

    const { error } = await supabase.from("marae_records").insert({
      name: name.trim(),
      location: location.trim() || null,
      hapu_affiliation: hapuAffiliation.trim() || null,
      iwi_affiliation: iwiAffiliation.trim() || null,
      governance_notes: governanceNotes.trim() || null,
      contact_notes: contactNotes.trim() || null,
      status,
    });

    setIsSubmitting(false);

    if (error) {
      setErrorMessage(error.message);
      return;
    }

    router.push("/marae");
    router.refresh();
  }

  return (
    <AppShell title="Add Marae Record" eyebrow="Marae Module">
      <section className="rounded-3xl border border-stone-800 bg-stone-900/50 p-8">
        <p className="text-xs uppercase tracking-[0.25em] text-stone-500">
          Create Marae Record
        </p>

        <h1 className="mt-3 text-3xl font-semibold text-white">
          Add Marae Record
        </h1>

        <p className="mt-4 max-w-2xl text-stone-400">
          Create a marae record that can later connect to governance records,
          hui, minutes, decisions, pānui, documents, and tasks.
        </p>
      </section>

      <form
        onSubmit={handleSubmit}
        className="mt-8 max-w-3xl rounded-2xl border border-stone-800 bg-stone-900 p-6"
      >
        <div className="grid gap-5">
          <label className="grid gap-2">
            <span className="text-sm font-medium text-stone-200">
              Marae name
            </span>
            <input
              value={name}
              onChange={(event) => setName(event.target.value)}
              className="rounded-xl border border-stone-700 bg-stone-950 px-4 py-3 text-stone-100 outline-none focus:border-stone-500"
              placeholder="Example: Test Marae"
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

          <div className="grid gap-5 md:grid-cols-2">
            <label className="grid gap-2">
              <span className="text-sm font-medium text-stone-200">
                Hapū affiliation
              </span>
              <input
                value={hapuAffiliation}
                onChange={(event) => setHapuAffiliation(event.target.value)}
                className="rounded-xl border border-stone-700 bg-stone-950 px-4 py-3 text-stone-100 outline-none focus:border-stone-500"
                placeholder="Example: Test Hapū"
              />
            </label>

            <label className="grid gap-2">
              <span className="text-sm font-medium text-stone-200">
                Iwi affiliation
              </span>
              <input
                value={iwiAffiliation}
                onChange={(event) => setIwiAffiliation(event.target.value)}
                className="rounded-xl border border-stone-700 bg-stone-950 px-4 py-3 text-stone-100 outline-none focus:border-stone-500"
                placeholder="Example: Ngāpuhi"
              />
            </label>
          </div>

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
              Governance notes
            </span>
            <textarea
              value={governanceNotes}
              onChange={(event) => setGovernanceNotes(event.target.value)}
              className="min-h-32 rounded-xl border border-stone-700 bg-stone-950 px-4 py-3 text-stone-100 outline-none focus:border-stone-500"
              placeholder="Add governance structure, committee notes, mandate notes, or internal context."
            />
          </label>

          <label className="grid gap-2">
            <span className="text-sm font-medium text-stone-200">
              Contact notes
            </span>
            <textarea
              value={contactNotes}
              onChange={(event) => setContactNotes(event.target.value)}
              className="min-h-24 rounded-xl border border-stone-700 bg-stone-950 px-4 py-3 text-stone-100 outline-none focus:border-stone-500"
              placeholder="Add contact information, communication notes, or follow-up details."
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
              {isSubmitting ? "Saving..." : "Create Marae Record"}
            </button>

            <button
              type="button"
              onClick={() => router.push("/marae")}
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
