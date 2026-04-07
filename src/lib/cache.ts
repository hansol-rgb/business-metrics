import { LRUCache } from 'lru-cache';
import type { PNLData } from '@/types/pnl';

const CACHE_KEY = 'pnl-data';
const DEFAULT_TTL = 5 * 60 * 1000;
const ttl = Number(process.env.CACHE_TTL_MS) || DEFAULT_TTL;

const cache = new LRUCache<string, PNLData>({
  max: 10,
  ttl,
});

export function getCachedData(): PNLData | undefined {
  return cache.get(CACHE_KEY);
}

export function setCachedData(data: PNLData): void {
  cache.set(CACHE_KEY, data);
}

export function invalidateCache(): void {
  cache.delete(CACHE_KEY);
}
