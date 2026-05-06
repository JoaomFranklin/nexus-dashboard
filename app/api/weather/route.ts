import { NextResponse } from "next/server";

const FOZ_LAT = -25.5469;
const FOZ_LON = -54.5882;
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
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${FOZ_LAT}&lon=${FOZ_LON}&appid=${apiKey}&units=metric&lang=pt_br`;
    const res = await fetch(url, { next: { revalidate: 300 } });

    if (!res.ok) throw new Error(`OpenWeather API error: ${res.status}`);

    const data = await res.json();

    const temp = Math.round(data.main.temp);
    const feelsLike = Math.round(data.main.feels_like);
    const humidity = data.main.humidity;
    const description = data.weather[0].description;
    const icon = data.weather[0].icon;

    // Day/Night based on sunrise/sunset from the city
    const now = Math.floor(Date.now() / 1000);
    const isDay = now >= data.sys.sunrise && now <= data.sys.sunset;

    return NextResponse.json({
      city: "Foz do Iguaçu",
      temp,
      feelsLike,
      humidity,
      description,
      icon,
      isCold: temp < COLD_THRESHOLD,
      isDay,
      sunrise: data.sys.sunrise,
      sunset: data.sys.sunset,
    });
  } catch (error) {
    console.error("[weather] fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch weather data" },
      { status: 502 }
    );
  }
}
