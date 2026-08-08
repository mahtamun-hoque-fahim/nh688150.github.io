import Link from "next/link";

const productLinks = [
  { label: "Folio", href: "/folio" },
  { label: "ReelVault", href: "/reelvault" },
  { label: "Hearth", href: "/hearth" },
];

const legalLinks = [
  { label: "Privacy", href: "/#privacy" },
  { label: "Contact", href: "/#contact" },
];

export function Footer() {
  return (
    <footer id="contact" className="border-t border-border bg-bg py-16">
      <div className="mx-auto max-w-6xl px-6 lg:px-8">
        <div className="grid gap-12 sm:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <span className="text-lg font-semibold tracking-tight">Falcotrix</span>
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-text-muted">
              Building the future of local-first utility. Powerful, private, and permanent.
            </p>
            <p className="mt-6 text-xs text-text-faint">&copy; 2024-26 Falcotrix. All Rights Reserved.</p>
          </div>

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-text-faint">
              Products
            </h3>
            <ul className="mt-4 space-y-3">
              {productLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-text-muted transition-colors duration-150 hover:text-text"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div id="privacy">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-text-faint">
              Legal
            </h3>
            <ul className="mt-4 space-y-3">
              {legalLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-text-muted transition-colors duration-150 hover:text-text"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}
