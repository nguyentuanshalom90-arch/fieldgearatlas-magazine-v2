"use client";

import Script from "next/script";
import { useEffect } from "react";
import { usePathname } from "next/navigation";

declare global { interface Window { dataLayer?: unknown[]; gtag?: (...args: unknown[]) => void; } }

const measurementId=process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
const projectName="fieldgearatlas_magazine_v2";

function track(name:string,params:Record<string,unknown>={}){if(typeof window!=="undefined"&&window.gtag&&measurementId)window.gtag("event",name,{project_name:projectName,...params});}

export function GoogleAnalytics(){
  const pathname=usePathname();
  useEffect(()=>{if(!measurementId)return;track("page_view",{page_location:window.location.href,page_path:pathname,page_title:document.title});},[pathname]);
  useEffect(()=>{
    if(!measurementId)return;
    const onClick=(event:MouseEvent)=>{const target=(event.target as HTMLElement).closest("a,button") as HTMLElement|null;if(!target)return;const href=target.getAttribute("href")||"";const label=(target.textContent||"").trim().slice(0,120);track("interaction_click",{element_type:target.tagName.toLowerCase(),element_label:label,link_url:href||undefined});if(href.startsWith("http")&&!href.includes(window.location.hostname))track("outbound_click",{link_url:href,link_text:label});if(/\.(pdf|zip|csv|docx?|xlsx?)($|\?)/i.test(href))track("file_download",{file_url:href,file_name:href.split("/").pop()});};
    const onScroll=()=>{const depth=Math.round((window.scrollY/(document.documentElement.scrollHeight-window.innerHeight))*100);if(depth>=25&&depth<50)track("scroll_depth",{percent_scrolled:25});else if(depth>=50&&depth<75)track("scroll_depth",{percent_scrolled:50});else if(depth>=75&&depth<90)track("scroll_depth",{percent_scrolled:75});else if(depth>=90)track("scroll_depth",{percent_scrolled:90});};
    const onFormStart=(event:Event)=>track("form_start",{form_id:(event.target as HTMLFormElement).id||"unknown"});
    const onFormSubmit=(event:Event)=>track("form_submit",{form_id:(event.target as HTMLFormElement).id||"unknown"});
    document.addEventListener("click",onClick,true);window.addEventListener("scroll",onScroll,{passive:true});document.addEventListener("focusin",event=>{if((event.target as HTMLElement).matches("input,textarea,select"))onFormStart(event);},{passive:true});document.addEventListener("submit",onFormSubmit,true);
    return()=>{document.removeEventListener("click",onClick,true);window.removeEventListener("scroll",onScroll);document.removeEventListener("submit",onFormSubmit,true);};
  },[]);
  if(!measurementId)return null;
  return <><Script src={`https://www.googletagmanager.com/gtag/js?id=${measurementId}`} strategy="afterInteractive"/><Script id="fga-ga4-config" strategy="afterInteractive">{`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)};window.gtag=gtag;gtag('js',new Date());gtag('config','${measurementId}',{send_page_view:false,project_name:'${projectName}'});`}</Script></>;
}
