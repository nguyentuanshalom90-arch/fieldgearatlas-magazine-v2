import test from "node:test";import assert from "node:assert/strict";import fs from "node:fs";import path from "node:path";
const root=process.cwd();
test("independent repo has no V1 environment dependency",()=>{assert.equal(fs.existsSync(path.join(root,".env.production")),false);assert.equal(fs.existsSync(path.join(root,"prisma")),false)});
test("private staging contains exactly 50 article folders",()=>{const dirs=fs.readdirSync(path.join(root,"private-content"),{withFileTypes:true}).filter(x=>x.isDirectory()&&/^FGA-\d+$/.test(x.name));assert.equal(dirs.length,50);for(const d of dirs){const s=JSON.parse(fs.readFileSync(path.join(root,"private-content",d.name,"ORIGIN_AND_STATUS.json")));assert.equal(s.release_authorized,false);assert.equal(s.draft_only,true)}});
test("manifest is 106 slots",()=>{const lines=fs.readFileSync(path.join(root,"reference/MEDIA_SOURCE_OF_TRUTH_106.csv"),"utf8").trim().split(/\r?\n/);assert.equal(lines.length-1,106)});
