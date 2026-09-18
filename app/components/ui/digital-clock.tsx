import { useEffect, useState } from "react";
import { Clock } from "lucide-react";
import { useSkyTheme } from "../sky-theme-context";

export function DigitalClock() {
  const { period } = useSkyTheme();
  const [mounted, setMounted] = useState(false);
  const [time, setTime] = useState<Date>(new Date());
  const [is24Hour, setIs24Hour] = useState(true);

  useEffect(() => {
    setMounted(true);
    setTime(new Date());
    const interval = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  if (!mounted) {
    return (
      <div className="fixed top-3 sm:top-4 right-3 sm:right-6 z-40 pointer-events-auto">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-card/85 backdrop-blur-md border border-border/80 shadow-md text-xs text-muted-foreground">
          <Clock className="w-3.5 h-3.5 text-muted-foreground" />
          <span className="font-mono font-medium tracking-wider">--:--:--</span>
        </div>
      </div>
    );
  }

  // Calculate hours, minutes, seconds
  let hours = time.getHours();
  const minutes = String(time.getMinutes()).padStart(2, "0");
  const seconds = String(time.getSeconds()).padStart(2, "0");
  let ampm = "";

  if (!is24Hour) {
    ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12 || 12;
  }
  const hoursStr = String(hours).padStart(2, "0");

  // Date formatting (e.g. Fri, 18 Sep)
  const dayName = time.toLocaleDateString("en-US", { weekday: "short" });
  const dateStr = time.toLocaleDateString("en-US", { day: "numeric", month: "short" });

  // Timezone display (e.g. WIB or GMT+7)
  const offset = -time.getTimezoneOffset() / 60;
  const tzLabel = offset === 7 ? "WIB" : offset >= 0 ? `GMT+${offset}` : `GMT${offset}`;

  // Period label
  const periodMap: Record<string, string> = {
    dawn: "Dawn",
    day: "Day",
    sunset: "Sunset",
    night: "Night",
  };
  const activePeriodLabel = periodMap[period] || "Live";

  return (
    <div className="fixed top-3 sm:top-4 right-3 sm:right-6 z-40 pointer-events-auto">
      <button
        type="button"
        onClick={() => setIs24Hour(!is24Hour)}
        title="Click to toggle 24h / 12h clock format"
        className="group flex items-center gap-2 sm:gap-2.5 px-3 sm:px-3.5 py-1.5 sm:py-2 rounded-full bg-card/85 hover:bg-card/95 backdrop-blur-md border border-border/80 hover:border-primary/50 shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer select-none"
      >
        {/* Real-time pulsing green indicator */}
        <span className="relative flex h-2 w-2 shrink-0">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
        </span>

        <Clock className="w-3.5 h-3.5 text-primary shrink-0 transition-transform group-hover:rotate-12 duration-200" />

        {/* Date: visible on sm screens and larger */}
        <span className="text-[11px] font-medium text-muted-foreground hidden sm:inline border-r border-border/60 pr-2">
          {dayName}, {dateStr}
        </span>

        {/* Digital Time with monospace numbers to eliminate jitter */}
        <div className="flex items-center text-xs sm:text-sm font-mono font-bold tracking-wider text-foreground">
          <span>{hoursStr}</span>
          <span className="text-primary mx-0.5 animate-pulse">:</span>
          <span>{minutes}</span>
          <span className="text-primary/70 mx-0.5 animate-pulse">:</span>
          <span className="text-muted-foreground text-[10px] sm:text-xs">{seconds}</span>
          {!is24Hour && (
            <span className="text-[10px] font-sans font-semibold text-primary ml-1 uppercase">
              {ampm}
            </span>
          )}
        </div>

        {/* Timezone */}
        <span className="text-[10px] font-mono text-muted-foreground/80 hidden xs:inline border-l border-border/60 pl-1.5 sm:pl-2">
          {tzLabel}
        </span>

        {/* Period badge */}
        <span className="text-[9px] font-semibold px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20 hidden md:inline-block uppercase tracking-wider">
          {activePeriodLabel}
        </span>
      </button>
    </div>
  );
}
