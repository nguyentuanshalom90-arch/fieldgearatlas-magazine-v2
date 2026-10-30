import type { MetadataRoute } from "next";
import { getSiteUrl } from "../src/web/site-url";
import { publishedArticles } from "../src/content/published-articles";

export default function sitemap():MetadataRoute.Sitemap{
  const base=getSiteUrl();
  const routes=["/","/topics",...(["boots","rucking","packs","clothing","field-sleep","surplus"].map(slug=>`/topics/${slug}`))];
  const entries=routes.map((path,index)=>{const changeFrequency:"weekly"|"monthly"=index===0?"weekly":"monthly";return {url:`${base}${path}`,lastModified:new Date("2026-10-29"),changeFrequency,priority:index===0?1:index===1?.9:.75};});
  const articleEntries=publishedArticles().map((article)=>({url:`${base}${article.path}`,lastModified:new Date("2026-10-30"),changeFrequency:"monthly" as const,priority:.7}));
  return [...entries,...articleEntries];
}
