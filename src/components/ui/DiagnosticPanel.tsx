"use client";

import { useEffect, useState } from "react";

const logLines = [
  "[INFO] Initializing Hardware Accelerator...",
  "[INFO] Device: Apple M3 Max (30-core GPU)",
  "[OK]   Metal Shading Language Loaded.",
  "[OK]   Local Sandbox Environment Verified.",
  "[INFO] Ready for local document ingestion.",
];

export function DiagnosticPanel() {
  const [gpuUtil, setGpuUtil] = useState(84);

  useEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) return;

    const interval = setInterval(() => {
      setGpuUtil((prev) => {
        const next = prev + (Math.random() > 0.5 ? 1 : -1) * (Math.random() * 3);
        return Math.min(96, Math.max(76, Math.round(next)));
      });
    }, 1800);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full rounded-lg border border-border bg-[#0a0b0e] font-mono shadow-[0_20px_60px_rgba(0,0,0,0.55)]">
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
              className="h-full rounded-full bg-accent transition-[width] duration-1000 ease-out"
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
            <div className="h-full w-[32%] rounded-full bg-accent" />
          </div>
        </div>

        <div className="rounded-md bg-surface p-4 text-xs leading-relaxed text-text-muted">
          {logLines.map((line) => (
            <p key={line}>{line}</p>
          ))}
          <span className="inline-block h-3 w-1.5 translate-y-0.5 animate-pulse bg-accent" />
        </div>
      </div>
    </div>
  );
}
