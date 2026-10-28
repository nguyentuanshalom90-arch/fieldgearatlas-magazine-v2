"use client";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

const nav = [["Boots","/topics/boots"],["Rucking","/topics/rucking"],["Packs","/topics/packs"],["Clothing","/topics/clothing"],["Field & Sleep","/topics/field-sleep"],["Surplus","/topics/surplus"]];

export function MagazineHeader(){
  const [open,setOpen]=useState(false);
  return <header className="site-header"><div className="header-inner">
    <Link href="/" aria-label="FieldGearAtlas home"><Image className="brand-logo" src="/brand/fieldgearatlas-horizontal.png" alt="FieldGearAtlas" width={484} height={100} priority /></Link>
    <nav className="desktop-nav" aria-label="Primary navigation"><Link href="/">Knowledge⌄</Link>{nav.map(([label,href])=><Link key={href} href={href}>{label}</Link>)}<span className="search" aria-hidden="true">⌕</span><Link className="guide-button" href="/topics/boots">Guides A-Z</Link></nav>
    <button className="mobile-toggle" aria-expanded={open} aria-controls="mobile-nav" onClick={()=>setOpen(!open)}>{open?"×":"☰"}<span className="sr-only">Menu</span></button>
    <nav id="mobile-nav" className={`mobile-nav ${open?"open":""}`} aria-label="Mobile navigation"><Link href="/">Knowledge</Link>{nav.map(([label,href])=><Link key={href} href={href} onClick={()=>setOpen(false)}>{label}</Link>)}</nav>
  </div></header>
}

export function MagazineFooter(){return <footer className="site-footer"><div className="footer-inner"><div><Image className="footer-logo" src="/brand/fieldgearatlas-horizontal-white.png" alt="FieldGearAtlas" width={410} height={85}/></div><p>In-depth guides, honest research, and practical knowledge for the outdoors, tactical and military gear community.</p><div className="footer-links"><Link href="/">About</Link><Link href="/">Contact</Link><Link href="/">Privacy</Link><Link href="/">Terms</Link></div></div><div className="footer-inner copyright">© 2026 FieldGearAtlas. Independent editorial research. No government affiliation.</div></footer>}
