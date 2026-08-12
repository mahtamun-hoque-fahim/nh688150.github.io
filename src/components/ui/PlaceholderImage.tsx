interface PlaceholderImageProps {
  /** One-line brief describing what real asset should go here eventually. */
  brief: string;
  className?: string;
}

/**
 * IMAGE-BRIEF placeholder. Swap the containing element for a real
 * screenshot/render when assets are ready — this div is disposable.
 */
export function PlaceholderImage({ brief, className = "" }: PlaceholderImageProps) {
  return (
    <div
      className={`flex aspect-[4/3] w-full items-center justify-center bg-[#d9d9d9] ${className}`}
      title={brief}
    >
      <span className="text-sm text-[#555555]">Placeholder image</span>
    </div>
  );
}
