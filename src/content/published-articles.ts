import fs from "node:fs";
import path from "node:path";

export type PublishedArticle = {
  id: string;
  title: string;
  description: string;
  topic: string;
  categorySlug: string;
  path: string;
  heroImage: string;
  heroAlt: string;
  body: string;
};

const CONTENT_ROOT = path.join(process.cwd(), "private-content");
const topicSlugs: Record<string, string> = {
  "Boots & Fit": "boots",
  "Rucking & Training": "rucking",
  "Packs & Carry": "packs",
  "Clothing & Protection": "clothing",
  "Field & Sleep": "field-sleep",
  "Surplus & Heritage": "surplus",
};

function clean(value: string) {
  return value.trim().replace(/^['"]|['"]$/g, "");
}

function readFrontMatter(source: string) {
  const match = source.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
  if (!match) return { fields: {} as Record<string, string>, body: source };
  const fields: Record<string, string> = {};
  let current = "";
  for (const rawLine of match[1].split(/\r?\n/)) {
    const line = rawLine.trimEnd();
    const key = line.match(/^([A-Za-z0-9_]+):\s*(.*)$/);
    if (key) {
      current = key[1];
      fields[current] = clean(key[2]);
    } else if (current && /^\s+/.test(rawLine) && !rawLine.trimStart().startsWith("-")) {
      fields[current] = `${fields[current]} ${rawLine.trim()}`.trim();
    }
  }
  return { fields, body: match[2] };
}

function readArticle(id: string): PublishedArticle | null {
  const folder = path.join(CONTENT_ROOT, id);
  const articleFile = path.join(folder, "article.md");
  const statusFile = path.join(folder, "ORIGIN_AND_STATUS.json");
  if (!fs.existsSync(articleFile) || !fs.existsSync(statusFile)) return null;
  const status = JSON.parse(fs.readFileSync(statusFile, "utf8")) as { release_authorized?: boolean; draft_only?: boolean; proposed_canonical_url?: string };
  if (!status.release_authorized || status.draft_only) return null;
  const parsed = readFrontMatter(fs.readFileSync(articleFile, "utf8"));
  const topic = parsed.fields.topic || "Field & Sleep";
  const articlePath = status.proposed_canonical_url || parsed.fields.proposed_path;
  if (!articlePath) return null;
  return {
    id,
    title: parsed.fields.seo_title || parsed.fields.title || id,
    description: parsed.fields.meta_description || "Source-aware field gear guidance for practical decisions.",
    topic,
    categorySlug: topicSlugs[topic] || "field-sleep",
    path: articlePath.endsWith("/") ? articlePath : `${articlePath}/`,
    heroImage: `/media/articles/${id}/hero.webp`,
    heroAlt: parsed.fields.hero_alt || `${parsed.fields.seo_title || id} — original editorial illustration`,
    body: parsed.body,
  };
}

export function publishedArticles(): PublishedArticle[] {
  if (!fs.existsSync(CONTENT_ROOT)) return [];
  return fs.readdirSync(CONTENT_ROOT, { withFileTypes: true })
    .filter((entry) => entry.isDirectory() && /^FGA-\d{3}$/.test(entry.name))
    .sort((a, b) => a.name.localeCompare(b.name))
    .map((entry) => readArticle(entry.name))
    .filter((article): article is PublishedArticle => Boolean(article));
}

export function publishedArticleByPath(articlePath: string) {
  const normalized = articlePath.endsWith("/") ? articlePath : `${articlePath}/`;
  return publishedArticles().find((article) => article.path === normalized);
}

export function publishedArticleParams() {
  return publishedArticles().map((article) => ({ slug: article.path.split("/").filter(Boolean) }));
}
