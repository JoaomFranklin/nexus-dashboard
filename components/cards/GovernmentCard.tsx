"use client";

interface GovData {
  government: {
    status: string;
    label: string;
    color: string;
    icon: string;
  };
}

interface Props {
  data: GovData | null;
  loading: boolean;
}

export default function GovernmentCard({ data, loading }: Props) {
  const isOperating = data?.government?.status === "operante";

  return (
    <div className="glass-card p-6 animate-fade-in">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
          Status • Governo
        </h3>
        <span className="text-lg">🏛️</span>
      </div>

      {loading && !data ? (
        <div className="h-8 bg-white/5 rounded-lg animate-pulse" />
      ) : !data ? (
        <div className="text-zinc-500 text-sm">Dados indisponíveis</div>
      ) : (
        <div>
          <div className={`text-2xl font-bold mb-2 ${isOperating ? "text-green-400" : "text-red-400"}`}>
            {data.government.icon} {isOperating ? "Operante" : "Inexistente"}
          </div>
          <p className="text-zinc-300 text-sm font-medium">{data.government.label}</p>
          <div
            className={`mt-3 px-3 py-2 rounded-lg border text-xs font-medium ${
              isOperating
                ? "bg-green-500/10 border-green-500/20 text-green-400"
                : "bg-red-500/10 border-red-500/20 text-red-400"
            }`}
          >
            {isOperating ? "Estrutura governamental: ATIVA" : "Estrutura governamental: DISSOLVIDA"}
          </div>
        </div>
      )}
    </div>
  );
}
