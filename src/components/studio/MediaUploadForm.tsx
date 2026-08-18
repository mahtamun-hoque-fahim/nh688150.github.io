"use client";

import { useRef, useState, type FormEvent } from "react";
import { Loader2, Upload, AlertCircle } from "lucide-react";
import { uploadMedia } from "@/lib/actions/media";
import { studioInputClasses, studioButtonClasses } from "./styles";

export function MediaUploadForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    const formData = new FormData(e.currentTarget);
    const result = await uploadMedia(formData);

    if (result.error) {
      setError(result.error);
      setSubmitting(false);
      return;
    }

    formRef.current?.reset();
    setSubmitting(false);
  }

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="flex flex-col gap-4 sm:flex-row sm:items-end">
      <div className="flex-1">
        <label htmlFor="file" className="mb-1.5 block text-xs text-text-muted">
          Image file
        </label>
        <input
          id="file"
          name="file"
          type="file"
          accept="image/png,image/jpeg,image/webp,image/gif,image/svg+xml"
          required
          className={`${studioInputClasses} file:mr-3 file:rounded-none file:border-0 file:bg-accent file:px-3 file:py-1.5 file:text-xs file:font-semibold file:text-white`}
        />
      </div>

      <div className="flex-1">
        <label htmlFor="altText" className="mb-1.5 block text-xs text-text-muted">
          Alt text (optional)
        </label>
        <input
          id="altText"
          name="altText"
          type="text"
          placeholder="Describes the image"
          className={studioInputClasses}
        />
      </div>

      <button type="submit" disabled={submitting} className={`${studioButtonClasses} w-auto shrink-0`}>
        {submitting ? (
          <Loader2 className="h-4 w-4 animate-spin" strokeWidth={2.25} />
        ) : (
          <Upload className="h-4 w-4" strokeWidth={2.25} />
        )}
        {submitting ? "Uploading..." : "Upload"}
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
