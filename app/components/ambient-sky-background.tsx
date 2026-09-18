import { useEffect, useRef, useState, type CSSProperties } from "react";
import { useLocation } from "react-router";
import {
  Sun, Sunset, Moon, Sunrise, Cloud, CloudRain, Snowflake, Shuffle, X,
} from "lucide-react";
import {
  useSkyTheme,
  type TimePeriod,
  type WeatherType,
  type MoonPhase,
} from "./sky-theme-context";

/* ─────────────────────────────────────────────
   SKY GRADIENTS
───────────────────────────────────────────── */
const SKY_GRADIENTS: Record<TimePeriod, string> = {
  dawn:   "linear-gradient(to bottom, #1a1a3e 0%, #4a2060 30%, #c4607a 60%, #f4a261 80%, #fce8bb 100%)",
  day:    "linear-gradient(to bottom, #1a6fc4 0%, #4da3e8 30%, #87ceeb 70%, #d0eeff 100%)",
  sunset: "linear-gradient(to bottom, #1a1040 0%, #5a2080 25%, #d45f28 55%, #f08030 75%, #fdd198 100%)",
  night:  "linear-gradient(to bottom, #020510 0%, #0a0c1e 50%, #0f1428 100%)",
};

function getWeatherOverlay(weather: WeatherType, period: TimePeriod): string {
  if (weather === "clear") return "transparent";
  if (weather === "overcast") {
    return period === "day"
      ? "rgba(148, 163, 184, 0.40)" // Soft cool silvery slate mist for daytime
      : period === "sunset"
      ? "rgba(55, 30, 48, 0.60)"   // Dusky twilight overcast
      : period === "dawn"
      ? "rgba(45, 25, 45, 0.55)"   // Morning rose-gray overcast
      : "rgba(15, 20, 35, 0.68)";  // Night overcast
  }
  if (weather === "rain") {
    return period === "day"
      ? "rgba(70, 85, 110, 0.45)"
      : "rgba(20, 28, 45, 0.62)";
  }
  if (weather === "snow") return "rgba(180, 210, 245, 0.18)";
  if (weather === "fog") {
    return period === "day"
      ? "rgba(203, 213, 225, 0.38)"
      : "rgba(148, 163, 184, 0.22)";
  }
  return "transparent";
}

interface WeatherOption { id: WeatherType; label: string; icon: React.ElementType; }
const WEATHER_OPTIONS: WeatherOption[] = [
  { id: "clear",    label: "Cerah",   icon: Sun       },
  { id: "rain",     label: "Hujan",   icon: CloudRain },
  { id: "snow",     label: "Salju",   icon: Snowflake },
  { id: "overcast", label: "Mendung", icon: Cloud     },
];

interface PeriodOption { id: TimePeriod | "auto"; label: string; sub: string; icon: React.ElementType; }
const PERIOD_OPTIONS: PeriodOption[] = [
  { id: "auto",   label: "Auto (Jam Nyata)", sub: "Ikuti jam lokal",  icon: Sun     },
  { id: "dawn",   label: "Subuh / Fajar",    sub: "04:00 – 06:00",   icon: Sunrise },
  { id: "day",    label: "Siang Cerah",       sub: "06:00 – 15:00",   icon: Sun     },
  { id: "sunset", label: "Sore / Senja",      sub: "15:00 – 19:00",   icon: Sunset  },
  { id: "night",  label: "Malam Kosmik",      sub: "19:00 – 04:00",   icon: Moon    },
];

interface MoonPhaseOption { id: MoonPhase | "auto"; label: string; sub: string; }
const MOON_PHASE_OPTIONS: MoonPhaseOption[] = [
  { id: "auto",     label: "Auto Kalender", sub: "Ikuti siklus tanggal" },
  { id: "crescent", label: "Bulan Sabit",   sub: "Crescent moon" },
  { id: "quarter",  label: "Bulan Separuh", sub: "Half / quarter" },
  { id: "gibbous",  label: "Bulan Cembung", sub: "Waxing gibbous" },
  { id: "full",     label: "Bulan Purnama", sub: "Full luminous moon" },
];

/* ─────────────────────────────────────────────
   MOUNTAIN + TREE SILHOUETTE SVG
   Shown for: dawn, sunset, night
───────────────────────────────────────────── */
// Colors of the silhouettes per period
const MOUNTAIN_COLORS: Partial<Record<TimePeriod, { back: string; mid: string; front: string; tree: string }>> = {
  dawn: {
    back:  "#1a0e28",
    mid:   "#120820",
    front: "#0d0518",
    tree:  "#08030e",
  },
  day: {
    back:  "#1a3a7a",
    mid:   "#0f2758",
    front: "#091a3e",
    tree:  "#051230",
  },
  sunset: {
    back:  "#1a0a2e",
    mid:   "#100620",
    front: "#0a0316",
    tree:  "#060110",
  },
  night: {
    back:  "#07091a",
    mid:   "#050714",
    front: "#03050e",
    tree:  "#020308",
  },
};

/* ─────────────────────────────────────────────
   SCENERY SVG ASSETS (House, Shelter, Rooster, Barn, Goat, Lion, Bird)
   Living activities tailored per time period:
   - Dawn:   Rooster crowing, lit house & smoke, waking goat, morning birds
   - Day:    Unlit house, active barn & shelter, grazing goats, soaring birds
   - Sunset: Unlit house, barn, goat walking home, majestic lion on ridge, homeward birds
   - Night:  Warm lit house & chimney smoke, night shelter, noble lion sentinel under moon, fireflies
───────────────────────────────────────────── */

type MountainPalette = { back: string; mid: string; front: string; tree: string };

/* ─────────────────────────────────────────────
   HANDCRAFTED LANDSCAPE ELEMENTS
   Proportional, lightweight, minimalist vector silhouettes
───────────────────────────────────────────── */

function AlpineCabin({
  x,
  y,
  isLit,
  c,
}: {
  x: number;
  y: number;
  isLit: boolean;
  c: MountainPalette;
}) {
  return (
    <g transform={`translate(${x}, ${y})`}>
      {/* Ground warm glow when illuminated at dawn/night */}
      {isLit && (
        <ellipse
          cx="17"
          cy="23"
          rx="20"
          ry="4"
          fill="#f59e0b"
          opacity={0.3}
          style={{ filter: "drop-shadow(0 0 8px rgba(245, 158, 11, 0.5))" }}
        />
      )}

      {/* Chimney smoke puffs (when lit) */}
      {isLit && (
        <g style={{ animation: "chimneySmoke 3s ease-in-out infinite" }}>
          <circle cx="23" cy="-1" r="1.5" fill="#e2e8f0" opacity={0.6} />
          <circle cx="24.5" cy="-5" r="2.3" fill="#cbd5e1" opacity={0.4} />
          <circle cx="26" cy="-10" r="3.2" fill="#94a3b8" opacity={0.22} />
        </g>
      )}

      {/* Stone Chimney */}
      <rect x="21" y="2" width="3.5" height="9" fill={c.tree} />

      {/* Overhanging Gable Roof */}
      <polygon points="16,3 -1,13 33,13" fill={c.mid} />
      <polygon points="16,5 1,13 31,13" fill={c.tree} />

      {/* Cabin Body */}
      <rect x="3" y="13" width="26" height="11" fill={c.front} />

      {/* Cozy Window */}
      {isLit ? (
        <rect
          x="7"
          y="15.5"
          width="6"
          height="5.5"
          rx="0.5"
          fill="#fde047"
          style={{ filter: "drop-shadow(0 0 6px rgba(253, 224, 71, 0.95))" }}
        />
      ) : (
        <rect x="7" y="15.5" width="6" height="5.5" rx="0.5" fill={c.mid} opacity={0.35} />
      )}

      {/* Doorway */}
      <rect
        x="17.5"
        y="15"
        width="7"
        height="9"
        rx="0.5"
        fill={isLit ? "#f59e0b" : c.mid}
        opacity={isLit ? 0.9 : 0.6}
      />
    </g>
  );
}

function FarmBarn({
  x,
  y,
  c,
}: {
  x: number;
  y: number;
  c: MountainPalette;
}) {
  return (
    <g transform={`translate(${x}, ${y})`}>
      {/* Gambrel Roof */}
      <polygon points="17,1 5,7 2,13 32,13 29,7" fill={c.mid} />
      <polygon points="17,3 6,8 4,13 30,13 28,8" fill={c.tree} />
      {/* Barn Body */}
      <rect x="4" y="13" width="26" height="12" fill={c.front} />
      {/* Loft Window */}
      <rect x="14" y="9" width="6" height="4" rx="0.5" fill={c.mid} />
      {/* Double Doors with X-brace */}
      <rect x="12" y="16" width="10" height="9" fill={c.tree} />
      <line x1="12" y1="16" x2="22" y2="25" stroke={c.front} strokeWidth="1" />
      <line x1="22" y1="16" x2="12" y2="25" stroke={c.front} strokeWidth="1" />
    </g>
  );
}

function RusticFence({
  x,
  y,
  color,
}: {
  x: number;
  y: number;
  color: string;
}) {
  return (
    <g transform={`translate(${x}, ${y})`} stroke={color} strokeWidth="1.2" strokeLinecap="round">
      <line x1="0" y1="2" x2="0" y2="12" strokeWidth="1.8" />
      <line x1="14" y1="0" x2="14" y2="10" strokeWidth="1.8" />
      <line x1="28" y1="-2" x2="28" y2="8" strokeWidth="1.8" />
      <line x1="-2" y1="5" x2="30" y2="1" />
      <line x1="-2" y1="9" x2="30" y2="5" />
    </g>
  );
}

function SoaringBird({
  x,
  y,
  scale = 0.5,
  opacity = 0.75,
  color,
}: {
  x: number;
  y: number;
  scale?: number;
  opacity?: number;
  color: string;
}) {
  return (
    <g transform={`translate(${x}, ${y}) scale(${scale})`} opacity={opacity}>
      <g style={{ animation: "birdGlide 7s ease-in-out infinite" }}>
        <path
          d="M 0,6 Q 7,-1 14,5 Q 21,-1 28,6 Q 19,4 14,8 Q 9,4 0,6 Z"
          fill={color}
        />
      </g>
    </g>
  );
}

