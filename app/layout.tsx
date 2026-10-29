import type { Metadata } from "next";
import "./globals.css";
import { MagazineHeader, MagazineFooter } from "../components/magazine-shell";
import { getSiteUrl } from "../src/web/site-url";

export const metadata: Metadata = {
  metadataBase: new URL(getSiteUrl()),
  title: { default: "FieldGearAtlas Magazine", template: "%s | FieldGearAtlas" },
  description: "Independent field gear research, fit guidance, and practical outdoor knowledge.",
  alternates: { canonical: "/" },
  icons: { icon: "/brand/fieldgearatlas-icon.png" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const siteUrl=getSiteUrl();
  const structuredData={"@context":"https://schema.org","@type":"WebSite",name:"FieldGearAtlas Magazine",url:siteUrl,description:"Independent field gear research, fit guidance, and practical outdoor knowledge."};
  return <html lang="en"><body><MagazineHeader />{children}<MagazineFooter /><script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(structuredData)}} /></body></html>;
}
