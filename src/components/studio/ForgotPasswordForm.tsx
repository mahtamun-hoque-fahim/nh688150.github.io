"use client";

import { useState, type FormEvent } from "react";
import { Loader2, Mail, CheckCircle2 } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { studioInputClasses, studioButtonClasses } from "./styles";

export function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);

    // Always show the same success state whether or not the email exists —
    // don't leak account existence via response differences.
    await authClient.requestPasswordReset({
      email,
      redirectTo: "/studio/reset-password",
    });

    setSubmitting(false);
    setSent(true);
  }

  if (sent) {
    return (
      <div className="flex flex-col items-center gap-3 py-4 text-center">
        <CheckCircle2 className="h-8 w-8 text-[#4ade80]" strokeWidth={2} />
        <p className="text-sm text-text-muted">
          If an account exists for that email, a reset link is on its way.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div>
        <label htmlFor="email" className="mb-1.5 block text-xs text-text-muted">
          Email
        </label>
        <input
          id="email"
          type="email"
          required
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={studioInputClasses}
        />
      </div>

      <button type="submit" disabled={submitting} className={studioButtonClasses}>
        {submitting ? (
          <Loader2 className="h-4 w-4 animate-spin" strokeWidth={2.25} />
        ) : (
          <Mail className="h-4 w-4" strokeWidth={2.25} />
        )}
        {submitting ? "Sending..." : "Send reset link"}
      </button>
    </form>
  );
}