function MountainWaterfall({
  x = 952,
  y = 150,
  period,
}: {
  x?: number;
  y?: number;
  period: TimePeriod;
}) {
  const isNight = period === "night";
  const isSunset = period === "sunset";
  const isDawn = period === "dawn";

  const waterColor = isNight
    ? "#38bdf8"
    : isDawn
    ? "#fda4af"
    : isSunset
    ? "#fb923c"
    : "#7dd3fc";

  const foamColor = isNight
    ? "#e0f2fe"
    : isSunset
    ? "#ffedd5"
    : "#ffffff";

  const deepWaterColor = isNight
    ? "#0369a1"
    : isDawn
    ? "#be123c"
    : isSunset
    ? "#c2410c"
    : "#0284c7";

  const wfGradId = `wf-grad-${period}`;
  const wfVeilGradId = `wf-veil-${period}`;

  return (
    <g transform={`translate(${x}, ${y})`}>
      <defs>
        <linearGradient id={wfGradId} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={deepWaterColor} stopOpacity={0.85} />
          <stop offset="25%" stopColor={waterColor} stopOpacity={0.9} />
          <stop offset="50%" stopColor={foamColor} stopOpacity={0.95} />
          <stop offset="85%" stopColor={waterColor} stopOpacity={0.9} />
          <stop offset="100%" stopColor={foamColor} stopOpacity={1} />
        </linearGradient>

        <linearGradient id={wfVeilGradId} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={foamColor} stopOpacity={0.3} />
          <stop offset="45%" stopColor={foamColor} stopOpacity={0.85} />
          <stop offset="100%" stopColor={foamColor} stopOpacity={0.95} />
        </linearGradient>
      </defs>

      {/* ── 1. Deep Rock Gorge Cleft (Dark rugged crevasse behind water) ── */}
      <path
        d="M -9,-6 Q -13,25 -15,55 Q -19,95 -22,135 L 24,135 Q 20,95 17,55 Q 15,25 12,-6 Z"
        fill="#020409"
        opacity={0.85}
      />

      {/* Jagged rock ledges flanking the cascade */}
      <path
        d="M -13,20 L -6,22 L -8,38 L -15,35 Z M 11,18 L 18,21 L 15,36 L 9,33 Z"
        fill="#080c18"
      />
      <path
        d="M -17,80 L -9,82 L -13,105 L -20,102 Z M 13,78 L 21,81 L 17,104 L 10,101 Z"
        fill="#080c18"
      />

      {/* ── 2. Upper Cascading Chute (y=-4 to y=52) ── */}
      {/* Upper water base */}
      <path
        d="M -4,-4 Q -6,24 -8,52 L 10,52 Q 8,24 6,-4 Z"
        fill={`url(#${wfGradId})`}
      />
      {/* Upper fluid veil shimmer — pure opacity glisten, zero movement */}
      <path
        d="M -2,-4 Q -5,22 -6,52 L 8,52 Q 6,22 4,-4 Z"
        fill={`url(#${wfVeilGradId})`}
        style={{ animation: "waterfallGlisten 2.6s ease-in-out infinite" }}
      />
      {/* Crest foam at lip */}
      <ellipse cx="1" cy="-3" rx="6" ry="1.8" fill={foamColor} opacity={0.95} />

      {/* ── 3. Middle Rock Shelf & Breaking Cataract (y=50 to y=60) ── */}
      <path
        d="M -12,50 L 14,50 L 12,57 L -10,56 Z"
        fill="#050812"
        opacity={0.95}
      />
      {/* Shelf whitewater froth — completely stationary */}
      <ellipse
        cx="1"
        cy="52"
        rx="13"
        ry="3.2"
        fill={foamColor}
        style={{ filter: "drop-shadow(0 0 4px rgba(255,255,255,0.7))" }}
      />
      <ellipse cx="-5" cy="53" rx="5.5" ry="2" fill={foamColor} opacity={0.9} />
      <ellipse cx="7" cy="53" rx="6" ry="2" fill={foamColor} opacity={0.9} />

      {/* ── 4. Lower Plunge Veil (y=54 to y=134) — Graceful Expanding Water Sheet ── */}
      {/* Broad curtain of rushing water */}
      <path
        d="M -8,54 Q -12,92 -18,134 L 20,134 Q 15,92 10,54 Z"
        fill={`url(#${wfGradId})`}
      />
      {/* Inner sheen ribbons — pure opacity glisten, NO transform/wobble */}
      <path
        d="M -5,55 Q -9,94 -14,134 L 16,134 Q 12,94 7,55 Z"
        fill={`url(#${wfVeilGradId})`}
        style={{ animation: "waterfallGlisten 2.2s ease-in-out infinite" }}
      />
      <path
        d="M -2,56 Q -5,95 -8,134 L 10,134 Q 7,95 4,56 Z"
        fill={foamColor}
        opacity={0.65}
        style={{ animation: "waterfallGlisten 2.2s ease-in-out infinite 1.1s" }}
      />

      {/* ── 5. Plunge Pool Splash, Concentric Expanding Rings & Mist ── */}
      {/* Concentric expanding ripples */}
      <g transform="translate(1, 134)">
        <ellipse
          cx="0"
          cy="0"
          rx="22"
          ry="5.5"
          fill="none"
          stroke={foamColor}
          strokeWidth="1.2"
          style={{
            animation: "waterfallSplash 1.8s ease-out infinite",
            transformBox: "fill-box",
            transformOrigin: "center",
          }}
        />
        <ellipse
          cx="0"
          cy="0"
          rx="22"
          ry="5.5"
          fill="none"
          stroke={foamColor}
          strokeWidth="1.0"
          style={{
            animation: "waterfallSplash 1.8s ease-out infinite 0.9s",
            transformBox: "fill-box",
            transformOrigin: "center",
          }}
        />
      </g>

      {/* Foaming plunge pool basin */}
      <ellipse
        cx="1"
        cy="133"
        rx="20"
        ry="5"
        fill={foamColor}
        opacity={0.95}
        style={{ filter: "drop-shadow(0 0 10px rgba(255,255,255,0.9))" }}
      />
      <ellipse cx="-6" cy="134" rx="10" ry="3.2" fill={foamColor} opacity={0.8} />
      <ellipse cx="8" cy="134" rx="11" ry="3.2" fill={foamColor} opacity={0.8} />

      {/* Rising fine mist spray vapor */}
      <ellipse
        cx="1"
        cy="122"
        rx="28"
        ry="10"
        fill={isNight ? "#93c5fd" : "#ffffff"}
        opacity={0.32}
        style={{
          filter: "blur(7px)",
          animation: "waterfallMist 3.2s ease-in-out infinite alternate",
        }}
      />
    </g>
  );
}

function MountainLake({
  period,
  c,
}: {
  period: TimePeriod;
  c: MountainPalette;
}) {
  const isNight = period === "night";
  const isSunset = period === "sunset";
  const isDawn = period === "dawn";
  const lakeGradId = `lake-grad-${period}`;

  return (
    <g>
      <defs>
        <linearGradient id={lakeGradId} x1="0%" y1="0%" x2="0%" y2="100%">
          {isNight && (
            <>
              <stop offset="0%" stopColor="#0a1628" stopOpacity="0.95" />
              <stop offset="50%" stopColor="#0f2445" stopOpacity="0.88" />
              <stop offset="100%" stopColor="#050d1a" stopOpacity="0.98" />
            </>
          )}
          {isDawn && (
            <>
              <stop offset="0%" stopColor="#4a1838" stopOpacity="0.92" />
              <stop offset="45%" stopColor="#83284a" stopOpacity="0.85" />
              <stop offset="100%" stopColor="#f4a261" stopOpacity="0.75" />
            </>
          )}
          {period === "day" && (
            <>
              <stop offset="0%" stopColor="#0284c7" stopOpacity="0.92" />
              <stop offset="50%" stopColor="#38bdf8" stopOpacity="0.88" />
              <stop offset="100%" stopColor="#0369a1" stopOpacity="0.95" />
            </>
          )}
          {isSunset && (
            <>
              <stop offset="0%" stopColor="#581c3f" stopOpacity="0.95" />
              <stop offset="50%" stopColor="#c2410c" stopOpacity="0.88" />
              <stop offset="100%" stopColor="#f97316" stopOpacity="0.82" />
            </>
          )}
        </linearGradient>

        <clipPath id="lake-clip">
          <path d="M 410,285 Q 560,268 730,272 Q 900,268 1050,282 Q 930,332 730,338 Q 530,332 410,285 Z" />
        </clipPath>
      </defs>

      {/* Lake Water Basin */}
      <path
        d="M 410,285 Q 560,268 730,272 Q 900,268 1050,282 Q 930,332 730,338 Q 530,332 410,285 Z"
        fill={`url(#${lakeGradId})`}
      />

      {/* Mirrored Reflections */}
      <g clipPath="url(#lake-clip)">
        {/* Mountain ridge mirror reflections */}
        <path
          d="M 400,280 L 490,298 L 580,285 L 670,302 L 770,284 L 860,296 L 950,282 L 1050,288 L 1050,340 L 400,340 Z"
          fill={c.mid}
          opacity={0.32}
        />
        <path
          d="M 420,282 L 530,292 L 620,286 L 710,294 L 800,288 L 890,293 L 980,286 L 1040,290 L 1040,340 L 420,340 Z"
          fill={c.back}
          opacity={0.22}
        />

        {/* Waterfall Stream Reflection */}
        <path
          d="M 948,280 L 944,324 L 958,324 L 954,280 Z"
          fill={isNight ? "#93c5fd" : "#ffffff"}
          opacity={0.38}
          style={{ filter: "blur(2px)" }}
        />

        {/* Sunpath / Moonpath reflection */}
        {isNight && (
          <g style={{ animation: "celestialReflection 4s ease-in-out infinite alternate" }}>
            <ellipse cx="780" cy="292" rx="18" ry="3" fill="#e0e7ff" opacity={0.35} style={{ filter: "blur(2px)" }} />
            <ellipse cx="780" cy="304" rx="28" ry="4" fill="#c7d2fe" opacity={0.30} style={{ filter: "blur(3px)" }} />
            <ellipse cx="780" cy="318" rx="22" ry="3.5" fill="#a5b4fc" opacity={0.25} style={{ filter: "blur(3px)" }} />
          </g>
        )}
        {period === "day" && (
          <g style={{ animation: "celestialReflection 3.5s ease-in-out infinite alternate" }}>
            <ellipse cx="710" cy="288" rx="32" ry="3.5" fill="#ffffff" opacity={0.45} style={{ filter: "blur(2px)" }} />
            <ellipse cx="710" cy="302" rx="42" ry="4.5" fill="#fef08a" opacity={0.38} style={{ filter: "blur(3px)" }} />
            <ellipse cx="710" cy="318" rx="36" ry="4" fill="#ffffff" opacity={0.32} style={{ filter: "blur(2px)" }} />
          </g>
        )}
        {isSunset && (
          <g style={{ animation: "celestialReflection 3.8s ease-in-out infinite alternate" }}>
            <ellipse cx="640" cy="290" rx="30" ry="3.5" fill="#fed7aa" opacity={0.5} style={{ filter: "blur(2px)" }} />
            <ellipse cx="640" cy="306" rx="44" ry="5" fill="#f97316" opacity={0.42} style={{ filter: "blur(3px)" }} />
            <ellipse cx="640" cy="322" rx="36" ry="4" fill="#ea580c" opacity={0.35} style={{ filter: "blur(3px)" }} />
          </g>
        )}
        {isDawn && (
          <g style={{ animation: "celestialReflection 4s ease-in-out infinite alternate" }}>
            <ellipse cx="790" cy="292" rx="26" ry="3.5" fill="#fde68a" opacity={0.45} style={{ filter: "blur(2px)" }} />
            <ellipse cx="790" cy="308" rx="38" ry="4.5" fill="#fb923c" opacity={0.38} style={{ filter: "blur(3px)" }} />
          </g>
        )}

        {/* Shimmering horizontal water ripple highlights */}
        <g stroke="rgba(255, 255, 255, 0.45)" strokeLinecap="round" style={{ animation: "waterRipples 3.5s ease-in-out infinite alternate" }}>
          <line x1="470" y1="286" x2="560" y2="286" strokeWidth="0.9" />
          <line x1="600" y1="289" x2="720" y2="289" strokeWidth="1.1" />
          <line x1="770" y1="287" x2="890" y2="287" strokeWidth="1.0" />
          <line x1="920" y1="289" x2="1010" y2="289" strokeWidth="0.8" />

          <line x1="510" y1="298" x2="630" y2="298" strokeWidth="1.2" />
          <line x1="680" y1="301" x2="830" y2="301" strokeWidth="1.3" />
          <line x1="860" y1="299" x2="960" y2="299" strokeWidth="1.0" />

          <line x1="480" y1="312" x2="590" y2="312" strokeWidth="1.0" />
          <line x1="640" y1="314" x2="780" y2="314" strokeWidth="1.2" />
          <line x1="820" y1="313" x2="940" y2="313" strokeWidth="1.1" />

          <line x1="560" y1="326" x2="700" y2="326" strokeWidth="0.9" />
          <line x1="740" y1="327" x2="870" y2="327" strokeWidth="0.9" />
        </g>
      </g>

      {/* Subtle shoreline edge highlight */}
      <path
        d="M 410,285 Q 560,268 730,272 Q 900,268 1050,282"
        stroke="rgba(255, 255, 255, 0.4)"
        strokeWidth="1.2"
        fill="none"
      />
    </g>
  );
}

