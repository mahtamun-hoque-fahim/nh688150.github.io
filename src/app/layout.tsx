import type { Metadata } from "next";
import "@fontsource-variable/google-sans-flex/wght.css";
import "@fontsource-variable/jetbrains-mono/wght.css";
import "./globals.css";

export const metadata: Metadata = {
  title: "Falcotrix — Quality Software On Your Machine",
  description:
    "Zero cloud uploads. Everything runs locally on your hardware. High-performance desktop tools for PDF editing, video transcoding, and more.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-bg text-text">{children}</body>
    </html>
  );
}
