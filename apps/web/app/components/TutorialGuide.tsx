"use client";

import { useEffect, useState } from "react";
import { useTutorialStore } from "@/lib/store/tutorial";

const STEPS = [
  {
    title: "Welcome! 🐧",
    text: "I'm Puffin, your NCS guide! Let me show you around the North Sea traffic map.",
    pointer: null,
  },
  {
    title: "Sidebar layers",
    text: "Use the sidebar on the left to toggle petroleum fields, helicopters, weather, and more.",
    pointer: "left" as const,
  },
  {
    title: "Petroleum fields",
    text: "Field polygons like Johan Sverdrup, Ekofisk, Troll, and Ormen Lange are shown with colored boundaries. Click them for details!",
    pointer: null,
  },
  {
    title: "Helicopter traffic",
    text: "Orange markers are helicopters flying to offshore installations. Their trajectories build up over time.",
    pointer: null,
  },
  {
    title: "Vessel traffic",
    text: "Vessels in the North Sea are shown as markers on the map. Toggle them in the sidebar.",
    pointer: null,
  },
  {
    title: "Weather & waves",
    text: "Enable the Wind and Waves layers to see current conditions across the North Sea.",
    pointer: "left" as const,
  },
  {
    title: "You're all set!",
    text: "Explore the North Sea at your own pace. Click the puffin button anytime to restart this guide!",
    pointer: null,
  },
];

/** Animated puffin bird character (SVG). */
function PuffinCharacter({ talking }: { talking: boolean }) {
  return (
    <div className="relative w-16 h-16 shrink-0 select-none" aria-hidden>
      <svg viewBox="0 0 64 64" width="64" height="64" className="drop-shadow-md">
        {/* Body */}
        <ellipse cx="32" cy="44" rx="14" ry="16" fill="#1e293b" />
        {/* White belly */}
        <ellipse cx="32" cy="46" rx="9" ry="12" fill="#f8fafc" />
        {/* Head */}
        <circle cx="32" cy="22" r="13" fill="#1e293b" />
        {/* White face patches */}
        <ellipse cx="26" cy="22" rx="5" ry="6" fill="#f1f5f9" />
        <ellipse cx="38" cy="22" rx="5" ry="6" fill="#f1f5f9" />
        {/* Eyes */}
        <circle cx="26" cy="21" r="2.5" fill="#1e293b">
          <animate attributeName="r" values="2.5;0.5;2.5" dur="3s" repeatCount="indefinite" />
        </circle>
        <circle cx="38" cy="21" r="2.5" fill="#1e293b">
          <animate attributeName="r" values="2.5;0.5;2.5" dur="3s" repeatCount="indefinite" />
        </circle>
        {/* Eye highlights */}
        <circle cx="27" cy="20" r="0.8" fill="white" />
        <circle cx="39" cy="20" r="0.8" fill="white" />
        {/* Beak - colorful puffin beak */}
        <polygon points="32,24 24,28 32,31" fill="#94a3b8" />
        <polygon points="32,24 40,28 32,31" fill="#94a3b8" />
        <polygon points="32,25 26,28 32,30" fill="#f97316" />
        <polygon points="32,25 38,28 32,30" fill="#ea580c" />
        <polygon points="32,25.5 28,27.5 32,29" fill="#dc2626" />
        <polygon points="32,25.5 36,27.5 32,29" fill="#b91c1c" />
        <line x1="32" y1="24.5" x2="32" y2="30.5" stroke="#fbbf24" strokeWidth="0.8" />
        {/* Beak tip */}
        <ellipse cx="32" cy="30.5" rx="1.5" ry="1" fill="#f97316" />
        {/* Mouth animation */}
        {talking && (
          <ellipse cx="32" cy="29" rx="2" ry="1" fill="#1e293b">
            <animate attributeName="ry" values="1;0.3;1.5;0.3;1" dur="0.5s" repeatCount="indefinite" />
          </ellipse>
        )}
        {/* Feet */}
        <ellipse cx="27" cy="59" rx="4" ry="1.5" fill="#f97316" />
        <ellipse cx="37" cy="59" rx="4" ry="1.5" fill="#f97316" />
        {/* Wing wave */}
        <g>
          <animateTransform
            attributeName="transform"
            type="rotate"
            values="0 18 38;-12 18 38;0 18 38;12 18 38;0 18 38"
            dur="1s"
            repeatCount="indefinite"
          />
          <ellipse cx="16" cy="40" rx="5" ry="10" fill="#1e293b" />
          <ellipse cx="16" cy="40" rx="3" ry="8" fill="#334155" />
        </g>
        {/* Right wing (static) */}
        <ellipse cx="48" cy="40" rx="5" ry="10" fill="#1e293b" />
        <ellipse cx="48" cy="40" rx="3" ry="8" fill="#334155" />
        {/* Body bobble */}
        <animateTransform
          attributeName="transform"
          type="translate"
          values="0,0;0,-1.5;0,0"
          dur="1.5s"
          repeatCount="indefinite"
        />
      </svg>
    </div>
  );
}

