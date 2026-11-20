import Link from "next/link";
import Image from "next/image";

const footerLinks = [
  {
    title: "Community",
    links: [
      { label: "About", href: "/about" },
      { label: "The Cohort", href: "/cohort" },
      { label: "FAQ", href: "/faq" },
      { label: "Apply", href: "/apply" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "Privacy", href: "/privacy" },
      { label: "Code Yaar platform", href: "https://github.com/ali-raza-py/Code-Yaar" },
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className="border-t border-[#e8ece8] bg-[#ffffff]">
      <div className="mx-auto max-w-[1152px] px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid gap-8 lg:grid-cols-4">
          <div className="col-span-2 lg:col-span-1">
            <Link
              href="/"
              className="flex items-center gap-2.5 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#087a52] focus-visible:ring-offset-2 focus-visible:ring-offset-white"
              aria-label="Code Yaar Home"
            >
              <div className="relative h-6 w-6 shrink-0">
                <Image
                  src="/brand/logo-mark.png"
                  alt=""
                  fill
                  sizes="24px"
                  className="object-contain"
                />
              </div>
              <span className="text-sm font-semibold tracking-tight text-[#19231d]">
                Code Yaar
              </span>
            </Link>
            <p className="mt-4 max-w-xs text-sm text-[#46534a] leading-relaxed">
              Code Yaar Global Founding Community — The First 100. A global
              founding cohort of learners and aspiring developers.
            </p>
            <div className="mt-6 flex gap-3">
              {[
                ["GitHub", "https://github.com/ali-raza-py/Code-Yaar"],
              ].map(([social, href]) => (
                <a
                  key={social}
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-[#e8ece8] bg-[#f2f5f3] text-xs font-medium text-[#46534a] transition-colors hover:bg-[#087a52] hover:text-white"
                  aria-label={social}
                >
                  {social[0]}
                </a>
              ))}
            </div>
          </div>
          {footerLinks.map((group) => (
            <div key={group.title}>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-[#46534a] mb-4">
                {group.title}
              </h3>
              <ul className="space-y-2.5">
                {group.links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-sm text-[#46534a] transition-colors hover:text-[#087a52]"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-12 border-t border-[#e8ece8] pt-8 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <p className="text-xs text-[#46534a]">
            &copy; {new Date().getFullYear()} Code Yaar. All rights reserved.
          </p>
          <p className="text-xs text-[#46534a]">Think. Build. Evolve.</p>
        </div>
      </div>
    </footer>
  );
}
