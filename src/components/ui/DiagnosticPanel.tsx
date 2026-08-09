"use client";

import { useEffect, useRef, useState } from "react";

const logLines = [
  "[INFO] Initializing Hardware Accelerator...",
  "[INFO] Device: Apple M3 Max (30-core GPU)",
  "[OK]   Metal Shading Language Loaded.",
  "[OK]   Local Sandbox Environment Verified.",
  "[INFO] Ready for local document ingestion.",
];

const LOADING_LABEL = "[INFO] Loading...";
const GPU_TARGET = 84;
const OCR_TARGET = 32;

// Timing -- deliberately unhurried so the ramp-up is felt, not just seen.
const FLY_IN_SETTLE_MS = 900; // fly-in transition + a beat before anything happens
const LABEL_TYPE_MS = 42; // per character
const PCT_DURATION_MS = 2400; // 0 -> 100, eased
const GAP_AFTER_LOADING_MS = 350;
const LOG_TYPE_MS = 20; // per character
const LOG_LINE_GAP_MS = 240;
const BAR_DURATION_MS = 2800; // 0 -> target, eased
const FINAL_LABEL_TYPE_MS = 42;

// Accelerating curve -- starts slow, visibly speeds up. This is the whole point.
const easeInQuad = (t: number) => t * t;

type Phase = "idle" | "label" | "counting" | "streaming" | "done";

interface DiagnosticPanelProps {
  active: boolean;
}

function typeText(
  text: string,
  speedMs: number,
  onChar: (partial: string) => void,
  onDone: () => void
): () => void {
  let i = 0;
  let timer: number;
  const step = () => {
    i++;
    onChar(text.slice(0, i));
    if (i < text.length) {
      timer = window.setTimeout(step, speedMs);
    } else {
      onDone();
    }
  };
  timer = window.setTimeout(step, speedMs);
  return () => window.clearTimeout(timer);
}

function animateValue(
  duration: number,
  target: number,
  onUpdate: (value: number) => void,
  onDone: () => void
): () => void {
  const start = performance.now();
  let raf: number;
  const tick = (now: number) => {
    const t = Math.min(1, (now - start) / duration);
    onUpdate(Math.round(easeInQuad(t) * target));
    if (t < 1) {
      raf = requestAnimationFrame(tick);
    } else {
      onDone();
    }
  };
  raf = requestAnimationFrame(tick);
  return () => cancelAnimationFrame(raf);
}

export function DiagnosticPanel({ active }: DiagnosticPanelProps) {
  const [phase, setPhase] = useState<Phase>("idle");
  const [loadingLabelTyped, setLoadingLabelTyped] = useState("");
  const [loadingPct, setLoadingPct] = useState(0);
  const [lineTyped, setLineTyped] = useState<string[]>([]);
  const [currentLine, setCurrentLine] = useState("");
  const [gpuUtil, setGpuUtil] = useState(0);
  const [ocrPct, setOcrPct] = useState(0);
  const [finalLabelTyped, setFinalLabelTyped] = useState("");
  const [dotCount, setDotCount] = useState(0);
  const startedRef = useRef(false);
  const cleanupRef = useRef<(() => void) | null>(null);

  // Orchestrate the whole boot sequence the first time the panel becomes active
  useEffect(() => {
    if (!active || startedRef.current) return;
    startedRef.current = true;

    const cleanups: Array<() => void> = [];
    const timers: number[] = [];
    const setT = (fn: () => void, ms: number) => {
      const id = window.setTimeout(fn, ms);
      timers.push(id);
    };

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduceMotion) {
      setPhase("done");
      setLoadingLabelTyped(LOADING_LABEL);
      setLoadingPct(100);
      setLineTyped(logLines);
      setCurrentLine("");
      setGpuUtil(GPU_TARGET);
      setOcrPct(OCR_TARGET);
      setFinalLabelTyped("Initializing");
      return;
    }

    // Bars start filling once the panel has settled in -- independent of the text sequence
    setT(() => {
      cleanups.push(animateValue(BAR_DURATION_MS, GPU_TARGET, setGpuUtil, () => {}));
      cleanups.push(animateValue(BAR_DURATION_MS, OCR_TARGET, setOcrPct, () => {}));
    }, FLY_IN_SETTLE_MS);

    // Text sequence: type "Loading...", then count the percentage up
    setT(() => {
      setPhase("label");
      cleanups.push(
        typeText(LOADING_LABEL, LABEL_TYPE_MS, setLoadingLabelTyped, () => {
          setPhase("counting");
          setT(() => {
            cleanups.push(
              animateValue(PCT_DURATION_MS, 100, setLoadingPct, () => {
                setT(() => setPhase("streaming"), GAP_AFTER_LOADING_MS);
              })
            );
          }, 150);
        })
      );
    }, FLY_IN_SETTLE_MS);

    return () => {
      timers.forEach(window.clearTimeout);
      cleanups.forEach((fn) => fn());
    };
  }, [active]);

  // Stream the log lines in one at a time, each typed character by character
  useEffect(() => {
    if (phase !== "streaming") return;
    if (lineTyped.length >= logLines.length) {
      setPhase("done");
      return;
    }
    const line = logLines[lineTyped.length];
    const cleanup = typeText(line, LOG_TYPE_MS, setCurrentLine, () => {
      setLineTyped((prev) => [...prev, line]);
      setCurrentLine("");
    });
    return cleanup;
  }, [phase, lineTyped]);

  // Once fully booted, let GPU util drift subtly like a live system
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

  // Type "Initializing" once settled, then loop the dots forever
  useEffect(() => {
    if (phase !== "done") return;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) {
      setFinalLabelTyped("Initializing");
      setDotCount(3);
      return;
    }

    const cleanup = typeText("Initializing", FINAL_LABEL_TYPE_MS, setFinalLabelTyped, () => {
      const interval = setInterval(() => {
        setDotCount((d) => (d + 1) % 4);
      }, 420);
      cleanupRef.current = () => clearInterval(interval);
    });

    return () => {
      cleanup();
      cleanupRef.current?.();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase]);

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
              {loadingLabelTyped}
              {(phase === "counting" || phase === "streaming" || phase === "done") && (
                <span className="tabular-nums"> {loadingPct}%</span>
              )}
            </p>
          )}

          {lineTyped.map((line) => (
            <p key={line}>{line}</p>
          ))}
          {phase === "streaming" && currentLine && <p>{currentLine}</p>}

          {phase === "done" && (
            <p className="text-text-muted">
              {finalLabelTyped}
              <span className="inline-block w-[1.5em]">{".".repeat(dotCount)}</span>
              <span className="inline-block h-3 w-1.5 translate-y-0.5 animate-pulse bg-accent" />
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
