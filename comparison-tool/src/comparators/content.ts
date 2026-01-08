import type { Page } from '@playwright/test';
import * as cheerio from 'cheerio';
import { normalizeKoreanText } from '../utils/korean.js';
import { waitForPageStability } from '../utils/helpers.js';

export interface ContentComparisonResult {
  page: string;
  textDifferences: TextDiff[];
  imageDifferences: ImageDiff[];
  linkDifferences: LinkDiff[];
  metaDifferences: MetaDiff[];
  totalDifferences: number;
}

export interface TextDiff {
  selector: string;
  originalText: string;
  cloneText: string;
  type: 'missing' | 'added' | 'changed';
}

export interface ImageDiff {
  originalSrc: string;
  cloneSrc: string;
  alt: string;
  type: 'missing' | 'added' | 'changed';
}

export interface LinkDiff {
  text: string;
  originalHref: string;
  cloneHref: string;
  type: 'missing' | 'added' | 'changed';
}

export interface MetaDiff {
  name: string;
  originalValue: string;
  cloneValue: string;
}

/**
 * Compare content of two pages
 */
export async function compareContent(
  originalPage: Page,
  clonePage: Page,
  pagePath: string
): Promise<ContentComparisonResult> {
  await Promise.all([
    waitForPageStability(originalPage),
    waitForPageStability(clonePage),
  ]);

  const [originalHtml, cloneHtml] = await Promise.all([
    originalPage.content(),
    clonePage.content(),
  ]);

  const original$ = cheerio.load(originalHtml);
  const clone$ = cheerio.load(cloneHtml);

  const textDifferences = compareText(original$, clone$);
  const imageDifferences = compareImages(original$, clone$);
  const linkDifferences = compareLinks(original$, clone$);
  const metaDifferences = compareMeta(original$, clone$);

  return {
    page: pagePath,
    textDifferences,
    imageDifferences,
    linkDifferences,
    metaDifferences,
    totalDifferences:
      textDifferences.length +
      imageDifferences.length +
      linkDifferences.length +
      metaDifferences.length,
  };
}

function compareText($original: cheerio.CheerioAPI, $clone: cheerio.CheerioAPI): TextDiff[] {
  const diffs: TextDiff[] = [];

  // Compare main content areas
  const selectors = ['h1', 'h2', 'h3', 'p', '.content', 'main', 'article'];

  for (const selector of selectors) {
    const originalTexts = new Set<string>();
    const cloneTexts = new Set<string>();

    $original(selector).each((_, el) => {
      const text = normalizeKoreanText($original(el).text());
      if (text.length > 10) originalTexts.add(text);
    });

    $clone(selector).each((_, el) => {
      const text = normalizeKoreanText($clone(el).text());
      if (text.length > 10) cloneTexts.add(text);
    });

    // Find missing in clone
    for (const text of originalTexts) {
      if (!cloneTexts.has(text)) {
        // Check if similar text exists
        const similar = [...cloneTexts].find(t =>
          t.includes(text.substring(0, 20)) || text.includes(t.substring(0, 20))
        );
        if (similar) {
          diffs.push({
            selector,
            originalText: text.substring(0, 100),
            cloneText: similar.substring(0, 100),
            type: 'changed',
          });
        } else {
          diffs.push({
            selector,
            originalText: text.substring(0, 100),
            cloneText: '',
            type: 'missing',
          });
        }
      }
    }

    // Find added in clone
    for (const text of cloneTexts) {
      if (!originalTexts.has(text) && ![...originalTexts].some(t =>
        t.includes(text.substring(0, 20)) || text.includes(t.substring(0, 20))
      )) {
        diffs.push({
          selector,
          originalText: '',
          cloneText: text.substring(0, 100),
          type: 'added',
        });
      }
    }
  }

  return diffs.slice(0, 20); // Limit to 20 differences
}

