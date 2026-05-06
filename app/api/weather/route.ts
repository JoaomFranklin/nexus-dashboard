import { NextResponse } from "next/server";

// Quedas do Iguaçu — PR, Brasil
const LAT = -25.4472;
const LON = -53.0108;
const COLD_THRESHOLD = 18;

export async function GET() {
  const apiKey = process.env.OPENWEATHER_API_KEY;

  if (!apiKey) {
    return NextResponse.json(
      { error: "OPENWEATHER_API_KEY not configured" },
      { status: 500 }
    );
  }

  try {
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${LAT}&lon=${LON}&appid=${apiKey}&units=metric&lang=pt_br`;
    const res = await fetch(url, { next: { revalidate: 300 } });
    if (!res.ok) throw new Error(`OpenWeather error: ${res.status}`);
    const data = await res.json();

    const temp = Math.round(data.main.temp);
    const feelsLike = Math.round(data.main.feels_like);
    const now = Math.floor(Date.now() / 1000);
    const isDay = now >= data.sys.sunrise && now <= data.sys.sunset;

    return NextResponse.json({
      city: "Quedas do Iguaçu",
      temp,
      feelsLike,
      humidity: data.main.humidity,
      description: data.weather[0].description,
      icon: data.weather[0].icon,
      isCold: temp < COLD_THRESHOLD,
      isDay,
    });
  } catch (error) {
    console.error("[weather]", error);
    return NextResponse.json({ error: "Failed to fetch weather" }, { status: 502 });
  }
}
