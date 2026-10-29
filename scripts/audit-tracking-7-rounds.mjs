import { chromium } from "playwright";
import fs from "node:fs/promises";

const base=(process.env.TRACKING_BASE_URL||"http://localhost:3004").replace(/\/$/,"");
const expectedId=process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID||"G-G7659QXX6M";
const project="fieldgearatlas_magazine_v2";
const browser=await chromium.launch({headless:true});
const page=await browser.newPage({viewport:{width:1280,height:900}});
const rounds=[];
const result=(round,status,details)=>rounds.push({round,status,details});
const events=()=>page.evaluate(()=>({
  dataLayer:Array.isArray(window.dataLayer)?window.dataLayer.map(x=>Array.isArray(x)?x:[x[0],x[1],x[2]]):[],
  scripts:[...document.scripts].map(s=>s.src||s.textContent||"")
}));
const hasEvent=(rows,name)=>rows.some(x=>x[0]==="event"&&x[1]===name&&x[2]?.project_name===project);

await page.goto(`${base}/`,{waitUntil:"networkidle"});
await page.waitForTimeout(500);
let state=await events();
result(1,state.scripts.some(x=>x.includes(`googletagmanager.com/gtag/js?id=${expectedId}`))?"PASS":"FAIL",`measurement_id=${expectedId}`);
result(2,state.dataLayer.some(x=>x[0]==="config"&&x[1]===expectedId&&x[2]?.project_name===project)?"PASS":"FAIL",`project_name=${project}`);
result(3,hasEvent(state.dataLayer,"page_view")?"PASS":"FAIL","page_view");

await page.getByRole("link",{name:/Read the guide/}).click();
await page.waitForTimeout(300);
state=await events();
result(4,hasEvent(state.dataLayer,"interaction_click")?"PASS":"FAIL","interaction_click");

await page.evaluate(()=>window.scrollTo(0,Math.max(600,document.documentElement.scrollHeight*.35)));
await page.waitForTimeout(150);
state=await events();
result(5,hasEvent(state.dataLayer,"scroll_depth")?"PASS":"FAIL","scroll_depth");

await page.goto(`${base}/`,{waitUntil:"networkidle"});
await page.waitForTimeout(300);
await page.locator("#email").focus();
await page.locator("form").evaluate(form=>form.dispatchEvent(new Event("submit",{bubbles:true,cancelable:true})));
await page.waitForTimeout(150);
state=await events();
result(6,hasEvent(state.dataLayer,"form_start")&&hasEvent(state.dataLayer,"form_submit")?"PASS":"FAIL","form_start+form_submit");

await page.getByRole("link",{name:"Boots",exact:true}).click();
await page.waitForTimeout(500);
state=await events();
result(7,page.url().endsWith("/topics/boots")&&hasEvent(state.dataLayer,"page_view")?"PASS":"FAIL",`route=${new URL(page.url()).pathname}; route_page_view=${hasEvent(state.dataLayer,"page_view")}`);

await browser.close();
const report={base,expectedId,project,generatedAt:new Date().toISOString(),rounds};
await fs.writeFile("TRACKING_7_ROUND_REPORT.json",JSON.stringify(report,null,2));
console.log(JSON.stringify(report,null,2));
if(rounds.some(x=>x.status!=="PASS"))process.exitCode=1;
