'use client';
/** Standalone FGA React 18/Next App Router client component.
 *  Research-only worksheet: never infer US shoe sizes, D/EE labels, or fit from numeric values.
 *  No cookies, storage, APIs, analytics, or server transmission.
 */
import { useMemo, useState } from 'react';
import './BootWidthWorksheet.css';

type Unit = 'mm' | 'in';
type MeasureKey = 'leftLength'|'leftWidth'|'leftArch'|'rightLength'|'rightWidth'|'rightArch';
type Problem = ''|'ball'|'toes'|'instep'|'heel'|'none';
const keys: MeasureKey[]=['leftLength','leftWidth','leftArch','rightLength','rightWidth','rightArch'];
const empty: Record<MeasureKey,string>={leftLength:'',leftWidth:'',leftArch:'',rightLength:'',rightWidth:'',rightArch:''};
const advice: Record<Problem,string>={
  '':'Identify the location of the problem and consult the specific boot brand/model chart.',
  ball:'Compare a genuine wider width option for the same boot model and inspect forefoot pressure.',
  toes:'Check length and toe-box geometry; width letters alone do not describe toe shape.',
  instep:'Check instep volume, last shape, tongue design and lacing before assuming you need EE.',
  heel:'Check heel hold and overall volume; increasing length could make slipping worse.',
  none:'Use a brand/model-specific size guide, then check fit while walking in the socks you will actually wear.'
};
const howTo: Record<MeasureKey,string>={leftLength:'Left heel-to-toe length',leftWidth:'Left ball-of-foot width',leftArch:'Left heel-to-ball length',rightLength:'Right heel-to-toe length',rightWidth:'Right ball-of-foot width',rightArch:'Right heel-to-ball length'};

type BrandKey = ''|'belleville'|'danner'|'underarmour';
const brandReferences: Record<Exclude<BrandKey,''>,{scope:string;codes:string;warning:string;source:string}> = {
 belleville:{scope:"Belleville men's boots",codes:'N = B; R = D; W = EE; XW = EEEE',warning:'Some widths are unavailable on some styles. This is a label reference, not a fitting result.',source:'https://www.bellevilleboot.com/index.php?l=page_view&p=sizing_guide'},
 danner:{scope:"Danner men's footwear",codes:'Medium = D; Wide = EE; some styles include Narrow B and Extra Wide 3E/4E',warning:'The options differ by model; check Danner model selection.',source:'https://support.danner.com/hc/en-us/articles/360040554994-Does-Danner-offer-extended-sizing'},
 underarmour:{scope:'Under Armour Micro G Valsetz Wide tactical boot',codes:'Wide = 2E on this specific model',warning:'Do not transfer this single-model label to all Under Armour footwear.',source:'https://www.underarmour.com/en-us/p/military_and_tactical_boots/ua_micro_g_valsetz_wide_2e_mens_tactical_boots/3023746.html'}
};

