/* Browser-only, zero external calls, no cookies, no localStorage. Original FGA code. */
(function(){'use strict';
const root=document.querySelector('[data-fga-width-worksheet]');if(!root)return;
const $=s=>root.querySelector(s);
const inputs=['leftLength','leftWidth','leftArch','rightLength','rightWidth','rightArch'];
const factor=25.4;const initial={unit:'mm',model:'',size:'',socks:'',problem:'',brand:'',leftLength:'',leftWidth:'',leftArch:'',rightLength:'',rightWidth:'',rightArch:''};
let unit='mm';
const label={leftLength:'Left length',leftWidth:'Left ball width',leftArch:'Left heel-to-ball',rightLength:'Right length',rightWidth:'Right ball width',rightArch:'Right heel-to-ball'};
const issueMap={ball:'Compare a genuine wider width option for the same boot model and inspect forefoot pressure.',toes:'Check length and toe-box geometry; width letters alone do not describe toe shape.',instep:'Check instep volume, last shape, tongue design and lacing before assuming you need EE.',heel:'Check heel hold and overall volume; increasing length could make slipping worse.',none:'Use a brand/model-specific size guide, then check fit while walking in the socks you will actually wear.'};
function num(id){const s=$(`[name="${id}"]`).value.trim();if(s==='')return null;const n=Number(s);return Number.isFinite(n)?n:null;}
function fmt(n){return Number(n.toFixed(unit==='mm'?1:2)).toString();}
function pretty(n){return n===null?'—':fmt(n)+' '+unit;}
function read(){return Object.fromEntries(inputs.map(id=>[id,num(id)]));}
function validate(v){const errs=[];for(const id of inputs){const n=v[id];const input=$(`[name="${id}"]`);const raw=input.value.trim();const valid=raw===''||(n!==null&&n>0&&n<=(unit==='mm'?500:19.69));input.setAttribute('aria-invalid',valid?'false':'true');if(!valid)errs.push(label[id]);}return errs;}
const brandRefs={
 belleville:{scope:"Belleville men's boots",codes:'N = B; R = D; W = EE; XW = EEEE',warning:'Some widths are unavailable on some styles. This is a label reference, not a fitting result.',source:'https://www.bellevilleboot.com/index.php?l=page_view&p=sizing_guide'},
 danner:{scope:"Danner men's footwear",codes:'Medium = D; Wide = EE; some styles include Narrow B and Extra Wide 3E/4E',warning:'Options differ by model; check Danner model selection.',source:'https://support.danner.com/hc/en-us/articles/360040554994-Does-Danner-offer-extended-sizing'},
 underarmour:{scope:'Under Armour Micro G Valsetz Wide tactical boot',codes:'Wide = 2E on this specific model',warning:'Do not transfer this single-model label to all Under Armour footwear.',source:'https://www.underarmour.com/en-us/p/military_and_tactical_boots/ua_micro_g_valsetz_wide_2e_mens_tactical_boots/3023746.html'}
};
function renderBrand(){const selected=$('[name="brand"]').value,rec=brandRefs[selected],container=$('#fw-brand-result');container.replaceChildren();container.hidden=!rec;if(!rec)return;const strong=document.createElement('strong');strong.textContent=rec.scope;const codes=document.createElement('p');codes.textContent=rec.codes;const warning=document.createElement('p');warning.className='fw-note';warning.textContent=rec.warning;const link=document.createElement('a');link.href=rec.source;link.rel='noopener noreferrer';link.target='_blank';link.textContent='Verify with manufacturer ↗';container.append(strong,codes,warning,link)}
function render(){const v=read(),errs=validate(v);renderBrand();const total=inputs.filter(id=>v[id]!==null).length;let summary='';
if(errs.length){$('#fw-error').textContent='Check positive measurements and units for: '+errs.join(', ')+'.';$('#fw-output').classList.add('fw-hidden');return;}
$('#fw-error').textContent='';$('#fw-output').classList.remove('fw-hidden');
const ll=v.leftLength,rl=v.rightLength,lw=v.leftWidth,rw=v.rightWidth;
const long=ll!==null&&rl!==null?(ll>rl?'Left foot':rl>ll?'Right foot':'Same recorded length'):'Record both lengths to compare';
const wide=lw!==null&&rw!==null?(lw>rw?'Left foot':rw>lw?'Right foot':'Same recorded width'):'Record both ball widths to compare';
summary=`<li><strong>Left:</strong> ${pretty(ll)} long × ${pretty(lw)} at ball; heel-to-ball ${pretty(v.leftArch)}</li><li><strong>Right:</strong> ${pretty(rl)} long × ${pretty(rw)} at ball; heel-to-ball ${pretty(v.rightArch)}</li><li><strong>Longer:</strong> ${long}${ll!==null&&rl!==null?' (difference '+pretty(Math.abs(ll-rl))+')':''}</li><li><strong>Wider at ball:</strong> ${wide}${lw!==null&&rw!==null?' (difference '+pretty(Math.abs(lw-rw))+')':''}</li>`;
$('#fw-summary').innerHTML=summary;
$('#fw-next').textContent=issueMap[$('[name="problem"]').value]||issueMap.none;
$('#fw-counter').textContent=`${total} of 6 optional measurements recorded`;
$('#fw-empty').textContent=total===0?'Fill in your measurements above to create your fit record.':'';
}
function serialize(){const vals=Object.fromEntries([...inputs,'model','size','socks','problem','brand'].map(id=>[id,$(`[name="${id}"]`).value.trim()]));const v=read();return `FieldGearAtlas — Boot Width Measurement Worksheet\nDate: ${new Date().toISOString().slice(0,10)}\nUnits: ${unit}\nBrand/model to check: ${vals.model||'Not specified'}\nUS size already worn / considering: ${vals.size||'Not specified'}\nPlanned socks: ${vals.socks||'Not specified'}\nMain fit issue: ${vals.problem||'Not specified'}\nSource-checked width reference: ${brandRefs[vals.brand]?brandRefs[vals.brand].scope+' — '+brandRefs[vals.brand].codes:'Not selected'}\n\nLEFT FOOT\nHeel-to-toe length: ${pretty(v.leftLength)}\nBall width: ${pretty(v.leftWidth)}\nHeel-to-ball length (optional): ${pretty(v.leftArch)}\n\nRIGHT FOOT\nHeel-to-toe length: ${pretty(v.rightLength)}\nBall width: ${pretty(v.rightWidth)}\nHeel-to-ball length (optional): ${pretty(v.rightArch)}\n\nNEXT CHECK\n${issueMap[vals.problem]||issueMap.none}\n\nThis tool records measurements only. It does not determine D, EE, a US shoe size or model-specific fit. Verify against manufacturer guidance and fitting in person where possible.\nSources: https://brannock.com/pages/instructions-fitting-tips ; https://www.bellevilleboot.com/index.php?l=page_view&p=sizing_guide`}
root.addEventListener('input',render);root.addEventListener('change',render);
$('#fw-unit').addEventListener('change',e=>{const next=e.target.value;if(next===unit)return;const mul=next==='in'?1/factor:factor;for(const id of inputs){const el=$(`[name="${id}"]`);const v=Number(el.value);if(el.value.trim()&&Number.isFinite(v)&&v>0)el.value=Number((v*mul).toFixed(next==='in'?3:1)).toString();}unit=next;for(const id of inputs){$(`[name="${id}"]`).step=next==='in'?'0.001':'0.1';}render()});
$('#fw-download').addEventListener('click',()=>{if(validate(read()).length){render();return;}const blob=new Blob([serialize()],{type:'text/plain;charset=utf-8'});const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download='fieldgearatlas-boot-fit-record.txt';document.body.append(a);a.click();a.remove();URL.revokeObjectURL(url)});
$('#fw-print').addEventListener('click',()=>{if(validate(read()).length){render();return;}window.print()});
$('#fw-reset').addEventListener('click',()=>{for(const name in initial){const el=$(`[name="${name}"]`);if(el)el.value=initial[name]}unit='mm';$('#fw-unit').value='mm';render()});
render();
})();
