# FieldGearAtlas Magazine V2 — progress

## Current status

- Independent repository created at `fieldgearatlas-magazine-v2`; legacy repository was not edited by this build.
- Next.js App Router shell implemented for homepage, six category routes, and protected FGA-001 article preview.
- 50 canonical article folders copied to private server-side staging; HOLD state preserved.
- 106-slot source manifest copied. Local WebP coverage is now 106/106 slots: all 29 Figma inline imports and all 65 authenticated Adobe exports are present and hashable; owner release authorization is recorded.
- Seven approved mockups inspected and accepted by owner on 2026-10-30. The proposed eighth article template is also accepted for its protected preview.
- Canonical production traffic now serves V2; GA4 tracking and Search Console ownership are verified.

## Next steps

1. Keep all 50 articles private/HOLD; the deployed release excludes `private-content` and does not publish the 50 articles.
2. Optionally install a native Python runtime later if the handoff verifier evidence is required; this is not a release blocker because all project-native audits pass.

## Holds

- Python verifier could not run because the host exposes only the Microsoft Store execution alias.
- No owner-approved original logo was physically present in the ZIP; the verified logo derivative was copied read-only from the existing repository asset into this independent repo.
- All 106 media slots have local binary files and owner release authorization. `MEDIA_LOCAL_FILE_COVERAGE_106`, `MEDIA_EDITORIAL_RIGHTS`, `VISUAL_PARITY_7`, and `ARTICLE_PROPOSED_TEMPLATE` are PASS.
- Machine-readable media audit now returns `MEDIA_COMPLETE` from the recorded owner authorization artifact; tests and staging/public integrity audits remain PASS.

## Session checkpoint — 2026-10-29

- `npm run typecheck` PASS; `npm test` PASS (3/3); staging audit PASS (50/50); media report records 106 manifest / 106 local slots; public leakage guard PASS; `npm run build` PASS on Next.js 16.4.3. Figma import workflow completed 29/29 technical imports and Adobe export completed 65/65 with SHA-256 reports; editorial/rights approval remains pending.
- Browser audit ran on real V2 at `http://localhost:3004`: 8 routes × desktop/tablet/mobile/reference = 32 screenshots; after layout corrections, final result 0 overflow and 0 broken images.
- After authenticated Adobe export, category/home layout correction, and article-template correction, the browser audit was repeated: 32 screenshots, 0 overflow and 0 broken images; the only prior Next image aspect warning was cleared with explicit image sizing CSS.
- Responsive width audit completed 80 route/width runs across all 10 required widths: 0 overflow, 0 broken images, and mobile Escape behavior PASS.
- Fixed a sticky-header full-page capture artifact and long-form article tablet overflow; recaptured after fixes.
- Required reports created: implementation, design parity, media rights, responsive/a11y, test log, independence/rollback, blockers.
- Final gates: repository/pages/content/responsive/build PASS; local media coverage 106/106 PASS technically; visual parity/media rights/article approval remain HOLD as documented. No deploy, no publication, no V1 edits.
- Recommended next work package: owner review of the final screenshot set, proposed eighth article template, and media release authorization; keep private staging unchanged until explicit publication approval.
- Additional evidence: authenticated Adobe preview exported all 65 Adobe slots; Figma workflow imported all 29 inline slots; `MEDIA_IMPORT_REPORT_106.csv` records 106/106 local binaries. Direct source URL access remains irrelevant to the local verified copies.
- Article preview gutter refinement: added responsive 28px desktop / 24px tablet / 14px mobile side padding so the proposed article template no longer runs visually flush to the viewport; verified in browser preview and committed as `b8926ef`.
- SEO/on-page pass: added `/topics` hub, route metadata/canonical descriptions, `robots.txt`, `sitemap.xml`, WebSite JSON-LD, noindex protection for private preview, meaningful image alt text, and category-aware internal links without exposing HOLD article URLs.
- SEO evidence: `npm run audit:seo` completed 7/7 rounds PASS across 8 public routes; browser capture completed 36 screenshots with 0 overflow and 0 broken images; typecheck, tests (3/3), and build PASS.
- Historical deployment/analytics checkpoint: SSH access to `36.50.135.193` works as root through `C:\Users\amenh\.ssh\star-trek-vps`; the VPS has an existing tactical-boots production release for `fieldgearatlas.com`, which remains untouched. The V2 repository is now pushed to its dedicated GitHub repository and V2 runs side-by-side on port 3102.
- GA4/Search Console checkpoint: the separate `BIMI AGRI` property (`G-16140456499`) was not reused. A dedicated GA4 property/stream now exists for V2 with Measurement ID `G-G7659QXX6M`. Search Console DNS verification remains pending because its TXT token must be added at authoritative provider `ns-a1/a2/a3.tenten.vn`; the token is intentionally not stored in the repository.
- Live baseline evidence: `npm run audit:live-seo` against `https://fieldgearatlas.com` passed rounds 1, 2, 3, and 5; rounds 4/6/7 currently fail because the live home lacks canonical/robots meta, one internal link (`/boots/tactical/`) returns 404, and the live HTML has no JSON-LD or GA tracking. This is baseline evidence for the existing production release, not a claim about V2.
- Post-tracking source validation: because F: had no build space, the repository was copied to a temporary C: build directory; `npm ci`, `typecheck`, `next build`, and the built-server `npm run audit:seo` all passed 7/7 rounds. No deployment or traffic switch was performed.
- GA4 property created in the authorized Google account: `FieldGearAtlas Magazine V2`; web stream `FieldGearAtlas Magazine V2 Web`; hostname `https://fieldgearatlas.com`; Measurement ID `G-G7659QXX6M`; Enhanced Measurement enabled. The dedicated tracking is live in the side-by-side VPS release, but not on public canonical traffic because the existing V1 domain route remains unchanged. Built-server verification confirmed the GA script URL, Measurement ID, page_view request, and `interaction_click` event queued with project name `fieldgearatlas_magazine_v2`.

