import type { MetadataRoute } from "next";
import { getSiteUrl } from "../src/web/site-url";

export default function robots():MetadataRoute.Robots{return {rules:{userAgent:"*",allow:"/",disallow:["/preview/","/private-content/"]},sitemap:`${getSiteUrl()}/sitemap.xml`};}
