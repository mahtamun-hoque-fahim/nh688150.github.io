"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2, Loader2 } from "lucide-react";
import { deleteProduct } from "@/lib/actions/products";

export function DeleteProductButton({ productId, name }: { productId: string; name: string }) {
  const router = useRouter();
  const [confirming, setConfirming] = useState(false);
  const [deleting, setDeleting] = useState(false);

  async function handleDelete() {
    setDeleting(true);
    const result = await deleteProduct(productId);
    if (result.success) {
      router.push("/studio/products");
      router.refresh();
    } else {
      setDeleting(false);
    }
  }

  if (confirming) {
    return (
      <div className="flex items-center gap-2 text-sm">
        <span className="text-text-muted">Delete &quot;{name}&quot; permanently?</span>
        <button
          type="button"
          onClick={handleDelete}
          disabled={deleting}
          className="rounded-none bg-[#7f1d1d] px-3 py-1.5 text-xs font-semibold text-white disabled:opacity-60"
        >
          {deleting ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" strokeWidth={2.25} />
          ) : (
            "Yes, delete"
          )}
        </button>
        <button
          type="button"
          onClick={() => setConfirming(false)}
          className="rounded-none border border-border px-3 py-1.5 text-xs text-text-muted hover:text-text"
        >
          Cancel
        </button>
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={() => setConfirming(true)}
      className="inline-flex items-center gap-1.5 text-xs text-text-faint hover:text-[#f87171]"
    >
      <Trash2 className="h-3.5 w-3.5" strokeWidth={2} />
      Delete product
    </button>
  );
}
