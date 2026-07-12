"use client";

import Link from "next/link";
import { track } from "@vercel/analytics";

export default function ALink({
  href,
  children,
  trackEvent,
  trackProps,
}: {
  href: string;
  children: React.ReactNode;
  /** Analytics event name to fire on click. Kept as data (not a function
   * prop) so this component can be used from Server Component pages - an
   * inline handler can't cross the server/client boundary. */
  trackEvent?: string;
  trackProps?: Record<string, string>;
}) {
  const onClick = trackEvent ? () => track(trackEvent, trackProps) : undefined;
  const inner = (
    <>
      {children}{" "}
      <span className="arw" aria-hidden>
        ↘
      </span>
    </>
  );
  return href.startsWith("/") || href.startsWith("#") ? (
    <Link className="alink" href={href} onClick={onClick}>
      {inner}
    </Link>
  ) : (
    <a className="alink" href={href} onClick={onClick}>
      {inner}
    </a>
  );
}
