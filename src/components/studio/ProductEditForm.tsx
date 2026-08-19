"use client";

import { useState, type FormEvent } from "react";
import { Loader2, Save, Plus, Trash2, CheckCircle2, AlertCircle } from "lucide-react";
import { updateProduct } from "@/lib/actions/products";
import { MediaPicker } from "./MediaPicker";
import { studioInputClasses, studioButtonClasses } from "./styles";

interface ProductFormData {
  id: string;
  name: string;
  tagline: string;
  published: boolean;
  aboutParagraphs: string[];
  aboutTagline: string | null;
  aboutClosing: string | null;
  logoMediaId: string | null;
  logoUrl: string | null;
  listingImageMediaId: string | null;
  listingImageUrl: string | null;
  heroBackgroundMediaId: string | null;
  heroBackgroundUrl: string | null;
  contentBackgroundMediaId: string | null;
  contentBackgroundUrl: string | null;
}

export function ProductEditForm({ product }: { product: ProductFormData }) {
  const [name, setName] = useState(product.name);
  const [tagline, setTagline] = useState(product.tagline);
  const [published, setPublished] = useState(product.published);
  const [aboutParagraphs, setAboutParagraphs] = useState(
    product.aboutParagraphs.length ? product.aboutParagraphs : [""],
  );
  const [aboutTagline, setAboutTagline] = useState(product.aboutTagline ?? "");
  const [aboutClosing, setAboutClosing] = useState(product.aboutClosing ?? "");

  const [logoMediaId, setLogoMediaId] = useState(product.logoMediaId);
  const [logoUrl, setLogoUrl] = useState(product.logoUrl);
  const [listingImageMediaId, setListingImageMediaId] = useState(product.listingImageMediaId);
  const [listingImageUrl, setListingImageUrl] = useState(product.listingImageUrl);
  const [heroBackgroundMediaId, setHeroBackgroundMediaId] = useState(product.heroBackgroundMediaId);
  const [heroBackgroundUrl, setHeroBackgroundUrl] = useState(product.heroBackgroundUrl);
  const [contentBackgroundMediaId, setContentBackgroundMediaId] = useState(
    product.contentBackgroundMediaId,
  );
  const [contentBackgroundUrl, setContentBackgroundUrl] = useState(product.contentBackgroundUrl);

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSaved(false);

    const result = await updateProduct(product.id, {
      name,
      tagline,
      published,
      aboutParagraphs: aboutParagraphs.filter((p) => p.trim().length > 0),
      aboutTagline: aboutTagline.trim() || null,
      aboutClosing: aboutClosing.trim() || null,
      logoMediaId,
      listingImageMediaId,
      heroBackgroundMediaId,
      contentBackgroundMediaId,
    });

    setSaving(false);

    if (result.error) {
      setError(result.error);
      return;
    }
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-8">
      <div className="rounded-lg border border-glass-border bg-glass p-6 backdrop-blur-md">
        <h2 className="mb-4 text-sm font-semibold text-white">Basic info</h2>
        <div className="flex flex-col gap-4">
          <div>
            <label className="mb-1.5 block text-xs text-text-muted">Name</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className={studioInputClasses}
            />
          </div>
          <div>
            <label className="mb-1.5 block text-xs text-text-muted">Tagline</label>
            <input
              value={tagline}
              onChange={(e) => setTagline(e.target.value)}
              className={studioInputClasses}
            />
          </div>
          <label className="flex items-center gap-2 text-sm text-text-muted">
            <input
              type="checkbox"
              checked={published}
              onChange={(e) => setPublished(e.target.checked)}
              className="h-4 w-4 rounded-none border-border bg-glass accent-accent"
            />
            Visible on the site
          </label>
        </div>
      </div>

      <div className="rounded-lg border border-glass-border bg-glass p-6 backdrop-blur-md">
        <h2 className="mb-4 text-sm font-semibold text-white">Images</h2>
        <div className="grid grid-cols-2 gap-6">
          <MediaPicker
            label="Logo (product header)"
            value={logoMediaId}
            valueUrl={logoUrl}
            onChange={(id, url) => {
              setLogoMediaId(id);
              setLogoUrl(url);
            }}
          />
          <MediaPicker
            label="Listing image (/products card)"
            value={listingImageMediaId}
            valueUrl={listingImageUrl}
            onChange={(id, url) => {
              setListingImageMediaId(id);
              setListingImageUrl(url);
            }}
          />
          <MediaPicker
            label="Hero background"
            value={heroBackgroundMediaId}
            valueUrl={heroBackgroundUrl}
            onChange={(id, url) => {
              setHeroBackgroundMediaId(id);
              setHeroBackgroundUrl(url);
            }}
          />
          <MediaPicker
            label="Content section background"
            value={contentBackgroundMediaId}
            valueUrl={contentBackgroundUrl}
            onChange={(id, url) => {
              setContentBackgroundMediaId(id);
              setContentBackgroundUrl(url);
            }}
          />
        </div>
      </div>

      <div className="rounded-lg border border-glass-border bg-glass p-6 backdrop-blur-md">
        <h2 className="mb-4 text-sm font-semibold text-white">About</h2>
        <div className="flex flex-col gap-3">
          {aboutParagraphs.map((p, i) => (
            <div key={i} className="flex gap-2">
              <textarea
                value={p}
                onChange={(e) =>
                  setAboutParagraphs((prev) =>
                    prev.map((val, idx) => (idx === i ? e.target.value : val)),
                  )
                }
                rows={3}
                className={`${studioInputClasses} resize-none`}
              />
              <button
                type="button"
                onClick={() => setAboutParagraphs((prev) => prev.filter((_, idx) => idx !== i))}
                className="shrink-0 text-text-faint hover:text-[#f87171]"
              >
                <Trash2 className="h-4 w-4" strokeWidth={2} />
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => setAboutParagraphs((prev) => [...prev, ""])}
            className="inline-flex w-fit items-center gap-1.5 text-xs text-text-muted hover:text-text"
          >
            <Plus className="h-3.5 w-3.5" strokeWidth={2.25} />
            Add paragraph
          </button>

          <div className="mt-2">
            <label className="mb-1.5 block text-xs text-text-muted">
              Tagline (e.g. &quot;Fully local · No data collected&quot;)
            </label>
            <input
              value={aboutTagline}
              onChange={(e) => setAboutTagline(e.target.value)}
              className={studioInputClasses}
            />
          </div>

          <div>
            <label className="mb-1.5 block text-xs text-text-muted">Closing line</label>
            <textarea
              value={aboutClosing}
              onChange={(e) => setAboutClosing(e.target.value)}
              rows={2}
              className={`${studioInputClasses} resize-none`}
            />
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button type="submit" disabled={saving} className={`${studioButtonClasses} w-auto`}>
          {saving ? (
            <Loader2 className="h-4 w-4 animate-spin" strokeWidth={2.25} />
          ) : (
            <Save className="h-4 w-4" strokeWidth={2.25} />
          )}
          {saving ? "Saving..." : "Save changes"}
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
  );
}