function MountainScene({ period }: { period: TimePeriod }) {
  const c = MOUNTAIN_COLORS[period];
  if (!c) return null;

  // The house window glows warm at Dawn and Night, and is turned off during Day and Sunset
  const isHouseLit = period === "night" || period === "dawn";

  return (
    <>
      <svg
        viewBox="0 0 1440 340"
        preserveAspectRatio="none"
        className="w-full h-full"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* ── 1. Grand Alpine Peaks (Back Mountain Range — Varied Majestic Topography) ── */}
        <path
          fill={c.back}
          d="M0,340 L0,205 L55,162 L110,178 L175,105 L210,148 L260,136 L320,186
             L380,132 L440,86 L485,96 L535,52 L595,112 L650,98 L705,168
             L775,66 L825,104 L890,48 L925,58 L975,122 L1045,40 L1105,78
             L1165,56 L1235,96 L1295,70 L1365,118 L1440,82 L1440,340 Z"
        />

        {/* 3D Ridge Facet Shading on iconic alpine summits */}
        <g stroke={c.mid} strokeWidth="1.2" opacity={0.42}>
          <line x1="175" y1="105" x2="190" y2="180" />
          <line x1="535" y1="52" x2="560" y2="152" />
          <line x1="775" y1="66" x2="795" y2="158" />
          <line x1="890" y1="48" x2="910" y2="142" />
          <line x1="1045" y1="40" x2="1070" y2="148" />
          <line x1="1165" y1="56" x2="1185" y2="138" />
          <line x1="1295" y1="70" x2="1312" y2="138" />
        </g>

        {/* ── 2. Mid Mountain Crags & Rugged Escarpments ── */}
        <path
          fill={c.mid}
          d="M0,340 L0,240 L70,198 L140,218 L215,166 L275,212 L350,182 L425,154
             L495,170 L575,126 L635,156 L715,138 L785,176 L865,144 L920,132
             L952,150 L980,136 L1055,164 L1125,106 L1195,146 L1275,118
             L1355,148 L1440,124 L1440,340 Z"
        />

        {/* Mid-mountain rock ridge facets */}
        <g stroke={c.back} strokeWidth="1" opacity={0.35}>
          <line x1="575" y1="126" x2="600" y2="200" />
          <line x1="1125" y1="106" x2="1145" y2="190" />
          <line x1="215" y1="166" x2="235" y2="225" />
        </g>

        {/* ── 3. Cascading Alpine Waterfall (Organic Fluid Cascade) ── */}
        <MountainWaterfall x={952} y={150} period={period} />

        {/* ── 4. Serene Mountain Lake & Mirror Reflections ── */}
        <MountainLake period={period} c={c} />

        {/* ── 5. Soaring Birds across Sky ── */}
        {period === "dawn" && (
          <g>
            <SoaringBird x={480} y={88} scale={0.55} opacity={0.7} color={c.mid} />
            <SoaringBird x={540} y={74} scale={0.42} opacity={0.55} color={c.mid} />
          </g>
        )}
        {period === "day" && (
          <g>
            <SoaringBird x={430} y={65} scale={0.58} opacity={0.75} color={c.mid} />
            <SoaringBird x={590} y={52} scale={0.44} opacity={0.6} color={c.mid} />
            <SoaringBird x={660} y={78} scale={0.48} opacity={0.7} color={c.mid} />
          </g>
        )}
        {period === "sunset" && (
          <g>
            <SoaringBird x={490} y={82} scale={0.55} opacity={0.8} color={c.mid} />
            <SoaringBird x={550} y={68} scale={0.44} opacity={0.65} color={c.mid} />
            <SoaringBird x={595} y={88} scale={0.48} opacity={0.75} color={c.mid} />
          </g>
        )}

        {/* ── 6. Pine trees (left cluster) ── */}
        <g fill={c.tree}>
          <polygon points="30,270 55,210 80,270" />
          <polygon points="40,240 55,190 70,240" />
          <rect x="51" y="270" width="8" height="20" />

          <polygon points="75,275 105,205 135,275" />
          <polygon points="86,245 105,180 124,245" />
          <rect x="101" y="275" width="10" height="20" />

          <polygon points="140,280 162,228 185,280" />
          <polygon points="150,255 162,210 175,255" />
          <rect x="158" y="280" width="8" height="18" />
        </g>

        {/* ── 7. Rustic Fence along hillside ── */}
        <RusticFence x={180} y={266} color={c.tree} />

        {/* ── 8. Cozy Alpine Cabin ── */}
        <AlpineCabin x={220} y={250} isLit={isHouseLit} c={c} />

        {/* ── 9. Meadow Barn (day & sunset) ── */}
        {(period === "day" || period === "sunset") && (
          <FarmBarn x={275} y={258} c={c} />
        )}

        {/* ── 10. Pine trees (right cluster) ── */}
        <g fill={c.tree}>
          <polygon points="1260,280 1285,220 1310,280" />
          <polygon points="1270,253 1285,200 1300,253" />
          <rect x="1281" y="280" width="8" height="20" />

          <polygon points="1305,275 1330,208 1355,275" />
          <polygon points="1316,248 1330,185 1344,248" />
          <rect x="1326" y="275" width="8" height="22" />

          <polygon points="1355,278 1378,222 1400,278" />
          <polygon points="1365,252 1378,203 1391,252" />
          <rect x="1374" y="278" width="8" height="20" />
        </g>

        {/* ── 11. Night Fireflies ── */}
        {period === "night" && (
          <g>
            <circle cx="280" cy="272" r="1.5" fill="#fef08a" opacity={0.85} style={{ filter: "drop-shadow(0 0 4px #fef08a)" }} />
            <circle cx="310" cy="260" r="1.8" fill="#a7f3d0" opacity={0.9} style={{ filter: "drop-shadow(0 0 5px #a7f3d0)" }} />
            <circle cx="210" cy="278" r="1.4" fill="#fef08a" opacity={0.75} style={{ filter: "drop-shadow(0 0 4px #fef08a)" }} />
            <circle cx="1135" cy="264" r="1.6" fill="#fef08a" opacity={0.85} style={{ filter: "drop-shadow(0 0 5px #fef08a)" }} />
            <circle cx="1215" cy="268" r="1.3" fill="#a7f3d0" opacity={0.7} style={{ filter: "drop-shadow(0 0 4px #a7f3d0)" }} />
          </g>
        )}

        {/* ── 12. Front hills (ground silhouette) ── */}
        <path
          fill={c.front}
          d="M0,340 L0,295 Q120,268 240,284 Q360,302 480,278
             Q600,262 720,276 Q840,290 960,270
             Q1080,256 1200,276 Q1320,296 1440,284 L1440,340 Z"
        />
      </svg>
      <style>{`
        @keyframes chimneySmoke {
          0%, 100% { transform: translateY(0) scale(1); opacity: 0.6; }
          50% { transform: translateY(-4px) scale(1.25); opacity: 0.25; }
        }
        @keyframes birdGlide {
          0%, 100% { transform: translate(0, 0); }
          50% { transform: translate(7px, -3.5px); }
        }
      `}</style>
    </>
  );
}

