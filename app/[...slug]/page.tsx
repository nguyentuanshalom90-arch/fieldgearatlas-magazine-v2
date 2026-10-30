import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { publishedArticleByPath, publishedArticleParams, publishedArticles, publicArticleUrl, type PublishedArticle } from "../../src/content/published-articles";

export const dynamic = "force-static";

export function generateStaticParams() {
  return publishedArticleParams();
}

function inlineText(text: string) {
  return text.replace(/\*\*/g, "").replace(/\*/g, "").replace(/`/g, "");
}

function articleSections(body: string) {
  const lines = body.split(/\r?\n/);
  const nodes: Array<{ kind: "h2" | "h3" | "p" | "li"; text: string; key: string }> = [];
  let listIndex = 0;
  for (const [index, raw] of lines.entries()) {
    const line = raw.trim();
    if (!line || line.startsWith("# ") || line.startsWith("![")) continue;
    if (line.startsWith("## ")) nodes.push({ kind: "h2", text: inlineText(line.slice(3)), key: `${index}-h2` });
    else if (line.startsWith("### ")) nodes.push({ kind: "h3", text: inlineText(line.slice(4)), key: `${index}-h3` });
    else if (/^[-*] /.test(line)) nodes.push({ kind: "li", text: inlineText(line.slice(2)), key: `${index}-li-${listIndex++}` });
    else if (!line.startsWith("|")) nodes.push({ kind: "p", text: inlineText(line), key: `${index}-p` });
  }
  return nodes;
}

function ArticleBody({ article }: { article: PublishedArticle }) {
  return <div className="article-body">
    {articleSections(article.body).map((node) => {
      if (node.kind === "h2") return <h2 key={node.key}>{node.text}</h2>;
      if (node.kind === "h3") return <h3 key={node.key}>{node.text}</h3>;
      if (node.kind === "li") return <ul key={node.key}><li>{node.text}</li></ul>;
      return <p key={node.key}>{node.text}</p>;
    })}
  </div>;
}

function relatedArticles(article: PublishedArticle) {
  const all = publishedArticles();
  const sameTopic = all.filter((candidate) => candidate.id !== article.id && candidate.categorySlug === article.categorySlug);
  const fallback = all.filter((candidate) => candidate.id !== article.id);
  return [...sameTopic, ...fallback].filter((candidate, index, list) => list.findIndex((item) => item.id === candidate.id) === index).slice(0, 4);
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string[] }> }): Promise<Metadata> {
  const { slug } = await params;
  const article = publishedArticleByPath(`/${slug.join("/")}/`);
  if (!article) return { robots: { index: false, follow: false } };
  return {
    title: article.title,
    description: article.description,
    alternates: { canonical: publicArticleUrl(article) },
    openGraph: { title: article.title, description: article.description, type: "article", images: [article.heroImage] },
  };
}

export default async function PublishedArticlePage({ params }: { params: Promise<{ slug: string[] }> }) {
  const { slug } = await params;
  const article = publishedArticleByPath(`/${slug.join("/")}/`);
  if (!article) notFound();
  const related = relatedArticles(article);
  return <main className="article-page">
    <div className="article-breadcrumbs"><Link href="/">Home</Link>　›　<Link href={`/topics/${article.categorySlug}`}>{article.topic}</Link>　›　{article.title}</div>
    <div className="article-kicker-row"><span className="eyebrow brown">{article.topic.toUpperCase()}</span><span className="article-code">{article.id} · GUIDE</span></div>
    <h1>{article.title}</h1>
    <p className="article-dek">{article.description}</p>
    <div className="article-byline"><span className="author-mark">F</span><div><strong>FieldGearAtlas Editorial</strong><small>Published guide　·　Source-aware　·　No first-hand test claim</small></div><span className="hold-badge published-badge">PUBLISHED</span></div>
    <img className="article-hero" src={article.heroImage} alt={article.heroAlt} />
    <p className="article-caption">Original conceptual illustration; no named product or first-hand test represented.</p>
    <div className="article-grid">
      <aside className="toc"><strong>ON THIS PAGE</strong><a href="#article-content">Guide content</a><a href="#related-guides">Related guides</a><a href="#editorial-limits">Editorial limits</a></aside>
      <article id="article-content"><ArticleBody article={article} /><section id="editorial-limits" className="proposed-note"><strong>Editorial limits.</strong> This guide is source-aware research, not a first-hand product test. Product-specific claims should be checked against the manufacturer’s current documentation and variant.</section><section id="related-guides" className="related-guides"><h2>Related guides</h2><div className="related-links">{related.map((item) => <Link key={item.id} href={item.path}>{item.title} <span>→</span></Link>)}</div><Link className="text-link" href={`/topics/${article.categorySlug}`}>Browse all {article.topic} guides →</Link></section></article>
      <aside className="article-rail"><strong>EDITORIAL NOTE</strong><div className="rail-card"><h3>Use the labels as a starting point.</h3><p>Fit, use case and source context matter more than a single marketing label.</p><Link href={`/topics/${article.categorySlug}`}>More guides →</Link></div><strong>EXPLORE THE MAGAZINE</strong><Link href="/topics/">All topics</Link><Link href="/">Latest guides</Link></aside>
    </div>
  </main>;
}


