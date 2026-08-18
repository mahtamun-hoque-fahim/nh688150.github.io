"use client";

import { useState, type FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2, LogIn, AlertCircle } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { studioInputClasses, studioButtonClasses } from "./styles";

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    const { error: signInError } = await authClient.signIn.email({ email, password });

    if (signInError) {
      setError(signInError.message ?? "Invalid email or password.");
      setSubmitting(false);
      return;
    }

    const redirectTo = searchParams.get("from") ?? "/studio";
    router.push(redirectTo);
    router.refresh();
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

      <div>
        <div className="mb-1.5 flex items-center justify-between">
          <label htmlFor="password" className="block text-xs text-text-muted">
            Password
          </label>
          <a href="/studio/forgot-password" className="text-xs text-text-faint hover:text-text-muted">
            Forgot password?
          </a>
        </div>
        <input
          id="password"
          type="password"
          required
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
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
          <LogIn className="h-4 w-4" strokeWidth={2.25} />
        )}
        {submitting ? "Signing in..." : "Sign in"}
      </button>
    </form>
  );
}
