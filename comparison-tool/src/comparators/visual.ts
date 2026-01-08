import type { Page } from '@playwright/test';
import pixelmatch from 'pixelmatch';
import { PNG } from 'pngjs';
import * as fs from 'fs';
import * as path from 'path';
import { waitForPageStability, hideDynamicElements } from '../utils/helpers.js';

export interface VisualComparisonResult {
  page: string;
  originalScreenshot: string;
  cloneScreenshot: string;
  diffImage: string;
  diffPixelCount: number;
  diffPercentage: number;
  isMatch: boolean;
  error?: string;
}

/**
 * Compare visual appearance of two pages
 */
export async function compareVisuals(
  originalPage: Page,
  clonePage: Page,
  pagePath: string,
  outputDir: string,
  threshold = 0.1
): Promise<VisualComparisonResult> {
  const safePath = pagePath.replace(/[^a-zA-Z0-9]/g, '_') || 'index';
  const originalPath = path.join(outputDir, `${safePath}_original.png`);
  const clonePath = path.join(outputDir, `${safePath}_clone.png`);
  const diffPath = path.join(outputDir, `${safePath}_diff.png`);

  try {
    // Wait for both pages to stabilize
    await Promise.all([
      waitForPageStability(originalPage),
      waitForPageStability(clonePage),
    ]);

    // Hide dynamic elements
    await Promise.all([
      hideDynamicElements(originalPage),
      hideDynamicElements(clonePage),
    ]);

    // Take screenshots
    const [originalBuffer, cloneBuffer] = await Promise.all([
      originalPage.screenshot({ fullPage: true }),
      clonePage.screenshot({ fullPage: true }),
    ]);

    // Save screenshots
    fs.writeFileSync(originalPath, originalBuffer);
    fs.writeFileSync(clonePath, cloneBuffer);

    // Parse PNGs
    const originalPng = PNG.sync.read(originalBuffer);
    const clonePng = PNG.sync.read(cloneBuffer);

    // Handle different sizes by using the larger dimensions
    const width = Math.max(originalPng.width, clonePng.width);
    const height = Math.max(originalPng.height, clonePng.height);

    // Create normalized images with same dimensions
    const normalizedOriginal = resizePng(originalPng, width, height);
    const normalizedClone = resizePng(clonePng, width, height);

    // Create diff image
    const diff = new PNG({ width, height });

    // Compare
    const diffPixels = pixelmatch(
      normalizedOriginal.data,
      normalizedClone.data,
      diff.data,
      width,
      height,
      { threshold }
    );

    // Save diff
    fs.writeFileSync(diffPath, PNG.sync.write(diff));

    const totalPixels = width * height;
    const diffPercentage = (diffPixels / totalPixels) * 100;

    return {
      page: pagePath,
      originalScreenshot: originalPath,
      cloneScreenshot: clonePath,
      diffImage: diffPath,
      diffPixelCount: diffPixels,
      diffPercentage: Math.round(diffPercentage * 100) / 100,
      isMatch: diffPercentage < 1, // Less than 1% difference
    };
  } catch (error) {
    return {
      page: pagePath,
      originalScreenshot: originalPath,
      cloneScreenshot: clonePath,
      diffImage: diffPath,
      diffPixelCount: -1,
      diffPercentage: 100,
      isMatch: false,
      error: (error as Error).message,
    };
  }
}

/**
 * Resize PNG to specified dimensions
 */
function resizePng(png: PNG, width: number, height: number): PNG {
  if (png.width === width && png.height === height) {
    return png;
  }

  const resized = new PNG({ width, height, fill: true });

  // Fill with white background
  for (let i = 0; i < resized.data.length; i += 4) {
    resized.data[i] = 255;     // R
    resized.data[i + 1] = 255; // G
    resized.data[i + 2] = 255; // B
    resized.data[i + 3] = 255; // A
  }

  // Copy original image data
  for (let y = 0; y < png.height && y < height; y++) {
    for (let x = 0; x < png.width && x < width; x++) {
      const srcIdx = (y * png.width + x) * 4;
      const dstIdx = (y * width + x) * 4;
      resized.data[dstIdx] = png.data[srcIdx];
      resized.data[dstIdx + 1] = png.data[srcIdx + 1];
      resized.data[dstIdx + 2] = png.data[srcIdx + 2];
      resized.data[dstIdx + 3] = png.data[srcIdx + 3];
    }
  }

  return resized;
}
