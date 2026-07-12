"use client";

// Site-wide nav: a persistent top-right toggle (StaggeredMenu) that opens a
// full slide-out panel. On the home page the toggle stays hidden while the
// hero's own text nav row ([data-hero-nav], rendered via <NavLinks/>) is on
// screen, and fades in once it scrolls away; on other pages it is always
// shown. Over dark sections ([data-header-invert]) the toggle flips white.

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { site } from "@/content/site";
import { trackContactClick, trackEmailClick, trackLinkedinClick } from "@/lib/analytics";
import StaggeredMenu from "./StaggeredMenu";
import "./StaggeredMenu.css";

const NAV_ITEMS = [
  { label: "Projects", ariaLabel: "See selected projects", link: "/#projects" },
  { label: "Expertise", ariaLabel: "See the design process", link: "/#expertise" },
  { label: "Partners", ariaLabel: "See construction partners", link: "/#partners" },
  {
    label: "Contact",
    ariaLabel: "Get in touch",
    link: "/#contact",
    onClick: () => trackContactClick("menu-nav"),
  },
];

export function NavLinks() {
  return (
    <nav className="main-nav" aria-label="Main">
      <Link href="/#projects">Projects</Link>
      <Link href="/#expertise">Expertise</Link>
      <Link href="/#partners">Partners</Link>
      <Link href="/#contact" onClick={() => trackContactClick("hero-nav")}>
        Contact
      </Link>
    </nav>
  );
}

export default function SiteHeader() {
  const pathname = usePathname();
  const hasHero = pathname === "/";
  const [prevPathname, setPrevPathname] = useState(pathname);
  const [on, setOn] = useState(!hasHero);
  const [invert, setInvert] = useState(false);

  // Reset the derived on/invert state as soon as the route changes, before
  // the effects below re-subscribe their observers for the new page.
  if (pathname !== prevPathname) {
    setPrevPathname(pathname);
    setOn(!hasHero);
    setInvert(false);
  }

  useEffect(() => {
    if (!hasHero) return;
    const heroNav = document.querySelector("[data-hero-nav]");
    if (!heroNav) return;
    const io = new IntersectionObserver(([e]) => setOn(!e.isIntersecting));
    io.observe(heroNav);
    return () => io.disconnect();
  }, [hasHero]);

  useEffect(() => {
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

  const socialItems = [
    { label: "Email", link: `mailto:${site.email}`, onClick: () => trackEmailClick("menu-socials") },
    { label: "LinkedIn", link: site.linkedin, onClick: () => trackLinkedinClick("menu-socials") },
  ];

  return (
    <StaggeredMenu
      position="right"
      isFixed
      hideToggle={!on}
      items={NAV_ITEMS}
      socialItems={socialItems}
      displaySocials
      displayItemNumbering
      logoText="MA"
      colors={["#111111", "#050505"]}
      accentColor="#8a8a8a"
      menuButtonColor={invert ? "#fff" : "#0a0a0a"}
      openMenuButtonColor="#0a0a0a"
      changeMenuColorOnOpen
    />
  );
}
