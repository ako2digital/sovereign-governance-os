"use client";

import { useEffect, useRef, useState } from "react";

const infrastructureLayers = [
  {
    name: "People Registry",
    layer: "Base records",
    status: "Active",
  },
  {
    name: "Whakapapa Relationships",
    layer: "Relational records",
    status: "Active",
  },
  {
    name: "Whenua Records",
    layer: "Land and history records",
    status: "Active",
  },
  {
    name: "Marae Records",
    layer: "Next module",
    status: "Planned",
  },
  {
    name: "Governance Records",
    layer: "Authority and decisions",
    status: "Planned",
  },
  {
    name: "Documents + Audit",
    layer: "Evidence and accountability",
    status: "Planned",
  },
];

export function InfrastructureSection() {
  const [isVisible, setIsVisible] = useState(false);
  const [activeLayer, setActiveLayer] = useState(0);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveLayer((previousLayer) => {
        return (previousLayer + 1) % infrastructureLayers.length;
      });
    }, 2200);

    return () => clearInterval(interval);
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden bg-stone-950 px-6 py-24 text-stone-100 lg:px-12 lg:py-32"
    >
      <div className="pointer-events-none absolute inset-0 opacity-30">
        <div className="absolute left-0 top-0 h-px w-full bg-stone-100/10" />
        <div className="absolute bottom-0 left-0 h-px w-full bg-stone-100/10" />
        <div className="absolute left-1/3 top-0 h-full w-px bg-stone-100/10" />
        <div className="absolute left-2/3 top-0 h-full w-px bg-stone-100/10" />
      </div>

      <div className="relative z-10 mx-auto max-w-[1400px]">
        <div className="grid items-center gap-16 lg:grid-cols-2 lg:gap-24">
          <div
            className={`transition-all duration-700 ${
              isVisible
                ? "translate-x-0 opacity-100"
                : "-translate-x-8 opacity-0"
            }`}
          >
            <span className="mb-6 inline-flex items-center gap-3 font-mono text-sm text-stone-500">
              <span className="h-px w-8 bg-stone-100/30" />
              Infrastructure
            </span>

            <h2 className="mb-8 text-4xl font-semibold tracking-tight text-white lg:text-6xl">
              Records first.
              <br />
              Sovereignty later.
            </h2>

            <p className="mb-12 max-w-xl text-xl leading-relaxed text-stone-400">
              The MVP starts with practical relational infrastructure: live
              database tables, working module pages, create forms, RLS policies,
              and a clean app shell. The long-term architecture can grow into
              stronger identity, permissions, storage, audit, and sovereignty
              layers.
            </p>

            <div className="grid grid-cols-3 gap-8">
              <div>
                <div className="mb-2 text-4xl font-semibold lg:text-5xl">3</div>
                <div className="text-sm text-stone-500">
                  Active modules
                </div>
              </div>

              <div>
                <div className="mb-2 text-4xl font-semibold lg:text-5xl">
                  RLS
                </div>
                <div className="text-sm text-stone-500">
                  Security enabled
                </div>
              </div>

              <div>
                <div className="mb-2 text-4xl font-semibold lg:text-5xl">
                  12
                </div>
                <div className="text-sm text-stone-500">
                  Planned modules
                </div>
              </div>
            </div>
          </div>

          <div
            className={`transition-all delay-200 duration-700 ${
              isVisible
                ? "translate-x-0 opacity-100"
                : "translate-x-8 opacity-0"
            }`}
          >
            <div className="overflow-hidden rounded-3xl border border-stone-800 bg-stone-900/60">
              <div className="flex items-center justify-between border-b border-stone-800 px-6 py-4">
                <span className="font-mono text-sm text-stone-500">
                  System Layers
                </span>

                <span className="flex items-center gap-2 font-mono text-xs text-green-400">
                  <span className="h-2 w-2 rounded-full bg-green-400" />
                  MVP online
                </span>
              </div>

              <div>
                {infrastructureLayers.map((layer, index) => (
                  <div
                    key={layer.name}
                    className={`flex items-center justify-between border-b border-stone-800 px-6 py-5 transition-all duration-300 last:border-b-0 ${
                      activeLayer === index ? "bg-stone-100/[0.04]" : ""
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <span
                        className={`h-2 w-2 rounded-full transition-colors duration-300 ${
                          activeLayer === index
                            ? "bg-stone-100"
                            : "bg-stone-100/20"
                        }`}
                      />

                      <div>
                        <div className="font-medium text-stone-100">
                          {layer.name}
                        </div>
                        <div className="text-sm text-stone-500">
                          {layer.layer}
                        </div>
                      </div>
                    </div>

                    <span
                      className={`font-mono text-sm ${
                        layer.status === "Active"
                          ? "text-green-400"
                          : "text-stone-500"
                      }`}
                    >
                      {layer.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-6 rounded-3xl border border-stone-800 bg-stone-900/40 p-6">
              <p className="font-mono text-xs uppercase tracking-[0.25em] text-stone-500">
                Current architecture
              </p>

              <p className="mt-4 text-sm leading-7 text-stone-400">
                Next.js interface, Supabase/PostgreSQL database, Row Level
                Security enabled, temporary MVP policies for local development,
                and module-by-module proof before expansion.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}