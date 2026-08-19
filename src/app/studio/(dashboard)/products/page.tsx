import Link from "next/link";
import { Package } from "lucide-react";
import { listProducts } from "@/lib/actions/products";
import { NewProductForm } from "@/components/studio/NewProductForm";

export default async function StudioProductsPage() {
  const products = await listProducts();

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="font-display text-2xl font-medium tracking-tight text-white">Products</h1>
        <p className="mt-2 text-sm text-text-muted">
          Create and edit Folio, ReelVault, Hearth, and any future product page. A product only
          exists at <code className="text-text-faint">/products/[slug]</code> once created here.
        </p>
      </div>

      <div className="rounded-lg border border-glass-border bg-glass p-6 backdrop-blur-md">
        <h2 className="mb-4 text-sm font-semibold text-white">Create a product</h2>
        <NewProductForm />
      </div>

      <div>
        <h2 className="mb-3 text-sm font-semibold text-white">All products</h2>
        <div className="flex flex-col divide-y divide-border rounded-lg border border-border">
          {products.length === 0 && (
            <p className="flex items-center gap-2 px-4 py-6 text-sm text-text-faint">
              <Package className="h-4 w-4" strokeWidth={1.5} />
              No products yet — create one above.
            </p>
          )}
          {products.map((p) => (
            <Link
              key={p.id}
              href={`/studio/products/${p.id}`}
              className="flex items-center justify-between px-4 py-3 transition-colors hover:bg-surface-elevated"
            >
              <div>
                <p className="text-sm text-text">{p.name}</p>
                <p className="text-xs text-text-faint">/products/{p.slug}</p>
              </div>
              <span
                className={`text-xs ${p.published ? "text-[#4ade80]" : "text-text-faint"}`}
              >
                {p.published ? "Live" : "Hidden"}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
