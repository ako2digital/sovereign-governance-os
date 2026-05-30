"use client";

import { useEffect, useRef, useState } from "react";

const steps = [
  {
    number: "I",
    title: "Create the core registers",
    description:
      "Start with people, whakapapa, whenua, marae, governance, hui, documents, decisions, pānui, tasks, and activity history.",
    code: `const module = "people"

await supabase
  .from("people")
  .select("*")
  .order("created_at")`,
  },
  {
    number: "II",
    title: "Connect the relationships",
    description:
      "Use relational records to connect people to whakapapa, whenua, hui, documents, decisions, tasks, and future authority layers.",
    code: `await supabase
  .from("whakapapa_relationships")
  .select(\`
    person_a:person_a_id(full_name),
    relationship_type,
    person_b:person_b_id(full_name)
  \`)`,
  },
  {
    number: "III",
    title: "Grow into governance infrastructure",
    description:
      "Build module by module until the system supports real hapū operations, evidence, accountability, and long-term data sovereignty.",
    code: `const roadmap = [
  "people",
  "whakapapa",
  "whenua",
  "marae",
  "governance",
  "documents"
]

// Build, test, prove, then expand.`,
  },
];

export function HowItWorksSection() {
  const [activeStep, setActiveStep] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

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
      setActiveStep((previousStep) => (previousStep + 1) % steps.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section
      id="how-it-works"
      ref={sectionRef}
      className="relative overflow-hidden bg-stone-100 py-24 text-stone-950 lg:py-32"
    >
      <div className="pointer-events-none absolute inset-0 opacity-[0.06]">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `repeating-linear-gradient(
              -45deg,
              transparent,
              transparent 40px,
              currentColor 40px,
              currentColor 41px
            )`,
          }}
        />
      </div>

      <div className="relative z-10 mx-auto max-w-[1400px] px-6 lg:px-12">
        <div className="mb-16 lg:mb-24">
          <span className="mb-6 inline-flex items-center gap-3 font-mono text-sm text-stone-500">
            <span className="h-px w-8 bg-stone-950/30" />
            Process
          </span>

          <h2
            className={`text-4xl font-semibold tracking-tight transition-all duration-700 lg:text-6xl ${
              isVisible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
            }`}
          >
            Build the system.
            <br />
            <span className="text-stone-500">Prove each layer.</span>
          </h2>
        </div>

        <div className="grid gap-16 lg:grid-cols-2 lg:gap-24">
          <div>
            {steps.map((step, index) => (
              <button
                key={step.number}
                type="button"
                onClick={() => setActiveStep(index)}
                className={`group w-full border-b border-stone-950/10 py-8 text-left transition-all duration-500 ${
                  activeStep === index
                    ? "opacity-100"
                    : "opacity-40 hover:opacity-70"
                }`}
              >
                <div className="flex items-start gap-6">
                  <span className="text-3xl font-semibold text-stone-400">
                    {step.number}
                  </span>

                  <div className="flex-1">
                    <h3 className="mb-3 text-2xl font-semibold transition-transform duration-300 group-hover:translate-x-2 lg:text-3xl">
                      {step.title}
                    </h3>

                    <p className="max-w-xl leading-relaxed text-stone-600">
                      {step.description}
                    </p>

                    {activeStep === index ? (
                      <div className="mt-4 h-px overflow-hidden bg-stone-950/20">
                        <div
                          className="h-full bg-stone-950"
                          style={{
                            animation: "progress 5s linear forwards",
                          }}
                        />
                      </div>
                    ) : null}
                  </div>
                </div>
              </button>
            ))}
          </div>

          <div className="self-start lg:sticky lg:top-32">
            <div className="overflow-hidden rounded-3xl border border-stone-950/10 bg-stone-950 text-stone-100">
              <div className="flex items-center justify-between border-b border-stone-100/10 px-6 py-4">
                <div className="flex gap-2">
                  <div className="h-3 w-3 rounded-full bg-stone-100/20" />
                  <div className="h-3 w-3 rounded-full bg-stone-100/20" />
                  <div className="h-3 w-3 rounded-full bg-stone-100/20" />
                </div>

                <span className="font-mono text-xs text-stone-500">
                  sovereign-os.ts
                </span>
              </div>

              <div className="min-h-[280px] p-8 font-mono text-sm">
                <pre className="text-stone-300">
                  {steps[activeStep].code.split("\n").map((line, lineIndex) => (
                    <div
                      key={`${activeStep}-${lineIndex}`}
                      className="leading-loose"
                    >
                      <span className="inline-block w-8 select-none text-stone-700">
                        {lineIndex + 1}
                      </span>
                      <span>{line}</span>
                    </div>
                  ))}
                </pre>
              </div>

              <div className="flex items-center gap-3 border-t border-stone-100/10 px-6 py-4">
                <span className="h-2 w-2 rounded-full bg-green-400" />
                <span className="font-mono text-xs text-stone-500">
                  MVP layer active
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes progress {
          from {
            width: 0%;
          }
          to {
            width: 100%;
          }
        }
      `}</style>
    </section>
  );
}