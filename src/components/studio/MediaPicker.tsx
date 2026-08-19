"use client";

import { useEffect, useState, useRef, type FormEvent } from "react";
import Image from "next/image";
import { Loader2, ImagePlus, X, Upload } from "lucide-react";
import { listMedia, uploadMedia } from "@/lib/actions/media";

interface MediaAssetRow {
  id: string;
  url: string;
  altText: string | null;
}

export function MediaPicker({
  label,
  value,
  valueUrl,
  onChange,
}: {
  label: string;
  value: string | null;
  /** Preview URL for the currently selected asset, if known ahead of a fresh library fetch. */
  valueUrl?: string | null;
  onChange: (mediaId: string | null, url: string | null) => void;
}) {
  const [open, setOpen] = useState(false);
  const [assets, setAssets] = useState<MediaAssetRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (!open) return;
    setLoading(true);
    listMedia().then((rows) => {
      setAssets(rows.map((r) => ({ id: r.id, url: r.url, altText: r.altText })));
      setLoading(false);
    });
  }, [open]);

  async function handleUpload(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setUploading(true);
    const formData = new FormData(e.currentTarget);
    const result = await uploadMedia(formData);
    setUploading(false);

    if (result.success) {
      formRef.current?.reset();
      const rows = await listMedia();
      setAssets(rows.map((r) => ({ id: r.id, url: r.url, altText: r.altText })));
    }
  }

  return (
    <div>
      <label className="mb-1.5 block text-xs text-text-muted">{label}</label>

      <div className="flex items-center gap-3">
        {valueUrl ? (
          <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-none border border-border bg-surface">
            <Image src={valueUrl} alt="" fill className="object-cover" sizes="64px" />
          </div>
        ) : (
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-none border border-dashed border-border text-text-faint">
            <ImagePlus className="h-5 w-5" strokeWidth={1.5} />
          </div>
        )}

        <div className="flex flex-col gap-1.5">
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="rounded-none border border-border bg-surface px-3 py-1.5 text-xs text-text-muted transition-colors hover:border-border-strong hover:text-text"
          >
            {value ? "Change" : "Choose image"}
          </button>
          {value && (
            <button
              type="button"
              onClick={() => onChange(null, null)}
              className="text-xs text-text-faint hover:text-[#f87171]"
            >
              Remove
            </button>
          )}
        </div>
      </div>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-6">
          <div className="flex max-h-[85vh] w-full max-w-2xl flex-col rounded-lg border border-border bg-bg">
            <div className="flex items-center justify-between border-b border-border p-4">
              <h3 className="text-sm font-semibold text-white">Choose an image</h3>
              <button type="button" onClick={() => setOpen(false)}>
                <X className="h-4 w-4 text-text-muted hover:text-text" />
              </button>
            </div>

            <div className="border-b border-border p-4">
              <form ref={formRef} onSubmit={handleUpload} className="flex items-center gap-2">
                <input
                  type="file"
                  name="file"
                  accept="image/png,image/jpeg,image/webp,image/gif,image/svg+xml"
                  required
                  className="flex-1 text-xs text-text-muted file:mr-2 file:rounded-none file:border-0 file:bg-accent file:px-2.5 file:py-1.5 file:text-xs file:font-semibold file:text-white"
                />
                <button
                  type="submit"
                  disabled={uploading}
                  className="inline-flex items-center gap-1.5 rounded-none bg-accent px-3 py-1.5 text-xs font-semibold text-white disabled:opacity-60"
                >
                  {uploading ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" strokeWidth={2.25} />
                  ) : (
                    <Upload className="h-3.5 w-3.5" strokeWidth={2.25} />
                  )}
                  Upload
                </button>
              </form>
            </div>

            <div className="flex-1 overflow-y-auto p-4">
              {loading && <p className="text-sm text-text-faint">Loading...</p>}
              {!loading && assets.length === 0 && (
                <p className="text-sm text-text-faint">No images yet — upload one above.</p>
              )}
              <div className="grid grid-cols-4 gap-3">
                {assets.map((asset) => (
                  <button
                    key={asset.id}
                    type="button"
                    onClick={() => {
                      onChange(asset.id, asset.url);
                      setOpen(false);
                    }}
                    className={`relative aspect-square overflow-hidden rounded-none border transition-colors ${
                      value === asset.id
                        ? "border-accent"
                        : "border-border hover:border-border-strong"
                    }`}
                  >
                    <Image
                      src={asset.url}
                      alt={asset.altText ?? ""}
                      fill
                      className="object-cover"
                      sizes="120px"
                    />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
