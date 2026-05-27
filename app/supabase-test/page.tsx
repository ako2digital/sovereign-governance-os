import AppShell from "@/components/layout/AppShell";
import { supabase } from "@/lib/supabaseClient";

export default async function SupabaseTestPage() {
  const { data, error } = await supabase.from("people").select("*").limit(5);

  return (
    <AppShell title="Supabase Connection Test" eyebrow="Backend Test">
      <section className="rounded-3xl border border-stone-800 bg-stone-900/50 p-8">
        <p className="text-xs uppercase tracking-[0.25em] text-stone-500">
          Supabase Test
        </p>

        <h1 className="mt-3 text-3xl font-semibold text-white">
          Database Connection Check
        </h1>

        <p className="mt-4 max-w-2xl text-stone-400">
          This page checks whether the Next.js app can connect to the Supabase
          backend and query the people table.
        </p>
      </section>

      <section className="mt-8 rounded-2xl border border-stone-800 bg-stone-900 p-6">
        <h2 className="text-lg font-semibold text-white">Result</h2>

        {error ? (
          <div className="mt-4 rounded-xl border border-red-900 bg-red-950/40 p-4 text-sm text-red-300">
            <p className="font-semibold">Connection error</p>
            <pre className="mt-3 whitespace-pre-wrap">{error.message}</pre>
          </div>
        ) : (
          <div className="mt-4 rounded-xl border border-green-900 bg-green-950/40 p-4 text-sm text-green-300">
            <p className="font-semibold">Connection successful</p>
            <pre className="mt-3 whitespace-pre-wrap">
              {JSON.stringify(data, null, 2)}
            </pre>
          </div>
        )}
      </section>
    </AppShell>
  );
}