export default function BootWidthWorksheet(){
 const [unit,setUnit]=useState<Unit>('mm');const [brand,setBrand]=useState<BrandKey>('');
 const [values,setValues]=useState<Record<MeasureKey,string>>(empty);
 const [model,setModel]=useState('');const [size,setSize]=useState('');const [socks,setSocks]=useState('');const [problem,setProblem]=useState<Problem>('');
 const max=unit==='mm'?500:19.69;
 const errors=useMemo(()=>keys.filter(k=>values[k].trim()!==''&&(!Number.isFinite(Number(values[k]))||Number(values[k])<=0||Number(values[k])>max)),[values,max]);
 const value=(k:MeasureKey)=>{const raw=values[k].trim();if(!raw)return null;const n=Number(raw);return Number.isFinite(n)&&n>0&&n<=max?n:null};
 const formatted=(n:number|null)=>n===null?'—':`${parseFloat(n.toFixed(unit==='mm'?1:2))} ${unit}`;
 const diff=(a:number|null,b:number|null,dimension:string)=>a===null||b===null?`Record both ${dimension} values to compare`:(a>b?'Left foot':b>a?'Right foot':'Same recorded measurement')+` (difference ${formatted(Math.abs(a-b))})`;
 const changeUnit=(next:Unit)=>{if(next===unit)return;const factor=next==='in'?1/25.4:25.4;setValues(old=>Object.fromEntries(keys.map(k=>[k,old[k].trim()&&Number.isFinite(Number(old[k]))&&Number(old[k])>0?Number((Number(old[k])*factor).toFixed(next==='in'?3:1)).toString():old[k]])) as Record<MeasureKey,string>);setUnit(next)};
 const buildReport=()=>[
 'FieldGearAtlas — Boot Width Measurement Worksheet',`Date: ${new Date().toISOString().slice(0,10)}`,`Units: ${unit}`,`Brand/model to check: ${model||'Not specified'}`,`Manufacturer width reference: ${brand?brandReferences[brand].codes+' ('+brandReferences[brand].scope+')':'Not selected'}`,`US shoe size already known: ${size||'Not specified'}`,`Planned socks: ${socks||'Not specified'}`,
 '',...keys.map(k=>`${howTo[k]}: ${formatted(value(k))}`),'',`Next check: ${advice[problem]}`,'', 'This tool records measurements, not a US size or D/EE width prediction. Consult manufacturer guidance and a professional fitting where needed.','Sources: https://brannock.com/pages/instructions-fitting-tips ; https://www.bellevilleboot.com/index.php?l=page_view&p=sizing_guide'
 ].join('\n');
 const download=()=>{if(errors.length)return;const blob=new Blob([buildReport()],{type:'text/plain;charset=utf-8'});const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download='fieldgearatlas-boot-fit-record.txt';document.body.appendChild(a);a.click();a.remove();URL.revokeObjectURL(url)};
 const id='boot-width-worksheet';
 const measurement=(foot:'left'|'right',kind:'Length'|'Width'|'Arch',name:string,placeholder?:string)=>{const k=`${foot}${kind}` as MeasureKey;return <div className="fw-field" key={k}><label htmlFor={`${id}-${k}`}>{name}</label><input type="number" id={`${id}-${k}`} inputMode="decimal" min="0" max={max} step={unit==='mm'?'0.1':'0.001'} placeholder={placeholder||''} aria-invalid={errors.includes(k)} value={values[k]} onChange={e=>setValues(v=>({...v,[k]:e.target.value}))}/></div>};
 return <section className="fga-worksheet" aria-labelledby={`${id}-title`}>
  <div className="fw-eyebrow">Free interactive field worksheet • By FieldGearAtlas</div>
  <h3 id={`${id}-title`}>Record Your Boot Fit Measurements</h3>
  <p className="fw-note">Record both feet, then save or print a fit record. Measurements stay in this browser session: no server uploads, email collection, cookies or persistent storage. This is <strong>not a D/EE size predictor.</strong></p>
  <div className="fw-toolbar fw-no-print"><div className="fw-field"><label htmlFor={`${id}-unit`}>Measurement unit</label><select id={`${id}-unit`} value={unit} onChange={e=>changeUnit(e.target.value as Unit)}><option value="mm">Millimeters (mm)</option><option value="in">Inches (in)</option></select></div><span className="fw-note">Switch units without retyping measurements.</span></div>
  <div className="fw-layout">{(['left','right'] as const).map(foot=><fieldset key={foot} className="fw-panel" style={{border:'1px solid var(--fga-border)'}}><legend className="fw-legend">{foot==='left'?'Left foot':'Right foot'}</legend><div className="fw-grid">{measurement(foot,'Length','Heel-to-toe length',unit==='mm'?'e.g. 275':'e.g. 10.83')}{measurement(foot,'Width','Ball-of-foot width',unit==='mm'?'e.g. 105':'e.g. 4.13')}</div>{measurement(foot,'Arch','Heel-to-ball length (optional; professional measurement preferred)')}</fieldset>)}</div>
  <div className="fw-layout" style={{marginTop:18}}><div className="fw-panel"><h4>Purchase context (optional)</h4><div className="fw-field"><label htmlFor={`${id}-model`}>Brand / model to check</label><input id={`${id}-model`} type="text" maxLength={100} value={model} onChange={e=>setModel(e.target.value)} placeholder="Specific model name"/></div><div className="fw-field"><label htmlFor={`${id}-size`}>US shoe size already known</label><input id={`${id}-size`} type="text" maxLength={30} value={size} onChange={e=>setSize(e.target.value)} placeholder="Not calculated here"/></div><div className="fw-field"><label htmlFor={`${id}-socks`}>Planned socks</label><select id={`${id}-socks`} value={socks} onChange={e=>setSocks(e.target.value)}><option value="">Choose (optional)</option><option>Lightweight</option><option>Medium boot socks</option><option>Heavy winter socks</option><option>Other / not sure</option></select></div></div>
  <div className="fw-panel"><h4>Where does your current boot feel wrong?</h4><div className="fw-field"><label htmlFor={`${id}-problem`}>Primary fit issue</label><select id={`${id}-problem`} value={problem} onChange={e=>setProblem(e.target.value as Problem)}><option value="">Select a symptom</option><option value="ball">Squeezing across the ball of the foot</option><option value="toes">Toes crowded or touching the front</option><option value="instep">Pressure across top of the foot</option><option value="heel">Heel slipping while walking</option><option value="none">None — researching fit in advance</option></select></div><p className="fw-note">A wider label may not solve a toe-box, instep or heel problem. Use a model-specific fitting reference.</p></div></div>
  <div className="fw-brand" aria-labelledby={`${id}-brand-title`}><h4 id={`${id}-brand-title`}>Source-checked width code reference</h4><p className="fw-note">Choose a manufacturer or a specific model example. This shows the brand's published label — it never converts foot measurements into a size.</p><div className="fw-field"><label htmlFor={`${id}-brand`}>Brand / product reference</label><select id={`${id}-brand`} value={brand} onChange={e=>setBrand(e.target.value as BrandKey)}><option value="">Choose a verified example (optional)</option><option value="belleville">Belleville men's boots</option><option value="danner">Danner men's footwear</option><option value="underarmour">Under Armour Micro G Valsetz Wide (2E)</option></select></div>{brand?<div className="fw-brand-result" aria-live="polite"><strong>{brandReferences[brand].scope}</strong><p>{brandReferences[brand].codes}</p><p className="fw-note">{brandReferences[brand].warning}</p><a href={brandReferences[brand].source} target="_blank" rel="noopener noreferrer">Verify with manufacturer <span aria-hidden="true">↗</span></a></div>:<p className="fw-note">The source-backed examples are also listed in the article above; the complete brand/model chart is authoritative.</p>}</div>
  {errors.length>0&&<p className="fw-error" role="alert">Check positive measurements in the selected units: {errors.map(k=>howTo[k]).join(', ')}.</p>}
  <div className="fw-card" aria-live="polite" aria-atomic="true"><h4>My fit record</h4><p className="fw-note">{keys.filter(k=>values[k].trim()!=='').length} of 6 optional measurements recorded</p><ul className="fw-summary"><li><strong>Left:</strong> {formatted(value('leftLength'))} long × {formatted(value('leftWidth'))} at ball; heel-to-ball {formatted(value('leftArch'))}</li><li><strong>Right:</strong> {formatted(value('rightLength'))} long × {formatted(value('rightWidth'))} at ball; heel-to-ball {formatted(value('rightArch'))}</li><li><strong>Longer:</strong> {diff(value('leftLength'),value('rightLength'),'length')}</li><li><strong>Wider at ball:</strong> {diff(value('leftWidth'),value('rightWidth'),'width')}</li></ul><p className="fw-suggestion"><strong>Next check:</strong> {advice[problem]}</p></div>
  <div className="fw-button-row fw-no-print"><button className="fw-primary" type="button" disabled={errors.length>0} onClick={()=>window.print()}>Print / Save as PDF</button><button type="button" disabled={errors.length>0} onClick={download}>Download text record</button><button type="button" onClick={()=>{setValues({...empty});setUnit('mm');setModel('');setSize('');setSocks('');setProblem('');setBrand('')}}>Clear</button></div>
  <p className="fw-note"><strong>No universal conversion:</strong> This worksheet does not compute D/EE width or shoe size. See <a href="https://brannock.com/pages/instructions-fitting-tips" target="_blank" rel="noopener noreferrer">Brannock's fitting instructions</a> and <a href={"https://www.bellevilleboot.com/index.php?l=page_view&p=sizing_guide"} target="_blank" rel="noopener noreferrer">Belleville's brand-specific width guide</a>.</p>
 </section>
}
