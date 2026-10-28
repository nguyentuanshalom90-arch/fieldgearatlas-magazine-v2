import Image from "next/image";
import Link from "next/link";

export type Story = {title:string; excerpt:string; image:string; category?:string; href?:string; date?:string; read?:string};
export const mediaIds=["021","022","023","024","025","026","027","028","029","030","031","038"];
export function media(i:number, role:"hero"|"thumb"="hero"){const id=mediaIds[i%mediaIds.length];return `/media/articles/FGA-${id}/${role}.webp`}

export function StoryCard({story,lead=false}: {story:Story;lead?:boolean}){return <Link href={story.href||"/"} className={`story-card ${lead?"mosaic-lead":""}`}><Image src={story.image} alt="" width={900} height={600} sizes="(max-width:650px) 100vw, 50vw" style={{width:"100%",height:"100%"}}/><div className="story-copy"><span className={`eyebrow ${story.category?.includes("Featured")?"brown":""}`}>{story.category||"FIELD NOTES"}</span><h3 className={lead?"lead-title":undefined}>{story.title}</h3><p>{story.excerpt}</p>{lead&&<span className="cta" style={{display:"inline-block",marginTop:12,fontSize:12}}>Read the guide →</span>}</div></Link>}

export function ArticleCard({story}:{story:Story}){return <Link href={story.href||"/"} className="article-card"><Image src={story.image} alt="" width={600} height={380} sizes="(max-width:650px) 100vw, 25vw" style={{width:"100%",height:"auto"}}/><div className="article-body"><span className="eyebrow" style={{fontSize:9,padding:"4px 6px"}}>{story.category||"FIELD NOTES"}</span><h3>{story.title}</h3><p>{story.excerpt}</p><span className="meta">{story.date||"Apr 12, 2024"} · {story.read||"7 min read"}</span></div></Link>}

export function MostRead({stories}:{stories:Story[]}){return <aside className="most-read"><h2>Most Read</h2><div className="read-tabs"><span>This Week</span><span>This Month</span><span>All Time</span></div>{stories.slice(0,5).map((s,i)=><div className="read-item" key={s.title}><span className="read-rank">{i+1}</span><Image src={s.image} alt="" width={104} height={78} style={{width:"52px",height:"39px"}}/><div><strong>{s.title}</strong><small>{s.read||"7 min read"}</small></div></div>)}</aside>}

export function SectionHeading({title,link="View all guides →"}:{title:string;link?:string}){return <div className="section-head"><h2>{title}</h2><Link href="/">{link}</Link></div>}
export function TopicStrip({items}:{items:readonly Story[]}){return <div className="topic-row">{items.map((s,i)=><Link className="topic-card" href="/" key={s.title}><Image src={s.image} alt="" width={500} height={300} style={{width:"100%",height:"100%"}}/><strong>{s.title}</strong></Link>)}</div>}
export function Newsletter({label="STAY IN THE KNOW",title="Get new guides, reviews, and field knowledge"}:{label?:string;title?:string}){return <div className="newsletter"><span className="eyebrow">{label}</span><h3>{title}</h3><p>Join our editorial list for practical field notes and new guides.</p><form><label className="sr-only" htmlFor="email">Email</label><input id="email" type="email" placeholder="Your email address"/><button type="button">Subscribe</button></form></div>}

export function MissingMedia({slot}:{slot:string}){return <div className="missing-media">EDITOR PREVIEW · MISSING MEDIA: {slot}<br/><small>Source exists in the 106-slot manifest, but no local binary is present yet. No substitute is silently used.</small></div>}
