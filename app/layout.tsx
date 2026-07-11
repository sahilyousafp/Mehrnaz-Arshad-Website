import type { Metadata } from "next";
import { Archivo, Fraunces } from "next/font/google";
import SiteHeader from "@/components/SiteHeader";
import { site } from "@/content/site";
import "./globals.css";

const fraunces = Fraunces({
  subsets: ["latin"],
  style: ["normal", "italic"],
  axes: ["opsz"],
  variable: "--fraunces",
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
    <html lang="en">
      <body className={`${fraunces.variable} ${archivo.variable}`}>
        <SiteHeader />
        {children}
        <footer className="site-footer">
          <span className="label">{site.name}</span>
          <span>{site.role}</span>
          <a href={`mailto:${site.email}`}>{site.email}</a>
          <span>
            {site.base} · © {new Date().getFullYear()}
          </span>
        </footer>
      </body>
    </html>
  );
}
