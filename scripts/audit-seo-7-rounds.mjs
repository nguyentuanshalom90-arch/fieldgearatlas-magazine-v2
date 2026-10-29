import { chromium } from "playwright";
import fs from "node:fs/promises";

const base=process.env.V2_BASE_URL||"http://localhost:3004";
const routes=["/","/topics","/topics/boots","/topics/rucking","/topics/packs","/topics/clothing","/topics/field-sleep","/topics/surplus"];
const internal=(href)=>href&&href.startsWith("/")&&!href.startsWith("//");
const results=[];
const record=(round,status,details)=>results.push({round,status,details});

for(const route of routes){const res=await fetch(`${base}${route}`);record(1,res.ok?"PASS":"FAIL",`${route} HTTP ${res.status}`);}
const robots=await fetch(`${base}/robots.txt`);const sitemap=await fetch(`${base}/sitemap.xml`);record(1,robots.ok&&sitemap.ok?"PASS":"FAIL",`robots ${robots.status}; sitemap ${sitemap.status}`);

const browser=await chromium.launch({headless:true});
for(const route of routes){
  const page=await browser.newPage({viewport:{width:1280,height:900}});
  await page.goto(`${base}${route}`,{waitUntil:"networkidle"});
  const data=await page.evaluate(()=>({
    title:document.title,
    description:document.querySelector('meta[name="description"]')?.getAttribute("content")||"",
    canonical:document.querySelector('link[rel="canonical"]')?.getAttribute("href")||"",
    robots:document.querySelector('meta[name="robots"]')?.getAttribute("content")||"",
    h1:document.querySelectorAll("h1").length,
    images:[...document.images].map(img=>({alt:img.getAttribute("alt")||"",src:img.getAttribute("src")||""})),
    links:[...document.querySelectorAll("a")].map(a=>a.getAttribute("href")||""),
    jsonld:[...document.querySelectorAll('script[type="application/ld+json"]')].length,
    overflow:document.documentElement.scrollWidth>document.documentElement.clientWidth
  }));
  record(2,data.title&&data.description&&data.canonical?"PASS":"FAIL",`${route} title=${Boolean(data.title)} description=${Boolean(data.description)} canonical=${Boolean(data.canonical)}`);
  record(3,data.h1===1?"PASS":"FAIL",`${route} h1=${data.h1}`);
  const badPrivate=data.links.filter(h=>h.includes("/preview/")||h.includes("local-v2")||h==="#");
  record(4,badPrivate.length===0?"PASS":"FAIL",`${route} invalid/private links=${badPrivate.length}`);
  const badImages=data.images.filter(img=>!img.alt||img.src.includes("undefined"));
  record(5,badImages.length===0?"PASS":"FAIL",`${route} images=${data.images.length} bad-alt-or-src=${badImages.length}`);
  const localLinks=data.links.filter(internal);
  const checks=await Promise.all([...new Set(localLinks)].map(async href=>{const response=await fetch(`${base}${href}`);return response.ok;}));
  record(6,checks.every(Boolean)?"PASS":"FAIL",`${route} internal links checked=${checks.length} broken=${checks.filter(v=>!v).length}`);
  record(7,!data.overflow&&data.jsonld>0?"PASS":"FAIL",`${route} overflow=${data.overflow} jsonld=${data.jsonld}`);
  await page.close();
}
await browser.close();
const summary=Array.from({length:7},(_,i)=>{const round=i+1;const rows=results.filter(r=>r.round===round);return {round,status:rows.every(r=>r.status==="PASS")?"PASS":"FAIL",checks:rows.length,failed:rows.filter(r=>r.status!=="PASS").length};});
const report={base,routes,rounds:summary,results,generatedAt:new Date().toISOString()};
await fs.writeFile("SEO_7_ROUND_AUDIT.json",JSON.stringify(report,null,2));
console.log(JSON.stringify({rounds:summary,total:results.length,report:"SEO_7_ROUND_AUDIT.json"},null,2));
if(summary.some(r=>r.status!=="PASS"))process.exitCode=1;
