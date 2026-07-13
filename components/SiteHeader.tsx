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
import LanguageToggle from "./LanguageToggle";
import { useLocale } from "./LocaleProvider";
import StaggeredMenu from "./StaggeredMenu";
import "./StaggeredMenu.css";

export function NavLinks() {
  const { t } = useLocale();
  return (
    <nav className="main-nav" aria-label="Main">
      <Link href="/#projects">{t("navProjects")}</Link>
      <Link href="/#expertise">{t("navExpertise")}</Link>
      <Link href="/#partners">{t("navPartners")}</Link>
      <Link href="/#contact" onClick={() => trackContactClick("hero-nav")}>
        {t("navContact")}
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

  const { t } = useLocale();

  const navItems = [
    { label: t("navProjects"), ariaLabel: t("navProjectsAria"), link: "/#projects" },
    { label: t("navExpertise"), ariaLabel: t("navExpertiseAria"), link: "/#expertise" },
    { label: t("navPartners"), ariaLabel: t("navPartnersAria"), link: "/#partners" },
    {
      label: t("navContact"),
      ariaLabel: t("navContactAria"),
      link: "/#contact",
      onClick: () => trackContactClick("menu-nav"),
    },
  ];

  const socialItems = [
    { label: t("socialEmail"), link: `mailto:${site.email}`, onClick: () => trackEmailClick("menu-socials") },
    { label: t("socialLinkedin"), link: site.linkedin, onClick: () => trackLinkedinClick("menu-socials") },
  ];

  return (
    <StaggeredMenu
      position="right"
      isFixed
      hideToggle={!on}
      items={navItems}
      socialItems={socialItems}
      displaySocials
      displayItemNumbering
      logoText="MA"
      colors={["#111111", "#050505"]}
      accentColor="#8a8a8a"
      menuButtonColor={invert ? "#fff" : "#0a0a0a"}
      openMenuButtonColor="#0a0a0a"
      changeMenuColorOnOpen
      extraPanelContent={<LanguageToggle className="sm-lang-toggle" />}
    />
  );
}
