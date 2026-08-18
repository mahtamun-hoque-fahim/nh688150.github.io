"use client";

import { useState, type FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2, KeyRound, AlertCircle, CheckCircle2 } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { studioInputClasses, studioButtonClasses } from "./styles";

export function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    if (!token) {
      setError("This reset link is invalid or has expired.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords don't match.");
      return;
    }

    setSubmitting(true);
    const { error: resetError } = await authClient.resetPassword({ newPassword: password, token });

    if (resetError) {
      setError(resetError.message ?? "Something went wrong. Try requesting a new link.");
      setSubmitting(false);
      return;
    }

    setDone(true);
    setTimeout(() => router.push("/studio/login"), 1800);
  }

  if (!token) {
    return (
      <div className="flex items-center gap-2 text-sm text-[#f87171]">
        <AlertCircle className="h-4 w-4 shrink-0" strokeWidth={2.25} />
        This reset link is invalid or has expired.{" "}
        <a href="/studio/forgot-password" className="text-accent hover:text-accent-hover">
          Request a new one
        </a>
      </div>
    );
  }

  if (done) {
    return (
      <div className="flex flex-col items-center gap-3 py-4 text-center">
        <CheckCircle2 className="h-8 w-8 text-[#4ade80]" strokeWidth={2} />
        <p className="text-sm text-text-muted">Password updated. Redirecting to sign in...</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div>
        <label htmlFor="password" className="mb-1.5 block text-xs text-text-muted">
          New password
        </label>
        <input
          id="password"
          type="password"
          required
          minLength={10}
          autoComplete="new-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className={studioInputClasses}
        />
      </div>

      <div>
        <label htmlFor="confirmPassword" className="mb-1.5 block text-xs text-text-muted">
          Confirm new password
        </label>
        <input
          id="confirmPassword"
          type="password"
          required
          minLength={10}
          autoComplete="new-password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className={studioInputClasses}
        />
      </div>

      {error && (
        <div className="flex items-center gap-2 text-sm text-[#f87171]">
          <AlertCircle className="h-4 w-4 shrink-0" strokeWidth={2.25} />
          {error}
        </div>
      )}

      <button type="submit" disabled={submitting} className={studioButtonClasses}>
        {submitting ? (
          <Loader2 className="h-4 w-4 animate-spin" strokeWidth={2.25} />
        ) : (
          <KeyRound className="h-4 w-4" strokeWidth={2.25} />
        )}
        {submitting ? "Updating..." : "Update password"}
      </button>
    </form>
  );
}
