"use client";

import { trackEmailClick, trackLinkedinClick } from "@/lib/analytics";
import { useLocale } from "./LocaleProvider";

export default function FooterLinks({ email, linkedin }: { email: string; linkedin: string }) {
  const { t } = useLocale();
  return (
    <div className="footer2__links">
      <a className="alink" href={`mailto:${email}`} onClick={() => trackEmailClick("footer")}>
        <span className="arw" aria-hidden>
          ↘
        </span>
        {t("socialEmail")}
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
        {t("socialLinkedin")}
      </a>
    </div>
  );
}
