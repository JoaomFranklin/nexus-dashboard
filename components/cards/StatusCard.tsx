"use client";

interface StatusData {
  mossad: {
    level: number;
    label: string;
    color: string;
    description: string;
    threat: string;
  };
}

interface Props {
  data: StatusData | null;
  loading: boolean;
}

const colorMap: Record<string, string> = {
  gray:   "text-zinc-300  bg-zinc-500/10   border-zinc-500/20",
  yellow: "text-yellow-400 bg-yellow-500/10 border-yellow-500/20",
  orange: "text-orange-400 bg-orange-500/10 border-orange-500/20",
  red:    "text-red-400   bg-red-500/10    border-red-500/20",
};

const dotMap: Record<string, string> = {
  gray:   "bg-zinc-400",
  yellow: "bg-yellow-400",
  orange: "bg-orange-400",
  red:    "bg-red-500",
};

const barMap: Record<string, string> = {
  gray:   "bg-zinc-500",
  yellow: "bg-yellow-400",
  orange: "bg-orange-400",
  red:    "bg-red-500",
};

export default function StatusCard({ data, loading }: Props) {
  return (
    <div className="glass-card p-6 animate-fade-in">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
          Intel Mossad
        </h3>
        <span className="text-lg">🕵️</span>
      </div>

      {loading && !data ? (
        <div className="space-y-3">
          <div className="h-8 bg-white/5 rounded-lg animate-pulse" />
          <div className="h-4 bg-white/5 rounded w-3/4 animate-pulse" />
        </div>
      ) : !data ? (
        <div className="text-zinc-500 text-sm">Dados indisponíveis</div>
      ) : (
        <div>
          <div className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg border ${colorMap[data.mossad.color]}`}>
            <span className={`w-2 h-2 rounded-full animate-pulse-dot ${dotMap[data.mossad.color]}`} />
            <span className="font-bold text-sm tracking-wide">{data.mossad.label}</span>
          </div>

          <div className="mt-3 flex items-center gap-2">
            <span className="text-[10px] text-zinc-600 uppercase tracking-widest">Nível de ameaça</span>
            <span className={`text-[10px] font-bold tracking-widest ${dotMap[data.mossad.color].replace("bg-", "text-")}`}>
              {data.mossad.threat}
            </span>
          </div>

          <p className="text-zinc-400 text-xs mt-2 leading-relaxed">
            {data.mossad.description}
          </p>

          <div className="mt-3 flex gap-1">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className={`h-1 flex-1 rounded-full transition-all ${
                  i <= data.mossad.level ? barMap[data.mossad.color] : "bg-white/8"
                }`}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
