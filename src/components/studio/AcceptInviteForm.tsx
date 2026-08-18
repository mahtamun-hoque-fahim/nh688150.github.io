"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Loader2, UserPlus, AlertCircle, CheckCircle2 } from "lucide-react";
import { acceptInvite } from "@/lib/actions/invites";
import { studioInputClasses, studioButtonClasses } from "./styles";

export function AcceptInviteForm({ token, email }: { token: string; email: string }) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError("Passwords don't match.");
      return;
    }

    setSubmitting(true);
    const result = await acceptInvite(token, name, password);

    if (result.error) {
      setError(result.error);
      setSubmitting(false);
      return;
    }

    setDone(true);
    setTimeout(() => router.push("/studio/login"), 1800);
  }

  if (done) {
    return (
      <div className="flex flex-col items-center gap-3 py-4 text-center">
        <CheckCircle2 className="h-8 w-8 text-[#4ade80]" strokeWidth={2} />
        <p className="text-sm text-text-muted">Account created. Redirecting to sign in...</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div>
        <label className="mb-1.5 block text-xs text-text-muted">Email</label>
        <input
          type="email"
          value={email}
          disabled
          className={`${studioInputClasses} cursor-not-allowed opacity-60`}
        />
      </div>

      <div>
        <label htmlFor="name" className="mb-1.5 block text-xs text-text-muted">
          Your name
        </label>
        <input
          id="name"
          type="text"
          required
          autoComplete="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className={studioInputClasses}
        />
      </div>

      <div>
        <label htmlFor="password" className="mb-1.5 block text-xs text-text-muted">
          Set a password
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
          Confirm password
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
          <UserPlus className="h-4 w-4" strokeWidth={2.25} />
        )}
        {submitting ? "Creating account..." : "Create account"}
      </button>
    </form>
  );
}
