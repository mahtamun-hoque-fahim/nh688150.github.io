"use client";

import { useState, type FormEvent } from "react";
import { Loader2, Save, Plus, Trash2, CheckCircle2, AlertCircle, ChevronDown } from "lucide-react";
import type { SectionRegistryKey } from "@/lib/content-schemas";
import type { FieldDef } from "@/lib/studio-section-fields";
import { updatePageSection } from "@/lib/actions/pages";
import { MediaPicker } from "./MediaPicker";
import { studioInputClasses, studioButtonClasses } from "./styles";

type FieldValue = string | string[];

export function SectionEditorForm({
  sectionKey,
  label,
  fields,
  initialContent,
  initialBackgroundMediaId,
  initialBackgroundUrl,
}: {
  sectionKey: SectionRegistryKey;
  label: string;
  fields: FieldDef[];
  initialContent: Record<string, unknown>;
  initialBackgroundMediaId: string | null;
  initialBackgroundUrl: string | null;
}) {
  const [open, setOpen] = useState(false);
  const [values, setValues] = useState<Record<string, FieldValue>>(() => {
    const initial: Record<string, FieldValue> = {};
    for (const field of fields) {
      const raw = initialContent[field.key];
      if (field.kind === "string-array") {
        initial[field.key] = Array.isArray(raw) ? (raw as string[]) : [""];
      } else {
        initial[field.key] = typeof raw === "string" ? raw : "";
      }
    }
    return initial;
  });
  const [backgroundMediaId, setBackgroundMediaId] = useState(initialBackgroundMediaId);
  const [backgroundUrl, setBackgroundUrl] = useState(initialBackgroundUrl);

  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function setField(key: string, value: FieldValue) {
    setValues((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSaved(false);

    const content: Record<string, unknown> = {};
    for (const field of fields) {
      if (field.kind === "string-array") {
        content[field.key] = (values[field.key] as string[]).filter((v) => v.trim().length > 0);
      } else {
        const val = (values[field.key] as string).trim();
        content[field.key] = val;
      }
    }

    const result = await updatePageSection(sectionKey, content, backgroundMediaId);
    setSaving(false);

    if (result.error) {
      setError(result.error);
      return;
    }
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  return (
    <div className="rounded-lg border border-glass-border bg-glass backdrop-blur-md">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between p-5 text-left"
      >
        <span className="text-sm font-semibold text-white">{label}</span>
        <ChevronDown
          className={`h-4 w-4 text-text-muted transition-transform ${open ? "rotate-180" : ""}`}
          strokeWidth={2}
        />
      </button>

      {open && (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 border-t border-border p-5">
          {fields.map((field) => {
            if (field.kind === "string-array") {
              const arr = values[field.key] as string[];
              return (
                <div key={field.key}>
                  <label className="mb-1.5 block text-xs text-text-muted">{field.label}</label>
                  <div className="flex flex-col gap-2">
                    {arr.map((item, i) => (
                      <div key={i} className="flex gap-2">
                        <textarea
                          value={item}
                          onChange={(e) =>
                            setField(
                              field.key,
                              arr.map((v, idx) => (idx === i ? e.target.value : v)),
                            )
                          }
                          rows={3}
                          className={`${studioInputClasses} resize-none`}
                        />
                        <button
                          type="button"
                          onClick={() => setField(field.key, arr.filter((_, idx) => idx !== i))}
                          className="shrink-0 text-text-faint hover:text-[#f87171]"
                        >
                          <Trash2 className="h-4 w-4" strokeWidth={2} />
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() => setField(field.key, [...arr, ""])}
                      className="inline-flex w-fit items-center gap-1.5 text-xs text-text-muted hover:text-text"
                    >
                      <Plus className="h-3.5 w-3.5" strokeWidth={2.25} />
                      Add {field.itemLabel.toLowerCase()}
                    </button>
                  </div>
                </div>
              );
            }

            return (
              <div key={field.key}>
                <label className="mb-1.5 block text-xs text-text-muted">{field.label}</label>
                {field.kind === "textarea" ? (
                  <textarea
                    value={values[field.key] as string}
                    onChange={(e) => setField(field.key, e.target.value)}
                    rows={3}
                    className={`${studioInputClasses} resize-none`}
                  />
                ) : (
                  <input
                    value={values[field.key] as string}
                    onChange={(e) => setField(field.key, e.target.value)}
                    className={studioInputClasses}
                  />
                )}
              </div>
            );
          })}

          <MediaPicker
            label="Background image"
            value={backgroundMediaId}
            valueUrl={backgroundUrl}
            onChange={(id, url) => {
              setBackgroundMediaId(id);
              setBackgroundUrl(url);
            }}
          />

          <div className="flex items-center gap-4">
            <button type="submit" disabled={saving} className={`${studioButtonClasses} w-auto`}>
              {saving ? (
                <Loader2 className="h-4 w-4 animate-spin" strokeWidth={2.25} />
              ) : (
                <Save className="h-4 w-4" strokeWidth={2.25} />
              )}
              {saving ? "Saving..." : "Save"}
            </button>
            {saved && (
              <span className="flex items-center gap-1.5 text-sm text-[#4ade80]">
                <CheckCircle2 className="h-4 w-4" strokeWidth={2.25} />
                Saved.
              </span>
            )}
            {error && (
              <span className="flex items-center gap-1.5 text-sm text-[#f87171]">
                <AlertCircle className="h-4 w-4" strokeWidth={2.25} />
                {error}
              </span>
            )}
          </div>
        </form>
      )}
    </div>
  );
}
