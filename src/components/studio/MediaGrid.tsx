"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Trash2, Loader2, Copy, Check } from "lucide-react";
import { deleteMedia } from "@/lib/actions/media";

interface MediaAssetRow {
  id: string;
  url: string;
  altText: string | null;
  width: number | null;
  height: number | null;
  createdAt: Date;
}

export function MediaGrid({ assets }: { assets: MediaAssetRow[] }) {
  const router = useRouter();
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  async function handleDelete(id: string) {
    if (!confirm("Delete this image? Anywhere it's currently used will fall back to empty.")) {
      return;
    }
    setDeletingId(id);
    await deleteMedia(id);
    setDeletingId(null);
    router.refresh();
  }

  function handleCopy(id: string, url: string) {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1500);
  }

  if (assets.length === 0) {
    return <p className="text-sm text-text-faint">No images uploaded yet.</p>;
  }

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
      {assets.map((asset) => (
        <div
          key={asset.id}
          className="group relative overflow-hidden rounded-lg border border-border bg-surface"
        >
          <div className="relative aspect-square">
            <Image
              src={asset.url}
              alt={asset.altText ?? ""}
              fill
              className="object-cover"
              sizes="(max-width: 640px) 50vw, 25vw"
            />
          </div>

          <div className="absolute inset-0 flex items-end justify-end gap-1.5 bg-black/0 p-2 opacity-0 transition-all duration-150 group-hover:bg-black/40 group-hover:opacity-100">
            <button
              type="button"
              onClick={() => handleCopy(asset.id, asset.url)}
              title="Copy URL"
              className="rounded-none border border-border bg-surface p-1.5 text-text-muted transition-colors hover:text-text"
            >
              {copiedId === asset.id ? (
                <Check className="h-3.5 w-3.5" strokeWidth={2.25} />
              ) : (
                <Copy className="h-3.5 w-3.5" strokeWidth={2.25} />
              )}
            </button>
            <button
              type="button"
              onClick={() => handleDelete(asset.id)}
              disabled={deletingId === asset.id}
              title="Delete"
              className="rounded-none border border-border bg-surface p-1.5 text-text-muted transition-colors hover:text-[#f87171] disabled:opacity-50"
            >
              {deletingId === asset.id ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" strokeWidth={2.25} />
              ) : (
                <Trash2 className="h-3.5 w-3.5" strokeWidth={2.25} />
              )}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
