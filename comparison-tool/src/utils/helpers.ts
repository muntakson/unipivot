import type { Page } from '@playwright/test';

/**
 * Wait for page to be stable (no network activity, animations complete)
 */
export async function waitForPageStability(page: Page, timeout = 5000): Promise<void> {
  await page.waitForLoadState('networkidle', { timeout });
  // Additional wait for any animations
  await page.waitForTimeout(500);
}

/**
 * Hide dynamic elements that change between page loads
 */
export async function hideDynamicElements(page: Page): Promise<void> {
  await page.evaluate(() => {
    const selectors = [
      '.date-display',
      '.view-count',
      '.visitor-count',
      '[class*="carousel"]',
      '[class*="slider"]',
      '[class*="slick"]',
      '.instagram-widget',
      '[data-dynamic]',
      '.loading',
      '[class*="loading"]',
      'iframe',
    ];

    selectors.forEach(selector => {
      document.querySelectorAll(selector).forEach(el => {
        (el as HTMLElement).style.visibility = 'hidden';
      });
    });
  });
}

/**
 * Normalize URL for comparison (remove session params, etc)
 */
export function normalizeUrl(url: string, baseUrl: string): string {
  try {
    const parsed = new URL(url, baseUrl);

    // Remove common session/tracking params
    const paramsToRemove = ['utm_source', 'utm_medium', 'utm_campaign', 'session', 'sid'];
    paramsToRemove.forEach(param => parsed.searchParams.delete(param));

    return parsed.pathname + (parsed.search || '');
  } catch {
    return url;
  }
}

/**
 * Check if URL is internal
 */
export function isInternalUrl(url: string, baseUrl: string): boolean {
  try {
    const parsed = new URL(url, baseUrl);
    const base = new URL(baseUrl);
    return parsed.hostname === base.hostname;
  } catch {
    return false;
  }
}

/**
 * Extract path from URL
 */
export function getPathFromUrl(url: string): string {
  try {
    const parsed = new URL(url);
    return parsed.pathname;
  } catch {
    return url;
  }
}
