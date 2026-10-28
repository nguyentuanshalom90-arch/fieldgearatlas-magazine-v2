# Media rights and approval status

## Current evidence

- Manifest: 106 planned slots.
- Local verified files: 28 files representing 12 slots (12 heroes + 12 thumbnails, plus FGA-001 technical/article assets).
- Remote-only records: 94 manifest slots remain without local binary files in the handoff.
- Sources include Adobe Firefly references and Figma-generated image references. A source URL is not a local production file.
- Access check on 2026-10-29: sampled Adobe Firefly short URLs returned HTTP 403 and sampled Figma references returned HTTP 400 from this environment; no binary was treated as recovered from those URLs.
- No owner public-release authorization for the 106 slots is present in the handoff.

## Rules applied

- No expiring Adobe/Figma URL is used as an application image source.
- No screenshot crop or generic mountain SVG is used as a substitute.
- Missing binaries remain `MEDIA_MISSING` in `MEDIA_IMPORT_REPORT_106.csv`.
- AI conceptual imagery is not represented as first-hand testing, product proof, military issue provenance, certification, or safety evidence.
- FGA-001 technical diagrams are kept as article assets and are not presented as product-test proof.

## Required to clear the gate

Authenticated export/download of the 94 missing binaries, per-slot dimensions and SHA-256 validation, source/rights record, visual review, and owner release authorization. Until then `MEDIA_LOCAL_FILE_COVERAGE_106` and `MEDIA_EDITORIAL_RIGHTS` remain HOLD.
