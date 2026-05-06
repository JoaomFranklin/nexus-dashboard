"use client";

// ⚠️ CONTEÚDO 100% FICTÍCIO — Apenas para fins de entretenimento

interface StatusData {
  mossad: {
    level: number;
    label: string;
    color: string;
    description: string;
  };
  disclaimer: string;
  error?: boolean;
}

interface Props {
  data: StatusData | null;
  loading: boolean;
}

const colorMap: Record<string, string> = {
  green: "text-green-400 bg-green-500/10 border-green-500/20",
  yellow: "text-yellow-400 bg-yellow-500/10 border-yellow-500/20",
  orange: "text-orange-400 bg-orange-500/10 border-orange-500/20",
  red: "text-red-400 bg-red-500/10 border-red-500/20",
};

const dotColorMap: Record<string, string> = {
  green: "bg-green-400",
  yellow: "bg-yellow-400",
  orange: "bg-orange-400",
  red: "bg-red-400",
};

const levelIcons = ["🟢", "🟡", "🟠", "🔴"];

export default function StatusCard({ data, loading }: Props) {
  return (
    <div className="glass-card p-6 animate-fade-in">
      <div className="flex items-center justify-between mb-1">
        <h3 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
          Status • Mossad
        </h3>
        <span className="text-lg">🕵️</span>
      </div>
      <p className="text-[10px] text-zinc-600 mb-4">⚠️ SIMULAÇÃO FICTÍCIA</p>

      {loading && !data ? (
        <div className="space-y-3">
          <div className="h-8 bg-white/5 rounded-lg animate-pulse" />
          <div className="h-4 bg-white/5 rounded w-3/4 animate-pulse" />
        </div>
      ) : data?.error || !data ? (
        <div className="text-zinc-500 text-sm">Dados indisponíveis</div>
      ) : (
        <div>
          <div className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg border ${colorMap[data.mossad.color]}`}>
            <span className={`w-2 h-2 rounded-full animate-pulse-dot ${dotColorMap[data.mossad.color]}`} />
            <span className="font-semibold text-sm">
              {levelIcons[data.mossad.level]} {data.mossad.label}
            </span>
          </div>
          <p className="text-zinc-500 text-xs mt-3 leading-relaxed">
            {data.mossad.description}
          </p>
          <div className="mt-3 flex gap-1">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className={`h-1 flex-1 rounded-full ${i <= data.mossad.level ? dotColorMap[data.mossad.color] : "bg-white/10"}`}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
