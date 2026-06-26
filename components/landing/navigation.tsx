"use client";

import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";

const navLinks = [
  { name: "People", href: "/people" },
  { name: "Whakapapa", href: "/whakapapa" },
  { name: "Whenua", href: "/whenua" },
  { name: "Dashboard", href: "/" },
];

export function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed z-50 transition-all duration-500 ${
        isScrolled ? "left-4 right-4 top-4" : "left-0 right-0 top-0"
      }`}
    >
      <nav
        className={`mx-auto transition-all duration-500 ${
          isScrolled || isMobileMenuOpen
            ? "max-w-[1200px] rounded-2xl border border-stone-100/10 bg-stone-950/80 shadow-lg backdrop-blur-xl"
            : "max-w-[1400px] bg-transparent"
        }`}
      >
        <div
          className={`flex items-center justify-between px-6 transition-all duration-500 lg:px-8 ${
            isScrolled ? "h-14" : "h-20"
          }`}
        >
          <a href="/design-test" className="flex items-center gap-2">
            <span
              className={`font-semibold tracking-tight text-stone-100 transition-all duration-500 ${
                isScrolled ? "text-xl" : "text-2xl"
              }`}
            >
              Tangata
            </span>
            <span
              className={`font-mono text-stone-500 transition-all duration-500 ${
                isScrolled ? "mt-0.5 text-[10px]" : "mt-1 text-xs"
              }`}
            >
              MVP
            </span>
          </a>

          <div className="hidden items-center gap-12 md:flex">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="group relative text-sm text-stone-400 transition-colors duration-300 hover:text-stone-100"
              >
                {link.name}
                <span className="absolute -bottom-1 left-0 h-px w-0 bg-stone-100 transition-all duration-300 group-hover:w-full" />
              </a>
            ))}
          </div>

          <div className="hidden items-center gap-4 md:flex">
            <a
              href="/people/new"
              className={`text-stone-400 transition-all duration-500 hover:text-stone-100 ${
                isScrolled ? "text-xs" : "text-sm"
              }`}
            >
              Add person
            </a>

            <a
              href="/whakapapa/new"
              className={`rounded-full bg-stone-100 font-semibold text-stone-950 transition-all duration-500 hover:bg-white ${
                isScrolled ? "h-8 px-4 text-xs" : "px-6 py-2 text-sm"
              }`}
            >
              Add relationship
            </a>
          </div>

          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 text-stone-100 md:hidden"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>
      </nav>

      <div
        className={`fixed inset-0 z-40 bg-stone-950 transition-all duration-500 md:hidden ${
          isMobileMenuOpen
            ? "pointer-events-auto opacity-100"
            : "pointer-events-none opacity-0"
        }`}
      >
        <div className="flex h-full flex-col px-8 pb-8 pt-28">
          <div className="flex flex-1 flex-col justify-center gap-8">
            {navLinks.map((link, index) => (
              <a
                key={link.name}
                href={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`text-5xl font-semibold text-stone-100 transition-all duration-500 hover:text-stone-400 ${
                  isMobileMenuOpen
                    ? "translate-y-0 opacity-100"
                    : "translate-y-4 opacity-0"
                }`}
                style={{
                  transitionDelay: isMobileMenuOpen
                    ? `${index * 75}ms`
                    : "0ms",
                }}
              >
                {link.name}
              </a>
            ))}
          </div>

          <div
            className={`flex gap-4 border-t border-stone-100/10 pt-8 transition-all duration-500 ${
              isMobileMenuOpen
                ? "translate-y-0 opacity-100"
                : "translate-y-4 opacity-0"
            }`}
            style={{
              transitionDelay: isMobileMenuOpen ? "300ms" : "0ms",
            }}
          >
            <a
              href="/people/new"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex h-14 flex-1 items-center justify-center rounded-full border border-stone-100/20 text-base font-semibold text-stone-100"
            >
              Add person
            </a>

            <a
              href="/whakapapa/new"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex h-14 flex-1 items-center justify-center rounded-full bg-stone-100 text-base font-semibold text-stone-950"
            >
              Add relationship
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}