/* ─────────────────────────────────────────────
   2. SKILLS BIOME: THE OBSERVATORY RIDGE
   High-altitude Research Station, Radio Arrays & Telescope Dome
───────────────────────────────────────────── */
function ObservatoryScene({ period }: { period: TimePeriod }) {
  const c = MOUNTAIN_COLORS[period];
  if (!c) return null;

  const isLit = period === "night" || period === "dawn";
  const isNight = period === "night";

  return (
    <svg
      viewBox="0 0 1440 340"
      preserveAspectRatio="none"
      className="w-full h-full"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* ── 1. Far Mountain Ridges ── */}
      <path
        fill={c.back}
        d="M0,340 L0,220 L60,180 L130,195 L220,130 L290,170 L380,120 L470,165
           L560,95 L650,140 L740,110 L830,160 L920,80 L1010,135 L1080,75
           L1170,125 L1260,65 L1350,120 L1440,90 L1440,340 Z"
      />

      {/* ── 2. Mid Mountains - Observatory sits on THIS ridge's crest ── */}
      <path
        fill={c.mid}
        d="M0,340 L0,260 L80,225 L170,245 L260,190 L350,225 L440,175
           L530,205 L620,165 L710,200 L800,158 L890,195 L980,160
           L1070,185 L1160,148 L1250,175 L1340,148 L1440,162 L1440,340 Z"
      />

      {/* ── 3. Observatory Dome sitting ON the mid ridge crest at ~x=620 ── */}
      <g transform="translate(600, 126)">
        {/* Rock base / foundation on the ridge */}
        <polygon points="-14,42 74,42 62,34 -2,34" fill={c.back} opacity={0.65} />
        {/* Observatory cylinder base */}
        <rect x="0" y="18" width="60" height="18" fill={c.tree} rx="2" />
        {/* Collar ring */}
        <rect x="-4" y="16" width="68" height="4" fill={c.mid} rx="1" />
        {/* Geodesic Dome */}
        <path d="M 0,18 A 30,26 0 0,1 60,18 Z" fill={c.tree} />
        {/* Dome shutter slit */}
        <path d="M 25,2 L 35,2 L 35,18 L 25,18 Z" fill={c.back} opacity={0.75} />
        {/* Optical Telescope Laser */}
        {isLit && (
          <g>
            <rect x="27" y="3" width="6" height="13" fill="#67e8f9" opacity={0.9} style={{ filter: "drop-shadow(0 0 8px #22d3ee)" }} />
            <line x1="30" y1="3" x2="30" y2="-55" stroke="#38bdf8" strokeWidth="1.2" opacity={0.6} strokeDasharray="3,2" />
          </g>
        )}
      </g>

      {/* ── 4. Radio Spire Tower on the right ridge crest ~x=920, y=80 ── */}
      <g transform="translate(912, 38)">
        {/* Rock base */}
        <polygon points="-8,48 28,48 22,41 -2,41" fill={c.back} opacity={0.55} />
        {/* Lattice tower legs */}
        <line x1="0" y1="85" x2="10" y2="15" stroke={c.tree} strokeWidth="1.6" />
        <line x1="20" y1="85" x2="10" y2="15" stroke={c.tree} strokeWidth="1.6" />
        <line x1="10" y1="15" x2="10" y2="0" stroke={c.tree} strokeWidth="1.8" />
        {/* Cross struts */}
        <line x1="3" y1="70" x2="17" y2="70" stroke={c.tree} strokeWidth="0.8" />
        <line x1="5" y1="50" x2="15" y2="50" stroke={c.tree} strokeWidth="0.8" />
        <line x1="7" y1="30" x2="13" y2="30" stroke={c.tree} strokeWidth="0.8" />
        {/* Guy wires */}
        <line x1="10" y1="28" x2="-35" y2="85" stroke={c.back} strokeWidth="0.7" opacity={0.5} />
        <line x1="10" y1="28" x2="55" y2="85" stroke={c.back} strokeWidth="0.7" opacity={0.5} />
        {/* Warning Beacon */}
        <circle cx="10" cy="0" r="2.5" fill="#ef4444" style={{ animation: "beaconPulse 1.8s ease-in-out infinite", filter: "drop-shadow(0 0 6px #ef4444)" }} />
      </g>

      {/* ── 5. Radio Dish Antenna Array (Left Ridge at ~x=260, y=190) ── */}
      <g transform="translate(248, 152)">
        <g>
          <line x1="15" y1="30" x2="15" y2="15" stroke={c.tree} strokeWidth="2" />
          <path d="M 0,15 Q 15,2 30,15" stroke={c.tree} strokeWidth="3" fill="none" strokeLinecap="round" />
          <line x1="15" y1="8" x2="15" y2="1" stroke={c.front} strokeWidth="1.2" />
          <circle cx="15" cy="1" r="1.5" fill={isLit ? "#38bdf8" : c.front} />
        </g>
        <g transform="translate(55, -8)">
          <line x1="12" y1="28" x2="12" y2="13" stroke={c.tree} strokeWidth="1.8" />
          <path d="M 0,13 Q 12,2 24,13" stroke={c.tree} strokeWidth="2.5" fill="none" strokeLinecap="round" />
          <line x1="12" y1="7" x2="12" y2="0" stroke={c.front} strokeWidth="1" />
          <circle cx="12" cy="0" r="1.2" fill={isLit ? "#38bdf8" : c.front} />
        </g>
        <g transform="translate(106, 6)">
          <line x1="14" y1="26" x2="14" y2="12" stroke={c.tree} strokeWidth="1.8" />
          <path d="M 0,12 Q 14,2 28,12" stroke={c.tree} strokeWidth="2.5" fill="none" strokeLinecap="round" />
          <line x1="14" y1="6" x2="14" y2="1" stroke={c.front} strokeWidth="1" />
        </g>
      </g>

      {/* Transmission Cable Lines Across Col */}
      <path d="M 360,200 Q 520,245 680,215 Q 840,245 1000,210" stroke={c.back} strokeWidth="0.9" fill="none" opacity={0.45} />

      {/* ── 6. Research Station / Server Outpost on plateau ── */}
      <g transform="translate(720, 238)">
        <rect x="0" y="6" width="48" height="18" fill={c.front} rx="1" />
        <rect x="4" y="2" width="40" height="4" fill={c.mid} rx="1" />
        <circle cx="36" cy="1" r="4" fill={c.tree} />
        <line x1="12" y1="2" x2="12" y2="-8" stroke={c.tree} strokeWidth="1.2" />
        <circle cx="12" cy="-8" r="1" fill={isLit ? "#10b981" : c.tree} />
        {isLit ? (
          <g>
            <rect x="6" y="10" width="8" height="8" rx="0.5" fill="#38bdf8" style={{ filter: "drop-shadow(0 0 5px rgba(56,189,248,0.8))" }} />
            <rect x="18" y="10" width="8" height="8" rx="0.5" fill="#fde047" style={{ filter: "drop-shadow(0 0 5px rgba(253,224,71,0.8))" }} />
            <rect x="30" y="10" width="8" height="8" rx="0.5" fill="#38bdf8" style={{ filter: "drop-shadow(0 0 5px rgba(56,189,248,0.8))" }} />
          </g>
        ) : (
          <g opacity={0.35}>
            <rect x="6" y="10" width="8" height="8" rx="0.5" fill={c.mid} />
            <rect x="18" y="10" width="8" height="8" rx="0.5" fill={c.mid} />
            <rect x="30" y="10" width="8" height="8" rx="0.5" fill={c.mid} />
          </g>
        )}
      </g>

      {/* ── 7. Pine trees LEFT cluster — foreground, grounded at bottom ── */}
      <g fill={c.tree}>
        <polygon points="25,340 55,265 85,340" />
        <polygon points="38,316 55,250 72,316" />
        <polygon points="80,340 108,270 136,340" />
        <polygon points="92,312 108,255 124,312" />
        <polygon points="130,340 158,268 186,340" />
        <polygon points="143,314 158,256 173,314" />
        {/* Trunks */}
        <rect x="52" y="312" width="6" height="28" fill={c.mid} opacity={0.65} />
        <rect x="105" y="314" width="6" height="26" fill={c.mid} opacity={0.65} />
        <rect x="155" y="316" width="6" height="24" fill={c.mid} opacity={0.65} />
      </g>

      {/* ── 8. Pine trees RIGHT cluster — foreground, grounded at bottom ── */}
      <g fill={c.tree}>
        <polygon points="1268,340 1295,264 1322,340" />
        <polygon points="1280,314 1295,250 1310,314" />
        <polygon points="1316,340 1342,268 1368,340" />
        <polygon points="1328,312 1342,256 1356,312" />
        <polygon points="1372,340 1397,272 1422,340" />
        <polygon points="1384,316 1397,260 1410,316" />
        {/* Trunks */}
        <rect x="1292" y="312" width="6" height="28" fill={c.mid} opacity={0.65} />
        <rect x="1339" y="314" width="6" height="26" fill={c.mid} opacity={0.65} />
        <rect x="1394" y="318" width="6" height="22" fill={c.mid} opacity={0.65} />
      </g>

      {/* Night Fireflies */}
      {isNight && (
        <g>
          <circle cx="280" cy="265" r="1.5" fill="#38bdf8" opacity={0.85} style={{ filter: "drop-shadow(0 0 4px #38bdf8)" }} />
          <circle cx="340" cy="255" r="1.8" fill="#a7f3d0" opacity={0.9} style={{ filter: "drop-shadow(0 0 5px #a7f3d0)" }} />
          <circle cx="710" cy="268" r="1.4" fill="#fef08a" opacity={0.75} style={{ filter: "drop-shadow(0 0 4px #fef08a)" }} />
          <circle cx="1200" cy="260" r="1.6" fill="#38bdf8" opacity={0.85} style={{ filter: "drop-shadow(0 0 5px #38bdf8)" }} />
        </g>
      )}

      {/* ── 9. Front Hills ── */}
      <path
        fill={c.front}
        d="M0,340 L0,295 Q140,272 280,288 Q420,304 560,280
           Q700,268 840,280 Q980,294 1120,272
           Q1260,260 1440,285 L1440,340 Z"
      />
    </svg>
  );
}

/* ─────────────────────────────────────────────
   3. PORTFOLIO BIOME: THE GRAND CANYON VIADUCT
   Monumental Multi-Arch Viaduct, Gorge River & Natural Cliff Detail
───────────────────────────────────────────── */
function ViaductGorgeScene({ period }: { period: TimePeriod }) {
  const c = MOUNTAIN_COLORS[period];
  if (!c) return null;

  const isLit = period === "night" || period === "dawn";

  // Pier x-positions for 8 piers (span = 110px per bay, pier width = 18px)
  const pierXs = [248, 358, 468, 578, 688, 798, 908, 1018, 1128];

  return (
    <svg
      viewBox="0 0 1440 340"
      preserveAspectRatio="none"
      className="w-full h-full"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        {/* Clip arch openings per span — actual SVG clip paths */}
        <clipPath id="archClip">
          <rect x="0" y="0" width="1440" height="340" />
        </clipPath>
      </defs>

      {/* ── 1. Distant plateau / canyon rim (back) ── */}
      <path
        fill={c.back}
        d="M0,340 L0,100 L55,100 L80,118 L130,98 L180,115 L230,88 L280,102
           L330,82 L360,108 L390,180 L420,205 L500,200 L580,205 L660,200
           L740,205 L820,200 L900,205 L980,200 L1060,205 L1100,180
           L1130,108 L1160,88 L1210,105 L1260,90 L1310,112 L1360,95 L1440,100 L1440,340 Z"
      />

      {/* Layered cliff face detail — natural vertical strata */}
      <g fill={c.mid} opacity={0.5}>
        {/* Left cliff face */}
        <polygon points="55,100 80,118 82,240 50,240" />
        <polygon points="130,98 180,115 182,240 128,240" />
        <polygon points="230,88 280,102 282,205 228,205" />
        {/* Right cliff face */}
        <polygon points="1160,88 1210,105 1208,240 1162,240" />
        <polygon points="1260,90 1310,112 1312,240 1258,240" />
        <polygon points="1360,95 1440,100 1440,240 1358,240" />
      </g>

      {/* Cliff ledge detail stripes */}
      <g stroke={c.front} strokeWidth="1" opacity={0.25}>
        <line x1="0" y1="145" x2="240" y2="145" />
        <line x1="0" y1="168" x2="190" y2="168" />
        <line x1="1200" y1="140" x2="1440" y2="140" />
        <line x1="1250" y1="162" x2="1440" y2="162" />
      </g>

      {/* ── 2. Canyon Gorge Floor — visible river ── */}
      {/* Deep gorge shadow */}
      <path
        fill={c.back}
        opacity={0.55}
        d="M 300,340 L 300,220 Q 720,235 1140,220 L 1140,340 Z"
      />
      {/* River channel */}
      <path
        fill={c.mid}
        opacity={0.55}
        d="M 310,340 L 310,260 Q 450,250 590,255 Q 720,258 860,252
           Q 1000,248 1130,258 L 1130,340 Z"
      />
      {/* River shimmer highlights */}
      <g stroke="rgba(255,255,255,0.5)" strokeWidth="1.2" strokeLinecap="round">
        <line x1="360" y1="285" x2="500" y2="280" />
        <line x1="540" y1="278" x2="700" y2="275" />
        <line x1="740" y1="275" x2="900" y2="278" />
        <line x1="940" y1="280" x2="1080" y2="285" />
        <line x1="400" y1="305" x2="560" y2="300" />
        <line x1="620" y1="298" x2="820" y2="298" />
        <line x1="860" y1="300" x2="1040" y2="305" />
      </g>

      {/* Small waterfall on left cliff */}
      <path
        d="M 230,145 Q 225,180 228,220 Q 226,240 230,265"
        stroke="rgba(255,255,255,0.35)"
        strokeWidth="2.5"
        fill="none"
        strokeLinecap="round"
      />
      <path
        d="M 234,150 Q 229,185 232,225 Q 230,245 234,268"
        stroke="rgba(255,255,255,0.2)"
        strokeWidth="1.5"
        fill="none"
        strokeLinecap="round"
      />

      {/* ── 3. Viaduct — pier legs ── */}
      <g fill={c.mid}>
        {pierXs.map((px) => (
          <rect key={px} x={px} y={170} width={18} height={120} rx="1" />
        ))}
      </g>

      {/* Pier cap stones */}
      <g fill={c.tree} opacity={0.7}>
        {pierXs.map((px) => (
          <rect key={px} x={px - 2} y={168} width={22} height={4} rx="1" />
        ))}
      </g>

      {/* Arch soffit between piers (drawn as curved underside openings) */}
      <g fill="none" stroke={c.back} strokeWidth="2" opacity={0.6}>
        {pierXs.slice(0, -1).map((px, i) => {
          const nx = pierXs[i + 1];
          const mx = (px + 18 + nx) / 2;
          const archBot = 228;
          return (
            <path
              key={i}
              d={`M ${px + 18},170 Q ${mx},${archBot} ${nx},170`}
            />
          );
        })}
      </g>

      {/* Viaduct deck — top rail and beam */}
      <rect x="230" y="162" width="980" height="8" fill={c.mid} />
      <rect x="230" y="160" width="980" height="3" fill={c.tree} />
      {/* Parapet railing */}
      <rect x="230" y="155" width="980" height="5" fill={c.front} opacity={0.7} rx="1" />
      {/* Railing posts */}
      {Array.from({ length: 28 }, (_, i) => 230 + i * 35).map((rx) => (
        <rect key={rx} x={rx} y={148} width="3" height="12" fill={c.tree} opacity={0.6} />
      ))}

      {/* Viaduct street lamps when lit */}
      {isLit && (
        <g>
          {pierXs.map((px) => (
            <g key={px}>
              <line x1={px + 9} y1={160} x2={px + 9} y2={150} stroke={c.tree} strokeWidth="1.2" />
              <circle cx={px + 9} cy={149} r="2.2" fill="#fde047" style={{ filter: "drop-shadow(0 0 5px #fde047)" }} />
            </g>
          ))}
        </g>
      )}

      {/* ── 4. Cliff-top structures: Survey tower left plateau ── */}
      <g transform="translate(158, 200)">
        {/* Small guard tower */}
        <polygon points="14,0 0,8 28,8" fill={c.mid} />
        <rect x="2" y="8" width="24" height="14" fill={c.front} />
        <rect x="0" y="8" width="28" height="3" fill={c.tree} opacity={0.5} />
        {isLit ? (
          <rect x="7" y="11" width="6" height="6" fill="#fde047" rx="0.5" style={{ filter: "drop-shadow(0 0 5px #fde047)" }} />
        ) : (
          <rect x="7" y="11" width="6" height="6" fill={c.mid} rx="0.5" opacity={0.3} />
        )}
      </g>

      {/* Right plateau: rock arch formation */}
      <g transform="translate(1220, 168)">
        <ellipse cx="30" cy="18" rx="30" ry="18" fill={c.back} opacity={0.7} />
        <ellipse cx="30" cy="22" rx="18" ry="12" fill={c.mid} opacity={0.4} />
      </g>

      {/* ── 5. Cliffside Foreground Terraces + pine trees ── */}
      {/* Left cliff terrace */}
      <path
        fill={c.front}
        d="M0,340 L0,255 L60,240 L120,250 L185,235 L240,258 L300,265 L300,340 Z"
      />
      {/* Right cliff terrace */}
      <path
        fill={c.front}
        d="M1440,340 L1440,255 L1380,240 L1320,250 L1255,235 L1200,258 L1140,265 L1140,340 Z"
      />

      {/* Left pine trees on terrace */}
      <g fill={c.tree}>
        <polygon points="30,340 58,268 86,340" />
        <polygon points="42,316 58,252 74,316" />
        <polygon points="78,340 106,272 134,340" />
        <polygon points="90,316 106,256 122,316" />
        <polygon points="130,340 154,278 178,340" />
        {/* Trunks */}
        <rect x="55" y="314" width="6" height="26" fill={c.mid} opacity={0.7} />
        <rect x="103" y="318" width="6" height="22" fill={c.mid} opacity={0.7} />
        <rect x="151" y="320" width="6" height="20" fill={c.mid} opacity={0.7} />
      </g>

      {/* Right pine trees on terrace */}
      <g fill={c.tree}>
        <polygon points="1268,340 1294,272 1320,340" />
        <polygon points="1280,316 1294,256 1308,316" />
        <polygon points="1314,340 1340,278 1366,340" />
        <polygon points="1326,316 1340,262 1354,316" />
        <polygon points="1364,340 1388,274 1412,340" />
        {/* Trunks */}
        <rect x="1291" y="314" width="6" height="26" fill={c.mid} opacity={0.7} />
        <rect x="1337" y="318" width="6" height="22" fill={c.mid} opacity={0.7} />
        <rect x="1385" y="320" width="6" height="20" fill={c.mid} opacity={0.7} />
      </g>

      {/* ── 6. Bottom foreground strip ── */}
      <path
        fill={c.front}
        opacity={0.85}
        d="M0,340 L0,310 Q360,300 720,308 Q1080,316 1440,308 L1440,340 Z"
      />
    </svg>
  );
}

