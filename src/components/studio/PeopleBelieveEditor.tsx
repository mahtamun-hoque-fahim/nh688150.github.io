"use client";

import { useState, type FormEvent } from "react";
import { Loader2, Save, Plus, Trash2, CheckCircle2, AlertCircle, ChevronDown } from "lucide-react";
import { updatePageSection } from "@/lib/actions/pages";
import { studioInputClasses, studioButtonClasses } from "./styles";

interface Card {
  productSlug: string;
  description: string;
  ctaLabel?: string;
  ctaHref?: string;
  badge?: string;
  status?: string;
}

export function PeopleBelieveEditor({
  initialContent,
  productSlugs,
}: {
  initialContent: Record<string, unknown>;
  productSlugs: string[];
}) {
  const [open, setOpen] = useState(false);
  const [heading, setHeading] = useState((initialContent.heading as string) ?? "");
  const [subheading, setSubheading] = useState((initialContent.subheading as string) ?? "");
  const [cards, setCards] = useState<Card[]>(
    Array.isArray(initialContent.cards) && initialContent.cards.length
      ? (initialContent.cards as Card[])
      : [],
  );

  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function updateCard(index: number, patch: Partial<Card>) {
    setCards((prev) => prev.map((c, i) => (i === index ? { ...c, ...patch } : c)));
  }

  function addCard() {
    setCards((prev) => [...prev, { productSlug: productSlugs[0] ?? "", description: "" }]);
  }

  function removeCard(index: number) {
    setCards((prev) => prev.filter((_, i) => i !== index));
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSaved(false);

    const result = await updatePageSection(
      "home:people_believe",
      { heading, subheading, cards },
      null,
    );
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
        <span className="text-sm font-semibold text-white">People Believes</span>
        <ChevronDown
          className={`h-4 w-4 text-text-muted transition-transform ${open ? "rotate-180" : ""}`}
          strokeWidth={2}
        />
      </button>

      {open && (
        <form onSubmit={handleSubmit} className="flex flex-col gap-5 border-t border-border p-5">
          <div>
            <label className="mb-1.5 block text-xs text-text-muted">Heading</label>
            <input
              value={heading}
              onChange={(e) => setHeading(e.target.value)}
              className={studioInputClasses}
            />
          </div>
          <div>
            <label className="mb-1.5 block text-xs text-text-muted">Subheading</label>
            <input
              value={subheading}
              onChange={(e) => setSubheading(e.target.value)}
              className={studioInputClasses}
            />
          </div>

          <div className="flex flex-col gap-3">
            <p className="text-xs text-text-muted">Cards</p>
            {cards.map((card, i) => (
              <div key={i} className="rounded-lg border border-border bg-surface p-4">
                <div className="mb-2 flex items-center justify-between">
                  <select
                    value={card.productSlug}
                    onChange={(e) => updateCard(i, { productSlug: e.target.value })}
                    className={studioInputClasses}
                  >
                    {productSlugs.length === 0 && <option value="">No products yet</option>}
                    {productSlugs.map((slug) => (
                      <option key={slug} value={slug}>
                        {slug}
                      </option>
                    ))}
                  </select>
                  <button
                    type="button"
                    onClick={() => removeCard(i)}
                    className="ml-2 shrink-0 text-text-faint hover:text-[#f87171]"
                  >
                    <Trash2 className="h-4 w-4" strokeWidth={2} />
                  </button>
                </div>
                <textarea
                  placeholder="Description"
                  value={card.description}
                  onChange={(e) => updateCard(i, { description: e.target.value })}
                  rows={2}
                  className={`${studioInputClasses} mb-2 resize-none`}
                />
                <div className="grid grid-cols-2 gap-2">
                  <input
                    placeholder="CTA label (optional)"
                    value={card.ctaLabel ?? ""}
                    onChange={(e) => updateCard(i, { ctaLabel: e.target.value })}
                    className={studioInputClasses}
                  />
                  <input
                    placeholder="CTA link (optional)"
                    value={card.ctaHref ?? ""}
                    onChange={(e) => updateCard(i, { ctaHref: e.target.value })}
                    className={studioInputClasses}
                  />
                  <input
                    placeholder="Badge (optional, e.g. BETA)"
                    value={card.badge ?? ""}
                    onChange={(e) => updateCard(i, { badge: e.target.value })}
                    className={studioInputClasses}
                  />
                  <input
                    placeholder="Status line (optional)"
                    value={card.status ?? ""}
                    onChange={(e) => updateCard(i, { status: e.target.value })}
                    className={studioInputClasses}
                  />
                </div>
              </div>
            ))}
            <button
              type="button"
              onClick={addCard}
              className="inline-flex w-fit items-center gap-1.5 text-xs text-text-muted hover:text-text"
            >
              <Plus className="h-3.5 w-3.5" strokeWidth={2.25} />
              Add card
            </button>
          </div>

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