function compareImages($original: cheerio.CheerioAPI, $clone: cheerio.CheerioAPI): ImageDiff[] {
  const diffs: ImageDiff[] = [];

  const originalImages = new Map<string, { src: string; alt: string }>();
  const cloneImages = new Map<string, { src: string; alt: string }>();

  $original('img').each((_, el) => {
    const src = $original(el).attr('src') || '';
    const alt = $original(el).attr('alt') || '';
    if (src) {
      // Normalize image path for comparison
      const key = normalizeImageSrc(src);
      originalImages.set(key, { src, alt });
    }
  });

  $clone('img').each((_, el) => {
    const src = $clone(el).attr('src') || '';
    const alt = $clone(el).attr('alt') || '';
    if (src) {
      const key = normalizeImageSrc(src);
      cloneImages.set(key, { src, alt });
    }
  });

  // Find missing images
  for (const [key, { src, alt }] of originalImages) {
    if (!cloneImages.has(key)) {
      diffs.push({
        originalSrc: src,
        cloneSrc: '',
        alt,
        type: 'missing',
      });
    }
  }

  // Find added images
  for (const [key, { src, alt }] of cloneImages) {
    if (!originalImages.has(key)) {
      diffs.push({
        originalSrc: '',
        cloneSrc: src,
        alt,
        type: 'added',
      });
    }
  }

  return diffs.slice(0, 20);
}

function normalizeImageSrc(src: string): string {
  // Extract filename from various CDN patterns
  const filename = src.split('/').pop()?.split('?')[0] || src;
  return filename.toLowerCase();
}

function compareLinks($original: cheerio.CheerioAPI, $clone: cheerio.CheerioAPI): LinkDiff[] {
  const diffs: LinkDiff[] = [];

  const originalLinks = new Map<string, string>();
  const cloneLinks = new Map<string, string>();

  $original('a[href]').each((_, el) => {
    const href = $original(el).attr('href') || '';
    const text = normalizeKoreanText($original(el).text()).substring(0, 50);
    if (text && !href.startsWith('#') && !href.startsWith('javascript:')) {
      originalLinks.set(text, href);
    }
  });

  $clone('a[href]').each((_, el) => {
    const href = $clone(el).attr('href') || '';
    const text = normalizeKoreanText($clone(el).text()).substring(0, 50);
    if (text && !href.startsWith('#') && !href.startsWith('javascript:')) {
      cloneLinks.set(text, href);
    }
  });

  // Compare links with same text
  for (const [text, originalHref] of originalLinks) {
    const cloneHref = cloneLinks.get(text);
    if (!cloneHref) {
      diffs.push({ text, originalHref, cloneHref: '', type: 'missing' });
    } else if (normalizeHref(originalHref) !== normalizeHref(cloneHref)) {
      diffs.push({ text, originalHref, cloneHref, type: 'changed' });
    }
  }

  return diffs.slice(0, 20);
}

function normalizeHref(href: string): string {
  // Remove domain, normalize path
  try {
    const url = new URL(href, 'https://example.com');
    return url.pathname;
  } catch {
    return href.replace(/^https?:\/\/[^/]+/, '');
  }
}

function compareMeta($original: cheerio.CheerioAPI, $clone: cheerio.CheerioAPI): MetaDiff[] {
  const diffs: MetaDiff[] = [];

  // Compare title
  const originalTitle = $original('title').text();
  const cloneTitle = $clone('title').text();
  if (normalizeKoreanText(originalTitle) !== normalizeKoreanText(cloneTitle)) {
    diffs.push({ name: 'title', originalValue: originalTitle, cloneValue: cloneTitle });
  }

  // Compare meta description
  const originalDesc = $original('meta[name="description"]').attr('content') || '';
  const cloneDesc = $clone('meta[name="description"]').attr('content') || '';
  if (normalizeKoreanText(originalDesc) !== normalizeKoreanText(cloneDesc)) {
    diffs.push({ name: 'description', originalValue: originalDesc, cloneValue: cloneDesc });
  }

  // Compare OG tags
  const ogTags = ['og:title', 'og:description', 'og:image'];
  for (const tag of ogTags) {
    const originalValue = $original(`meta[property="${tag}"]`).attr('content') || '';
    const cloneValue = $clone(`meta[property="${tag}"]`).attr('content') || '';
    if (originalValue !== cloneValue) {
      diffs.push({ name: tag, originalValue, cloneValue });
    }
  }

  return diffs;
}
