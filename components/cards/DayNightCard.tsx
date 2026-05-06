"use client";

import { useEffect, useState } from "react";

export default function DayNightCard() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Foz do Iguaçu timezone: UTC-3
  const fozHour = (time.getUTCHours() - 3 + 24) % 24;
  const isDay = fozHour >= 6 && fozHour < 18;

  const timeStr = time.toLocaleTimeString("pt-BR", {
    timeZone: "America/Sao_Paulo",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  const dateStr = time.toLocaleDateString("pt-BR", {
    timeZone: "America/Sao_Paulo",
    weekday: "long",
    day: "numeric",
    month: "long",
  });

  return (
    <div className="glass-card p-6 animate-fade-in">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
          Horário • Foz do Iguaçu
        </h3>
        <span className="text-lg">{isDay ? "☀️" : "🌙"}</span>
      </div>

      <div className="mb-2">
        <div className={`text-3xl font-bold ${isDay ? "text-amber-400" : "text-indigo-300"}`}>
          {isDay ? "Está de dia" : "Está de noite"}
        </div>
        <div className="text-2xl font-mono text-white mt-1">{timeStr}</div>
      </div>

      <p className="text-zinc-400 text-sm capitalize">{dateStr}</p>

      {/* Day progress bar */}
      <div className="mt-4">
        <div className="flex justify-between text-xs text-zinc-600 mb-1">
          <span>06:00</span>
          <span>18:00</span>
        </div>
        <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-1000 ${isDay ? "bg-amber-400" : "bg-indigo-500"}`}
            style={{
              width: `${Math.max(0, Math.min(100, ((fozHour - 6) / 12) * 100))}%`,
            }}
          />
        </div>
      </div>
    </div>
  );
}
