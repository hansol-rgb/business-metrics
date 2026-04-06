const EUK = 100_000_000; // 1억
const MAN = 10_000; // 1만

export function formatKRW(n: number): string {
  if (n === 0) return '0';

  const abs = Math.abs(n);
  const sign = n < 0 ? '-' : '';

  if (abs >= EUK) {
    const euk = abs / EUK;
    return `${sign}${euk % 1 === 0 ? euk.toFixed(0) : euk.toFixed(1)}억`;
  }

  if (abs >= MAN) {
    const man = Math.round(abs / MAN);
    return `${sign}${man.toLocaleString('en-US')}만`;
  }

  return `${sign}${abs.toLocaleString('en-US')}`;
}

export function formatKRWFull(n: number): string {
  return n.toLocaleString('en-US');
}

export function formatPercent(n: number): string {
  return `${n.toFixed(2)}%`;
}

export function formatNumber(n: number): string {
  return Math.round(n).toLocaleString('en-US');
}
