# Media rights and approval status

## Current evidence

- Manifest: 106 planned slots.
- Local verified files: 122 media files representing all 106 manifest slots (29 Figma inline imports plus 65 authenticated Adobe exports, with the supplied bundle assets and FGA-001 technical assets also retained).
- Remote-only records: none in the 106-slot binary manifest after authenticated Adobe export.
- Sources include Adobe Firefly references and Figma-generated image references. A source URL is not a local production file.
- Access check on 2026-10-29: sampled Adobe Firefly short URLs returned HTTP 403 and sampled Figma references returned HTTP 400 from this environment; no binary was treated as recovered from those URLs.
- Owner public-release authorization for all 106 slots was explicitly granted on 2026-10-30. The approval applies to the locally verified binaries listed in the manifest and does not convert conceptual imagery into product evidence.

## Rules applied

- No expiring Adobe/Figma URL is used as an application image source.
- No screenshot crop or generic mountain SVG is used as a substitute.
- Missing binaries remain `MEDIA_MISSING` in `MEDIA_IMPORT_REPORT_106.csv`.
- AI conceptual imagery is not represented as first-hand testing, product proof, military issue provenance, certification, or safety evidence.
- FGA-001 technical diagrams are kept as article assets and are not presented as product-test proof.

## Required to clear the gate

Per-slot dimensions and SHA-256 validation are recorded for all 65 Adobe exports and all 29 Figma imports. `MEDIA_LOCAL_FILE_COVERAGE_106` and `MEDIA_EDITORIAL_RIGHTS` are PASS after explicit owner approval on 2026-10-30.
