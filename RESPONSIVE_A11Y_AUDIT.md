# Responsive and accessibility audit

Date: 2026-10-29

## Browser evidence

`npm run capture:visuals` rendered 8 routes at four required viewports:

- desktop: 1440×900
- tablet: 768×1024
- mobile: 390×844
- reference layout: 1122×1402

Total: 32 full-page screenshots in `SCREENSHOTS/`.

Result: 0 horizontal overflow, 0 broken images after image readiness validation.

## Implemented checks

- Semantic headings, navigation labels, form label, image alt attributes, and `aria-expanded` mobile menu state.
- Mobile layout collapses to one-column content and keeps navigation links usable.
- Long article body switches to a single-column layout at tablet widths and wraps long source text safely.
- No production route exposes private article content; the preview requires local development mode plus key query.

## Follow-up

Run a manual keyboard/contrast review with the owner before any public release. The newsletter control is intentionally non-submitting in this private build.
