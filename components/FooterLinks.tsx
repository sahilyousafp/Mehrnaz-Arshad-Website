"use client";

import { trackEmailClick, trackLinkedinClick } from "@/lib/analytics";

export default function FooterLinks({ email, linkedin }: { email: string; linkedin: string }) {
  return (
    <div className="footer2__links">
      <a className="alink" href={`mailto:${email}`} onClick={() => trackEmailClick("footer")}>
        <span className="arw" aria-hidden>
          ↘
        </span>
        Email
      </a>
      <a
        className="alink"
        href={linkedin}
        target="_blank"
        rel="noreferrer"
        onClick={() => trackLinkedinClick("footer")}
      >
        <span className="arw" aria-hidden>
          ↘
        </span>
        LinkedIn
      </a>
    </div>
  );
}
