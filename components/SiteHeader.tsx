"use client";

// Fixed header that switches from paper to ink text while a light section
// (anything tagged data-header-ink) sits underneath it. Cheaper than
// mix-blend-mode, which forces expensive compositing over the image reel.

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { site } from "@/content/site";

export default function SiteHeader() {
  const pathname = usePathname();
  const [ink, setInk] = useState(false);

  useEffect(() => {
    setInk(false);
    const sections = Array.from(document.querySelectorAll("[data-header-ink]"));
    if (sections.length === 0) return;
    const underHeader = new Set<Element>();
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) underHeader.add(entry.target);
          else underHeader.delete(entry.target);
        }
        setInk(underHeader.size > 0);
      },
      // Only the strip the header occupies counts as "underneath".
      { rootMargin: "0px 0px -93% 0px" },
    );
    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, [pathname]);

  return (
    <header className={`site-header${ink ? " site-header--ink" : ""}`}>
      <Link href="/" className="brand" aria-label={site.name}>
        MEHRNAZ ARSHAD
      </Link>
      <nav className="site-nav" aria-label="Main">
        <Link href="/#projects">Projects</Link>
        <Link href="/#about">About</Link>
        <Link href="/#contact">Contact</Link>
      </nav>
    </header>
  );
}
