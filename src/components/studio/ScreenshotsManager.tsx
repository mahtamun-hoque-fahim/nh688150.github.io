"use client";

import { useState } from "react";
import Image from "next/image";
import { Trash2, Loader2 } from "lucide-react";
import { addScreenshot, deleteScreenshot } from "@/lib/actions/products";
import { MediaPicker } from "./MediaPicker";

interface ScreenshotRow {
  id: string;
  mediaId: string;
  url: string;
  caption: string | null;
}

export function ScreenshotsManager({
  productId,
  initialScreenshots,
}: {
  productId: string;
  initialScreenshots: ScreenshotRow[];
}) {
  const [screenshots, setScreenshots] = useState(initialScreenshots);
  const [busyId, setBusyId] = useState<string | null>(null);

  async function handleAdd(mediaId: string | null, url: string | null) {
    if (!mediaId || !url) return;
    const result = await addScreenshot(productId, mediaId, null);
    if (result.success) {
      setScreenshots((prev) => [...prev, { id: crypto.randomUUID(), mediaId, url, caption: null }]);
    }
  }

  async function handleDelete(id: string) {
    setBusyId(id);
    const result = await deleteScreenshot(id, productId);
    setBusyId(null);
    if (result.success) {
      setScreenshots((prev) => prev.filter((s) => s.id !== id));
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-3 gap-3">
        {screenshots.map((s) => (
          <div key={s.id} className="group relative aspect-[4/3] overflow-hidden rounded-lg border border-border">
            <Image src={s.url} alt="" fill className="object-cover" sizes="200px" />
            <button
              type="button"
              onClick={() => handleDelete(s.id)}
              disabled={busyId === s.id}
              className="absolute right-2 top-2 rounded-none bg-black/70 p-1.5 opacity-0 transition-opacity group-hover:opacity-100"
            >
              {busyId === s.id ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin text-white" strokeWidth={2} />
              ) : (
                <Trash2 className="h-3.5 w-3.5 text-white" strokeWidth={2} />
              )}
            </button>
          </div>
        ))}
      </div>

      <MediaPicker label="Add a screenshot" value={null} valueUrl={null} onChange={handleAdd} />
    </div>
  );
}