/** Mini puffin icon for the floating button. */
function PuffinIcon() {
  return (
    <svg viewBox="0 0 32 32" width="24" height="24" className="shrink-0">
      <circle cx="16" cy="12" r="8" fill="#1e293b" />
      <ellipse cx="12" cy="12" rx="3" ry="3.5" fill="#f1f5f9" />
      <ellipse cx="20" cy="12" rx="3" ry="3.5" fill="#f1f5f9" />
      <circle cx="12" cy="11.5" r="1.5" fill="#1e293b" />
      <circle cx="20" cy="11.5" r="1.5" fill="#1e293b" />
      <polygon points="16,13 12,15.5 16,17" fill="#f97316" />
      <polygon points="16,13 20,15.5 16,17" fill="#ea580c" />
      <ellipse cx="16" cy="23" rx="7" ry="8" fill="#1e293b" />
      <ellipse cx="16" cy="24" rx="4.5" ry="6" fill="#f8fafc" />
    </svg>
  );
}

/** Speech bubble. */
function SpeechBubble({
  title,
  text,
  pointer,
}: {
  title: string;
  text: string;
  pointer: "left" | null;
}) {
  return (
    <div className="relative">
      {pointer === "left" && (
        <div className="absolute top-1/2 -left-5 -translate-y-1/2 text-white/90 dark:text-slate-800/90 font-bold text-xl animate-bounce">
          👈
        </div>
      )}
      <div className="bg-white/95 dark:bg-slate-800/95 backdrop-blur-sm rounded-2xl shadow-2xl border border-slate-200 dark:border-white/10 px-4 py-3 max-w-xs">
        <p className="text-sm font-bold text-slate-800 dark:text-white">{title}</p>
        <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">{text}</p>
      </div>
    </div>
  );
}

export default function TutorialGuide() {
  const completed = useTutorialStore((s) => s.completed);
  const step = useTutorialStore((s) => s.step);
  const setStep = useTutorialStore((s) => s.setStep);
  const complete = useTutorialStore((s) => s.complete);
  const restart = useTutorialStore((s) => s.restart);

  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  // Floating puffin button when tutorial is completed
  if (completed) {
    return (
      <button
        onClick={restart}
        aria-label="Start tutorial"
        className="fixed bottom-6 right-6 z-[2000] flex items-center justify-center size-12 rounded-full bg-slate-800 hover:bg-slate-700 dark:bg-slate-700 dark:hover:bg-slate-600 border border-slate-600 dark:border-white/15 shadow-lg transition-all duration-200 cursor-pointer hover:scale-110"
      >
        <PuffinIcon />
      </button>
    );
  }

  const current = STEPS[step];
  const isLast = step === STEPS.length - 1;

  return (
    <div className="fixed bottom-6 right-6 z-[2000] flex items-end gap-3 animate-[slideUp_0.4s_ease-out]">
      <PuffinCharacter talking={!isLast} />
      <div className="flex flex-col gap-2">
        <SpeechBubble
          title={current.title}
          text={current.text}
          pointer={current.pointer ?? null}
        />
        <div className="flex items-center justify-between gap-2 px-1">
          <span className="text-[10px] text-slate-400 dark:text-white/30 font-medium">
            {step + 1} / {STEPS.length}
          </span>
          <div className="flex gap-1.5">
            <button
              onClick={complete}
              className="px-3 py-1.5 text-xs font-medium rounded-lg bg-slate-200 text-slate-600 hover:bg-slate-300 dark:bg-white/10 dark:text-white/60 dark:hover:bg-white/15 transition-colors cursor-pointer"
            >
              Skip
            </button>
            {step > 0 && (
              <button
                onClick={() => setStep(step - 1)}
                className="px-3 py-1.5 text-xs font-medium rounded-lg bg-slate-200 text-slate-600 hover:bg-slate-300 dark:bg-white/10 dark:text-white/60 dark:hover:bg-white/15 transition-colors cursor-pointer"
              >
                Back
              </button>
            )}
            <button
              onClick={() => (isLast ? complete() : setStep(step + 1))}
              className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-cyan-500 text-white hover:bg-cyan-600 shadow-sm transition-colors cursor-pointer"
            >
              {isLast ? "Finish" : "Next"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
