import { createContext, useContext, useEffect, useState } from "react";

export type TimePeriod = "dawn" | "day" | "sunset" | "night";
export type WeatherType = "clear" | "rain" | "snow" | "fog" | "overcast";
export type MoonPhase = "crescent" | "quarter" | "gibbous" | "full";

interface SkyThemeCtx {
  period: TimePeriod;
  weather: WeatherType;
  moonPhase: MoonPhase;
  forcedPeriod: TimePeriod | "auto";
  forcedWeather: WeatherType | "auto";
  forcedMoonPhase: MoonPhase | "auto";
  setForcedPeriod: (p: TimePeriod | "auto") => void;
  setForcedWeather: (w: WeatherType | "auto") => void;
  setForcedMoonPhase: (m: MoonPhase | "auto") => void;
}

export const SkyThemeContext = createContext<SkyThemeCtx>({
  period: "day",
  weather: "clear",
  moonPhase: "crescent",
  forcedPeriod: "auto",
  forcedWeather: "auto",
  forcedMoonPhase: "auto",
  setForcedPeriod: () => {},
  setForcedWeather: () => {},
  setForcedMoonPhase: () => {},
});

export function useSkyTheme() {
  return useContext(SkyThemeContext);
}

function getTimePeriod(hour: number): TimePeriod {
  if (hour >= 4 && hour < 6) return "dawn";
  if (hour >= 6 && hour < 15) return "day";
  if (hour >= 15 && hour < 19) return "sunset";
  return "night";
}

const PHASES: MoonPhase[] = ["crescent", "quarter", "gibbous", "full"];

export function SkyThemeProvider({ children }: { children: React.ReactNode }) {
  const [hour, setHour] = useState(() => new Date().getHours());
  const [forcedPeriod, setForcedPeriod] = useState<TimePeriod | "auto">("auto");
  const [forcedWeather, setForcedWeather] = useState<WeatherType | "auto">("auto");
  const [forcedMoonPhase, setForcedMoonPhase] = useState<MoonPhase | "auto">("auto");

  useEffect(() => {
    const timer = setInterval(() => setHour(new Date().getHours()), 60_000);
    return () => clearInterval(timer);
  }, []);

  // Randomize atmospheric conditions upon initial site entry
  useEffect(() => {
    const PERIODS: TimePeriod[] = ["dawn", "day", "sunset", "night"];
    const WEATHERS: WeatherType[] = ["clear", "rain", "snow"];
    const PHASES: MoonPhase[] = ["crescent", "quarter", "gibbous", "full"];

    const rPeriod = PERIODS[Math.floor(Math.random() * PERIODS.length)];
    const rWeather = WEATHERS[Math.floor(Math.random() * WEATHERS.length)];
    const rPhase = PHASES[Math.floor(Math.random() * PHASES.length)];

    setForcedPeriod(rPeriod);
    setForcedWeather(rWeather);
    setForcedMoonPhase(rPhase);
  }, []);

  const period: TimePeriod = forcedPeriod === "auto" ? getTimePeriod(hour) : forcedPeriod;
  const weather: WeatherType = forcedWeather === "auto" ? "clear" : forcedWeather;
  const moonPhase: MoonPhase =
    forcedMoonPhase === "auto"
      ? PHASES[Math.floor((new Date().getDate() / 7) % 4)] || "crescent"
      : forcedMoonPhase;

  // Inject data-period and data-weather attributes on <html>
  useEffect(() => {
    document.documentElement.setAttribute("data-period", period);
    document.documentElement.setAttribute("data-weather", weather);
  }, [period, weather]);

  return (
    <SkyThemeContext.Provider
      value={{
        period,
        weather,
        moonPhase,
        forcedPeriod,
        forcedWeather,
        forcedMoonPhase,
        setForcedPeriod,
        setForcedWeather,
        setForcedMoonPhase,
      }}
    >
      {children}
    </SkyThemeContext.Provider>
  );
}
