"use client";

import { useEffect, useRef, useState } from "react";

const logLines = [
  "[INFO] Initializing Hardware Accelerator...",
  "[INFO] Device: Apple M3 Max (30-core GPU)",
  "[OK]   Metal Shading Language Loaded.",
  "[OK]   Local Sandbox Environment Verified.",
  "[INFO] Ready for local document ingestion.",
];

const GPU_TARGET = 84;
const OCR_TARGET = 32;

type Phase = "idle" | "loading" | "streaming" | "done";

interface DiagnosticPanelProps {
  active: boolean;
}

export function DiagnosticPanel({ active }: DiagnosticPanelProps) {
  const [phase, setPhase] = useState<Phase>("idle");
  const [loadingPct, setLoadingPct] = useState(0);
  const [visibleLines, setVisibleLines] = useState(0);
  const [gpuUtil, setGpuUtil] = useState(0);
  const [ocrPct, setOcrPct] = useState(0);
  const [dotCount, setDotCount] = useState(0);
  const startedRef = useRef(false);

  // Kick off the whole sequence the first time the panel becomes active
  useEffect(() => {
    if (!active || startedRef.current) return;
    startedRef.current = true;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduceMotion) {
      setPhase("done");
      setLoadingPct(100);
      setVisibleLines(logLines.length);
      setGpuUtil(GPU_TARGET);
      setOcrPct(OCR_TARGET);
      return;
    }

    setPhase("loading");

    let pct = 0;
    const loadInterval = setInterval(() => {
      pct = Math.min(100, pct + Math.round(7 + Math.random() * 11));
      setLoadingPct(pct);
      if (pct >= 100) {
        clearInterval(loadInterval);
        window.setTimeout(() => setPhase("streaming"), 200);
      }
    }, 45);

    let gpu = 0;
    const gpuInterval = setInterval(() => {
      gpu = Math.min(GPU_TARGET, gpu + Math.ceil((GPU_TARGET - gpu) * 0.2) + 1);
      setGpuUtil(gpu);
      if (gpu >= GPU_TARGET) clearInterval(gpuInterval);
    }, 40);

    let ocr = 0;
    const ocrInterval = setInterval(() => {
      ocr = Math.min(OCR_TARGET, ocr + Math.ceil((OCR_TARGET - ocr) * 0.25) + 1);
      setOcrPct(ocr);
      if (ocr >= OCR_TARGET) clearInterval(ocrInterval);
    }, 40);

    return () => {
      clearInterval(loadInterval);
      clearInterval(gpuInterval);
      clearInterval(ocrInterval);
    };
  }, [active]);

  // Stream the log lines in one at a time once loading finishes
  useEffect(() => {
    if (phase !== "streaming") return;
    if (visibleLines >= logLines.length) {
      setPhase("done");
      return;
    }
    const t = window.setTimeout(() => setVisibleLines((n) => n + 1), 220);
    return () => window.clearTimeout(t);
  }, [phase, visibleLines]);

  // Once settled, let GPU util drift subtly like a live system
  useEffect(() => {
    if (phase !== "done") return;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) return;

    const interval = setInterval(() => {
      setGpuUtil((prev) => {
        const next = prev + (Math.random() > 0.5 ? 1 : -1) * (Math.random() * 3);
        return Math.min(96, Math.max(76, Math.round(next)));
      });
    }, 1800);

    return () => clearInterval(interval);
  }, [phase]);

  // Infinite looping "Initializing..." dots on the cursor line
  useEffect(() => {
    if (!active) return;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) {
      setDotCount(3);
      return;
    }
    const interval = setInterval(() => {
      setDotCount((d) => (d + 1) % 4);
    }, 400);
    return () => clearInterval(interval);
  }, [active]);

  return (
    <div
      className={`w-full rounded-lg border border-border bg-[#0a0b0e] font-mono shadow-[0_20px_60px_rgba(0,0,0,0.55)] transition-all duration-700 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${
        active ? "translate-x-0 opacity-100" : "translate-x-16 opacity-0"
      }`}
    >
      <div className="flex items-center justify-between border-b border-border px-5 py-3.5">
        <div className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
        </div>
        <span className="text-xs text-text-faint">SYS_DIAGNOSTIC_v2.0</span>
      </div>

      <div className="space-y-4 px-5 py-5">
        <div>
          <div className="mb-1.5 flex items-center justify-between text-xs">
            <span className="text-text-muted">GPU_THREAD_UTIL</span>
            <span className="tabular-nums text-text">{gpuUtil}%</span>
          </div>
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-surface-elevated">
            <div
              className="h-full rounded-full bg-accent transition-[width] duration-150 ease-out"
              style={{ width: `${gpuUtil}%` }}
            />
          </div>
        </div>

        <div>
          <div className="mb-1.5 flex items-center justify-between text-xs">
            <span className="text-text-muted">NATIVE_OCR_BUFFER</span>
            <span className="tabular-nums text-text">1.2 GB</span>
          </div>
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-surface-elevated">
            <div
              className="h-full rounded-full bg-accent transition-[width] duration-150 ease-out"
              style={{ width: `${ocrPct}%` }}
            />
          </div>
        </div>

        <div className="min-h-[112px] rounded-md bg-surface p-4 text-xs leading-relaxed text-text-muted">
          {phase !== "idle" && (
            <p className={loadingPct < 100 ? "text-text" : "text-text-muted"}>
              [INFO] Loading<span className="tabular-nums">... {loadingPct}%</span>
            </p>
          )}

          {(phase === "streaming" || phase === "done") &&
            logLines
              .slice(0, phase === "done" ? logLines.length : visibleLines)
              .map((line) => <p key={line}>{line}</p>)}

          {phase === "done" && (
            <p className="text-text-muted">
              Initializing
              <span className="inline-block w-[1.5em]">{".".repeat(dotCount)}</span>
              <span className="inline-block h-3 w-1.5 translate-y-0.5 animate-pulse bg-accent" />
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
