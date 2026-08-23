import crypto from 'crypto';

/**
 * Recursively sorts the keys of an object or array to ensure stable JSON serialization.
 */
function sortKeysRecursively(val: unknown): unknown {
  if (val === null || typeof val !== 'object') {
    return val;
  }

  if (Array.isArray(val)) {
    return val.map(sortKeysRecursively);
  }

  const obj = val as Record<string, unknown>;
  const sortedKeys = Object.keys(obj).sort();
  const sortedObj: Record<string, unknown> = {};

  for (const key of sortedKeys) {
    const value = obj[key];
    if (value !== undefined) {
      sortedObj[key] = sortKeysRecursively(value);
    }
  }

  return sortedObj;
}

/**
 * Generates a deterministic cache key for any given payload by recursively sorting keys
 * and computing a SHA-256 hash.
 * Output format: `gemini:cache:${sha256Hash}`
 */
export function generateCacheKey(payload: unknown): string {
  const sortedPayload = sortKeysRecursively(payload);
  const jsonString = JSON.stringify(sortedPayload);
  const hash = crypto.createHash('sha256').update(jsonString).digest('hex');
  return `gemini:cache:${hash}`;
}