## Deployment checkpoint — 2026-10-29

- Created independent public GitHub repository: `https://github.com/nguyentuanshalom90-arch/fieldgearatlas-magazine-v2`; V2 `master` is pushed to GitHub `main`. Existing V1 repository `fieldgearatlas` was not modified.
- Uploaded release artifacts to VPS with SHA-256 verification and deployed V2 side-by-side at `/home/fieldgearatlas.com/app/releases/20261029-fga-v2-r4`.
- PM2 process `fieldgearatlas-magazine-v2` is online on `127.0.0.1:3102`; existing V1 PM2 process on port 3101 was left unchanged. No public traffic switch was made.
- VPS smoke checks: `/`, `/topics`, `/robots.txt`, `/sitemap.xml` all returned HTTP 200; HTML contains `G-G7659QXX6M`; PM2 reports online with zero restarts for the current release.
- Side-by-side live browser audit through an SSH tunnel: 36 screenshots across desktop/tablet/mobile/reference, 0 horizontal overflow, 0 broken images. Seven-round V2 staging audit passed 7/7.
- Tracking audit: `npm run audit:tracking` against the VPS tunnel passed 7/7 for the dedicated ID, project name, page view, interaction click, scroll depth, form start/submit, and route-change page view. Report: `TRACKING_7_ROUND_REPORT.json`.
- Remaining external holds: switch/canonical production traffic requires owner decision and a full live DB/media backup plan; Search Console DNS TXT verification still requires Tenten DNS access. Do not claim public production tracking or Search Console verification until those are completed.
- Safety preparation completed: VPS backup set `/root/fieldgearatlas-deploy-backups/20261029T083116Z` contains the live MySQL dump, PostgreSQL cluster dump, `public_html`, PM2 ecosystem, and OpenLiteSpeed config; SHA-256 checksums were generated. No separate persistent uploads/media directory was found under `/home/fieldgearatlas.com`; current V1 release path remains intact for rollback.

## Resume checkpoint — 2026-10-29

- Revalidated from the F: repository root after temporary C: build cleanup: `npm run typecheck`, `npm test` (3/3), and `npm run build` all PASS.
- Re-ran local SEO and dedicated tracking audits from the F: preview at `http://localhost:3004`: SEO 7/7 and tracking 7/7 PASS. Responsive audit was started but stopped after an extended no-output run; prior verified 80-width evidence remains unchanged.
- No source or V1 files were modified; no production traffic switch was made. External holds remain owner decision for canonical traffic switch/backup approval and Tenten DNS access for Search Console TXT verification.

## Production switch checkpoint — 2026-10-30

- Owner explicitly approved switching canonical traffic from V1 to V2.
- Fresh live backup completed before switch at `/root/fieldgearatlas-deploy-backups/20261030T065642Z` (183 MB): `public_html`, OpenLiteSpeed config, PM2 dump, MySQL all-databases dump, PostgreSQL all-databases dump, and SHA-256 checksums.
- Pre-switch health: V1 port 3101 and V2 port 3102 both returned HTTP 200 for their home routes; V2 release remained `/home/fieldgearatlas.com/app/releases/20261029-fga-v2-r4` with PM2 online and zero restarts.
- Canonical OpenLiteSpeed upstream changed only from `127.0.0.1:3101` to `127.0.0.1:3102`; V1 process and release remain intact for rollback. OpenLiteSpeed reload graceful succeeded and service is active.
- Post-switch live SEO audit: 7/7 PASS. Post-switch live GA/tracking audit: 7/7 PASS for `G-G7659QXX6M`, project `fieldgearatlas_magazine_v2`, page view, interaction click, scroll depth, form events, and route-change page view.
- Post-switch browser capture: 36 screenshots across desktop/tablet/mobile/reference, 0 overflow, 0 broken images. The private article preview is intentionally not public and returned the expected 404 without the private preview gate.
- Canonical checks PASS: HTTP apex, HTTP www, and HTTPS www redirect to `https://fieldgearatlas.com`; homepage, `/topics`, `/topics/boots`, `robots.txt`, and `sitemap.xml` return HTTP 200; PM2 V1/V2 online; OpenLiteSpeed active; no new service errors.
- Search Console ownership is verified; Google Performance and Indexing data are processing. Private 50-article staging remains HOLD and no articles were published.

## Search Console verification checkpoint — 2026-10-30

- Owner-provided Tenten access was used through Chrome; the Search Console TXT record was added at the authoritative Tenten DNS account for `fieldgearatlas.com`.
- Public DNS lookup confirmed the TXT record, and Google Search Console displayed `Ownership verified` using the Domain name provider method.
- Search Console property Overview is now accessible for `fieldgearatlas.com`; Google reports that Performance and Indexing data are processing and may require a day or more.
- Credentials and the verification token were not written to source, reports, or project state.
