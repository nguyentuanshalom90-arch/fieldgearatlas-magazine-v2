import type { Metadata } from "next";
import "./globals.css";
import { MagazineHeader, MagazineFooter } from "../components/magazine-shell";

export const metadata: Metadata = {
  title: { default: "FieldGearAtlas Magazine", template: "%s | FieldGearAtlas" },
  description: "Independent field gear research, fit guidance, and practical outdoor knowledge.",
  icons: { icon: "/brand/fieldgearatlas-icon.png" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body><MagazineHeader />{children}<MagazineFooter /></body></html>;
}
