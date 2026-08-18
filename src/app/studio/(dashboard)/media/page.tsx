import { listMedia } from "@/lib/actions/media";
import { MediaUploadForm } from "@/components/studio/MediaUploadForm";
import { MediaGrid } from "@/components/studio/MediaGrid";

export default async function StudioMediaPage() {
  const assets = await listMedia();

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="font-display text-2xl font-medium tracking-tight text-white">
          Media Library
        </h1>
        <p className="mt-2 text-sm text-text-muted">
          Every background image, logo, and screenshot lives here once. Reuse the same image
          across multiple pages, or upload a different one for each — that's your call each time
          you assign an image to a section.
        </p>
      </div>

      <div className="rounded-lg border border-glass-border bg-glass p-6 backdrop-blur-md">
        <MediaUploadForm />
      </div>

      <MediaGrid assets={assets} />
    </div>
  );
}
