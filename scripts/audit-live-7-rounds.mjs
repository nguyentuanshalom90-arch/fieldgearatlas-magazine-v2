import { chromium } from "playwright";
import fs from "node:fs/promises";

const base=(process.env.LIVE_BASE_URL||"https://fieldgearatlas.com").replace(/\/$/,"");
const checks=[];
const add=(round,status,details)=>checks.push({round,status,details});
const fetchUrl=async(url,options={})=>fetch(url,{redirect:"manual",...options});

const root=await fetchUrl(`${base}/`);const robots=await fetchUrl(`${base}/robots.txt`);const sitemap=await fetchUrl(`${base}/sitemap.xml`);
add(1,root.ok&&robots.ok&&sitemap.ok?"PASS":"FAIL",`root=${root.status}; robots=${robots.status}; sitemap=${sitemap.status}`);
const sitemapText=await sitemap.text();const urls=[...sitemapText.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m=>m[1]).slice(0,50);
const urlResults=await Promise.all(urls.map(async url=>{const response=await fetchUrl(url);return {url,status:response.status,ok:response.ok};}));
add(2,urlResults.every(x=>x.ok)?"PASS":"FAIL",`sitemap URLs checked=${urlResults.length}; broken=${urlResults.filter(x=>!x.ok).length}`);
const browser=await chromium.launch({headless:true});const page=await browser.newPage({viewport:{width:1280,height:900}});await page.goto(`${base}/`,{waitUntil:"networkidle"});
const data=await page.evaluate(()=>({title:document.title,description:document.querySelector('meta[name="description"]')?.content||"",canonical:document.querySelector('link[rel="canonical"]')?.href||"",robots:document.querySelector('meta[name="robots"]')?.content||"",h1:document.querySelectorAll("h1").length,images:[...document.images].map(i=>({alt:i.alt,src:i.currentSrc||i.src,complete:i.complete,naturalWidth:i.naturalWidth})),links:[...document.querySelectorAll("a")].map(a=>a.href),jsonld:document.querySelectorAll('script[type="application/ld+json"]').length,ga:[...document.scripts].some(s=>/googletagmanager|google-analytics|gtag/i.test(s.src||s.textContent||"")),overflow:document.documentElement.scrollWidth>innerWidth}));
add(3,data.title&&data.description?"PASS":"FAIL",`title=${Boolean(data.title)}; description=${Boolean(data.description)}`);
add(4,data.canonical.startsWith("https://fieldgearatlas.com")&&data.robots?"PASS":"FAIL",`canonical=${data.canonical||"missing"}; robots=${data.robots||"missing"}`);
add(5,data.h1===1&&data.images.every(i=>i.alt&&i.complete&&i.naturalWidth>0)?"PASS":"FAIL",`h1=${data.h1}; images=${data.images.length}; bad-images=${data.images.filter(i=>!i.alt||!i.complete||i.naturalWidth===0).length}`);
const sameOrigin=[...new Set(data.links.filter(h=>h.startsWith(base)))].slice(0,40);const linkResults=await Promise.all(sameOrigin.map(async url=>{const response=await fetchUrl(url);return response.ok;}));
add(6,linkResults.every(Boolean)?"PASS":"FAIL",`internal links checked=${linkResults.length}; broken=${linkResults.filter(v=>!v).length}`);
const apex=await fetchUrl("http://fieldgearatlas.com/",{redirect:"manual"});const www=await fetchUrl("https://www.fieldgearatlas.com/",{redirect:"manual"});
add(7,data.jsonld>0&&data.ga&&(!apex.status.toString().startsWith("2")||String(apex.headers.get("location")||"").startsWith("https://fieldgearatlas.com"))&&(!www.status.toString().startsWith("2")||String(www.headers.get("location")||"").startsWith("https://fieldgearatlas.com"))?"PASS":"FAIL",`jsonld=${data.jsonld}; ga=${data.ga}; apex=${apex.status}->${apex.headers.get("location")||""}; www=${www.status}->${www.headers.get("location")||""}; overflow=${data.overflow}`);
await browser.close();const rounds=Array.from({length:7},(_,i)=>{const round=i+1;const rows=checks.filter(c=>c.round===round);return {round,status:rows.every(c=>c.status==="PASS")?"PASS":"FAIL",failed:rows.filter(c=>c.status!=="PASS").length};});
const report={base,generatedAt:new Date().toISOString(),rounds,checks,urlResults};await fs.writeFile("LIVE_SEO_7_ROUND_BASELINE.json",JSON.stringify(report,null,2));console.log(JSON.stringify({base,rounds,report:"LIVE_SEO_7_ROUND_BASELINE.json"},null,2));