/* ─────────────────────────────────────────────
   4. CONTACT BIOME: COASTAL SHORE & LIGHTHOUSE
   Ocean Promontory, Stone Lighthouse, Harbor Pier & Rocky Shore
───────────────────────────────────────────── */
function LighthouseShoreScene({ period }: { period: TimePeriod }) {
  const c = MOUNTAIN_COLORS[period];
  if (!c) return null;

  const isLit = period === "night" || period === "dawn" || period === "sunset";

  return (
    <svg
      viewBox="0 0 1440 340"
      preserveAspectRatio="none"
      className="w-full h-full"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="lhBeamGrad" x1="0%" y1="50%" x2="100%" y2="50%">
          <stop offset="0%" stopColor="#fef08a" stopOpacity="0.85" />
          <stop offset="30%" stopColor="#fde047" stopOpacity="0.45" />
          <stop offset="70%" stopColor="#fef08a" stopOpacity="0.15" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="oceanGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={c.mid} stopOpacity="0.5" />
          <stop offset="100%" stopColor={c.mid} stopOpacity="0.25" />
        </linearGradient>
      </defs>

      {/* ── 1. Distant sea horizon & sea stacks (back) ── */}
      <path
        fill={c.back}
        d="M0,340 L0,245 L80,242 L130,220 L155,242 L200,242 L230,208
           L258,242 L360,244 L600,244 L900,244 L1060,218 L1200,190
           L1320,168 L1440,158 L1440,340 Z"
      />

      {/* Distant island/rock silhouettes */}
      <ellipse cx="420" cy="244" rx="40" ry="8" fill={c.back} opacity={0.7} />
      <ellipse cx="680" cy="246" rx="25" ry="6" fill={c.back} opacity={0.6} />
      <ellipse cx="820" cy="244" rx="18" ry="5" fill={c.back} opacity={0.55} />

      {/* ── 2. Rocky Promontory Cape (right mid-layer) ── */}
      <path
        fill={c.mid}
        d="M 920,340 L 920,268 Q 1020,222 1140,205 L 1280,188 L 1440,178 L 1440,340 Z"
      />
      {/* Cliff face detail on promontory */}
      <g fill={c.back} opacity={0.35}>
        <polygon points="960,268 980,240 1000,268" />
        <polygon points="1020,250 1045,218 1070,250" />
        <polygon points="1090,235 1110,210 1130,235" />
      </g>

      {/* ── 3. Sweeping Beacon Light Beam ── */}
      {isLit && (
        <g transform="translate(1190, 118)">
          <g style={{ animation: "lighthouseBeam 7s ease-in-out infinite", transformOrigin: "0 0" }}>
            <polygon points="0,0 -500,-140 -465,-45" fill="url(#lhBeamGrad)" />
          </g>
          <circle cx="0" cy="0" r="4.5" fill="#ffffff" style={{ filter: "drop-shadow(0 0 12px #fde047)" }} />
          <circle cx="0" cy="0" r="8" fill="#fef08a" opacity={0.65} style={{ filter: "drop-shadow(0 0 20px #f59e0b)" }} />
        </g>
      )}

      {/* ── 4. Tall Stone Lighthouse on promontory ── */}
      <g transform="translate(1176, 108)">
        {/* Tapered tower body */}
        <polygon points="5,95 21,95 18,20 8,20" fill={c.tree} />
        {/* Masonry band details */}
        <polygon points="6,78 20,78 19,64 7,64" fill={c.mid} opacity={0.55} />
        <polygon points="7,50 19,50 18,35 8,35" fill={c.mid} opacity={0.55} />
        {/* Gallery deck balcony */}
        <rect x="4" y="18" width="18" height="3" fill={c.front} rx="0.5" />
        <line x1="4" y1="17" x2="22" y2="17" stroke={c.mid} strokeWidth="0.8" />
        {/* Lantern room */}
        <rect x="7" y="8" width="12" height="10" fill={isLit ? "#fef08a" : c.front} rx="0.5" />
        <rect x="9" y="9" width="8" height="8" fill={isLit ? "#ffffff" : c.tree} rx="0.5" />
        {/* Conical roof */}
        <polygon points="13,0 5,8 21,8" fill={c.front} />
        <line x1="13" y1="0" x2="13" y2="-5" stroke={c.front} strokeWidth="1.2" />
        {/* Keeper's cottage beside tower */}
        <g transform="translate(25, 75)">
          <polygon points="13,0 0,9 26,9" fill={c.mid} />
          <rect x="1" y="9" width="24" height="12" fill={c.front} />
          {isLit ? (
            <rect x="5" y="11" width="6" height="6" fill="#fde047" rx="0.5" style={{ filter: "drop-shadow(0 0 5px #fde047)" }} />
          ) : (
            <rect x="5" y="11" width="6" height="6" fill={c.mid} rx="0.5" opacity={0.3} />
          )}
        </g>
      </g>

      {/* ── 5. Ocean water ── */}
      <path
        d="M 0,250 Q 400,246 800,250 Q 1050,252 1180,270 L 1180,340 L 0,340 Z"
        fill="url(#oceanGrad)"
      />
      {/* Wave shimmer lines */}
      <g stroke="rgba(255,255,255,0.5)" strokeWidth="1.1" strokeLinecap="round">
        <line x1="60" y1="262" x2="210" y2="258" />
        <line x1="260" y1="265" x2="440" y2="261" />
        <line x1="500" y1="263" x2="740" y2="259" />
        <line x1="780" y1="261" x2="900" y2="265" />
        <line x1="120" y1="280" x2="320" y2="276" />
        <line x1="380" y1="278" x2="640" y2="274" />
        <line x1="680" y1="276" x2="870" y2="280" />
        <line x1="160" y1="298" x2="380" y2="294" />
        <line x1="440" y1="292" x2="680" y2="296" />
      </g>

      {/* Ocean buoy */}
      <g transform="translate(560, 270)">
        <polygon points="5,0 0,10 10,10" fill={c.tree} />
        <circle cx="5" cy="-1" r="2" fill="#ef4444" style={{ animation: "beaconPulse 2s ease-in-out infinite", filter: "drop-shadow(0 0 5px #ef4444)" }} />
      </g>
      {/* Second buoy */}
      <g transform="translate(760, 265)">
        <polygon points="4,0 0,8 8,8" fill={c.tree} opacity={0.7} />
        <circle cx="4" cy="-1" r="1.5" fill="#ef4444" opacity={0.7} style={{ animation: "beaconPulse 2.6s ease-in-out infinite", filter: "drop-shadow(0 0 4px #ef4444)" }} />
      </g>

      {/* ── 6. Wooden Harbor Pier / Wharf (Left) ── */}
      <g transform="translate(60, 258)">
        <rect x="0" y="8" width="240" height="6" fill={c.front} rx="1" />
        <rect x="0" y="6" width="240" height="2" fill={c.tree} />
        {[20, 60, 100, 140, 180, 215].map((px) => (
          <g key={px}>
            <rect x={px} y={14} width="5" height="50" fill={c.tree} />
            <line x1={px} y1={18} x2={px + 32} y2={46} stroke={c.mid} strokeWidth="0.8" opacity={0.4} />
          </g>
        ))}
        {/* Bollards */}
        <rect x="200" y="1" width="6" height="7" fill={c.tree} rx="1" />
        <rect x="125" y="1" width="6" height="7" fill={c.tree} rx="1" />
        {/* Pierhead lantern */}
        <g transform="translate(232, 0)">
          <line x1="0" y1="6" x2="0" y2="-12" stroke={c.tree} strokeWidth="1.2" />
          <line x1="0" y1="-12" x2="9" y2="-12" stroke={c.tree} strokeWidth="1.2" />
          {isLit ? (
            <circle cx="9" cy="-9" r="3" fill="#f59e0b" style={{ filter: "drop-shadow(0 0 7px #f59e0b)" }} />
          ) : (
            <circle cx="9" cy="-9" r="2" fill={c.tree} />
          )}
        </g>
        {/* Small boat tied at pier */}
        <path d="M 50,14 Q 90,10 130,14 L 125,22 L 55,22 Z" fill={c.mid} opacity={0.75} />
        <line x1="90" y1="10" x2="90" y2="2" stroke={c.tree} strokeWidth="1.2" />
      </g>

      {/* ── 7. Pine trees grounded LEFT shore (properly anchored) ── */}
      <g fill={c.tree}>
        {/* Main pine cluster — touching shore/ground */}
        <polygon points="300,340 330,268 360,340" />
        <polygon points="313,316 330,252 347,316" />
        <polygon points="352,340 380,270 408,340" />
        <polygon points="365,316 380,256 395,316" />
        <polygon points="400,340 425,274 450,340" />
        <polygon points="413,318 425,262 437,318" />
        {/* Trunks */}
        <rect x="327" y="314" width="6" height="26" fill={c.mid} opacity={0.7} />
        <rect x="377" y="316" width="6" height="24" fill={c.mid} opacity={0.7} />
        <rect x="422" y="318" width="6" height="22" fill={c.mid} opacity={0.7} />
      </g>

      {/* ── 8. Shore rocks LEFT foreground ── */}
      <g fill={c.front}>
        <ellipse cx="42" cy="312" rx="38" ry="18" />
        <ellipse cx="95" cy="320" rx="28" ry="14" />
        <ellipse cx="148" cy="316" rx="20" ry="10" />
        <ellipse cx="200" cy="322" rx="24" ry="12" />
        {/* Smaller pebble rocks */}
        <ellipse cx="68" cy="324" rx="14" ry="7" />
        <ellipse cx="175" cy="328" rx="12" ry="6" />
      </g>

      {/* ── 9. Seabirds silhouettes ── */}
      <g fill="none" stroke={c.tree} strokeWidth="1.2" strokeLinecap="round" opacity={0.7}>
        {/* Bird 1 */}
        <path d="M 350,195 Q 358,191 366,195" />
        <path d="M 366,195 Q 374,191 382,195" />
        {/* Bird 2 */}
        <path d="M 500,178 Q 506,174 512,178" />
        <path d="M 512,178 Q 518,174 524,178" />
        {/* Bird 3 */}
        <path d="M 620,188 Q 627,184 634,188" />
        <path d="M 634,188 Q 641,184 648,188" />
        {/* Bird 4 - small */}
        <path d="M 740,200 Q 745,197 750,200" />
        <path d="M 750,200 Q 755,197 760,200" />
        {/* Bird 5 */}
        <path d="M 440,210 Q 446,207 452,210" />
        <path d="M 452,210 Q 458,207 464,210" />
      </g>

      {/* ── 10. Foreground shore silhouette ── */}
      <path
        fill={c.front}
        d="M0,340 L0,298 Q120,288 240,296 Q380,304 520,292
           Q660,282 800,292 Q940,302 1080,290 Q1220,280 1440,292 L1440,340 Z"
      />
    </svg>
  );
}

