# Super Car Society

A photography-led Next.js / TypeScript / Tailwind CSS website with Home (`/`), Shop (`/shop`), and Contact / Quote (`/contact`). Fonts are hosted locally. No CMS, database, checkout, or email service is connected.

## Run locally

Use Node.js 20.9 or newer (Node.js 22 LTS or newer recommended).

```sh
npm ci
npm run dev
```

Open http://localhost:3000.

```sh
npm run lint
npm run typecheck
npm run build
npm start
```

## Content and assets

- `src/lib/site.ts`: centralized company contact details, social links, and product data. No invented prices, sizes, inventory, social handles, or email addresses.
- `src/lib/quote.ts`: isolated quote submission adapter. It explicitly returns `sent: false` until a real provider is configured. The form validates input and offers a local text-file download of the event brief; nothing is transmitted or persisted.
- `src/components`: shared navigation, footer, photography, buttons, product card, and quote form.
- `src/app`: three routes, page metadata, responsive styling, and an icon derived from the official logo.
- `images spc/`: source photography. The 29 files in `shirt pics/` are preserved unchanged.
- `public/images/scs/`: selected WebP derivatives and the trimmed transparent official logo. `manifest.json` maps each derivative to its original.
- `scripts/prepare-assets.mjs`: reproduces derivatives using stable manifest filenames, retaining legacy derivatives when their source is unavailable.
- `scripts/prepare-shirt-assets.mjs`: rebuilds only the seven new campaign derivatives (`node scripts/prepare-shirt-assets.mjs`). `public/images/scs/shirt-manifest.json` records exact sources, dimensions, and output sizes.

### Art direction

The nighttime gathering (`86F382D1…`) opens the homepage. The El Paso street lineup (`2fc2bcab…`), orange nighttime car (`1474C3D2…`), blue studio car (`67E6AFD0…`), and downtown convoy (`3a19ae53…`) form the editorial showcase. The night crowd (`c923c8c2…`) and `_JDM3107.JPG` show event energy. The new shirt campaign replaces the old `IMG_5453`–`IMG_5457` imagery and the `IMG_5285` product view. `50b9e037…` illustrates the quote page and `IMG_5941` closes the homepage. The official transparent logo is `AFC9841D…PNG`.

Original screenshots and redundant photographs are deliberately excluded. Car/event derivatives are capped at 2000 pixels and new campaign derivatives at 2400 pixels on the longest side, never upscaled, and served with responsive Next.js Image optimization. Below-the-fold photography loads lazily. Only page hero photography and the shared logo receive priority.

## Before public launch

1. Supply approved product names, descriptions, prices, sizes, inventory, and checkout integration. The existing product label is descriptive, not an invented collection name. The store currently states “Store launching soon.” A `purchaseUrl` can link to hosted product checkout; implement variant selection/cart behavior with the selected commerce provider when available.
2. Connect `submitQuote` to a verified server action or form provider, with server-side validation, rate limiting, and error handling. Keep secrets on the server. Return successful delivery only on provider confirmation; update the form's availability notice and submit-button wording when enabled.
3. Add verified company email and social URLs to `src/lib/site.ts`. The general-contact area and footer consume this configuration.
4. Set `metadataBase`, canonical URLs, and production social-preview URLs after the domain is confirmed.
5. Repeat browser QA after catalog or checkout integration. The photography refresh was checked at 320px, 390px, and 1440px widths.

## Dependency note

The initial npm audit reports an upstream `braces` advisory in the development-only Next.js ESLint dependency chain. The suggested automatic fix downgrades the Next.js lint configuration by two major versions and is not applied. Production dependencies are audited separately. Recheck the upstream fix before updating lint tooling.

## Verification performed

- `npm run lint`: passed without warnings.
- `npm run typecheck`: passed.
- `npm run build`: passed; all three pages prerendered. A production domain is still needed for absolute social-image metadata.
- Production HTTP smoke checks: `/`, `/shop`, `/contact`, favicon, logo, and Next.js optimized hero image returned HTTP 200. Shared navigation and page titles were checked in the rendered HTML.
- All literal photo references resolve; `git diff --check` passed.
- `npm audit --omit=dev`: zero reported vulnerabilities.
- Photography refresh: isolated headless Chrome fallback verified `/`, `/shop`, and `/contact` at 320px, 390px, and 1440px with no horizontal overflow, broken images, or runtime exceptions; desktop/mobile screenshots reviewed. The in-app browser still fails initialization (`Cannot redefine property: process`). Full keyboard and form-submission behavior were not retested in this photography-only change.
- The default production build stalled in the restricted process sandbox; rerunning `npm run build` with broader process permissions passed. The existing `metadataBase` domain warning remains.

## Shirt photography refresh

All 29 new photographs were reviewed against the six existing merch assets. The selected JPEGs have clearer fabric/logo detail and cleaner lighting than the old compressed exports. Similar poses, car-only shots, and lower-resolution PNG exports were excluded. There is no clear shirt-back product view in the selected photography; none is implied in the catalog.

| Source prefix in `images spc/shirt pics` | Placement | Selection rationale |
| --- | --- | --- |
| DSC06999 | Shop hero; homepage portrait | Clear face and gold logo, expressive close portrait |
| DSC07041 | Product card | Unobstructed shirt front and visible fit |
| DSC06979 | Shop flat-lay; homepage center | Sharp full front design; landscape composition |
| DSC07127 | Shop editorial landscape | Strong group composition, distinct poses, wide crop |
| DSC06983 | Shop editorial portrait | Full-body pose, shirt visible beside open door |
| DSC07057 | Shop editorial detail | Collar, fabric, and embroidered logo detail |
| DSC07048 | Homepage portrait | Clean silhouette and distinct door-side pose |

The shop headline stays in its own black panel for readability. The hero uses a 4:5 frame on desktop and mobile with positioning that preserves face and chest logo. Product and full-body photos use 2:3 frames; landscape group and mobile flat-lay images retain 3:2. Three homepage photos link into `/shop` via the existing section CTA. All below-fold campaign images use lazy Next.js Image loading and placement-specific responsive sizes; only the shop hero is prioritized. No product names, pricing, sizes, inventory, or checkout details were fabricated.
