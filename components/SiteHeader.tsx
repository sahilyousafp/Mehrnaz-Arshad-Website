"use client";

// Slim fixed header. On the home page it stays hidden while the hero's own
// nav row ([data-hero-nav]) is on screen and fades in once it scrolls away;
// on other pages it is always shown. Over dark sections ([data-header-invert])
// the text flips to white.

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export function NavLinks() {
  return (
    <nav className="main-nav" aria-label="Main">
      <Link href="/#projects">Projects</Link>
      <Link href="/#expertise">Expertise</Link>
      <Link href="/#partners">Partners</Link>
      <Link href="/#contact">Contact</Link>
    </nav>
  );
}

export default function SiteHeader() {
  const pathname = usePathname();
  const [on, setOn] = useState(false);
  const [invert, setInvert] = useState(false);

  useEffect(() => {
    const heroNav = document.querySelector("[data-hero-nav]");
    if (!heroNav) {
      setOn(true);
    } else {
      setOn(false);
      const io = new IntersectionObserver(([e]) => setOn(!e.isIntersecting));
      io.observe(heroNav);
      return () => io.disconnect();
    }
  }, [pathname]);

  useEffect(() => {
    setInvert(false);
    const sections = Array.from(document.querySelectorAll("[data-header-invert]"));
    if (sections.length === 0) return;
    const under = new Set<Element>();
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) under.add(e.target);
          else under.delete(e.target);
        }
        setInvert(under.size > 0);
      },
      { rootMargin: "0px 0px -94% 0px" },
    );
    sections.forEach((s) => io.observe(s));
    return () => io.disconnect();
  }, [pathname]);

  return (
    <header className={`top-header${on ? " is-on" : ""}${invert ? " is-invert" : ""}`}>
      <Link href="/" className="top-header__brand" aria-label="Mehrnaz Arshad">
        MA
      </Link>
      <NavLinks />
    </header>
  );
}
