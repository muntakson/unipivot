import { chromium, Browser, BrowserContext } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';
import { crawlSite, getMainPages } from './crawler.js';
import { compareVisuals, VisualComparisonResult } from './comparators/visual.js';
import { compareContent, ContentComparisonResult } from './comparators/content.js';

const ORIGINAL_URL = 'https://www.unipivot.org';
const CLONE_URL = 'https://unipivot.iotok.org';
const OUTPUT_DIR = path.join(process.cwd(), 'reports');
const SCREENSHOTS_DIR = path.join(OUTPUT_DIR, 'screenshots');

interface ComparisonReport {
  generatedAt: string;
  originalUrl: string;
  cloneUrl: string;
  summary: {
    pagesCompared: number;
    visualDifferences: number;
    contentDifferences: number;
    pagesWithIssues: number;
  };
  pages: PageResult[];
}

interface PageResult {
  path: string;
  visual: VisualComparisonResult;
  content: ContentComparisonResult;
}

async function main() {
  console.log('🔍 Unipivot Site Comparison Tool\n');
  console.log(`Original: ${ORIGINAL_URL}`);
  console.log(`Clone: ${CLONE_URL}\n`);

  // Ensure output directories exist
  fs.mkdirSync(SCREENSHOTS_DIR, { recursive: true });

  const browser = await chromium.launch({ headless: true });

  try {
    // Create separate contexts for original and clone
    const originalContext = await browser.newContext({
      locale: 'ko-KR',
      viewport: { width: 1920, height: 1080 },
    });
    const cloneContext = await browser.newContext({
      locale: 'ko-KR',
      viewport: { width: 1920, height: 1080 },
    });

    // Get pages to compare
    console.log('📋 Getting pages to compare...\n');
    const pagesToCompare = getMainPages();
    console.log(`Found ${pagesToCompare.length} pages to compare\n`);

    const results: PageResult[] = [];
    let visualDiffCount = 0;
    let contentDiffCount = 0;

    // Compare each page
    for (const pagePath of pagesToCompare) {
      console.log(`\n📄 Comparing: ${pagePath}`);

      const originalPage = await originalContext.newPage();
      const clonePage = await cloneContext.newPage();

      try {
        // Navigate to both pages
        const originalUrl = `${ORIGINAL_URL}${pagePath}`;
        const cloneUrl = `${CLONE_URL}${pagePath}`;

        await Promise.all([
          originalPage.goto(originalUrl, { waitUntil: 'networkidle', timeout: 30000 }),
          clonePage.goto(cloneUrl, { waitUntil: 'networkidle', timeout: 30000 }),
        ]);

        // Visual comparison
        console.log('  📸 Visual comparison...');
        const visualResult = await compareVisuals(
          originalPage,
          clonePage,
          pagePath,
          SCREENSHOTS_DIR
        );

        if (!visualResult.isMatch) {
          visualDiffCount++;
          console.log(`  ⚠️  Visual diff: ${visualResult.diffPercentage}%`);
        } else {
          console.log('  ✅ Visual match');
        }

        // Content comparison
        console.log('  📝 Content comparison...');
        const contentResult = await compareContent(originalPage, clonePage, pagePath);

        if (contentResult.totalDifferences > 0) {
          contentDiffCount++;
          console.log(`  ⚠️  Content differences: ${contentResult.totalDifferences}`);
        } else {
          console.log('  ✅ Content match');
        }

        results.push({
          path: pagePath,
          visual: visualResult,
          content: contentResult,
        });
      } catch (error) {
        console.error(`  ❌ Error: ${(error as Error).message}`);
        results.push({
          path: pagePath,
          visual: {
            page: pagePath,
            originalScreenshot: '',
            cloneScreenshot: '',
            diffImage: '',
            diffPixelCount: -1,
            diffPercentage: 100,
            isMatch: false,
            error: (error as Error).message,
          },
          content: {
            page: pagePath,
            textDifferences: [],
            imageDifferences: [],
            linkDifferences: [],
            metaDifferences: [],
            totalDifferences: 0,
          },
        });
      } finally {
        await originalPage.close();
        await clonePage.close();
      }
    }

    // Generate report
    const report: ComparisonReport = {
      generatedAt: new Date().toISOString(),
      originalUrl: ORIGINAL_URL,
      cloneUrl: CLONE_URL,
      summary: {
        pagesCompared: results.length,
        visualDifferences: visualDiffCount,
        contentDifferences: contentDiffCount,
        pagesWithIssues: results.filter(r => !r.visual.isMatch || r.content.totalDifferences > 0).length,
      },
      pages: results,
    };

    // Save JSON report
    const jsonPath = path.join(OUTPUT_DIR, 'results.json');
    fs.writeFileSync(jsonPath, JSON.stringify(report, null, 2));
    console.log(`\n💾 JSON report saved to: ${jsonPath}`);

    // Generate HTML report
    const htmlPath = path.join(OUTPUT_DIR, 'report.html');
    fs.writeFileSync(htmlPath, generateHtmlReport(report));
    console.log(`📊 HTML report saved to: ${htmlPath}`);

    // Print summary
    console.log('\n' + '='.repeat(50));
    console.log('📊 COMPARISON SUMMARY');
    console.log('='.repeat(50));
    console.log(`Pages compared: ${report.summary.pagesCompared}`);
    console.log(`Visual differences: ${report.summary.visualDifferences}`);
    console.log(`Content differences: ${report.summary.contentDifferences}`);
    console.log(`Pages with issues: ${report.summary.pagesWithIssues}`);

    await originalContext.close();
    await cloneContext.close();
  } finally {
    await browser.close();
  }
}

