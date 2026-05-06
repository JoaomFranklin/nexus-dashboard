"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createClient } from "@/lib/supabase-client";
import { useRouter } from "next/navigation";
import SearchBar from "./SearchBar";
import WeatherCard from "./cards/WeatherCard";
import DayNightCard from "./cards/DayNightCard";
import StatusCard from "./cards/StatusCard";
import GovernmentCard from "./cards/GovernmentCard";
import FinancialCard from "./cards/FinancialCard";

interface User {
  id: string;
  email: string | undefined;
}

interface Props {
  user: User;
}

const REFRESH_INTERVAL = 60_000; // 60s

export default function Dashboard({ user }: Props) {
  const router = useRouter();
  const [weather, setWeather] = useState<any>(null);
  const [financial, setFinancial] = useState<any>(null);
  const [status, setStatus] = useState<any>(null);
  const [loadingWeather, setLoadingWeather] = useState(true);
  const [loadingFinancial, setLoadingFinancial] = useState(true);
  const [loadingStatus, setLoadingStatus] = useState(true);
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const fetchWeather = useCallback(async () => {
    try {
      const res = await fetch("/api/weather");
      const data = await res.json();
      setWeather(res.ok ? data : { ...data, error: true });
    } catch {
      setWeather({ error: true });
    } finally {
      setLoadingWeather(false);
    }
  }, []);

  const fetchFinancial = useCallback(async () => {
    try {
      const res = await fetch("/api/financial");
      const data = await res.json();
      setFinancial(res.ok ? data : { ...data, error: true });
    } catch {
      setFinancial({ error: true });
    } finally {
      setLoadingFinancial(false);
    }
  }, []);

  const fetchStatus = useCallback(async () => {
    try {
      const res = await fetch(`/api/status?userId=${user.id}`);
      const data = await res.json();
      setStatus(res.ok ? data : { ...data, error: true });
    } catch {
      setStatus({ error: true });
    } finally {
      setLoadingStatus(false);
    }
  }, [user.id]);

  const fetchAll = useCallback(() => {
    fetchWeather();
    fetchFinancial();
    fetchStatus();
    setLastRefresh(new Date());
  }, [fetchWeather, fetchFinancial, fetchStatus]);

  useEffect(() => {
    fetchAll();
    intervalRef.current = setInterval(fetchAll, REFRESH_INTERVAL);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [fetchAll]);

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  };

  return (
    <div className="min-h-screen p-4 md:p-6 lg:p-8">
      {/* Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute -top-60 -right-60 w-[600px] h-[600px] bg-blue-900/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-60 -left-60 w-[600px] h-[600px] bg-purple-900/10 rounded-full blur-3xl" />
      </div>

      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <header className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-xl font-bold text-white">
              ⚡ Nexus Dashboard
            </h1>
            <p className="text-zinc-500 text-xs mt-0.5">
              {user.email} · Atualizado às {lastRefresh.toLocaleTimeString("pt-BR")}
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 text-sm text-zinc-400 hover:text-white glass-card hover:border-white/20 transition-all"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Sair
          </button>
        </header>

        {/* Search Bar */}
        <div className="mb-8">
          <SearchBar />
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Financial takes full width on large screens */}
          <div className="sm:col-span-2 lg:col-span-1 lg:row-span-2">
            <FinancialCard data={financial} loading={loadingFinancial} />
          </div>

          <WeatherCard data={weather} loading={loadingWeather} />
          <DayNightCard />
          <StatusCard data={status} loading={loadingStatus} />
          <GovernmentCard data={status} loading={loadingStatus} />
        </div>

        {/* Footer */}
        <footer className="mt-8 text-center text-[11px] text-zinc-600">
          Dados financeiros: CoinGecko + Yahoo Finance · Clima: OpenWeatherMap · Quedas do Iguaçu
        </footer>
      </div>
    </div>
  );
}
