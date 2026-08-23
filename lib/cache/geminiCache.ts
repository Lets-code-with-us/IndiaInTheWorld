import { kv } from '@vercel/kv';
import { NextResponse } from 'next/server';
import { generateCacheKey } from './hash';

export interface GeminiCacheOptions {
  ttl?: number; // TTL in seconds (default: 86400 = 24 hours)
}

/**
 * Wraps a Gemini API call with Vercel KV caching.
 *
 * @param payload - Request payload used to compute the deterministic SHA-256 cache key
 * @param fetcher - Async callback that executes the actual Gemini API call and returns response data
 * @param options - Cache options such as custom TTL (default: 86400s / 24h)
 * @returns NextResponse with the JSON payload and appropriate `X-Cache` header ('HIT' or 'MISS')
 */
export async function getCachedGeminiResponse<T extends Record<string, any>>(
  payload: unknown,
  fetcher: () => Promise<T>,
  options: GeminiCacheOptions = {}
): Promise<NextResponse> {
  const ttl = options.ttl ?? 86400;
  const cacheKey = generateCacheKey(payload);

  // 1. Try reading from KV store (fail-open strategy)
  try {
    const cachedData = await kv.get<T>(cacheKey);
    if (cachedData !== null && cachedData !== undefined) {
      return NextResponse.json(cachedData, {
        headers: {
          'X-Cache': 'HIT',
        },
      });
    }
  } catch (error) {
    console.warn(`[GeminiCache] KV read failed for key ${cacheKey}. Falling open to live API call.`, error);
  }

  // 2. Cache Miss or KV read error: Execute Gemini API fetcher
  const data = await fetcher();

  // 3. Save successful response to KV store (fail-open strategy)
  if (data) {
    try {
      await kv.set(cacheKey, data, { ex: ttl });
    } catch (error) {
      console.warn(`[GeminiCache] KV write failed for key ${cacheKey}.`, error);
    }
  }

  return NextResponse.json(data, {
    headers: {
      'X-Cache': 'MISS',
    },
  });
}
