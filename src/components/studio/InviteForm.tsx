"use client";

import { useState, type FormEvent } from "react";
import { Loader2, Send, AlertCircle, CheckCircle2 } from "lucide-react";
import { createInvite } from "@/lib/actions/invites";
import { studioInputClasses, studioButtonClasses } from "./styles";

export function InviteForm() {
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    setSubmitting(true);

    const result = await createInvite(email);

    if (result.error) {
      setError(result.error);
      setSubmitting(false);
      return;
    }

    setSuccess(true);
    setEmail("");
    setSubmitting(false);
  }

  return (
    <form onSubmit={handleSubmit} className="flex items-end gap-3">
      <div className="flex-1">
        <label htmlFor="invite-email" className="mb-1.5 block text-xs text-text-muted">
          Email address
        </label>
        <input
          id="invite-email"
          type="email"
          required
          placeholder="teammate@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={studioInputClasses}
        />
      </div>

      <button type="submit" disabled={submitting} className={`${studioButtonClasses} w-auto`}>
        {submitting ? (
          <Loader2 className="h-4 w-4 animate-spin" strokeWidth={2.25} />
        ) : (
          <Send className="h-4 w-4" strokeWidth={2.25} />
        )}
        {submitting ? "Sending..." : "Send invite"}
      </button>

      {error && (
        <span className="flex items-center gap-1.5 text-sm text-[#f87171]">
          <AlertCircle className="h-4 w-4 shrink-0" strokeWidth={2.25} />
          {error}
        </span>
      )}
      {success && (
        <span className="flex items-center gap-1.5 text-sm text-[#4ade80]">
          <CheckCircle2 className="h-4 w-4 shrink-0" strokeWidth={2.25} />
          Invite sent.
        </span>
      )}
    </form>
  );
}
