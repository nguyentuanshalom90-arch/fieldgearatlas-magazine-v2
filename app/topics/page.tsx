import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { categories, type CategoryKey } from "../../data/magazine";

export const metadata:Metadata={title:"Topics",description:"Browse FieldGearAtlas research by boots, rucking, packs, clothing, field sleep, and military surplus.",alternates:{canonical:"/topics"},openGraph:{title:"Topics | FieldGearAtlas",description:"Browse FieldGearAtlas research by gear topic.",type:"website"}};

export default function TopicsIndex(){return <main className="page-wrap topics-index"><div className="breadcrumbs">Home　›　Topics</div><header className="topic-index-intro"><span className="eyebrow">KNOWLEDGE BASE</span><h1>Explore FieldGearAtlas topics</h1><p>Start with the gear category that matches the decision you are trying to make. Each topic hub brings together practical guides, fit considerations, and evidence limits.</p></header><div className="topic-index-grid">{(Object.keys(categories) as CategoryKey[]).map((slug)=><Link className="topic-index-card" href={`/topics/${slug}`} key={slug}><Image src={categories[slug].hero} alt={`${categories[slug].name} topic`} width={900} height={520}/><div><span className="eyebrow">{categories[slug].name.toUpperCase()}</span><h2>{categories[slug].name}</h2><p>{categories[slug].description}</p><span className="cta">Explore topic →</span></div></Link>)}</div></main>}
