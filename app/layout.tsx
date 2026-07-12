import { Analytics } from "@vercel/analytics/next";
import type { Metadata } from "next";
import { Archivo, Bebas_Neue } from "next/font/google";
import Image from "next/image";
import FooterLinks from "@/components/FooterLinks";
import SiteHeader from "@/components/SiteHeader";
import Wordmark from "@/components/Wordmark";
import { site } from "@/content/site";
import "./globals.css";

const bebas = Bebas_Neue({
  subsets: ["latin"],
  weight: "400",
  variable: "--bebas",
});

const archivo = Archivo({
  subsets: ["latin"],
  variable: "--archivo",
});

export const metadata: Metadata = {
  title: `${site.name} - ${site.role}`,
  description:
    "Exhibition stand design portfolio of Mehrnaz Arshad: custom stands for MWC, Web Summit Qatar, Farnborough Airshow, FITUR and more, built with construction partners across Europe, the Middle East and Asia.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${bebas.variable} ${archivo.variable}`}>
      <body>
        <SiteHeader />
        {children}
        <footer className="footer2" id="contact" data-header-invert>
          <Image
            src="/pinned/hero-contact.jpg"
            alt=""
            fill
            sizes="100vw"
            className="footer2__bg"
            aria-hidden
          />
          <div className="footer2__top">
            <FooterLinks email={site.email} linkedin={site.linkedin} />
            <p className="footer2__legal">
              © {new Date().getFullYear()}, {site.name}. {site.role} — {site.base}
            </p>
          </div>
          <Wordmark text="MEHRNAZ ARSHAD" className="footer2__mark" />
        </footer>
        <Analytics />
      </body>
    </html>
  );
}
