import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";

const root = process.cwd();
const manifest = JSON.parse(fs.readFileSync(path.join(root, "reference", "MEDIA_SOURCE_OF_TRUTH_106.json"), "utf8").replace(/: NaN/g, ": null"));
const rows = manifest.filter((row) => row.webp_target_in_V2);
const report = ["slot_id,local_status,local_path,sha256,notes"];
let localSlots = 0;
for (const row of rows) {
  const localPath = row.webp_target_in_V2;
  const absolute = path.resolve(root, localPath);
  const exists = fs.existsSync(absolute);
  const hash = exists ? crypto.createHash("sha256").update(fs.readFileSync(absolute)).digest("hex") : "";
  if (exists) localSlots += 1;
  report.push(`${row.slot_id},${exists ? "LOCAL_FILE_VERIFIED" : "MEDIA_MISSING"},${localPath},${hash},${exists ? "Binary exists and is hashable" : "Source exists in manifest; binary missing"}`);
}
const mediaRoot = path.join(root, "public", "media");
const localFiles = fs.existsSync(mediaRoot) ? walk(mediaRoot).length : 0;
fs.writeFileSync(path.join(root, "MEDIA_IMPORT_REPORT_106.csv"), report.join("\n") + "\n");
console.log(JSON.stringify({ manifest: rows.length, localFiles, localSlots, missingSlots: rows.length - localSlots, status: localSlots === rows.length ? "LOCAL_FILE_COVERAGE_COMPLETE_RIGHTS_PENDING" : "SOURCE_COVERAGE_ONLY" }, null, 2));

function walk(dir) {
  const result = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) result.push(...walk(full));
    else result.push(full);
  }
  return result;
}
