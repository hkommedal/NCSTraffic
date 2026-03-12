"use client";

import { useState, useCallback, useEffect } from "react";
import PuffinGuide from "./PuffinGuide";

const TUTORIAL_STEPS = [
  {
    title: "Welcome to NCS Traffic!",
    body: "I'm Puffin, your guide. Let me show you around the North Sea traffic map!",
    target: null,
  },
  {
    title: "Petroleum Fields",
    body: "The map shows petroleum field polygons like Johan Sverdrup, Ekofisk, Troll, Brage and Ormen Lange. Toggle them under the Fields section in the sidebar.",
    target: "sidebar-fields",
  },
  {
    title: "Facilities",
    body: "Each field has facilities — platforms, templates, and wellheads. You can toggle facility types in the Facilities section.",
    target: "sidebar-facilities",
  },
  {
    title: "Helicopter Traffic",
    body: "Helicopter flights to offshore installations are tracked in real-time from Flightradar24. Their trajectories are drawn as they move!",
    target: "sidebar-helicopters",
  },
  {
    title: "Layer Controls",
    body: "Use the sidebar to toggle layers on and off — airports, weather, waves and more. Expand each section to fine-tune.",
    target: "sidebar-layers",
  },
  {
    title: "Theme & Navigation",
    body: "Switch between light and dark mode, and visit the Data Sources page to see API status. That's it — enjoy exploring!",
    target: "sidebar-footer",
  },
] as const;

export default function Tutorial() {
  const [active, setActive] = useState(false);
  const [step, setStep] = useState(0);

  const start = useCallback(() => {
    setStep(0);
    setActive(true);
  }, []);

  const next = useCallback(() => {
    if (step < TUTORIAL_STEPS.length - 1) {
      setStep((s) => s + 1);
    } else {
      setActive(false);
    }
  }, [step]);

  const prev = useCallback(() => {
    setStep((s) => Math.max(0, s - 1));
  }, []);

  const close = useCallback(() => setActive(false), []);

  // Close on Escape
  useEffect(() => {
    if (!active) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setActive(false);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [active]);

  const current = TUTORIAL_STEPS[step];
  const isLast = step === TUTORIAL_STEPS.length - 1;

  return (
    <>
      {/* Tutorial start button in sidebar */}
      <button
        onClick={start}
        className="w-full flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-xs font-semibold text-slate-500 hover:bg-slate-100 hover:text-slate-800 transition-all duration-150 cursor-pointer select-none dark:text-white/40 dark:hover:bg-white/5 dark:hover:text-white/70"
      >
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="shrink-0"
        >
          <circle cx="12" cy="12" r="10" />
          <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
          <line x1="12" y1="17" x2="12.01" y2="17" />
        </svg>
        Tutorial
      </button>

      {/* Overlay + dialog */}
      {active && (
        <div
          className="fixed inset-0 z-[2000] flex items-end justify-center sm:items-center"
          onClick={close}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />

          {/* Dialog card */}
          <div
            className="relative mx-4 mb-8 sm:mb-0 flex flex-col items-center rounded-2xl bg-white dark:bg-[#1c2133] border border-slate-200 dark:border-white/10 shadow-2xl px-6 pt-2 pb-5 max-w-sm w-full"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              onClick={close}
              className="absolute top-3 right-3 text-slate-400 hover:text-slate-700 dark:text-white/30 dark:hover:text-white/70 transition-colors"
              aria-label="Close tutorial"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>

            {/* Puffin */}
            <div className="mt-1">
              <PuffinGuide size={72} />
            </div>

            {/* Step indicator */}
            <div className="flex gap-1.5 mt-2 mb-3">
              {TUTORIAL_STEPS.map((_, i) => (
                <span
                  key={i}
                  className={`size-1.5 rounded-full transition-colors ${
                    i === step
                      ? "bg-cyan-500"
                      : i < step
                        ? "bg-cyan-500/40"
                        : "bg-slate-300 dark:bg-white/15"
                  }`}
                />
              ))}
            </div>

            {/* Content */}
            <h3 className="text-base font-bold text-slate-800 dark:text-white text-center">
              {current.title}
            </h3>
            <p className="mt-1.5 text-sm text-slate-600 dark:text-white/65 text-center leading-relaxed">
              {current.body}
            </p>

            {/* Navigation buttons */}
            <div className="flex items-center gap-3 mt-4 w-full">
              {step > 0 ? (
                <button
                  onClick={prev}
                  className="flex-1 rounded-lg border border-slate-200 dark:border-white/10 py-2 text-xs font-semibold text-slate-600 dark:text-white/60 hover:bg-slate-50 dark:hover:bg-white/5 transition-colors"
                >
                  Back
                </button>
              ) : (
                <div className="flex-1" />
              )}
              <button
                onClick={next}
                className="flex-1 rounded-lg bg-cyan-500 hover:bg-cyan-600 py-2 text-xs font-semibold text-white shadow-sm transition-colors"
              >
                {isLast ? "Got it!" : "Next"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
