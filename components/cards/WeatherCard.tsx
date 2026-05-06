"use client";

interface WeatherData {
  city: string;
  temp: number;
  feelsLike: number;
  humidity: number;
  description: string;
  icon: string;
  isCold: boolean;
  isDay: boolean;
  error?: boolean;
}

interface Props {
  data: WeatherData | null;
  loading: boolean;
}

export default function WeatherCard({ data, loading }: Props) {
  return (
    <div className="glass-card p-6 animate-fade-in">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
          Clima • Foz do Iguaçu
        </h3>
        <span className="text-lg">🌊</span>
      </div>

      {loading && !data ? (
        <div className="space-y-3">
          <div className="h-10 bg-white/5 rounded-lg animate-pulse" />
          <div className="h-4 bg-white/5 rounded w-2/3 animate-pulse" />
        </div>
      ) : data?.error || !data ? (
        <div className="text-zinc-500 text-sm">Dados indisponíveis</div>
      ) : (
        <div>
          <div className="flex items-end gap-2 mb-1">
            <span className="text-4xl font-bold text-white">{data.temp}°C</span>
            <img
              src={`https://openweathermap.org/img/wn/${data.icon}.png`}
              alt={data.description}
              width={40}
              height={40}
              className="mb-1 opacity-90"
            />
          </div>
          <p className="text-zinc-400 text-sm capitalize mb-3">{data.description}</p>
          <div className="flex gap-4 text-xs text-zinc-500">
            <span>Sensação: <span className="text-zinc-300">{data.feelsLike}°C</span></span>
            <span>Humidade: <span className="text-zinc-300">{data.humidity}%</span></span>
          </div>
          {data.isCold && (
            <div className="mt-3 px-3 py-1.5 bg-blue-500/10 border border-blue-500/20 rounded-lg inline-flex items-center gap-1.5">
              <span className="text-blue-400 text-xs font-medium">🥶 Está frio!</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
