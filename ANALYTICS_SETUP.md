# FieldGearAtlas analytics setup

This repository never hard-codes a Google property from another project.

## Required production values

Set these values in the persistent production environment, not in the release source:

```text
NEXT_PUBLIC_SITE_URL=https://fieldgearatlas.com
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-<FieldGearAtlas-only-stream-id>
NEXT_PUBLIC_GSC_VERIFICATION=<FieldGearAtlas-only-Search-Console-token>
```

The GA4 client uses the project name `fieldgearatlas_magazine_v2` on every event. It records page views, interaction clicks, outbound clicks, file downloads, form starts, form submits, scroll-depth milestones, and route changes. The current Google Analytics property visible in the owner's browser is BIMI AGRI and must not be used for this project.

After the dedicated GA4 web stream and Search Console property exist, verify:

1. The stream hostname is `fieldgearatlas.com` and the displayed Measurement ID matches the configured value.
2. Search Console is a Domain property or URL-prefix property for `https://fieldgearatlas.com/`.
3. The verification token is copied into the persistent environment and is visible in generated HTML without exposing credentials.
4. GA4 Realtime/DebugView receives a page view and the named events from a browser session.
5. Search Console can read the submitted sitemap and the canonical host is `https://fieldgearatlas.com`.

No GA4 or Search Console claim is considered complete until these live checks have evidence.
