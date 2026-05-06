import { NextResponse } from "next/server";

async function fetchBitcoin() {
  const res = await fetch(
    "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd&include_24hr_change=true",
    { next: { revalidate: 60 } }
  );
  if (!res.ok) throw new Error("CoinGecko error");
  const data = await res.json();
  return {
    symbol: "BTC",
    name: "Bitcoin",
    price: data.bitcoin.usd,
    change24h: data.bitcoin.usd_24h_change,
  };
}

async function fetchYahooStock(symbol: string, name: string) {
  const url = `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?interval=1d&range=2d`;
  const res = await fetch(url, {
    headers: { "User-Agent": "Mozilla/5.0" },
    next: { revalidate: 60 },
  });
  if (!res.ok) throw new Error(`Yahoo Finance error for ${symbol}: ${res.status}`);
  const data = await res.json();
  const meta = data?.chart?.result?.[0]?.meta;
  if (!meta) throw new Error(`No data for ${symbol}`);
  const price = meta.regularMarketPrice ?? meta.postMarketPrice;
  const prev = meta.chartPreviousClose ?? meta.previousClose;
  const change24h = prev > 0 ? ((price - prev) / prev) * 100 : 0;
  return { symbol, name, price, change24h };
}

export async function GET() {
  const results = await Promise.allSettled([
    fetchBitcoin(),
    fetchYahooStock("GS", "Goldman Sachs"),
    fetchYahooStock("LMT", "Lockheed Martin"),
  ]);

  const fallbacks = [
    { symbol: "BTC", name: "Bitcoin" },
    { symbol: "GS", name: "Goldman Sachs" },
    { symbol: "LMT", name: "Lockheed Martin" },
  ];

  const assets = results.map((r, i) => {
    if (r.status === "fulfilled") return r.value;
    console.error(`[financial] ${fallbacks[i].symbol}:`, r.reason?.message);
    return { ...fallbacks[i], price: null, change24h: null, error: true };
  });

  return NextResponse.json({ assets, updatedAt: new Date().toISOString() });
}
