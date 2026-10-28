# Test execution log

All commands ran in `fieldgearatlas-magazine-v2` on 2026-10-29.

| Command | Result |
|---|---|
| `npm install` | PASS; dependency install completed |
| `npm audit` | PASS; 0 vulnerabilities after Next.js 16.4.3 update |
| `npm run typecheck` | PASS |
| `npm test` | PASS; 3/3 tests |
| `npm run audit:staging` | PASS; 50 articles, private-only, release authorization false |
| `npm run audit:media` | PASS; 106 manifest slots, 106 local verified slots, 0 missing; rights/release authorization remains pending |
| `npm run import:adobe` | PASS; 65/65 authenticated Adobe exports converted to local WebP with dimensions and SHA-256 records |
| `npm run import:figma` | PASS for the 29-slot Figma staging workflow; `FIGMA_IMPORT_RESULTS_29.json` records 29/29 technical imports, with editorial/rights approval still pending |
| `npm run capture:visuals` | PASS after media import; 32 real screenshots, 0 horizontal overflow, 0 broken images |
| `npm run audit:public` | PASS; preview guard and server-side private loader confirmed |
| `npm run build` | PASS; Next.js 16.4.3 production build |
| `npm run capture:visuals` | PASS; 32 screenshots, 0 overflow, 0 broken images |
| handoff `verify_handoff.py` | NOT RUN; Python executable unavailable on Windows host (Microsoft Store alias only) |

The Python verifier limitation is recorded, not hidden. Node/Next checks above are independent evidence, not a replacement claim that the Python verifier ran.
