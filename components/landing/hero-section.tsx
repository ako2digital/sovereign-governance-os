"use client";

import { useEffect, useState } from "react";
import { ArrowRight } from "lucide-react";
import { AnimatedSphere } from "./animated-sphere";

const words = ["organise", "protect", "connect", "govern"];

export function HeroSection() {
  const [isVisible, setIsVisible] = useState(false);
  const [wordIndex, setWordIndex] = useState(0);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setWordIndex((prev) => (prev + 1) % words.length);
    }, 2500);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative flex min-h-screen flex-col justify-center overflow-hidden bg-stone-950 text-stone-100">
      <div className="pointer-events-none absolute right-0 top-1/2 h-[600px] w-[600px] -translate-y-1/2 opacity-30 lg:h-[800px] lg:w-[800px]">
        <AnimatedSphere />
      </div>

      <div className="pointer-events-none absolute inset-0 overflow-hidden opacity-30">
        {[...Array(8)].map((_, index) => (
          <div
            key={`horizontal-${index}`}
            className="absolute h-px bg-stone-100/10"
            style={{
              top: `${12.5 * (index + 1)}%`,
              left: 0,
              right: 0,
            }}
          />
        ))}

        {[...Array(12)].map((_, index) => (
          <div
            key={`vertical-${index}`}
            className="absolute w-px bg-stone-100/10"
            style={{
              left: `${8.33 * (index + 1)}%`,
              top: 0,
              bottom: 0,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 mx-auto w-full max-w-[1400px] px-6 py-32 lg:px-12 lg:py-40">
        <div
          className={`mb-8 transition-all duration-700 ${
            isVisible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
          }`}
        >
          <span className="inline-flex items-center gap-3 text-sm font-mono text-stone-400">
            <span className="h-px w-8 bg-stone-100/30" />
            Sovereign relational infrastructure for hapū records
          </span>
        </div>

        <div className="mb-12">
          <h1
            className={`text-[clamp(3rem,10vw,9rem)] font-semibold leading-[0.9] tracking-tight transition-all duration-1000 ${
              isVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
            }`}
          >
            <span className="block">The system</span>
            <span className="block">
              to{" "}
              <span className="relative inline-block">
                <span key={wordIndex} className="inline-flex">
                  {words[wordIndex].split("").map((char, index) => (
                    <span
                      key={`${wordIndex}-${index}`}
                      className="inline-block"
                      style={{
                        animationDelay: `${index * 50}ms`,
                      }}
                    >
                      {char}
                    </span>
                  ))}
                </span>
                <span className="absolute -bottom-2 left-0 right-0 h-3 bg-stone-100/10" />
              </span>
            </span>
          </h1>
        </div>

        <div className="grid items-end gap-12 lg:grid-cols-2 lg:gap-24">
          <p
            className={`max-w-xl text-xl leading-relaxed text-stone-400 transition-all delay-200 duration-700 lg:text-2xl ${
              isVisible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
            }`}
          >
            A working records layer for people, whakapapa, whenua, marae,
            governance, hui, documents, decisions, pānui, tasks, and activity
            history.
          </p>

          <div
            className={`flex flex-col items-start gap-4 transition-all delay-300 duration-700 sm:flex-row ${
              isVisible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
            }`}
          >
            <a
              href="/people"
              className="group inline-flex h-14 items-center rounded-full bg-stone-100 px-8 text-base font-semibold text-stone-950 transition hover:bg-white"
            >
              View people register
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </a>

            <a
              href="/whakapapa"
              className="inline-flex h-14 items-center rounded-full border border-stone-100/20 px-8 text-base font-semibold text-stone-100 transition hover:bg-stone-100/5"
            >
              View whakapapa
            </a>
          </div>
        </div>
      </div>

      <div
        className={`absolute bottom-24 left-0 right-0 transition-all delay-500 duration-700 ${
          isVisible ? "opacity-100" : "opacity-0"
        }`}
      >
        <div className="flex gap-16 whitespace-nowrap">
          {[...Array(2)].map((_, index) => (
            <div key={index} className="flex gap-16">
              {[
                {
                  value: "3",
                  label: "working MVP modules",
                  area: "PEOPLE / WHAKAPAPA / WHENUA",
                },
                {
                  value: "12",
                  label: "planned data modules",
                  area: "FOUNDATION BUILD",
                },
                {
                  value: "Live",
                  label: "Supabase connection",
                  area: "DATABASE PROOF",
                },
                {
                  value: "RLS",
                  label: "security layer enabled",
                  area: "MVP POLICIES",
                },
              ].map((stat) => (
                <div key={`${stat.area}-${index}`} className="flex items-baseline gap-4">
                  <span className="text-4xl font-semibold lg:text-5xl">
                    {stat.value}
                  </span>
                  <span className="text-sm text-stone-400">
                    {stat.label}
                    <span className="mt-1 block font-mono text-xs">
                      {stat.area}
                    </span>
                  </span>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}