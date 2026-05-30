"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import AppShell from "@/components/layout/AppShell";
import { supabase } from "@/lib/supabaseClient";

const futureLinks = [
  "Whenua connections",
  "Hui records",
  "Governance records",
  "Supporting documents",
  "Marae activity history",
];

export default function NewMaraePage() {
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
      <section className="grid gap-6">
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

          <h1 className="mt-5 max-w-5xl text-4xl font-semibold tracking-tight text-white md:text-5xl">
            Add a marae as a community anchor inside the system.
          </h1>

          <p className="mt-5 max-w-3xl text-base leading-8 text-stone-400">
            A marae record should later connect to whenua, hui, governance
            records, documents, decisions, tasks, and activity history.
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
                Use the confirmed marae_records fields.
              </h2>
            </div>

            <div className="mt-6 grid gap-6">
              <label className="grid gap-3">
                <span className="text-sm font-semibold text-stone-300">
                  Marae name <span className="text-red-300">*</span>
                </span>

                <input
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  required
                  placeholder="Example: Kohewhata Marae"
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
                  placeholder="Example: Kaikohe, Te Tai Tokerau"
                  className="rounded-2xl border border-stone-700 bg-stone-950 px-5 py-4 text-stone-100 outline-none transition placeholder:text-stone-600 focus:border-stone-400"
                />
              </label>

              <label className="grid gap-3">
                <span className="text-sm font-semibold text-stone-300">
                  Description / notes
                </span>

                <textarea
                  value={description}
                  onChange={(event) => setDescription(event.target.value)}
                  placeholder="Add context, history, rohe, hapū connection, or operational notes."
                  className="min-h-40 rounded-2xl border border-stone-700 bg-stone-950 px-5 py-4 text-stone-100 outline-none transition placeholder:text-stone-600 focus:border-stone-400"
                />
              </label>

              <div className="rounded-2xl border border-stone-800 bg-stone-950 p-5">
                <p className="font-mono text-xs uppercase tracking-[0.25em] text-stone-600">
                  Current schema
                </p>

                <p className="mt-3 text-sm leading-7 text-stone-500">
                  This form only writes confirmed columns: name, location, and
                  description. Extra fields can be added after the marae table
                  schema is confirmed.
                </p>
              </div>

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
                      Available after the marae record exists.
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
                Create the marae record first. Then connect the record to
                whenua, hui, governance, documents, decisions, tasks, and
                future activity logs.
              </p>
            </div>

            <div className="rounded-3xl border border-stone-800 bg-stone-900/60 p-6">
              <p className="font-mono text-xs uppercase tracking-[0.3em] text-stone-500">
                Linked actions
              </p>

              <div className="mt-5 grid gap-3">
                <a
                  href="/whenua"
                  className="rounded-2xl border border-stone-800 bg-stone-950 p-4 text-sm font-semibold text-stone-300 transition hover:border-stone-600 hover:bg-stone-900 hover:text-white"
                >
                  View Whenua
                </a>

                <a
                  href="/hui"
                  className="rounded-2xl border border-stone-800 bg-stone-950 p-4 text-sm font-semibold text-stone-300 transition hover:border-stone-600 hover:bg-stone-900 hover:text-white"
                >
                  View Hui
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