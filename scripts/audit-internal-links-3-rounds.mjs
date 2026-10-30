import fs from "node:fs";
import path from "node:path";
import { chromium } from "playwright";

const root = process.cwd();
const base = process.env.AUDIT_BASE_URL || "http://localhost:3004";
const dirs = fs.readdirSync(path.join(root, "private-content"), { withFileTypes: true }).filter((entry) => entry.isDirectory() && /^FGA-\d{3}$/.test(entry.name));
const articles = dirs.map((entry) => {
  const status = JSON.parse(fs.readFileSync(path.join(root, "private-content", entry.name, "ORIGIN_AND_STATUS.json"), "utf8"));
  return { id: entry.name, url: status.proposed_canonical_url };
}).filter((article) => article.url);

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
const cache = new Map();
async function inspect(url) {
  if (cache.has(url)) return cache.get(url);
  const response = await page.goto(new URL(url, base).toString(), { waitUntil: "domcontentloaded" });
  const result = { url, status: response?.status() ?? 0, links: [], canonical: "", title: "", h1: 0, noindex: false };
  if (response?.ok()) {
    result.links = await page.locator("a[href]").evaluateAll((anchors) => anchors.map((anchor) => anchor.getAttribute("href")).filter((href) => href?.startsWith("/")));
    result.canonical = await page.locator('link[rel="canonical"]').getAttribute("href").catch(() => null) || "";
    result.title = await page.title();
    result.h1 = await page.locator("h1").count();
    result.noindex = (await page.locator('meta[name="robots"]').getAttribute("content").catch(() => ""))?.includes("noindex") ?? false;
  }
  cache.set(url, result);
  return result;
}

const report = { base, generatedAt: new Date().toISOString(), articleCount: articles.length, rounds: [] };

// Round 1: every article has a live public URL, canonical, title, and one H1.
const first = [];
for (const article of articles) first.push(await inspect(article.url));
report.rounds.push({ round: 1, name: "public route and metadata coverage", pass: first.every((item) => item.status === 200 && item.canonical.endsWith(item.url) && item.title && item.h1 === 1 && !item.noindex), checked: first.length, failed: first.filter((item) => item.status !== 200 || !item.canonical.endsWith(item.url) || !item.title || item.h1 !== 1 || item.noindex).map((item) => ({ url: item.url, status: item.status, canonical: item.canonical, h1: item.h1, noindex: item.noindex })) });

// Round 2: category hubs and home page link into the article graph; article pages link to related guides.
const roots = ["/", "/topics/", ...["boots", "rucking", "packs", "clothing", "field-sleep", "surplus"].map((slug) => `/topics/${slug}/`)];
const rootPages = [];
for (const root of roots) rootPages.push(await inspect(root));
const linkedFromHubs = new Set(rootPages.flatMap((item) => item.links).filter((href) => articles.some((article) => article.url === href || article.url === `${href}/`)).map((href) => href.endsWith("/") ? href : `${href}/`));
const relatedCount = first.filter((item) => item.links.some((href) => articles.some((article) => article.url === href || article.url === `${href}/`))).length;
report.rounds.push({ round: 2, name: "hub reachability and related-guide links", pass: linkedFromHubs.size === articles.length && relatedCount === articles.length, hubArticleLinks: linkedFromHubs.size, relatedArticlePages: relatedCount, orphaned: articles.map((article) => article.url).filter((url) => !linkedFromHubs.has(url.endsWith("/") ? url : `${url}/`)) });

// Round 3: every internal link emitted by the audited graph resolves and sitemap contains all articles.
const graphUrls = [...new Set([...roots, ...articles.map((article) => article.url), ...first.flatMap((item) => item.links)])].filter((url) => url.startsWith("/"));
const graphResults = [];
for (const url of graphUrls) graphResults.push(await inspect(url));
const sitemapResponse = await page.goto(new URL("/sitemap.xml", base).toString(), { waitUntil: "domcontentloaded" });
const sitemapText = await page.locator("body").innerText().catch(() => "");
const broken = graphResults.filter((item) => item.status >= 400).map((item) => ({ url: item.url, status: item.status }));
const sitemapMissing = articles.map((article) => article.url).filter((url) => !sitemapText.includes(url));
report.rounds.push({ round: 3, name: "broken-link and sitemap integrity", pass: broken.length === 0 && sitemapMissing.length === 0, checked: graphResults.length, broken, sitemapMissing });

await browser.close();
fs.writeFileSync(path.join(root, "INTERNAL_LINK_AUDIT_3_ROUNDS.json"), JSON.stringify(report, null, 2));
console.log(JSON.stringify(report, null, 2));
if (!report.rounds.every((round) => round.pass)) process.exit(1);
