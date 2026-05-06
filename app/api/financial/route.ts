import { NextResponse } from "next/server";

// Bitcoin via CoinGecko (free, no key needed)
async function fetchBitcoin() {
  const res = await fetch(
    "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd&include_24hr_change=true&include_24hr_vol=true",
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

// Stocks via Finnhub (requires FINNHUB_API_KEY)
async function fetchStock(symbol: string, name: string) {
  const apiKey = process.env.FINNHUB_API_KEY;
  if (!apiKey) throw new Error("FINNHUB_API_KEY not configured");

  const [quoteRes, profileRes] = await Promise.all([
    fetch(
      `https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${apiKey}`,
      { next: { revalidate: 60 } }
    ),
    fetch(
      `https://finnhub.io/api/v1/stock/profile2?symbol=${symbol}&token=${apiKey}`,
      { next: { revalidate: 3600 } }
    ),
  ]);

  if (!quoteRes.ok) throw new Error(`Finnhub error for ${symbol}`);

  const quote = await quoteRes.json();
  const profile = profileRes.ok ? await profileRes.json() : {};

  const change24h = quote.pc > 0 ? ((quote.c - quote.pc) / quote.pc) * 100 : 0;

  return {
    symbol,
    name: profile.name || name,
    price: quote.c,
    change24h,
    high: quote.h,
    low: quote.l,
    previousClose: quote.pc,
  };
}

export async function GET() {
  const results = await Promise.allSettled([
    fetchBitcoin(),
    fetchStock("GS", "Goldman Sachs"),
    fetchStock("LMT", "Lockheed Martin"),
  ]);

  const data = results.map((r, i) => {
    if (r.status === "fulfilled") return r.value;
    const fallback = [
      { symbol: "BTC", name: "Bitcoin" },
      { symbol: "GS", name: "Goldman Sachs" },
      { symbol: "LMT", name: "Lockheed Martin" },
    ][i];
    console.error(`[financial] failed to fetch ${fallback.symbol}:`, r.reason);
    return { ...fallback, price: null, change24h: null, error: true };
  });

  return NextResponse.json({ assets: data, updatedAt: new Date().toISOString() });
}
