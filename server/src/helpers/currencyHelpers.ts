import * as data from "@server/database/data/currencies.json" with { type: "json" };

export interface CurrencyInfo {
  code: string;
  isoNum: number;
  name: string;
  symbol: string;
  symbolNative: string;
}

const byCode = new Map<string, CurrencyInfo>();
const byIsoNum = new Map<number, CurrencyInfo>();

for (const [code, entry] of Object.entries(data.default)) {
  if (entry.ISOnum === null) continue;

  const info: CurrencyInfo = {
    code,
    isoNum: entry.ISOnum,
    name: entry.name,
    symbol: entry.symbol,
    symbolNative: entry.symbolNative,
  };

  byCode.set(code, info);
  byIsoNum.set(entry.ISOnum, info);
}

export function getCurrencyByCode(code: string): CurrencyInfo | undefined {
  return byCode.get(code.toUpperCase());
}

export function getCurrencyByIsoNum(isoNum: number): CurrencyInfo | undefined {
  return byIsoNum.get(isoNum);
}

export function getAllCurrencies(): CurrencyInfo[] {
  return [...byCode.values()].sort((a, b) => a.code.localeCompare(b.code));
}

export const VALID_ISO_NUMS: number[] = [...byIsoNum.keys()];
