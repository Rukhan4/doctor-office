import Link from "next/link";
import { practice } from "../lib/content";

export function SiteFooter() {
  return (
    <footer className="border-t border-line bg-white/60">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-8 text-sm text-muted sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
        <div>
          <p className="font-medium text-ink">{practice.name}</p>
          <p>{practice.address}</p>
        </div>
        <div className="flex flex-wrap gap-4">
            <Link href="/services" className="hover:text-ink">
            Services
          </Link>
          <Link href="/packages" className="hover:text-ink">
            Packages
          </Link>
          <Link href="/doctors" className="hover:text-ink">
            Doctors / Team
          </Link>
          <Link href="/contact" className="hover:text-ink">
            Contact
          </Link>
          <Link href={practice.googleBusinessUrl} target="_blank" rel="noreferrer" className="hover:text-ink">
            Google Business Profile
          </Link>
        </div>
      </div>
    </footer>
  );
}