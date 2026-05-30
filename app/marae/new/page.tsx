"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import AppShell from "@/components/layout/AppShell";
import { supabase } from "@/lib/supabaseClient";

export default function NewMaraeRecordPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");

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
      description: description.trim() || null,
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
    <AppShell title="Add Marae Record" eyebrow="Governance / Marae">
      <section className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="rounded-3xl border border-stone-800 bg-stone-900/60 p-8">
          <a
            href="/marae"
            className="text-sm font-medium text-stone-500 transition hover:text-white"
          >
            ← Back to Marae Records
          </a>

          <p className="mt-8 font-mono text-xs uppercase tracking-[0.3em] text-stone-500">
            New marae record
          </p>

          <h1 className="mt-5 text-4xl font-semibold tracking-tight text-white md:text-5xl">
            Add a marae record to the community layer.
          </h1>

          <p className="mt-5 text-lg leading-8 text-stone-400">
            A marae record becomes a connection point for people, whakapapa,
            hui, governance decisions, documents, pānui, tasks, and future
            operational history.
          </p>

          <div className="mt-8 rounded-2xl border border-stone-800 bg-stone-950 p-5">
            <p className="font-mono text-xs uppercase tracking-[0.25em] text-stone-600">
              Current rule
            </p>

            <p className="mt-3 text-sm leading-7 text-stone-400">
              This MVP starts with a simple marae name, location, and
              description. Once the record flow is proven, we can add contacts,
              hapū links, governance roles, documents, and hui connections.
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
                Marae name <span className="text-red-300">*</span>
              </span>

              <input
                value={name}
                onChange={(event) => setName(event.target.value)}
                required
                className="rounded-2xl border border-stone-700 bg-stone-950 px-5 py-4 text-stone-100 outline-none transition placeholder:text-stone-600 focus:border-stone-400"
                placeholder="Example: Ngāpuhi marae record"
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

            <label className="grid gap-3">
              <span className="text-sm font-semibold text-stone-300">
                Description
              </span>

              <textarea
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                className="min-h-36 rounded-2xl border border-stone-700 bg-stone-950 px-5 py-4 text-stone-100 outline-none transition placeholder:text-stone-600 focus:border-stone-400"
                placeholder="Add context, notes, whakapapa links, governance context, or operational information."
              />
            </label>

            {errorMessage ? (
              <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-5">
                <p className="font-semibold text-red-300">
                  Could not create marae record.
                </p>

                <p className="mt-3 text-sm leading-7 text-red-200/80">
                  {errorMessage}
                </p>
              </div>
            ) : null}

            <div className="rounded-2xl border border-stone-800 bg-stone-950 p-5">
              <p className="text-sm leading-7 text-stone-500">
                After submission, this record will be inserted into the
                Supabase marae_records table and the app will return to the
                Marae Records page.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                type="submit"
                disabled={isSubmitting}
                className="rounded-full bg-stone-100 px-6 py-3 text-sm font-semibold text-stone-950 transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSubmitting ? "Saving..." : "Create Marae Record"}
              </button>

              <button
                type="button"
                onClick={() => router.push("/marae")}
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