function generateHtmlReport(report: ComparisonReport): string {
  const pagesHtml = report.pages.map(page => {
    const visualStatus = page.visual.isMatch ? '✅' : '⚠️';
    const contentStatus = page.content.totalDifferences === 0 ? '✅' : '⚠️';

    const screenshotsHtml = page.visual.originalScreenshot ? `
      <div class="screenshots">
        <div class="screenshot">
          <h4>Original</h4>
          <img src="screenshots/${path.basename(page.visual.originalScreenshot)}" alt="Original">
        </div>
        <div class="screenshot">
          <h4>Clone</h4>
          <img src="screenshots/${path.basename(page.visual.cloneScreenshot)}" alt="Clone">
        </div>
        <div class="screenshot">
          <h4>Diff (${page.visual.diffPercentage}%)</h4>
          <img src="screenshots/${path.basename(page.visual.diffImage)}" alt="Diff">
        </div>
      </div>
    ` : '';

    const textDiffsHtml = page.content.textDifferences.length > 0 ? `
      <h4>Text Differences</h4>
      <ul>
        ${page.content.textDifferences.map(d => `
          <li><strong>${d.type}</strong> [${d.selector}]: "${d.originalText}" → "${d.cloneText}"</li>
        `).join('')}
      </ul>
    ` : '';

    const linkDiffsHtml = page.content.linkDifferences.length > 0 ? `
      <h4>Link Differences</h4>
      <ul>
        ${page.content.linkDifferences.map(d => `
          <li><strong>${d.type}</strong>: "${d.text}" - ${d.originalHref} → ${d.cloneHref}</li>
        `).join('')}
      </ul>
    ` : '';

    const metaDiffsHtml = page.content.metaDifferences.length > 0 ? `
      <h4>Meta Differences</h4>
      <ul>
        ${page.content.metaDifferences.map(d => `
          <li><strong>${d.name}</strong>: "${d.originalValue}" → "${d.cloneValue}"</li>
        `).join('')}
      </ul>
    ` : '';

    return `
      <div class="page-result ${page.visual.isMatch && page.content.totalDifferences === 0 ? 'match' : 'mismatch'}">
        <h3>${page.path} ${visualStatus} ${contentStatus}</h3>
        ${page.visual.error ? `<p class="error">Error: ${page.visual.error}</p>` : ''}
        <div class="stats">
          <span>Visual: ${page.visual.diffPercentage}% diff</span>
          <span>Content: ${page.content.totalDifferences} differences</span>
        </div>
        ${screenshotsHtml}
        ${textDiffsHtml}
        ${linkDiffsHtml}
        ${metaDiffsHtml}
      </div>
    `;
  }).join('');

  return `<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Unipivot Site Comparison Report</title>
  <style>
    * { box-sizing: border-box; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      max-width: 1400px;
      margin: 0 auto;
      padding: 20px;
      background: #f5f5f5;
    }
    h1 { color: #333; }
    .summary {
      background: white;
      padding: 20px;
      border-radius: 8px;
      margin-bottom: 20px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    .summary-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
      gap: 15px;
      margin-top: 15px;
    }
    .summary-item {
      background: #f8f9fa;
      padding: 15px;
      border-radius: 4px;
      text-align: center;
    }
    .summary-item strong {
      display: block;
      font-size: 24px;
      color: #06bfb9;
    }
    .page-result {
      background: white;
      padding: 20px;
      border-radius: 8px;
      margin-bottom: 20px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    .page-result.mismatch {
      border-left: 4px solid #f0ad4e;
    }
    .page-result.match {
      border-left: 4px solid #5cb85c;
    }
    .stats {
      display: flex;
      gap: 20px;
      color: #666;
      margin: 10px 0;
    }
    .screenshots {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 10px;
      margin: 15px 0;
    }
    .screenshot {
      text-align: center;
    }
    .screenshot img {
      max-width: 100%;
      border: 1px solid #ddd;
      border-radius: 4px;
    }
    .screenshot h4 {
      margin: 0 0 5px 0;
      font-size: 12px;
      color: #666;
    }
    .error {
      color: #d9534f;
      background: #fdf2f2;
      padding: 10px;
      border-radius: 4px;
    }
    h4 { color: #555; margin-top: 15px; }
    ul { color: #666; }
  </style>
</head>
<body>
  <h1>🔍 Unipivot Site Comparison Report</h1>

  <div class="summary">
    <p><strong>Original:</strong> ${report.originalUrl}</p>
    <p><strong>Clone:</strong> ${report.cloneUrl}</p>
    <p><strong>Generated:</strong> ${new Date(report.generatedAt).toLocaleString('ko-KR')}</p>

    <div class="summary-grid">
      <div class="summary-item">
        <strong>${report.summary.pagesCompared}</strong>
        Pages Compared
      </div>
      <div class="summary-item">
        <strong>${report.summary.visualDifferences}</strong>
        Visual Differences
      </div>
      <div class="summary-item">
        <strong>${report.summary.contentDifferences}</strong>
        Content Differences
      </div>
      <div class="summary-item">
        <strong>${report.summary.pagesWithIssues}</strong>
        Pages with Issues
      </div>
    </div>
  </div>

  ${pagesHtml}
</body>
</html>`;
}

main().catch(console.error);
