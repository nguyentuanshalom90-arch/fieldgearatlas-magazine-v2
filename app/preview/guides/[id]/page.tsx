import { notFound } from "next/navigation";
import fs from "node:fs";
import path from "node:path";
import Image from "next/image";
import type { Metadata } from "next";

export const metadata:Metadata={title:"Private article preview",robots:{index:false,follow:false,noarchive:true}};

function renderMarkdown(source:string){
  const lines=source.split(/\r?\n/);
  const body=[] as Array<{kind:"h2"|"p"|"li";text:string;key:number}>;
  let frontMatter=false;
  let closedFrontMatter=false;
  for(const [i,line] of lines.entries()){
    if(i===0&&line.trim()==="---"){frontMatter=true;continue}
    if(frontMatter&&line.trim()==="---"){frontMatter=false;closedFrontMatter=true;continue}
    if(frontMatter||!closedFrontMatter)continue;
    if(line.startsWith("# "))continue;
    if(line.startsWith("## "))body.push({kind:"h2",text:line.slice(3),key:i});
    else if(line.startsWith("### "))body.push({kind:"h2",text:line.slice(4),key:i});
    else if(line.startsWith("- "))body.push({kind:"li",text:line.slice(2),key:i});
    else if(line.trim()&&!line.startsWith("|"))body.push({kind:"p",text:line.replace(/\*\*/g,""),key:i});
  }
  return body.map((line)=>line.kind==="h2"?<h2 key={line.key}>{line.text}</h2>:line.kind==="li"?<li key={line.key}>{line.text}</li>:<p key={line.key}>{line.text}</p>);
}

export default async function ArticlePreview({params,searchParams}:{params:Promise<{id:string}>;searchParams:Promise<{preview?:string;key?:string}>}){
  const {id}=await params;
  const q=await searchParams;
  const allowed=process.env.NODE_ENV!=="production"&&q.preview==="1"&&(q.key||"")===(process.env.PREVIEW_KEY||"local-v2");
  if(id!=="FGA-001"||!allowed)notFound();
  const file=path.join(process.cwd(),"private-content",id,"article.md");
  if(!fs.existsSync(file))notFound();
  const source=fs.readFileSync(file,"utf8");
  return <main className="article-page">
    <div className="article-breadcrumbs">Home　›　Knowledge　›　Boots &amp; Fit　›　Tactical Boot Width Chart</div>
    <div className="article-kicker-row"><span className="eyebrow brown">BOOTS &amp; FIT</span><span className="article-code">FGA-001 · GUIDE</span></div>
    <h1>Tactical Boot Width Chart: D vs EE, Measured Widths &amp; Fit Worksheet</h1>
    <p className="article-dek">How to understand width labels, measure both feet, and check fit — without assuming that every tactical boot brand fits the same.</p>
    <div className="article-byline"><span className="author-mark">F</span><div><strong>FieldGearAtlas Editorial</strong><small>Educational guide　·　Source-aware　·　No first-hand test claim</small></div><span className="hold-badge">PRIVATE PREVIEW · HOLD</span></div>
    <Image className="article-hero" src="/media/articles/FGA-001/tactical-boot-width-hero.webp" alt="Illustrative boot width measurement workspace" width={1280} height={720} priority/>
    <p className="article-caption">Conceptual illustration; no named product or first-hand test represented.</p>
    <div className="article-grid">
      <aside className="toc"><strong>ON THIS PAGE</strong><a href="#quick-answer">Quick answer</a><a href="#width-labels">Width labels</a><a href="#measure">Measure both feet</a><a href="#fit-checklist">Fit checklist</a><a href="#worksheet">Worksheet</a></aside>
      <article className="article-body"><p className="article-intro">A tactical boot can be the right length and still be the wrong fit. If the sides press against the ball of your foot, your toes feel crowded, or your heel slides as soon as you walk, changing the size number alone may not solve the problem.</p><section className="short-answer" id="quick-answer"><span>THE SHORT ANSWER</span><p>In many U.S. men’s charts, D is standard width, 2E (EE) is wide, and 4E is extra-wide. These labels are starting points, not a universal inches-to-width conversion.</p></section><h2 id="width-labels">What do D, EE and 4E mean?</h2><p>Width labels help identify available options, but the correct fit is determined by both foot measurements, the boot’s shape, and a practical walking test.</p>{renderMarkdown(source)}<figure className="article-figure" id="worksheet"><Image src="/media/articles/FGA-001/tactical-boot-width-code-chart.svg" alt="Boot width code chart" width={900} height={650}/><figcaption>Reference chart from the staged FGA-001 editorial package.</figcaption></figure><h2 id="measure">How to measure before choosing a boot</h2><p>Measure both feet in the socks you intend to wear. Keep length, forefoot width, and heel-retention notes together so you can compare a specific brand’s published guidance.</p><figure className="article-figure"><Image src="/media/articles/FGA-001/foot-tracing-at-home-ai.webp" alt="Illustrative foot tracing worksheet" width={1200} height={900}/><figcaption>Illustrative worksheet for recording foot measurements.</figcaption></figure><h2 id="fit-checklist">Fit checklist and evidence limits</h2><p>This is research and worksheet content, not a first-hand test, certification, or exact product measurement. Product-specific facts require separate source-aware assertions.</p></article>
      <aside className="article-rail"><strong>EDITORIAL NOTE</strong><div className="rail-card"><h3>Know the labels, then check the fit.</h3><p>Width code is only the beginning. Sock choice, toe room, and heel hold still matter.</p><button type="button">More fit guides →</button></div><strong>FIELD REFERENCES</strong><a href="#measure">Foot measurements</a><a href="#width-labels">Manufacturer charts</a><a href="#worksheet">Printable worksheet</a></aside>
    </div>
  </main>
}
