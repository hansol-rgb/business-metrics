import type { PNLData } from '@/types/pnl';
import { getCachedData, setCachedData } from '@/lib/cache';
import { fetchPNLRawData } from '@/lib/google-sheets';
import { parsePNLFromRows } from '@/lib/parse-pnl';

export async function getPNLData(): Promise<PNLData> {
  const cached = getCachedData();
  if (cached) return cached;

  const rows = await fetchPNLRawData();
  const data = parsePNLFromRows(rows);
  setCachedData(data);
  return data;
}
