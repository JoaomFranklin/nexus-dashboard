"use client";

interface Asset {
  symbol: string;
  name: string;
  price: number | null;
  change24h: number | null;
  error?: boolean;
}

interface FinancialData {
  assets: Asset[];
  updatedAt: string;
  error?: boolean;
}

interface Props {
  data: FinancialData | null;
  loading: boolean;
}

function formatPrice(price: number | null, symbol: string): string {
  if (price === null) return "—";
  if (symbol === "BTC") {
    return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(price);
  }
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 2 }).format(price);
}

const symbolIcons: Record<string, string> = {
  BTC: "₿",
  GS: "🏦",
  LMT: "🛡️",
};

export default function FinancialCard({ data, loading }: Props) {
  return (
    <div className="glass-card p-6 animate-fade-in">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
          Mercado • Tempo Real
        </h3>
        <div className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse-dot" />
          <span className="text-[10px] text-zinc-500">AO VIVO</span>
        </div>
      </div>

      {loading && !data ? (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-14 bg-white/5 rounded-lg animate-pulse" />
          ))}
        </div>
      ) : data?.error || !data ? (
        <div className="text-zinc-500 text-sm">Dados indisponíveis</div>
      ) : (
        <div className="space-y-3">
          {data.assets.map((asset) => {
            const isPositive = (asset.change24h ?? 0) >= 0;
            const hasError = asset.error || asset.price === null;

            return (
              <div
                key={asset.symbol}
                className="flex items-center justify-between p-3 bg-white/3 rounded-xl hover:bg-white/5 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-white/8 flex items-center justify-center text-base">
                    {symbolIcons[asset.symbol] || "📈"}
                  </div>
                  <div>
                    <div className="text-white text-sm font-semibold">{asset.symbol}</div>
                    <div className="text-zinc-500 text-xs truncate max-w-24">{asset.name}</div>
                  </div>
                </div>

                <div className="text-right">
                  {hasError ? (
                    <div className="text-zinc-600 text-sm">Indisponível</div>
                  ) : (
                    <>
                      <div className="text-white text-sm font-mono font-semibold">
                        {formatPrice(asset.price, asset.symbol)}
                      </div>
                      <div
                        className={`text-xs font-medium ${
                          isPositive ? "text-green-400" : "text-red-400"
                        }`}
                      >
                        {isPositive ? "▲" : "▼"}{" "}
                        {Math.abs(asset.change24h ?? 0).toFixed(2)}%
                      </div>
                    </>
                  )}
                </div>
              </div>
            );
          })}
          {data.updatedAt && (
            <p className="text-[10px] text-zinc-600 text-right pt-1">
              Atualizado às {new Date(data.updatedAt).toLocaleTimeString("pt-BR")}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
