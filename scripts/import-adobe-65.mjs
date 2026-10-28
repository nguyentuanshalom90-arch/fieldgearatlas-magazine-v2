import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import sharp from "sharp";

const root = process.cwd();
const manifestPath = path.join(root, "reference", "MEDIA_SOURCE_OF_TRUTH_106.json");
const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8").replace(/: NaN/g, ": null"));
const rows = manifest.filter((row) => row.source_provider === "ADOBE_FIREFLY");
const originalsRoot = path.join(root, ".adobe-staging", "originals");
const results = [];

for (const row of rows) {
  const input = path.join(originalsRoot, `${row.slot_id}.jpg`);
  const target = path.resolve(root, row.webp_target_in_V2);
  const publicRoot = path.resolve(root, "public");
  if (!target.startsWith(`${publicRoot}${path.sep}`)) throw new Error(`Unsafe target: ${row.slot_id}`);
  if (!fs.existsSync(input)) throw new Error(`Missing authenticated Adobe export: ${row.slot_id}`);

  const inputBuffer = fs.readFileSync(input);
  const inputMeta = await sharp(inputBuffer).metadata();
  if (!inputMeta.width || !inputMeta.height) throw new Error(`Invalid image dimensions: ${row.slot_id}`);
  fs.mkdirSync(path.dirname(target), { recursive: true });
  const outputBuffer = await sharp(inputBuffer).webp({ quality: 85, effort: 5 }).toBuffer();
  const outputMeta = await sharp(outputBuffer).metadata();
  if (outputMeta.format !== "webp" || !outputMeta.width || !outputMeta.height) throw new Error(`Invalid WebP output: ${row.slot_id}`);
  fs.writeFileSync(target, outputBuffer);
  results.push({
    slot_id: row.slot_id,
    input_sha256: crypto.createHash("sha256").update(inputBuffer).digest("hex"),
    output_sha256: crypto.createHash("sha256").update(outputBuffer).digest("hex"),
    input_dimensions: `${inputMeta.width}x${inputMeta.height}`,
    output_dimensions: `${outputMeta.width}x${outputMeta.height}`,
    output_path: row.webp_target_in_V2,
    status: "LOCAL_FILE_VERIFIED_PENDING_EDITORIAL_APPROVAL"
  });
}

const report = {
  generated_at: new Date().toISOString(),
  source_provider: "ADOBE_FIREFLY",
  planned: rows.length,
  imported: results.length,
  missing: rows.length - results.length,
  rights_status: "PENDING_OWNER_APPROVAL",
  release_authorized: false,
  results
};
fs.writeFileSync(path.join(root, "ADOBE_IMPORT_RESULTS_65.json"), JSON.stringify(report, null, 2) + "\n");
console.log(JSON.stringify({ planned: rows.length, imported: results.length, missing: rows.length - results.length, status: "LOCAL_FILE_COVERAGE_COMPLETE_RIGHTS_PENDING" }, null, 2));
