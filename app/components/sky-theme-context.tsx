import { createContext, useContext, useEffect, useState } from "react";

export type TimePeriod = "dawn" | "day" | "sunset" | "night";
export type WeatherType = "clear" | "rain" | "snow" | "fog" | "overcast";

interface SkyThemeCtx {
  period: TimePeriod;
  weather: WeatherType;
  forcedPeriod: TimePeriod | "auto";
  forcedWeather: WeatherType | "auto";
  setForcedPeriod: (p: TimePeriod | "auto") => void;
  setForcedWeather: (w: WeatherType | "auto") => void;
}

export const SkyThemeContext = createContext<SkyThemeCtx>({
  period: "day",
  weather: "clear",
  forcedPeriod: "auto",
  forcedWeather: "auto",
  setForcedPeriod: () => {},
  setForcedWeather: () => {},
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

export function SkyThemeProvider({ children }: { children: React.ReactNode }) {
  const [hour, setHour] = useState(() => new Date().getHours());
  const [forcedPeriod, setForcedPeriod] = useState<TimePeriod | "auto">("auto");
  const [forcedWeather, setForcedWeather] = useState<WeatherType | "auto">("auto");

  useEffect(() => {
    const timer = setInterval(() => setHour(new Date().getHours()), 60_000);
    return () => clearInterval(timer);
  }, []);

  const period: TimePeriod = forcedPeriod === "auto" ? getTimePeriod(hour) : forcedPeriod;
  const weather: WeatherType = forcedWeather === "auto" ? "clear" : forcedWeather;

  // Inject data-period attribute on <html> so CSS vars can respond
  useEffect(() => {
    document.documentElement.setAttribute("data-period", period);
    document.documentElement.setAttribute("data-weather", weather);
  }, [period, weather]);

  return (
    <SkyThemeContext.Provider
      value={{ period, weather, forcedPeriod, forcedWeather, setForcedPeriod, setForcedWeather }}
    >
      {children}
    </SkyThemeContext.Provider>
  );
}
