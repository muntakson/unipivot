import type { Page } from '@playwright/test';
import { normalizeUrl, isInternalUrl } from './utils/helpers.js';

export interface DiscoveredPage {
  path: string;
  depth: number;
  hasForm: boolean;
  title: string;
}

/**
 * Crawl a site and discover all internal pages
 */
export async function crawlSite(
  page: Page,
  baseUrl: string,
  maxDepth = 3,
  maxPages = 100
): Promise<DiscoveredPage[]> {
  const discovered = new Map<string, DiscoveredPage>();
  const queue: { url: string; depth: number }[] = [{ url: baseUrl, depth: 0 }];
  const visited = new Set<string>();

  // Patterns to exclude
  const excludePatterns = [
    /logout/i,
    /login/i,
    /signout/i,
    /\.pdf$/i,
    /\.jpg$/i,
    /\.png$/i,
    /\.gif$/i,
    /\.zip$/i,
    /\.css$/i,
    /\.js$/i,
    /^mailto:/i,
    /^tel:/i,
    /^javascript:/i,
    /#/,
  ];

  while (queue.length > 0 && discovered.size < maxPages) {
    const current = queue.shift()!;
    const normalizedPath = normalizeUrl(current.url, baseUrl);

    if (visited.has(normalizedPath) || current.depth > maxDepth) {
      continue;
    }

    // Check exclude patterns
    if (excludePatterns.some(pattern => pattern.test(current.url))) {
      continue;
    }

    visited.add(normalizedPath);

    try {
      const fullUrl = new URL(current.url, baseUrl).href;
      await page.goto(fullUrl, { waitUntil: 'domcontentloaded', timeout: 30000 });

      // Get page info
      const title = await page.title();
      const hasForm = await page.locator('form').count() > 0;

      discovered.set(normalizedPath, {
        path: normalizedPath,
        depth: current.depth,
        hasForm,
        title,
      });

      console.log(`  Discovered: ${normalizedPath} (${title})`);

      // Extract links for next level
      if (current.depth < maxDepth) {
        const links = await page.evaluate(() => {
          return Array.from(document.querySelectorAll('a[href]'))
            .map(a => a.getAttribute('href'))
            .filter(href => href && !href.startsWith('#'));
        });

        for (const link of links) {
          if (link && isInternalUrl(link, baseUrl)) {
            const normalized = normalizeUrl(link, baseUrl);
            if (!visited.has(normalized) && !excludePatterns.some(p => p.test(link))) {
              queue.push({ url: link, depth: current.depth + 1 });
            }
          }
        }
      }
    } catch (error) {
      console.error(`  Error crawling ${current.url}:`, (error as Error).message);
    }
  }

  return Array.from(discovered.values());
}

/**
 * Get a predefined list of main pages to compare
 */
export function getMainPages(): string[] {
  return [
    '/',
    '/about',
    '/board',
    '/bookmap',
    '/donate',
    '/kmove',
    '/reviews',
    '/seminar',
    '/bookclub_offline',
    '/bookclub_olinen',
    '/info',
    '/opinion',
  ];
}
