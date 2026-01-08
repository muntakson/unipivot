# Plan: Playwright Site Comparison Tool

Compare https://www.unipivot.org (original) vs https://unipivot.iotok.org (clone) with full site crawl, visual/content/functional differences.

## Project Setup

Create `/home/jit/unipivot/comparison-tool/` with:

```
comparison-tool/
├── package.json
├── playwright.config.ts
├── src/
│   ├── index.ts              # Main entry point
│   ├── crawler.ts            # Site crawler with link discovery
│   ├── comparators/
│   │   ├── visual.ts         # Screenshot comparison (pixelmatch)
│   │   ├── content.ts        # Text/image/link comparison
│   │   └── functional.ts     # Form/navigation testing
│   └── utils/
│       ├── korean.ts         # Korean text normalization
│       └── helpers.ts        # Wait helpers, DOM utils
├── reports/                  # Generated output
│   ├── screenshots/
│   └── report.html
└── tests/
    └── compare.spec.ts       # Playwright test file
```

## Dependencies

```json
{
  "dependencies": {
    "@playwright/test": "^1.40.0",
    "pixelmatch": "^5.3.0",
    "pngjs": "^7.0.0",
    "cheerio": "^1.0.0-rc.12"
  },
  "devDependencies": {
    "typescript": "^5.3.0",
    "tsx": "^4.7.0"
  }
}
```

## Implementation Steps

### Step 1: Initialize Project
- Create `comparison-tool/` directory
- Create `package.json` with dependencies
- Create `playwright.config.ts` with Korean locale (`ko-KR`)
- Run `npm install && npx playwright install`

### Step 2: Site Crawler (`src/crawler.ts`)
- Start from homepage, extract all internal links
- Normalize URLs (handle IMWEB query params like `?bmode=view&idx=`)
- Exclude logout/auth URLs
- Return list of page paths to compare

### Step 3: Visual Comparator (`src/comparators/visual.ts`)
- Load same page on both sites in parallel
- Wait for `networkidle` state
- Hide dynamic elements (date stamps, view counters, carousels)
- Take full-page screenshots
- Use `pixelmatch` to generate diff images
- Calculate diff percentage

### Step 4: Content Comparator (`src/comparators/content.ts`)
- Extract visible text (normalize Korean with NFC)
- Compare image sources (map `cdn.imweb.me` → `/assets/cdn/`)
- Compare internal links
- Compare meta tags (title, description, OG tags)

### Step 5: Functional Comparator (`src/comparators/functional.ts`)
- Test form fields exist and match (name, type, required)
- Verify form actions point to correct endpoints
- Test navigation menu items and links
- Test interactive elements (dropdowns, modals)

### Step 6: Report Generator
- Generate HTML report with:
  - Summary stats (pages compared, differences found)
  - Side-by-side screenshot comparisons with diff overlay
  - Content differences table
  - Functional issues list
- Export JSON for programmatic access

### Step 7: Main Test File (`tests/compare.spec.ts`)
- Crawl both sites to discover pages
- For each page, run visual/content/functional comparisons
- Generate final report

## Key Technical Considerations

1. **Korean Text**: Use `text.normalize('NFC')` for consistent comparison
2. **Dynamic Content**: Mask timestamps, view counters, Instagram widgets
3. **IMWEB URLs**: Handle query params like `?category=`, `?q=` for pagination
4. **Image URLs**: Original uses `cdn.imweb.me`, clone uses `/assets/cdn/`
5. **Forms**: Original posts to IMWEB, clone posts to `/api/*` endpoints

## Commands

```bash
cd /home/jit/unipivot/comparison-tool
npm install
npx playwright install chromium
npm run compare          # Run comparison
npm run report           # View HTML report
```

## Output

The tool will generate:
1. `reports/report.html` - Interactive HTML report with all differences
2. `reports/screenshots/` - Original, clone, and diff images for each page
3. `reports/results.json` - Machine-readable comparison data
