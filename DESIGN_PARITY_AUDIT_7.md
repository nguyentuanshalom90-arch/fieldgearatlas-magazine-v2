# Design parity audit — seven approved mockups

Evidence folder: `SCREENSHOTS/` (32 browser-rendered full-page PNGs) and `SCREENSHOTS/BROWSER_AUDIT_RESULTS.json`.

## Cross-page checks

- Header/logo/nav/footer composition implemented and captured.
- Homepage uses an asymmetric lead mosaic, four supporting stories, research tools, latest cards, Most Read, topic strip, editor picks, and dark footer.
- Each category has its own route and composition branch; Boots/Rucking/Field & Sleep use panoramic hero treatment, while Packs/Clothing/Surplus use intro + feature composition.
- Mobile navigation is collapsible with an `aria-expanded` state and tap-sized links.
- Browser audit found 0 overflow and 0 broken images after eager-load validation.
- The static header correction removed a full-page screenshot stitching artifact that did not exist in the approved references.

## Per-page status

| Approved reference | V2 route | Geometry/content audit | Status |
|---|---|---|---|
| `00_homepage_approved.png` | `/` | Mosaic, tools, latest/rail/topic/footer structure present | OWNER REVIEW / media-limited |
| `01_boots_and_fit_approved.png` | `/topics/boots` | Boot hero, dominant feature, supporting cards, latest/rail/topic sections present | OWNER REVIEW / media-limited |
| `02_rucking_and_training_approved.png` | `/topics/rucking` | Wide hero treatment, feature mosaic, training topic modules present | OWNER REVIEW / media-limited |
| `03_packs_and_carry_approved.png` | `/topics/packs` | Intro + dominant feature, alternating feature cards, loadout topics present | OWNER REVIEW / media-limited |
| `04_clothing_and_protection_approved.png` | `/topics/clothing` | Apparel-oriented intro, feature wall, clothing topics present | OWNER REVIEW / media-limited |
| `05_field_and_sleep_approved.png` | `/topics/field-sleep` | Field/sleep hero, feature cards, sleep essentials present | OWNER REVIEW / media-limited |
| `06_surplus_and_heritage_approved.png` | `/topics/surplus` | Archive-themed intro, heritage topics, condition/provenance framing present | OWNER REVIEW / media-limited |

`VISUAL_PARITY_7` is not marked PASS: the approved references contain imagery that is not supplied as local binaries, and owner acceptance is still required. No pixel-perfect or rights claim is inferred from these screenshots.