/* ─────────────────────────────────────────────
   DYNAMIC BIOME SWITCHER — CINEMATIC SLIDE TRANSITION
   Biomes slide left/right like a horizontal panorama pan
   Order: about(0) → skills(1) → portfolio(2) → contact(3)
───────────────────────────────────────────── */
const BIOME_ORDER = ["about", "skills", "portfolio", "contact"] as const;
type BiomeName = (typeof BIOME_ORDER)[number];

function DynamicBiomeScene({ period }: { period: TimePeriod }) {
  const location = useLocation();
  const path = location.pathname;

  const activeBiome: BiomeName = path.startsWith("/skills")
    ? "skills"
    : path.startsWith("/portfolio")
    ? "portfolio"
    : path.startsWith("/contact")
    ? "contact"
    : "about";

  const activeIdx = BIOME_ORDER.indexOf(activeBiome);

  // Compute per-biome transform: active = center, earlier = left, later = right
  // Inactive scenes slide 60% off-screen in their direction
  function biomeStyle(name: BiomeName): CSSProperties {
    const idx = BIOME_ORDER.indexOf(name);
    const isActive = name === activeBiome;
    const offset = (idx - activeIdx) * 60; // percent units
    return {
      opacity: isActive ? 1 : 0,
      transform: isActive
        ? "translateX(0%) scale(1)"
        : `translateX(${offset}%) scale(0.98)`,
      transition: "opacity 850ms cubic-bezier(0.4, 0, 0.2, 1), transform 850ms cubic-bezier(0.4, 0, 0.2, 1)",
      willChange: "opacity, transform",
      pointerEvents: "none" as const,
    };
  }

  return (
    <div
      className="absolute bottom-0 left-0 right-0 w-full pointer-events-none overflow-hidden"
      style={{ height: "40vh", minHeight: 190 }}
    >
      {/* ── 1. About Scene: Alpine Valley ── */}
      <div className="absolute inset-0 w-full h-full" style={biomeStyle("about")}>
        <MountainScene period={period} />
      </div>

      {/* ── 2. Skills Scene: Tech Observatory Ridge ── */}
      <div className="absolute inset-0 w-full h-full" style={biomeStyle("skills")}>
        <ObservatoryScene period={period} />
      </div>

      {/* ── 3. Portfolio Scene: Grand Canyon Viaduct ── */}
      <div className="absolute inset-0 w-full h-full" style={biomeStyle("portfolio")}>
        <ViaductGorgeScene period={period} />
      </div>

      {/* ── 4. Contact Scene: Coastal Shore & Lighthouse ── */}
      <div className="absolute inset-0 w-full h-full" style={biomeStyle("contact")}>
        <LighthouseShoreScene period={period} />
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   MOON VISUAL COMPONENT
   4 distinct vector moon phases with pure paths
───────────────────────────────────────────── */
function MoonVisual({
  moonPhase,
  size,
  isTwilight = false,
}: {
  moonPhase: MoonPhase;
  size: number;
  isTwilight?: boolean;
}) {
  return (
    <div
      style={{
        width: size,
        height: size,
        filter: isTwilight
          ? "drop-shadow(0 0 10px rgba(224, 231, 255, 0.75)) drop-shadow(0 0 22px rgba(165, 180, 252, 0.35))"
          : "drop-shadow(0 0 16px rgba(199, 210, 254, 0.85)) drop-shadow(0 0 32px rgba(129, 140, 248, 0.4))",
      }}
    >
      <svg viewBox="0 0 100 100" width={size} height={size} xmlns="http://www.w3.org/2000/svg">
        {/* Outer subtle halo */}
        <circle cx="50" cy="50" r="44" fill={isTwilight ? "rgba(199,210,254,0.08)" : "rgba(199,210,254,0.06)"} />

        {/* Crescent Phase (Sabit) */}
        {moonPhase === "crescent" && (
          <>
            <path d="M 50,14 A 36,36 0 0,0 50,86 Q 26,50 50,14 Z" fill="#e8eeff" />
            <circle cx="26" cy="50" r="3.2" fill="rgba(165,180,252,0.4)" />
            <circle cx="32" cy="36" r="2.4" fill="rgba(165,180,252,0.35)" />
            <circle cx="30" cy="64" r="2.8" fill="rgba(165,180,252,0.35)" />
            <circle cx="21" cy="58" r="1.8" fill="rgba(165,180,252,0.3)" />
          </>
        )}

        {/* Quarter / Half Moon Phase (Separuh) */}
        {moonPhase === "quarter" && (
          <>
            <path d="M 50,14 A 36,36 0 0,0 50,86 L 50,14 Z" fill="#e8eeff" />
            <circle cx="35" cy="50" r="3.5" fill="rgba(165,180,252,0.35)" />
            <circle cx="41" cy="35" r="3" fill="rgba(165,180,252,0.3)" />
            <circle cx="37" cy="66" r="2.8" fill="rgba(165,180,252,0.3)" />
            <circle cx="28" cy="54" r="2" fill="rgba(165,180,252,0.25)" />
          </>
        )}

        {/* Gibbous (3/4) Phase (Cembung) */}
        {moonPhase === "gibbous" && (
          <>
            <path d="M 50,14 A 36,36 0 0,0 50,86 Q 74,50 50,14 Z" fill="#e8eeff" />
            <circle cx="42" cy="48" r="4" fill="rgba(165,180,252,0.35)" />
            <circle cx="52" cy="34" r="3.5" fill="rgba(165,180,252,0.3)" />
            <circle cx="48" cy="65" r="3.2" fill="rgba(165,180,252,0.3)" />
            <circle cx="33" cy="52" r="2.5" fill="rgba(165,180,252,0.25)" />
          </>
        )}

        {/* Full Moon Phase */}
        {moonPhase === "full" && (
          <>
            <circle cx="50" cy="50" r="36" fill="#f0f4ff" />
            <circle cx="42" cy="40" r="7" fill="rgba(165,180,252,0.32)" />
            <circle cx="58" cy="44" r="6" fill="rgba(165,180,252,0.28)" />
            <circle cx="48" cy="62" r="8" fill="rgba(165,180,252,0.30)" />
            <circle cx="35" cy="56" r="4.5" fill="rgba(165,180,252,0.25)" />
            <circle cx="62" cy="58" r="5" fill="rgba(165,180,252,0.22)" />
            <circle cx="53" cy="28" r="3.5" fill="rgba(165,180,252,0.2)" />
          </>
        )}
      </svg>
    </div>
  );
}

/* ─────────────────────────────────────────────
   CELESTIAL BODIES (Sun & Moon)
   Time-driven natural positioning:
   - Dawn:   Sun rising low in the east (right horizon)
   - Day:    Sun blazing high in the middle sky
   - Sunset: Sinking sun low on west horizon (left), PLUS twilight moon rising on east (right)
   - Night:  Luminous moon high in the starry sky
───────────────────────────────────────────── */
function CelestialBody({
  period,
  moonPhase,
  weather,
}: {
  period: TimePeriod;
  moonPhase: MoonPhase;
  weather?: WeatherType;
}) {
  return (
    <>
      {/* ── Moon at Night ── */}
      {period === "night" && (
        <div
          className="absolute pointer-events-none select-none"
          style={{
            top: "16%",
            left: "70%",
            transform: "translate(-50%, -50%)",
            width: 84,
            height: 84,
            transition: "all 2.4s ease",
          }}
        >
          <MoonVisual moonPhase={moonPhase} size={84} />
        </div>
      )}

      {/* ── Twilight Moon at Sunset (Menjelang Maghrib) ── */}
      {period === "sunset" && (
        <div
          className="absolute pointer-events-none select-none"
          style={{
            top: "22%",
            left: "76%",
            transform: "translate(-50%, -50%)",
            width: 68,
            height: 68,
            opacity: 0.82,
            transition: "all 2.4s ease",
          }}
        >
          <MoonVisual moonPhase={moonPhase} size={68} isTwilight />
        </div>
      )}

      {/* ── Sinking Sun at Sunset (Menjelang Maghrib di Barat Bawah) ── */}
      {period === "sunset" && (
        <div
          className="absolute pointer-events-none select-none"
          style={{
            top: "66%",
            left: "22%",
            transform: "translate(-50%, -50%)",
            width: 102,
            height: 102,
            transition: "all 2.4s ease",
          }}
        >
          <div
            style={{
              width: 102,
              height: 102,
              filter: "drop-shadow(0 0 24px rgba(239, 68, 68, 0.95)) drop-shadow(0 0 50px rgba(249, 115, 22, 0.55))",
            }}
          >
            <svg viewBox="0 0 100 100" width={102} height={102} xmlns="http://www.w3.org/2000/svg">
              <defs>
                <radialGradient id="cb-set-grad" cx="50%" cy="50%" r="50%">
                  <stop offset="0%"   stopColor="#fff7ed" />
                  <stop offset="35%"  stopColor="#fca5a5" />
                  <stop offset="70%"  stopColor="#ef4444" />
                  <stop offset="100%" stopColor="#b91c1c" />
                </radialGradient>
              </defs>
              <circle cx="50" cy="50" r="48" fill="rgba(248,113,113,0.18)" />
              <circle cx="50" cy="50" r="38" fill="rgba(239,68,68,0.25)" />
              <circle cx="50" cy="50" r="25" fill="url(#cb-set-grad)" />
            </svg>
          </div>
        </div>
      )}

      {/* ── Rising Sun at Dawn (Terbit Rendah di Timur) ── */}
      {period === "dawn" && (
        <div
          className="absolute pointer-events-none select-none"
          style={{
            top: "62%",
            left: "78%",
            transform: "translate(-50%, -50%)",
            width: 94,
            height: 94,
            transition: "all 2.4s ease",
          }}
        >
          <div
            style={{
              width: 94,
              height: 94,
              filter: "drop-shadow(0 0 20px rgba(251, 146, 60, 0.9)) drop-shadow(0 0 40px rgba(244, 63, 94, 0.45))",
            }}
          >
            <svg viewBox="0 0 100 100" width={94} height={94} xmlns="http://www.w3.org/2000/svg">
              <defs>
                <radialGradient id="cb-dawn-grad" cx="50%" cy="50%" r="50%">
                  <stop offset="0%"   stopColor="#fff7ed" />
                  <stop offset="45%"  stopColor="#fdba74" />
                  <stop offset="80%"  stopColor="#f97316" />
                  <stop offset="100%" stopColor="#e11d48" />
                </radialGradient>
              </defs>
              <circle cx="50" cy="50" r="48" fill="rgba(253,186,116,0.18)" />
              <circle cx="50" cy="50" r="38" fill="rgba(244,114,182,0.22)" />
              <circle cx="50" cy="50" r="24" fill="url(#cb-dawn-grad)" />
            </svg>
          </div>
        </div>
      )}

      {/* ── Sun at Day (Tinggi di Tengah Langit) ── */}
      {period === "day" && (
        <div
          className="absolute pointer-events-none select-none"
          style={{
            top: "14%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 104,
            height: 104,
            opacity: weather === "overcast" ? 0.32 : weather === "rain" ? 0.22 : 1,
            transition: "opacity 1.2s ease, transform 2.4s ease",
          }}
        >
          <div
            style={{
              width: 104,
              height: 104,
              filter:
                weather === "overcast"
                  ? "blur(3px) drop-shadow(0 0 16px rgba(255, 255, 255, 0.45))"
                  : "drop-shadow(0 0 22px rgba(251, 191, 36, 0.95)) drop-shadow(0 0 44px rgba(245, 158, 11, 0.55))",
            }}
          >
            <svg viewBox="0 0 100 100" width={104} height={104} xmlns="http://www.w3.org/2000/svg">
              <defs>
                <radialGradient id="cb-sun-grad" cx="50%" cy="50%" r="50%">
                  <stop offset="0%"   stopColor="#ffffff" />
                  <stop offset="35%"  stopColor="#fef08a" />
                  <stop offset="70%"  stopColor="#fbbf24" />
                  <stop offset="100%" stopColor="#f59e0b" />
                </radialGradient>
              </defs>
              <circle cx="50" cy="50" r="48" fill="rgba(253,224,71,0.14)" />
              <circle cx="50" cy="50" r="38" fill="rgba(251,191,36,0.22)" />
              {Array.from({ length: 12 }, (_, i) => {
                const a = (Math.PI / 6) * i;
                return (
                  <line
                    key={i}
                    x1={50 + 26 * Math.cos(a)} y1={50 + 26 * Math.sin(a)}
                    x2={50 + 42 * Math.cos(a)} y2={50 + 42 * Math.sin(a)}
                    stroke="rgba(253,224,71,0.75)" strokeWidth="2.5" strokeLinecap="round"
                  />
                );
              })}
              <circle cx="50" cy="50" r="22" fill="url(#cb-sun-grad)" />
            </svg>
          </div>
        </div>
      )}
    </>
  );
}

/* ─────────────────────────────────────────────
   CROSSFADE SKY (smooth period transitions)
───────────────────────────────────────────── */
function CrossfadeSky({ period }: { period: TimePeriod }) {
  const [layers, setLayers] = useState<{ bg: string; key: number; opacity: number }[]>([
    { bg: SKY_GRADIENTS[period], key: 0, opacity: 1 },
  ]);
  const keyRef = useRef(1);
  const prevPeriod = useRef(period);

  useEffect(() => {
    if (period === prevPeriod.current) return;
    prevPeriod.current = period;
    const newKey = keyRef.current++;
    // Push new layer on top at opacity 0, then fade it in
    setLayers((prev) => [
      ...prev,
      { bg: SKY_GRADIENTS[period], key: newKey, opacity: 0 },
    ]);
    // rAF to trigger transition
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setLayers((prev) =>
          prev.map((l) => (l.key === newKey ? { ...l, opacity: 1 } : l))
        );
        // Remove old layers after transition completes (2.2s)
        setTimeout(() => {
          setLayers([{ bg: SKY_GRADIENTS[period], key: newKey, opacity: 1 }]);
        }, 2400);
      });
    });
  }, [period]);

  return (
    <>
      {layers.map((layer) => (
        <div
          key={layer.key}
          className="absolute inset-0 pointer-events-none"
          style={{
            background: layer.bg,
            opacity: layer.opacity,
            transition: "opacity 2.2s ease",
          }}
        />
      ))}
    </>
  );
}

