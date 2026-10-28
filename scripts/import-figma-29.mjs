#!/usr/bin/env node
/**
 * Download/export ONLY the 29 Figma-generated original photos into a safe staging folder.
 * Does not touch the old FieldGearAtlas repo, any database, or publish content.
 * Requires Node 20+ and `npm install` in this directory.
 *
 * Usage: node import_figma_29.mjs
 */
import fs from "node:fs/promises";
import path from "node:path";
import crypto from "node:crypto";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const base = path.resolve(scriptDir, "../reference");
const manifestText = (await fs.readFile(path.join(base, "MEDIA_SOURCE_OF_TRUTH_106.json"), "utf8"))
  .replaceAll(": NaN", ": null");
const manifest = JSON.parse(manifestText)
  .filter((x) => x.source_provider === "FIGMA_AI_GPT_IMAGE")
  .filter((x) => !process.env.IMPORT_SLOT_IDS || process.env.IMPORT_SLOT_IDS.split(",").includes(x.slot_id));
const outputDir = path.resolve(scriptDir, "../.media-staging/FIGMA_IMPORTED_STAGING");
const report = [];
const PNG_MAGIC = "89504e470d0a1a0a";
const sha256 = (b) => crypto.createHash("sha256").update(b).digest("hex");

async function runOne(row) {
  const result = { slot_id: row.slot_id, status: "NOT_IMPORTED", provider: row.source_provider, webp_target: row.webp_target_in_V2 };
  try {
    // URLs supplied by the Figma image-generation provider, not arbitrary third-party URLs.
    const url = new URL(row.original_url);
    if (url.protocol !== "https:" || url.host !== "www.figma.com" || !url.pathname.startsWith("/api/mcp/asset/")) {
      throw new Error("Unexpected source URL host/path");
    }
    const response = await fetch(url, {redirect: "follow", signal: AbortSignal.timeout(45000)});
    if (!response.ok) throw new Error(`HTTP ${response.status}: Figma link expired, requires login, or access blocked`);
    const bytes = Buffer.from(await response.arrayBuffer());
    if (bytes.subarray(0, 8).toString("hex") !== PNG_MAGIC) throw new Error("Not a PNG image (possible login or error page)");
    const originalMeta = await sharp(bytes).metadata();
    if (originalMeta.width < 900 || originalMeta.height < 675) throw new Error(`Unexpected dimensions ${originalMeta.width}x${originalMeta.height}`);
    if (Math.abs(originalMeta.width / originalMeta.height - 4 / 3) > 0.03) throw new Error("Unexpected aspect ratio");

    const originalPath = path.join(outputDir, "ORIGINALS", `${row.slot_id}.png`);
    const relativeTarget = row.webp_target_in_V2.replaceAll("\\", "/");
    if (!relativeTarget.startsWith("public/media/articles/") || relativeTarget.includes("..")) {
      throw new Error("Unsafe destination path");
    }
    const webpPath = path.join(outputDir, "COPY_TO_V2_AFTER_QA", relativeTarget);
    await fs.mkdir(path.dirname(originalPath), {recursive:true});
    await fs.mkdir(path.dirname(webpPath), {recursive:true});
    await fs.writeFile(originalPath, bytes);
    await sharp(bytes).webp({ quality:85, effort:5 }).toFile(webpPath);
    const webp = await fs.readFile(webpPath);
    const webpMeta = await sharp(webp).metadata();
    if (webpMeta.format !== "webp") throw new Error("WebP output verification failed");

    Object.assign(result, {
      status: "LOCAL_FILES_CREATED_PENDING_EDITORIAL_APPROVAL",
      original_path: path.relative(outputDir, originalPath),
      original_sha256: sha256(bytes),
      original_bytes:bytes.length,
      webp_path:path.relative(outputDir, webpPath),
      webp_sha256:sha256(webp),
      webp_bytes:webp.length,
      width:webpMeta.width,
      height:webpMeta.height
    });
    if (process.env.REMOVE_ORIGINALS_AFTER_QA === "1") {
      await fs.unlink(originalPath);
      result.original_retained = false;
    }
  } catch(e) {
    result.status = "IMPORT_FAILED";
    result.error = String(e?.message || e);
  }
  return result;
}

for (let i=0;i<manifest.length;i+=3) {
  const batch = await Promise.all(manifest.slice(i,i+3).map(runOne));
  report.push(...batch);
  for (const row of batch) console.log(`${row.slot_id}: ${row.status}${row.error ? " - "+row.error : ""}`);
}
await fs.mkdir(outputDir, {recursive:true});
await fs.writeFile(path.join(outputDir, "IMPORT_RESULTS.json"), JSON.stringify({
  generatedAt:new Date().toISOString(),
  planned:manifest.length,
  imported:report.filter(x=>x.status==="LOCAL_FILES_CREATED_PENDING_EDITORIAL_APPROVAL").length,
  missing:report.filter(x=>x.status==="IMPORT_FAILED").length,
  qaNote:"Success confirms local technical file existence only; owner editorial approval and publication HOLD still apply.",
  assets:report
},null,2));
const failures=report.filter(x=>x.status!=="LOCAL_FILES_CREATED_PENDING_EDITORIAL_APPROVAL").length;
console.log(`\nResult: ${report.length-failures}/${manifest.length} Figma images imported to STAGING. Check IMPORT_RESULTS.json.`);
if (failures) process.exitCode=1;
