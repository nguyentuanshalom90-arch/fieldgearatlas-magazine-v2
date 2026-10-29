import type { MetadataRoute } from "next";
import { getSiteUrl } from "../src/web/site-url";

export default function sitemap():MetadataRoute.Sitemap{
  const base=getSiteUrl();
  const routes=["/","/topics",...(["boots","rucking","packs","clothing","field-sleep","surplus"].map(slug=>`/topics/${slug}`))];
  return routes.map((path,index)=>({url:`${base}${path}`,lastModified:new Date("2026-10-29"),changeFrequency:index===0?"weekly":"monthly",priority:index===0?1:index===1?.9:.75}));
}
