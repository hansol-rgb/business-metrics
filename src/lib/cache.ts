import { LRUCache } from 'lru-cache';
import type { PNLData } from '@/types/pnl';

const CACHE_KEY = 'pnl-data';

const cache = new LRUCache<string, PNLData>({
  max: 10,
  ttl: 5 * 60 * 1000, // 5 minutes
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
