/**
 * Normalize Korean text for consistent comparison
 */
export function normalizeKoreanText(text: string): string {
  // Normalize Unicode (NFC form for Korean)
  let normalized = text.normalize('NFC');

  // Remove zero-width characters
  normalized = normalized.replace(/[\u200B-\u200D\uFEFF]/g, '');

  // Normalize whitespace
  normalized = normalized.replace(/\s+/g, ' ').trim();

  return normalized;
}

/**
 * Compare two Korean text strings
 */
export function compareKoreanText(original: string, clone: string): {
  isEqual: boolean;
  originalNormalized: string;
  cloneNormalized: string;
} {
  const originalNormalized = normalizeKoreanText(original);
  const cloneNormalized = normalizeKoreanText(clone);

  return {
    isEqual: originalNormalized === cloneNormalized,
    originalNormalized,
    cloneNormalized,
  };
}
