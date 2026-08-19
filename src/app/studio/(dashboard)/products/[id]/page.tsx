import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getProduct } from "@/lib/actions/products";
import { ProductEditForm } from "@/components/studio/ProductEditForm";
import { ModulesManager } from "@/components/studio/ModulesManager";
import { ScreenshotsManager } from "@/components/studio/ScreenshotsManager";
import { DeleteProductButton } from "@/components/studio/DeleteProductButton";

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = await getProduct(id);

  if (!product) {
    notFound();
  }

  return (
    <div className="flex max-w-3xl flex-col gap-8">
      <div>
        <Link
          href="/studio/products"
          className="mb-3 inline-flex items-center gap-1.5 text-xs text-text-faint hover:text-text-muted"
        >
          <ArrowLeft className="h-3.5 w-3.5" strokeWidth={2} />
          All products
        </Link>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-display text-2xl font-medium tracking-tight text-white">
              {product.name}
            </h1>
            <p className="mt-1 text-xs text-text-faint">/products/{product.slug}</p>
          </div>
          <DeleteProductButton productId={product.id} name={product.name} />
        </div>
      </div>

      <ProductEditForm product={product} />

      <div className="rounded-lg border border-glass-border bg-glass p-6 backdrop-blur-md">
        <h2 className="mb-4 text-sm font-semibold text-white">Modules</h2>
        <ModulesManager productId={product.id} initialModules={product.modules} />
      </div>

      <div className="rounded-lg border border-glass-border bg-glass p-6 backdrop-blur-md">
        <h2 className="mb-4 text-sm font-semibold text-white">Screenshots</h2>
        <ScreenshotsManager productId={product.id} initialScreenshots={product.screenshots} />
      </div>
    </div>
  );
}
