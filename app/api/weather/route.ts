import { NextResponse } from "next/server";

// Quedas do Iguaçu — PR, Brasil
const LAT = -25.4472;
const LON = -53.0108;
const COLD_THRESHOLD = 18;

// WMO Weather interpretation codes → descrição PT-BR
const WMO_DESCRIPTIONS: Record<number, string> = {
  0: "céu limpo",
  1: "predominantemente limpo",
  2: "parcialmente nublado",
  3: "nublado",
  45: "neblina",
  48: "neblina com geada",
  51: "garoa leve",
  53: "garoa moderada",
  55: "garoa intensa",
  61: "chuva leve",
  63: "chuva moderada",
  65: "chuva forte",
  71: "neve leve",
  73: "neve moderada",
  75: "neve forte",
  77: "grãos de neve",
  80: "pancadas de chuva leves",
  81: "pancadas de chuva moderadas",
  82: "pancadas de chuva violentas",
  85: "pancadas de neve leves",
  86: "pancadas de neve fortes",
  95: "trovoada",
  96: "trovoada com granizo leve",
  99: "trovoada com granizo forte",
};

function wmoIcon(code: number, isDay: boolean): string {
  if (code === 0) return isDay ? "01d" : "01n";
  if (code <= 2) return isDay ? "02d" : "02n";
  if (code === 3) return isDay ? "03d" : "03n";
  if (code <= 48) return "50d";
  if (code <= 55) return isDay ? "09d" : "09n";
  if (code <= 65) return isDay ? "10d" : "10n";
  if (code <= 77) return "13d";
  if (code <= 82) return isDay ? "09d" : "09n";
  if (code <= 86) return "13d";
  return "11d";
}

export async function GET() {
  try {
    const url =
      `https://api.open-meteo.com/v1/forecast` +
      `?latitude=${LAT}&longitude=${LON}` +
      `&current=temperature_2m,apparent_temperature,relative_humidity_2m,weather_code,is_day` +
      `&timezone=America%2FSao_Paulo`;

    const res = await fetch(url, { next: { revalidate: 300 } });
    if (!res.ok) throw new Error(`open-meteo ${res.status}`);

    const data = await res.json();
    const c = data.current;

    const temp = Math.round(c.temperature_2m);
    const feelsLike = Math.round(c.apparent_temperature);
    const humidity = c.relative_humidity_2m;
    const code = c.weather_code as number;
    const isDay = c.is_day === 1;
    const description = WMO_DESCRIPTIONS[code] ?? "condição desconhecida";
    const icon = wmoIcon(code, isDay);

    return NextResponse.json({
      city: "Quedas do Iguaçu",
      temp,
      feelsLike,
      humidity,
      description,
      icon,
      isCold: temp < COLD_THRESHOLD,
      isDay,
    });
  } catch (error) {
    console.error("[weather]", error);
    return NextResponse.json({ error: "Failed to fetch weather" }, { status: 502 });
  }
}
