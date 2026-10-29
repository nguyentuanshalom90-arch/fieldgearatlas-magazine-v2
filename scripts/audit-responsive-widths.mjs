import fs from "node:fs";
import path from "node:path";
import { chromium } from "playwright";

const base="http://localhost:3004";
const widths=[320,375,390,430,650,768,1024,1122,1280,1440];
const routes=["/","/topics/boots","/topics/rucking","/topics/packs","/topics/clothing","/topics/field-sleep","/topics/surplus","/preview/guides/FGA-001?preview=1&key=local-v2"];
const browser=await chromium.launch({headless:true});
const results=[];
for(const width of widths){
  const page=await browser.newPage({viewport:{width,height:900}});
  for(const route of routes){
    await page.goto(base+route,{waitUntil:"networkidle"});
    const images=page.locator("img");
    for(let imageIndex=0;imageIndex<await images.count();imageIndex++){await images.nth(imageIndex).scrollIntoViewIfNeeded();}
    await page.waitForTimeout(250);
    await page.evaluate(async()=>{for(let y=0;y<document.body.scrollHeight;y+=700){window.scrollTo(0,y);await new Promise((resolve)=>setTimeout(resolve,35))}window.scrollTo(0,0);await new Promise((resolve)=>setTimeout(resolve,200))});
    await page.waitForTimeout(250);
    const result=await page.evaluate(()=>({overflow:document.documentElement.scrollWidth>document.documentElement.clientWidth||document.body.scrollWidth>document.body.clientWidth,broken:Array.from(document.images).filter((image)=>!image.complete||image.naturalWidth===0).map((image)=>image.getAttribute("src")),menu:null}));
    if(width<=650&&route==="/"){
      const toggle=page.getByRole("button",{name:"Menu"});
      await toggle.click();
      const opened=await toggle.getAttribute("aria-expanded");
      await page.keyboard.press("Escape");
      const closed=await toggle.getAttribute("aria-expanded");
      result.menu={opened,closed};
    }
    results.push({width,route,...result});
  }
  await page.close();
}
await browser.close();
const report={generated_at:new Date().toISOString(),widths,routes,total:results.length,overflow:results.filter((item)=>item.overflow).length,broken:results.filter((item)=>item.broken.length>0).length,keyboardEscape:results.filter((item)=>item.menu).every((item)=>item.menu.opened==="true"&&item.menu.closed==="false"),results};
fs.writeFileSync(path.join(process.cwd(),"RESPONSIVE_WIDTH_AUDIT.json"),JSON.stringify(report,null,2)+"\n");
console.log(JSON.stringify({widths:widths.length,routes:routes.length,total:results.length,overflow:report.overflow,broken:report.broken,keyboardEscape:report.keyboardEscape},null,2));
