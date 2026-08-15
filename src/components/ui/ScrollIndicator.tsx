import { ChevronDown } from "lucide-react";

export function ScrollIndicator({ className = "" }: { className?: string }) {
  return (
    <div
      className={`pointer-events-none absolute inset-x-0 bottom-8 flex justify-center ${className}`}
      aria-hidden="true"
    >
      <ChevronDown className="h-6 w-6 animate-scroll-hint text-text-muted" strokeWidth={2} />
    </div>
  );
}
