import { ArrowRight } from "lucide-react";

export function CTASection() {
  return (
    <section
      id="cta"
      className="relative overflow-hidden bg-stone-100 px-6 py-24 text-stone-950 lg:px-12 lg:py-32"
    >
      <div className="pointer-events-none absolute inset-0 opacity-[0.06]">
        <div className="absolute left-0 top-0 h-px w-full bg-stone-950" />
        <div className="absolute bottom-0 left-0 h-px w-full bg-stone-950" />
        <div className="absolute left-1/2 top-0 h-full w-px bg-stone-950" />
      </div>

      <div className="relative z-10 mx-auto max-w-[1400px]">
        <div className="rounded-[2rem] border border-stone-300 bg-white p-8 shadow-sm md:p-12 lg:p-16">
          <div className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
            <div>
              <p className="mb-5 font-mono text-sm uppercase tracking-[0.3em] text-stone-500">
                Next action
              </p>

              <h2 className="max-w-4xl text-4xl font-semibold tracking-tight md:text-6xl">
                Move from visual shell to operational infrastructure.
              </h2>

              <p className="mt-6 max-w-2xl text-lg leading-8 text-stone-600">
                The design layer is being transplanted safely through a test
                route first. Once the landing preview is stable, the same visual
                system can be applied to the real app without overwriting routes,
                Supabase logic, or working module flows.
              </p>
            </div>

            <div className="grid gap-4">
              <a
                href="/people"
                className="group flex items-center justify-between rounded-2xl bg-stone-950 px-6 py-5 text-stone-100 transition hover:bg-stone-800"
              >
                <div>
                  <div className="font-semibold">Open People Register</div>
                  <div className="mt-1 text-sm text-stone-400">
                    View and create live people records.
                  </div>
                </div>

                <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
              </a>

              <a
                href="/whakapapa"
                className="group flex items-center justify-between rounded-2xl border border-stone-300 px-6 py-5 transition hover:border-stone-500 hover:bg-stone-50"
              >
                <div>
                  <div className="font-semibold">Open Whakapapa</div>
                  <div className="mt-1 text-sm text-stone-600">
                    View and create relational records.
                  </div>
                </div>

                <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
              </a>

              <a
                href="/whenua"
                className="group flex items-center justify-between rounded-2xl border border-stone-300 px-6 py-5 transition hover:border-stone-500 hover:bg-stone-50"
              >
                <div>
                  <div className="font-semibold">Open Whenua</div>
                  <div className="mt-1 text-sm text-stone-600">
                    View and create whenua records.
                  </div>
                </div>

                <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}