/* ─────────────────────────────────────────────
   RAIN CANVAS
───────────────────────────────────────────── */
function RainCanvas() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    let W = (canvas.width = window.innerWidth);
    let H = (canvas.height = window.innerHeight);
    const onResize = () => { W = canvas.width = window.innerWidth; H = canvas.height = window.innerHeight; };
    window.addEventListener("resize", onResize);
    const drops = Array.from({ length: 220 }, () => ({
      x: Math.random() * W, y: Math.random() * H,
      len: Math.random() * 18 + 8, speed: Math.random() * 6 + 8,
      opacity: Math.random() * 0.4 + 0.2,
    }));
    let raf: number;
    const tick = () => {
      ctx.clearRect(0, 0, W, H);
      ctx.strokeStyle = "rgba(180,210,255,1)";
      ctx.lineWidth = 0.8;
      drops.forEach((d) => {
        ctx.globalAlpha = d.opacity;
        ctx.beginPath(); ctx.moveTo(d.x, d.y); ctx.lineTo(d.x - 2, d.y + d.len); ctx.stroke();
        d.y += d.speed;
        if (d.y > H + d.len) { d.y = -d.len; d.x = Math.random() * W; }
      });
      ctx.globalAlpha = 1;
      raf = requestAnimationFrame(tick);
    };
    tick();
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", onResize); };
  }, []);
  return <canvas ref={ref} className="absolute inset-0 w-full h-full pointer-events-none" />;
}

/* ─────────────────────────────────────────────
   SNOW CANVAS  (gentle swaying snowfall)
───────────────────────────────────────────── */
function SnowCanvas() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    let W = (canvas.width = window.innerWidth);
    let H = (canvas.height = window.innerHeight);
    const onResize = () => {
      W = canvas.width = window.innerWidth;
      H = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", onResize);

    const flakes = Array.from({ length: 160 }, () => ({
      x: Math.random() * W,
      y: Math.random() * H,
      r: Math.random() * 2.8 + 1.2,
      speedY: Math.random() * 1.5 + 0.7,
      speedX: Math.random() * 0.6 - 0.3,
      swayAmp: Math.random() * 1.8 + 0.6,
      swayFreq: Math.random() * 0.02 + 0.008,
      swayPhase: Math.random() * Math.PI * 2,
      opacity: Math.random() * 0.55 + 0.35,
    }));

    let t = 0;
    let raf: number;
    const tick = () => {
      t += 1;
      ctx.clearRect(0, 0, W, H);
      flakes.forEach((f) => {
        ctx.save();
        ctx.fillStyle = "rgba(255, 255, 255, 1)";
        ctx.globalAlpha = f.opacity;
        ctx.shadowBlur = f.r > 2 ? 6 : 2;
        ctx.shadowColor = "rgba(186, 230, 253, 0.9)";
        ctx.beginPath();
        const sway = Math.sin(t * f.swayFreq + f.swayPhase) * f.swayAmp;
        ctx.arc(f.x + sway, f.y, f.r, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        f.y += f.speedY;
        f.x += f.speedX;

        if (f.y > H + 10) {
          f.y = -10;
          f.x = Math.random() * W;
        }
        if (f.x > W + 10) f.x = -10;
        if (f.x < -10) f.x = W + 10;
      });
      raf = requestAnimationFrame(tick);
    };
    tick();
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
    };
  }, []);
  return <canvas ref={ref} className="absolute inset-0 w-full h-full pointer-events-none" />;
}

/* ─────────────────────────────────────────────
   STARS + METEORS CANVAS
───────────────────────────────────────────── */
function StarsCanvas() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    let W = (canvas.width = window.innerWidth);
    let H = (canvas.height = window.innerHeight);
    const onResize = () => { W = canvas.width = window.innerWidth; H = canvas.height = window.innerHeight; };
    window.addEventListener("resize", onResize);
    const COLS = ["#ffffff", "#e0f2fe", "#fef3c7", "#e0e7ff", "#a5f3fc"];
    const stars = Array.from({ length: Math.min(Math.floor((W * H) / 5500), 200) }, () => ({
      x: Math.random() * W, y: Math.random() * H,
      r: Math.random() * 1.6 + 0.4,
      base: Math.random() * 0.65 + 0.25,
      tw: Math.random() * 0.04 + 0.01,
      off: Math.random() * Math.PI * 2,
      color: COLS[Math.floor(Math.random() * COLS.length)],
    }));
    const meteors: { x: number; y: number; len: number; speed: number; size: number; alpha: number; angle: number }[] = [];
    const spawnMeteor = () => {
      if (meteors.length < 2)
        meteors.push({ x: Math.random() * W * 0.7 + W * 0.1, y: Math.random() * H * 0.35, len: Math.random() * 130 + 70, speed: Math.random() * 14 + 10, size: Math.random() * 1.5 + 1, alpha: 1, angle: Math.PI / 4 });
    };
    const mt = setInterval(() => { if (Math.random() > 0.45) spawnMeteor(); }, 8000);
    let t = 0; let raf: number;
    const tick = () => {
      t += 0.016;
      ctx.clearRect(0, 0, W, H);
      stars.forEach((s) => {
        const a = Math.max(0.1, s.base + Math.sin(t * s.tw * 60 + s.off) * 0.35);
        ctx.globalAlpha = a; ctx.fillStyle = s.color;
        ctx.shadowBlur = s.r > 1.2 ? 5 : 0; ctx.shadowColor = s.color;
        ctx.beginPath(); ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2); ctx.fill();
      });
      meteors.forEach((m, i) => {
        const g = ctx.createLinearGradient(m.x, m.y, m.x - Math.cos(m.angle) * m.len, m.y - Math.sin(m.angle) * m.len);
        g.addColorStop(0, `rgba(255,255,255,${m.alpha})`);
        g.addColorStop(0.4, `rgba(165,243,252,${m.alpha * 0.7})`);
        g.addColorStop(1, "rgba(56,189,248,0)");
        ctx.globalAlpha = m.alpha; ctx.beginPath();
        ctx.moveTo(m.x, m.y); ctx.lineTo(m.x - Math.cos(m.angle) * m.len, m.y - Math.sin(m.angle) * m.len);
        ctx.strokeStyle = g; ctx.lineWidth = m.size; ctx.shadowBlur = 8; ctx.shadowColor = "#38bdf8"; ctx.stroke();
        m.x += Math.cos(m.angle) * m.speed; m.y += Math.sin(m.angle) * m.speed; m.alpha -= 0.018;
        if (m.alpha <= 0) meteors.splice(i, 1);
      });
      ctx.globalAlpha = 1; ctx.shadowBlur = 0;
      raf = requestAnimationFrame(tick);
    };
    tick();
    return () => { cancelAnimationFrame(raf); clearInterval(mt); window.removeEventListener("resize", onResize); };
  }, []);
  return <canvas ref={ref} className="absolute inset-0 w-full h-full pointer-events-none" />;
}

