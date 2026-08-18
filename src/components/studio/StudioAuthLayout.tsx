export function StudioAuthLayout({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-bg px-6">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <h1 className="font-display text-2xl font-medium tracking-tight text-white">{title}</h1>
          {subtitle && <p className="mt-2 text-sm text-text-muted">{subtitle}</p>}
        </div>

        <div className="rounded-lg border border-glass-border bg-glass p-8 backdrop-blur-md">
          {children}
        </div>
      </div>
    </main>
  );
}
