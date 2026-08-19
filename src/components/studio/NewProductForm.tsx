"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Plus, AlertCircle } from "lucide-react";
import { createProduct } from "@/lib/actions/products";
import { studioInputClasses, studioButtonClasses } from "./styles";

export function NewProductForm() {
  const router = useRouter();
  const [slug, setSlug] = useState("");
  const [name, setName] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    const result = await createProduct(slug, name);

    if (result.error || !result.id) {
      setError(result.error ?? "Something went wrong.");
      setSubmitting(false);
      return;
    }

    router.push(`/studio/products/${result.id}`);
  }

  return (
    <form onSubmit={handleSubmit} className="flex items-end gap-3">
      <div className="flex-1">
        <label htmlFor="new-name" className="mb-1.5 block text-xs text-text-muted">
          Product name
        </label>
        <input
          id="new-name"
          type="text"
          required
          placeholder="ReelVault"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className={studioInputClasses}
        />
      </div>

      <div className="flex-1">
        <label htmlFor="new-slug" className="mb-1.5 block text-xs text-text-muted">
          URL slug
        </label>
        <input
          id="new-slug"
          type="text"
          required
          placeholder="reelvault"
          value={slug}
          onChange={(e) => setSlug(e.target.value)}
          className={studioInputClasses}
        />
        <p className="mt-1 text-xs text-text-faint">/products/{slug || "..."}</p>
      </div>

      <button type="submit" disabled={submitting} className={`${studioButtonClasses} w-auto`}>
        {submitting ? (
          <Loader2 className="h-4 w-4 animate-spin" strokeWidth={2.25} />
        ) : (
          <Plus className="h-4 w-4" strokeWidth={2.25} />
        )}
        {submitting ? "Creating..." : "Create product"}
      </button>

      {error && (
        <span className="flex items-center gap-1.5 text-sm text-[#f87171]">
          <AlertCircle className="h-4 w-4 shrink-0" strokeWidth={2.25} />
          {error}
        </span>
      )}
    </form>
  );
}