/* ─────────────────────────────────────────────
   AURORA BOREALIS (Northern Lights at Night)
   Multi-layered luminous ribbons, rays & coronal glow
───────────────────────────────────────────── */
function AuroraBands() {
  return (
    <div
      className="absolute top-0 left-0 right-0 h-[70vh] overflow-hidden pointer-events-none select-none"
      style={{ mixBlendMode: "screen" }}
    >
      {/* 1. Deep atmospheric green-cyan coronal glow */}
      <div
        className="absolute -top-24 left-1/2 -translate-x-1/2 w-[130vw] h-[450px]"
        style={{
          background:
            "radial-gradient(ellipse at 50% 30%, rgba(16,185,129,0.38) 0%, rgba(6,182,212,0.25) 35%, rgba(139,92,246,0.18) 65%, transparent 80%)",
          filter: "blur(54px)",
          animation: "auroraPulse 10s ease-in-out infinite alternate",
        }}
      />

      {/* 2. Primary Ribbon: Sweeping Emerald Wave */}
      <div
        className="absolute -top-12 -left-[15%] w-[135%] h-[340px]"
        style={{
          background:
            "radial-gradient(ellipse at 45% 50%, rgba(52,211,153,0.60) 0%, rgba(16,185,129,0.45) 30%, rgba(5,150,105,0.20) 60%, transparent 75%)",
          filter: "blur(38px)",
          animation: "auroraDrift1 16s ease-in-out infinite alternate",
        }}
      />

      {/* 3. Secondary Ribbon: Electric Turquoise & Cyan Wave */}
      <div
        className="absolute -top-16 left-[5%] w-[125%] h-[370px]"
        style={{
          background:
            "radial-gradient(ellipse at 55% 45%, rgba(34,211,238,0.52) 0%, rgba(6,182,212,0.38) 35%, rgba(2,132,199,0.18) 65%, transparent 80%)",
          filter: "blur(42px)",
          animation: "auroraDrift2 20s ease-in-out infinite alternate",
        }}
      />

      {/* 4. Upper Ribbon: Ethereal Violet & Magenta Curtains */}
      <div
        className="absolute -top-8 left-[-5%] w-[120%] h-[320px]"
        style={{
          background:
            "radial-gradient(ellipse at 65% 55%, rgba(168,85,247,0.45) 0%, rgba(139,92,246,0.30) 40%, rgba(236,72,153,0.18) 65%, transparent 80%)",
          filter: "blur(42px)",
          animation: "auroraDrift3 18s ease-in-out infinite alternate",
        }}
      />

      {/* 5. Shimmering Vertical Ray Bands (Rayed Drapery) */}
      <div
        className="absolute top-0 left-0 w-full h-[400px]"
        style={{
          background:
            "repeating-linear-gradient(90deg, transparent 0px, transparent 45px, rgba(110,231,183,0.18) 65px, rgba(34,211,238,0.22) 85px, transparent 115px)",
          filter: "blur(20px)",
          animation: "auroraRays 12s ease-in-out infinite alternate",
        }}
      />
    </div>
  );
}



/* ─────────────────────────────────────────────
   SIMULATION MODAL
───────────────────────────────────────────── */
interface SimulationModalProps {
  forcedPeriod: TimePeriod | "auto";
  forcedWeather: WeatherType | "auto";
  forcedMoonPhase: MoonPhase | "auto";
  onChangePeriod: (p: TimePeriod | "auto") => void;
  onChangeWeather: (w: WeatherType | "auto") => void;
  onChangeMoonPhase: (m: MoonPhase | "auto") => void;
  onClose: () => void;
}

function SimulationModal({
  forcedPeriod,
  forcedWeather,
  forcedMoonPhase,
  onChangePeriod,
  onChangeWeather,
  onChangeMoonPhase,
  onClose,
}: SimulationModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm pointer-events-auto" onClick={onClose}>
      <div className="bg-card text-card-foreground border border-border/80 rounded-2xl shadow-2xl p-5 w-full max-w-sm space-y-4 max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-bold text-sm text-foreground">Simulasi Suasana Langit</h3>
            <p className="text-[11px] text-muted-foreground">Uji tema waktu, cuaca & fase bulan</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors text-sm cursor-pointer" aria-label="Close">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-1.5">
          <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground px-1">Waktu Hari</p>
          {PERIOD_OPTIONS.map((opt) => {
            const Icon = opt.icon;
            const isActive = forcedPeriod === opt.id;
            return (
              <button key={opt.id} onClick={() => onChangePeriod(opt.id)} className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-left text-xs transition-all cursor-pointer ${isActive ? "bg-primary/15 text-primary border border-primary/30 font-semibold" : "hover:bg-muted/70 text-foreground/80 border border-transparent"}`}>
                <Icon className="w-4 h-4 shrink-0" />
                <div className="flex-1"><span className="font-semibold">{opt.label}</span><span className="text-muted-foreground ml-2">{opt.sub}</span></div>
                {isActive && <span className="w-2 h-2 rounded-full bg-primary ml-auto shrink-0" />}
              </button>
            );
          })}
        </div>

        <div className="space-y-2 pt-2 border-t border-border/60">
          <div className="flex items-center justify-between">
            <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Cuaca</p>
            {forcedWeather !== "auto" && <button onClick={() => onChangeWeather("auto")} className="text-[10px] text-primary hover:underline cursor-pointer">Reset</button>}
          </div>
          <div className="grid grid-cols-2 gap-2">
            {WEATHER_OPTIONS.map((opt) => {
              const Icon = opt.icon;
              const isActive = forcedWeather === opt.id;
              return (
                <button key={opt.id} onClick={() => onChangeWeather(opt.id)} className={`flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${isActive ? "bg-primary text-primary-foreground shadow-sm" : "bg-muted/60 text-foreground/80 hover:bg-muted"}`}>
                  <Icon className="w-4 h-4" /><span>{opt.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Moon Phase Selector */}
        <div className="space-y-2 pt-2 border-t border-border/60">
          <div className="flex items-center justify-between">
            <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Fase Bulan (Malam)</p>
            {forcedMoonPhase !== "auto" && <button onClick={() => onChangeMoonPhase("auto")} className="text-[10px] text-primary hover:underline cursor-pointer">Reset</button>}
          </div>
          <div className="grid grid-cols-2 gap-1.5">
            {MOON_PHASE_OPTIONS.map((opt) => {
              const isActive = forcedMoonPhase === opt.id;
              return (
                <button
                  key={opt.id}
                  onClick={() => onChangeMoonPhase(opt.id)}
                  className={`px-2.5 py-1.5 rounded-xl text-left text-xs transition-all cursor-pointer ${
                    isActive
                      ? "bg-primary text-primary-foreground font-semibold shadow-xs"
                      : "bg-muted/60 text-foreground/80 hover:bg-muted"
                  }`}
                >
                  <p className="font-bold text-[11px] leading-tight">{opt.label}</p>
                  <p className="text-[9px] opacity-75">{opt.sub}</p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Randomize Button */}
        <div className="pt-2 border-t border-border/60">
          <button
            onClick={() => {
              const periods: TimePeriod[] = ["dawn", "day", "sunset", "night"];
              const weathers: WeatherType[] = ["clear", "rain", "snow", "overcast"];
              const phases: MoonPhase[] = ["crescent", "quarter", "gibbous", "full"];
              const randP = periods[Math.floor(Math.random() * periods.length)];
              const randW = weathers[Math.floor(Math.random() * weathers.length)];
              const randM = phases[Math.floor(Math.random() * phases.length)];
              onChangePeriod(randP);
              onChangeWeather(randW);
              onChangeMoonPhase(randM);
            }}
            className="w-full flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-bold bg-primary/10 text-primary hover:bg-primary/20 border border-primary/25 shadow-sm transition-all cursor-pointer"
          >
            <Shuffle className="w-3.5 h-3.5" />
            <span>Acak Suasana, Cuaca & Bulan (Random)</span>
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   MAIN COMPONENT
───────────────────────────────────────────── */
export function AmbientSkyBackground() {
  const {
    period,
    weather,
    moonPhase,
    forcedPeriod,
    forcedWeather,
    forcedMoonPhase,
    setForcedPeriod,
    setForcedWeather,
    setForcedMoonPhase,
  } = useSkyTheme();
  const [modalOpen, setModalOpen] = useState(false);
  const isNight = period === "night";
  const hasMountains = true; // all periods have mountains

  const PeriodIcon = period === "dawn" ? Sunrise : period === "day" ? Sun : period === "sunset" ? Sunset : Moon;
  const WeatherIcon = WEATHER_OPTIONS.find((w) => w.id === weather)?.icon ?? Sun;

  return (
    <>
      {/* ── Sky (crossfade on period change) ── */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden select-none">
        <CrossfadeSky period={period} />

        {/* Weather dimmer */}
        {weather !== "clear" && (
          <div
            className="absolute inset-0 pointer-events-none"
            style={{ backgroundColor: getWeatherOverlay(weather, period), transition: "background-color 1.2s ease" }}
          />
        )}

        {/* Night: stars + aurora */}
        {isNight && weather !== "overcast" && weather !== "rain" && (
          <>
            <StarsCanvas />
            <AuroraBands />
          </>
        )}
        {isNight && weather === "overcast" && (
          <div className="absolute inset-0 bg-gradient-to-b from-gray-900/80 to-gray-800/60 pointer-events-none" />
        )}

        {/* Daytime clear clouds */}
        {period === "day" && weather === "clear" && (
          <>
            <div className="absolute top-[8%] left-[5%] w-80 h-24 rounded-full bg-white/60 blur-2xl pointer-events-none" style={{ animation: "fogDrift 35s linear infinite" }} />
            <div className="absolute top-[15%] right-[10%] w-64 h-16 rounded-full bg-white/50 blur-2xl pointer-events-none" style={{ animation: "fogDrift 48s linear infinite reverse" }} />
          </>
        )}

        {/* Daytime overcast / mendung cloud blankets */}
        {period === "day" && weather === "overcast" && (
          <>
            <div className="absolute top-0 left-0 right-0 h-[50%] bg-gradient-to-b from-slate-400/35 via-slate-300/20 to-transparent blur-3xl pointer-events-none" />
            <div className="absolute top-[2%] left-[-10%] w-[120%] h-40 rounded-full bg-slate-200/50 blur-3xl pointer-events-none" style={{ animation: "fogDrift 45s linear infinite" }} />
            <div className="absolute top-[10%] right-[-10%] w-[110%] h-36 rounded-full bg-slate-300/40 blur-3xl pointer-events-none" style={{ animation: "fogDrift 60s linear infinite reverse" }} />
            <div className="absolute top-[18%] left-[8%] w-[85%] h-32 rounded-full bg-white/40 blur-2xl pointer-events-none" />
          </>
        )}

        {/* Dawn horizon glow */}
        {period === "dawn" && (
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[90vw] h-[320px] bg-gradient-to-t from-amber-400/40 via-rose-400/20 to-transparent blur-3xl pointer-events-none" />
        )}

        {/* Sunset glow */}
        {period === "sunset" && (
          <>
            <div className="absolute bottom-0 left-1/4 w-[900px] h-[380px] bg-gradient-to-t from-amber-500/40 via-orange-400/25 to-transparent rounded-full blur-3xl pointer-events-none" />
            <div className="absolute top-12 right-16 w-72 h-72 bg-rose-500/20 rounded-full blur-3xl pointer-events-none" />
          </>
        )}

        {/* ── Sun / Moon in the sky (behind mountains) ── */}
        <CelestialBody period={period} moonPhase={moonPhase} weather={weather} />

        {/* Dynamic Biome Landscapes — distinct scenery per tab with 1000ms organic cross-fade */}
        {hasMountains && <DynamicBiomeScene period={period} />}

        {/* Rain & Snow overlays */}
        {weather === "rain" && <RainCanvas />}
        {weather === "snow" && <SnowCanvas />}
      </div>

      {/* ── Floating pill ── */}
      <div className="fixed bottom-5 left-5 z-40 pointer-events-auto">
        <button
          onClick={() => setModalOpen(true)}
          className="flex items-center gap-2 px-3.5 py-2 rounded-full bg-card/90 backdrop-blur-md border border-border shadow-md hover:shadow-lg hover:scale-105 transition-all text-xs font-semibold cursor-pointer"
        >
          <PeriodIcon className="w-4 h-4 text-primary" />
          <WeatherIcon className="w-3.5 h-3.5 text-muted-foreground" />
          <span className="text-foreground/80 hidden sm:inline">
            {forcedPeriod === "auto" ? "Auto" : PERIOD_OPTIONS.find((p) => p.id === forcedPeriod)?.label?.split(" ")[0]}
          </span>
          {forcedPeriod === "auto" && (
            <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-primary/20 text-primary font-mono font-bold">LIVE</span>
          )}
        </button>
      </div>

      {/* ── Simulation modal ── */}
      {modalOpen && (
        <SimulationModal
          forcedPeriod={forcedPeriod}
          forcedWeather={forcedWeather}
          forcedMoonPhase={forcedMoonPhase}
          onChangePeriod={setForcedPeriod}
          onChangeWeather={setForcedWeather}
          onChangeMoonPhase={setForcedMoonPhase}
          onClose={() => setModalOpen(false)}
        />
      )}
    </>
  );
}
