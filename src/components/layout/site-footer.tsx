import { ArrowUpRight } from "lucide-react";
import Link from "next/link";

import { SectionInner } from "@/components/ui/section";
import { CAMPAIGN } from "@/lib/constants";

import { Wordmark } from "./wordmark";
import styles from "./site-footer.module.css";

const footerLinkGroups = [
  {
    title: "Get involved",
    links: [
      { label: "Apply", href: "/apply" },
      { label: "The First 100", href: "/cohort" },
      { label: "Global Ambassadors", href: "/ambassadors" },
    ],
  },
  {
    title: "Code Yaar",
    links: [
      { label: "About", href: "/about" },
      { label: "FAQ", href: "/faq" },
      { label: "Privacy", href: "/privacy" },
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className={styles.footer}>
      <SectionInner>
        <div className={styles.main}>
          <div>
            <Wordmark className={styles.wordmark} />
            <p className={styles.tagline}>{CAMPAIGN.tagline}</p>
            <p className={styles.description}>
              The 2026&ndash;27 founding community for learners and builders around
              the world.
            </p>
          </div>
          <nav aria-label="Footer" className={styles.navigation}>
            {footerLinkGroups.map(({ title, links }) => (
              <div key={title}>
                <h2 className={styles.groupTitle}>{title}</h2>
                <ul>
                  {links.map(({ label, href }) => (
                    <li key={href}>
                      <Link
                        href={href}
                        className={href === "/apply" ? styles.accentLink : styles.link}
                      >
                        {label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </div>
        <div className={styles.utility}>
          <p>&copy; 2026 Code Yaar. All rights reserved.</p>
          <a
            className={styles.link}
            href="https://github.com/ali-raza-py/Code-Yaar"
            target="_blank"
            rel="noreferrer"
          >
            GitHub <ArrowUpRight aria-hidden="true" size={15} />
          </a>
        </div>
      </SectionInner>
    </footer>
  );
}
