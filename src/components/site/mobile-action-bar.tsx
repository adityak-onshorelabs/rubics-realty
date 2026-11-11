import Link from "next/link";
import { CalendarDays, FileText, MessageCircle, Phone } from "lucide-react";
import { company } from "@/content/en";

/** Sticky actions on project pages for phones. WhatsApp shows only once the client provides a number. */
export function MobileActionBar() {
  const items = [
    { href: company.salesPhone.href, label: "Call", Icon: Phone },
    ...(company.whatsapp ? [{ href: company.whatsapp.href, label: "WhatsApp", Icon: MessageCircle }] : []),
    { href: "?intent=brochure#visit", label: "Brochure", Icon: FileText },
    { href: "?intent=visit#visit", label: "Visit", Icon: CalendarDays },
  ];
  return (
    <nav aria-label="Quick actions" className="mobile-action-bar on-lacquer fixed inset-x-0 bottom-0 z-40 border-t border-datum-navy pb-[env(safe-area-inset-bottom)] md:hidden">
      <ul className="grid" style={{ gridTemplateColumns: `repeat(${items.length}, minmax(0, 1fr))` }}>
        {items.map(({ href, label, Icon }) => (
          <li key={label}>
            {href.startsWith("?") ? (
              <Link href={href} className="flex min-h-14 flex-col items-center justify-center gap-1 text-ivory">
                <Icon aria-hidden className="size-5 text-brass" />
                <span className="t-label text-[0.6rem]">{label}</span>
              </Link>
            ) : (
              <a href={href} className="flex min-h-14 flex-col items-center justify-center gap-1 text-ivory">
                <Icon aria-hidden className="size-5 text-brass" />
                <span className="t-label text-[0.6rem]">{label}</span>
              </a>
            )}
          </li>
        ))}
      </ul>
    </nav>
  );
}
