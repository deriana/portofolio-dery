import { useEffect, useRef, useState } from "react";
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

const WEATHER_OVERLAY: Record<WeatherType, string> = {
  clear:    "transparent",
  rain:     "rgba(30,40,60,0.5)",
  snow:     "rgba(180,210,245,0.18)",
  fog:      "rgba(180,195,210,0.22)",
  overcast: "rgba(50,55,70,0.55)",
};

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

function HouseSVG({
  x,
  y,
  scale = 1.35,
  isLit,
  c,
}: {
  x: number;
  y: number;
  scale?: number;
  isLit: boolean;
  c: MountainPalette;
}) {
  return (
    <g transform={`translate(${x}, ${y}) scale(${scale})`}>
      {/* Ground glow when illuminated */}
      {isLit && (
        <ellipse
          cx="12"
          cy="22.8"
          rx="15"
          ry="3.5"
          fill="#f59e0b"
          opacity={0.32}
          style={{ filter: "drop-shadow(0 0 6px rgba(245, 158, 11, 0.55))" }}
        />
      )}

      {/* Chimney Smoke puffs (only when lit at dawn/night) */}
      {isLit && (
        <g style={{ animation: "chimneySmoke 3s ease-in-out infinite" }}>
          <circle cx="17.2" cy="0.5" r="1.3" fill="#e2e8f0" opacity={0.65} />
          <circle cx="18.2" cy="-3.5" r="2.1" fill="#cbd5e1" opacity={0.4} />
          <circle cx="19.5" cy="-8" r="3" fill="#94a3b8" opacity={0.22} />
        </g>
      )}

      {/* Chimney */}
      <path
        d="M16 3H18.5C18.7761 3 19 3.22386 19 3.5L19 7.63955L15.5 4.83955V3.5C15.5 3.22386 15.7239 3 16 3Z"
        fill={c.tree}
      />

      {/* House Body & Roof (from home-1.svg) */}
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M21.5315 11.5857L20.75 10.9605V21.25H22C22.4142 21.25 22.75 21.5858 22.75 22C22.75 22.4143 22.4142 22.75 22 22.75H2.00003C1.58581 22.75 1.25003 22.4143 1.25003 22C1.25003 21.5858 1.58581 21.25 2.00003 21.25H3.25003V10.9605L2.46855 11.5857C2.1451 11.8445 1.67313 11.792 1.41438 11.4686C1.15562 11.1451 1.20806 10.6731 1.53151 10.4144L9.65742 3.91366C11.027 2.818 12.9731 2.818 14.3426 3.91366L22.4685 10.4144C22.792 10.6731 22.8444 11.1451 22.5857 11.4686C22.3269 11.792 21.855 11.8445 21.5315 11.5857ZM12 6.75004C10.4812 6.75004 9.25003 7.98126 9.25003 9.50004C9.25003 11.0188 10.4812 12.25 12 12.25C13.5188 12.25 14.75 11.0188 14.75 9.50004C14.75 7.98126 13.5188 6.75004 12 6.75004ZM13.7459 13.3116C13.2871 13.25 12.7143 13.25 12.0494 13.25H11.9507C11.2858 13.25 10.7129 13.25 10.2542 13.3116C9.76255 13.3777 9.29128 13.5268 8.90904 13.9091C8.52679 14.2913 8.37773 14.7626 8.31163 15.2542C8.24996 15.7129 8.24999 16.2858 8.25003 16.9507L8.25003 21.25H9.75003H14.25H15.75L15.75 16.9507L15.75 16.8271C15.7498 16.2146 15.7462 15.6843 15.6884 15.2542C15.6223 14.7626 15.4733 14.2913 15.091 13.9091C14.7088 13.5268 14.2375 13.3777 13.7459 13.3116Z"
        fill={c.front}
      />

      {/* Round Window: Lit at Dawn/Night, dark at Day/Sunset */}
      {isLit ? (
        <circle
          cx="12"
          cy="9.5"
          r="1.35"
          fill="#fde047"
          style={{ filter: "drop-shadow(0 0 5px rgba(253, 224, 71, 0.95))" }}
        />
      ) : (
        <circle cx="12" cy="9.5" r="1.25" fill={c.mid} opacity={0.35} />
      )}

      {/* Doorway: Warm amber glow when lit, dark wood when unlit */}
      {isLit ? (
        <path
          d="M12.0494 13.25C12.7142 13.25 13.2871 13.2499 13.7458 13.3116C14.2375 13.3777 14.7087 13.5268 15.091 13.909C15.4732 14.2913 15.6223 14.7625 15.6884 15.2542C15.7462 15.6842 15.7498 16.2146 15.75 16.827L15.75 21.25H8.25L8.25 16.9506C8.24997 16.2858 8.24993 15.7129 8.31161 15.2542C8.37771 14.7625 8.52677 14.2913 8.90901 13.909C9.29126 13.5268 9.76252 13.3777 10.2542 13.3116C10.7129 13.2499 11.2858 13.25 11.9506 13.25H12.0494Z"
          fill="#f59e0b"
          opacity={0.88}
          style={{ filter: "drop-shadow(0 0 5px rgba(245, 158, 11, 0.75))" }}
        />
      ) : (
        <path
          d="M12.0494 13.25C12.7142 13.25 13.2871 13.2499 13.7458 13.3116C14.2375 13.3777 14.7087 13.5268 15.091 13.909C15.4732 14.2913 15.6223 14.7625 15.6884 15.2542C15.7462 15.6842 15.7498 16.2146 15.75 16.827L15.75 21.25H8.25L8.25 16.9506C8.24997 16.2858 8.24993 15.7129 8.31161 15.2542C8.37771 14.7625 8.52677 14.2913 8.90901 13.909C9.29126 13.5268 9.76252 13.3777 10.2542 13.3116C10.7129 13.2499 11.2858 13.25 11.9506 13.25H12.0494Z"
          fill={c.mid}
          opacity={0.65}
        />
      )}
    </g>
  );
}

function AnimalShelterSVG({
  x,
  y,
  scale = 1.0,
  isNight,
  c,
}: {
  x: number;
  y: number;
  scale?: number;
  isNight: boolean;
  c: MountainPalette;
}) {
  return (
    <g transform={`translate(${x}, ${y}) scale(${scale})`}>
      <path
        d="M 7.528,0.895 9,2 h 1 L 11.473,0.896 C 11.689502,0.73373378 12,0.8884387 12,1.159 V 4.5 c 0,0.722 -0.522,1.184 -1,1.573 V 10 l 0.8,2.4 0.706,0.353 c 0.302922,0.151551 0.494181,0.461283 0.494,0.8 C 13,13.8 12.8,14 12.553,14 H 4.25 C 3.017,14 2,13 2,11.713 2,9.5424588 2.4530836,7.9300225 2.745,6.845 2.8910836,6.3020225 3.0352907,5.8946079 3.138,5.614 3.1956028,5.4566256 3.253276,5.3110749 3.33,5.165 3.7788405,4.3104525 5.0743666,4.9556117 4.672,5.833 4.6232251,5.9393571 4.5778358,6.0512046 4.539,6.15 4.4477518,6.3821288 4.325004,6.7430011 4.193,7.234 3.947004,8.1490011 3.674,9.521 3.558,11.367 3.926,9.307 5.98,7.239 7.635,5.758 7.29,5.432 7.001,5.038 7.001,4.5 l 0,-3.342 c 0,-0.2705613 0.3106215,-0.42543084 0.527,-0.263 z"
        fill={c.tree}
      />
      {isNight && (
        <circle
          cx="11.2"
          cy="4.6"
          r="1"
          fill="#fef08a"
          style={{ filter: "drop-shadow(0 0 3px #fef08a)" }}
        />
      )}
    </g>
  );
}

function RoosterSVG({
  x,
  y,
  scale = 0.38,
  c,
}: {
  x: number;
  y: number;
  scale?: number;
  c: MountainPalette;
}) {
  return (
    <g
      transform={`translate(${x}, ${y}) scale(${scale})`}
      style={{ animation: "roosterCrow 4.5s ease-in-out infinite", transformOrigin: "bottom center" }}
    >
      {/* Rustic wooden fence post perch */}
      <rect x="16" y="30" width="3.5" height="14" fill={c.mid} />
      <line x1="8" y1="33" x2="26" y2="33" stroke={c.mid} strokeWidth="2" strokeLinecap="round" />

      {/* Rooster body & feathers (from animal-chicken-rooster.svg) */}
      <path
        d="M31,6.9h-2.8h0c-4,0-7.8,2.2-9.9,5.8l0,0c-0.5,0.8-1.7,0.8-2.1-0.1l-2.7-6.1C12.9,5,11.5,4,9.9,4h0 C7.8,4,6,5.9,6,8.2v7.2c0,4.4,2.4,8.4,6.1,10.4l0.1,0.1c3.1,1.6,6.8,1.6,9.8,0l0.1-0.1c2.8-1.5,4.8-4.1,5.7-7.2 c0.7-2.7,1.7-5.3,3.1-7.6l0.1-0.1h-2.1L31,6.9z"
        fill="none"
        stroke={c.tree}
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <polygon points="6,7 1,10 6,13" fill={c.tree} stroke={c.tree} strokeWidth="1" />
      <path
        d="M4,12.3c0,1.1-0.4,2.1-1,3l0,0C2.2,16.4,3,18,4.3,18h0C5.3,18,6,17.3,6,16.3"
        fill="none"
        stroke={c.tree}
        strokeWidth="2"
      />
      {/* Comb with subtle red crest hint */}
      <path
        d="M13,4h-3v0c0-1.7,1.3-3,3-3h3v0C16,2.7,14.7,4,13,4z"
        fill="#ef4444"
        opacity={0.88}
      />
      <line x1="19" y1="18" x2="24" y2="18" stroke={c.tree} strokeWidth="2" strokeLinecap="round" />
      <path
        d="M12,16v0.5c0,3,2.5,5.5,5.5,5.5h0c2.5,0,4.6-1.7,5.3-4"
        fill="none"
        stroke={c.tree}
        strokeWidth="2"
      />
      <line x1="18" y1="27" x2="18" y2="31" stroke={c.tree} strokeWidth="2" />
      <line x1="15" y1="31" x2="20" y2="31" stroke={c.tree} strokeWidth="2" />
    </g>
  );
}

function FarmBarnSVG({
  x,
  y,
  scale = 1.05,
  c,
}: {
  x: number;
  y: number;
  scale?: number;
  c: MountainPalette;
}) {
  return (
    <g transform={`translate(${x}, ${y}) scale(${scale})`}>
      {/* Gambrel Roof */}
      <polygon points="28,9 16,2 4,9 1,17 31,17" fill={c.mid} stroke={c.tree} strokeWidth="1.5" />
      <polygon points="25,11 16,6 7,11 5,17 27,17" fill={c.tree} />
      {/* Barn Body */}
      <rect x="5" y="17" width="22" height="13" fill={c.front} />
      {/* Hay Window */}
      <rect x="13" y="12" width="6" height="5" fill={c.mid} />
      {/* Double Doors with X-brace */}
      <rect x="11" y="20" width="10" height="10" fill={c.tree} />
      <line x1="11" y1="20" x2="21" y2="30" stroke={c.front} strokeWidth="1.2" />
      <line x1="21" y1="20" x2="11" y2="30" stroke={c.front} strokeWidth="1.2" />
    </g>
  );
}

function FarmGoatSVG({
  x,
  y,
  scale = 0.026,
  flip = false,
  animated = false,
  c,
}: {
  x: number;
  y: number;
  scale?: number;
  flip?: boolean;
  animated?: boolean;
  c: MountainPalette;
}) {
  return (
    <g
      transform={`translate(${x}, ${y}) scale(${flip ? -scale : scale}, ${scale})`}
      style={animated ? { animation: "goatGraze 5s ease-in-out infinite", transformOrigin: "bottom center" } : undefined}
    >
      <circle cx="95.544" cy="120.129" r="6.092" fill={c.tree} />
      <path
        d="M52.036,158.65c1.529,13.043,8.456,25.276,19.531,34.188c1.654,1.332,3.709,2.02,5.784,2.02c1.37,0,2.75-0.3,4.028-0.912 c3.071-1.47,4.979-4.442,4.979-7.756v-19.708c2.89,0.85,5.969,1.582,9.218,2.154v46.601c0,24.491,7.338,47.76,20.436,67.261 l30.402,78.248l-5.061,91.254h-5.504c-3.59,0-6.5,2.91-6.5,6.5s2.91,6.5,6.5,6.5h40.902l7.313-103.351l40.502,90.348h-3.648 c-3.59,0-6.5,2.91-6.5,6.5s2.91,6.5,6.5,6.5h47.245l-30.653-69.636c-6.601-14.988-9.074-26.249-9.987-33.057 c-0.29-2.164-0.415-4.411-0.372-6.679c0.033-1.763,0.161-3.505,0.381-5.196c2.581-3.535,4.789-7.291,6.604-11.219 c15.688,3.727,32.82,5.542,52.244,5.542c8.686,0,17.202-0.698,25.643-2.111c2.37,6.864,6.051,11.126,14.018,17.157 c6.631,5.023,10.526,12.397,10.775,20.338l-19.32,71.86h-6.001c-3.59,0-6.5,2.91-6.5,6.5s2.91,6.5,6.5,6.5h34.024l15.615-53.536 v40.539h-1.31c-3.59,0-6.5,2.91-6.5,6.5s2.91,6.5,6.5,6.5h33.935v-62.789l5.899-49.619c1.415-9.813-2.642-14.166-5.192-15.889 c-6.181-4.178-9.281-11.393-9.464-22.039l2.397-7.32c8.089,16.843,25.315,28.5,45.215,28.5h18.79 c18.397,0,33.311-14.914,33.311-33.311v-6.501h-44.66c-13.181,0-24.049-10.626-24.009-23.807 c0.109-36.64-29.666-66.483-66.281-66.483h-18.033c-0.018,0-0.035-0.001-0.053-0.001h-20.183c-3.59,0-6.5,2.91-6.5,6.5 s2.91,6.5,6.5,6.5h20.183v0.001h0.053c15.166,0.016,29.41,6.717,39.091,18.394c7.306,8.814,11.341,19.66,11.68,30.858h-0.014v3.225 c-0.086,2.594-0.358,5.198-0.848,7.792l-1.846,9.785l-7.802,23.818v1.038c0,15.427,4.98,26.714,14.808,33.556 c0.13,0.471,0.271,1.623-0.018,3.584l-5.979,50.266l-0.046,0.383v50.559h-6.625v-80.289c0-1.725-0.111-3.457-0.331-5.154 l-0.065-0.5c-0.015-0.098-0.028-0.195-0.043-0.291l-0.033-0.209c-0.053-0.33-0.108-0.647-0.163-0.932 c-0.03-0.186-0.063-0.375-0.1-0.561l-0.072-0.371c-0.092-0.451-0.191-0.897-0.291-1.294c-0.115-0.475-0.233-0.948-0.369-1.413 c-0.085-0.317-0.179-0.629-0.286-0.977c-0.105-0.354-0.218-0.712-0.342-1.057c-0.187-0.561-0.39-1.119-0.576-1.611 c-0.069-0.187-0.143-0.367-0.216-0.546l-0.086-0.212c-0.231-0.561-0.476-1.121-0.698-1.586c-0.229-0.494-0.461-0.978-0.734-1.511 c-0.269-0.514-0.549-1.027-0.834-1.517c-1.025-1.769-2.185-3.451-3.506-5.074c-0.302-0.36-0.605-0.721-0.951-1.104l-0.281-0.308 c-0.342-0.379-0.695-0.744-1.06-1.109c-0.329-0.341-0.678-0.679-0.988-0.967c-0.267-0.254-0.533-0.496-0.812-0.737 c-0.32-0.286-0.642-0.56-0.963-0.817c-0.192-0.163-0.387-0.316-0.588-0.473c-0.38-0.311-0.778-0.605-1.181-0.898 c-0.29-0.21-0.58-0.426-0.857-0.652c-0.197-0.16-0.387-0.32-0.577-0.488l-0.33-0.291l-0.024-0.018 c-0.153-0.137-0.305-0.276-0.453-0.418c-0.065-0.064-0.131-0.126-0.197-0.186c-0.194-0.189-0.383-0.379-0.562-0.563 c-0.226-0.234-0.451-0.477-0.656-0.696c-0.662-0.73-1.319-1.544-2.006-2.488c-0.153-0.203-0.298-0.416-0.472-0.668 c-0.55-0.787-1.059-1.589-1.512-2.385l-0.131-0.221c-0.128-0.205-0.248-0.424-0.362-0.635l-0.078-0.14 c-0.17-0.294-0.322-0.589-0.477-0.89l-0.06-0.114c-0.178-0.331-0.348-0.663-0.498-0.978l-0.157-0.33 c-0.112-0.235-0.225-0.469-0.331-0.707l-0.064-0.139c-0.122-0.257-0.239-0.514-0.352-0.773l-0.19-0.443 c-0.125-0.295-0.252-0.595-0.403-0.973c-0.129-0.311-0.26-0.619-0.373-0.93l-0.093-0.238c-0.052-0.128-0.104-0.262-0.15-0.389 l-0.057-0.152c-0.093-0.238-0.178-0.478-0.268-0.732l-0.043-0.117c-0.126-0.347-0.252-0.693-0.387-1.098 c-0.287-0.843-0.556-1.693-0.821-2.572c-0.124-0.408-0.247-0.814-0.361-1.217c-0.271-0.961-0.525-1.92-0.759-2.873 c-0.13-0.531-0.252-1.044-0.366-1.536c-0.568-2.495-1.06-5.1-1.46-7.741l-0.018-0.107c-0.033-0.196-0.06-0.391-0.087-0.582 l-0.071-0.498c-0.048-0.313-0.089-0.621-0.13-0.924l-0.136-1.043c-0.056-0.456-0.11-0.901-0.159-1.333 c-0.237-2.108-0.414-4.181-0.54-6.331c-0.011-0.294-0.023-0.571-0.042-0.832l-0.022-0.547c-0.079-2.461-1.374-4.706-3.467-6.004 c-2.098-1.304-4.695-1.471-6.944-0.443c-8.408,3.834-32.643,10.985-48.985,10.985c-27.25,0-40.015-6.774-46.851-10.402 c-2.933-1.573-6.572-1.003-8.895,1.511c-1.773,1.921-2.313,4.691-1.582,7.201c2.173,7.46,3.889,18.938-0.122,31.518 c-0.317,0.982-0.603,1.808-0.868,2.514c-1.818,4.81-4.362,9.354-7.563,13.507l-0.997,1.294l-0.267,1.61 c-0.461,2.781-0.723,5.673-0.778,8.595c-0.056,2.925,0.107,5.836,0.485,8.654c1.025,7.641,3.761,20.187,10.974,36.566 l22.626,51.397h-9.423l-55.898-124.69l-21.848-51.785c-1.599-3.791-4.133-7.074-7.188-9.828c-5.29-4.77-8.32-11.574-8.32-18.703 v-11.806c0-3.59-2.91-6.5-6.5-6.5s-6.5,2.91-6.5,6.5v10.935c0,11.146,4.418,22.027,12.789,29.385 c1.667,1.467,3.005,3.324,3.868,5.369l11.121,26.36c-32.096-19.458-51.762-54.095-51.762-91.997v-45.336 c0.588,0.012,1.168,0.035,1.764,0.035c0.139,0,0.281,0,0.42-0.001c2.867-0.021,5.702-0.177,8.425-0.464 c9.309-0.979,17.999-5.05,24.734-11.439c2.964-2.813,2.699-7.607-0.604-10.012l-0.005-0.003c-2.571-1.872-6.072-1.557-8.385,0.628 c-4.667,4.412-10.674,7.222-17.102,7.897c-2.305,0.243-4.713,0.375-7.143,0.393c-16.69,0.095-29.545-5.534-37.432-10.258 l-1.542-0.924H54.317c-7.625,0-13.849-6.113-14.028-13.696c-0.024-1.037,0.161-2.086,0.659-2.996 c0.703-1.284,1.815-2.227,3.159-2.69l58.458-22.793c7.017-2.736,14.396-4.124,21.931-4.124c0.4,0,0.801,0.007,1.163,0.022 c3.624,0.167,7.097,1.115,10.323,2.819l0.414,0.219l4.583,1.632l0.596,0.094c3.661,0.58,7.6,1.854,11.389,3.682 c6.84,3.303,11.088,10.693,13.345,15.891c-5.483,1.458-13.937,2.727-20.744-0.561c-3.733-1.802-7.071-4.005-9.758-6.415 c-2.289-2.053-5.744-2.112-8.188-0.245c-3.205,2.449-3.472,7.245-0.465,9.934c3.61,3.229,7.969,6.122,12.759,8.434 c5.047,2.438,10.411,3.31,15.457,3.342l9.134,28.573l8.83,23.377c6.448,17.042,23.022,28.492,41.241,28.492h61.001 c3.59,0,6.5-2.91,6.5-6.5s-2.91-6.5-6.5-6.5h-61.001c-12.848,0-24.535-8.075-29.082-20.091l-8.658-22.897l-8.337-26.079 c5.049-1.234,8.478-2.742,8.816-2.894l4.984-2.237l-1.347-5.295c-0.229-0.896-5.773-22.035-22.335-30.034 c-0.581-0.28-1.166-0.551-1.755-0.811c3.116-4.878,7.065-8.824,11.61-11.5c6.93-4.081,14.814-4.988,22.201-2.553 c7.382,2.433,13.374,7.594,16.874,14.534c2.932,5.813,4.008,12.589,1.532,21.109c-0.896,3.086,0.422,6.385,3.252,7.91 c3.752,2.021,8.417,0.096,9.66-3.98c0.281-0.924,0.471-1.545,0.471-1.545c9.513-28.868-6.234-60.094-35.103-69.606 c-28.87-9.515-60.094,6.234-69.605,35.1c-0.214,0.646-0.403,1.301-0.592,1.956c-6.609,0.66-13.083,2.206-19.319,4.638 l-58.111,22.663c-3.628,1.283-6.729,3.618-8.964,6.745c-2.278,3.169-3.482,6.919-3.482,10.846 C27.285,145.857,38.195,157.487,52.036,158.65z"
        fill={c.tree}
      />
    </g>
  );
}

function LionSVG({
  x,
  y,
  scale = 0.042,
  isNight,
  c,
}: {
  x: number;
  y: number;
  scale?: number;
  isNight: boolean;
  c: MountainPalette;
}) {
  return (
    <g
      transform={`translate(${x}, ${y}) scale(${scale})`}
      style={{
        animation: "lionBreathe 6s ease-in-out infinite",
        transformOrigin: "bottom center",
        filter: isNight ? "drop-shadow(0 0 5px rgba(199, 210, 254, 0.45))" : undefined,
      }}
    >
      <circle cx="78.862" cy="120.651" r="6.544" fill={c.tree} />
      <path
        d="M149.186,142.581c3.355-11.119,5.055-23.169,5.055-35.921v-1.393c0-3.59-2.91-6.5-6.5-6.5s-6.5,2.91-6.5,6.5v1.393 c0,11.479-1.514,22.273-4.502,32.175c-0.988,3.268,0.752,6.732,3.949,7.929C144.195,148.075,148.104,146.167,149.186,142.581z"
        fill={c.tree}
      />
      <path
        d="M135.494,158.274l-0.121-0.065c-2.971-1.617-6.652-0.634-8.5,2.199c-0.775,1.189-1.578,2.348-2.41,3.474 c-2.002,2.709-1.666,6.48,0.857,8.712l0.104,0.091c2.799,2.476,7.148,2.082,9.375-0.918c1.057-1.421,2.072-2.885,3.049-4.388 C139.877,164.255,138.766,160.055,135.494,158.274z"
        fill={c.tree}
      />
      <path
        d="M33.398,156.176c0.463,1.643,0.344,2.854,0.18,4.53c-0.205,2.108-0.463,4.733,0.613,7.798 c2.053,5.852,7.439,9.223,13.645,11.23c-8.186,22.026-4.975,46.711,9.451,71.856c11.658,20.319,26.438,33.735,27.061,34.297 l18.736,16.866l-8.246-23.822c-1.109-3.205-1.453-6.647-1.326-10.044c4.408,13.003,11.623,28.343,22.941,38.308l11.773,58.479 l-6.76,95.412h-4.105c-3.59,0-6.5,2.91-6.5,6.5s2.91,6.5,6.5,6.5h52.215l13.449-90.732l19.213,77.734h-2.529 c-3.59,0-6.5,2.91-6.5,6.5s2.91,6.5,6.5,6.5h53.926l-13.596-115.612c2.744-2.667,5.27-5.542,7.533-8.576 c3.207-4.296,5.879-8.901,8.004-13.741c12.418,3.594,32.164,8.527,65.271,8.527c7.916,0,15.863-0.584,23.705-1.719 c4.105,8.598,9.625,15.563,16.467,20.738c9.289,7.033,14.744,17.385,15.086,28.545l-25.381,68.838h-7.705c-3.59,0-6.5,2.91-6.5,6.5 s2.91,6.5,6.5,6.5h53.516v-0.002h63.68v-52.723l7.822-65.79c1.721-11.864-2.994-16.999-5.963-19.007 c-8.855-5.984-13.26-16.201-13.449-31.211l9.869-30.135l2.627-13.912c1.107-5.874,1.564-11.78,1.402-17.628h0.008v-68.226 c0-18.947-15.51-33.739-34.457-33.941c-10.025-0.106-18.48-6.887-21.125-16.098h28.318c19.113,0,37.48-9.204,50.396-25.252 c2.41-2.997,2.881-7.204,1.199-10.719c-1.588-3.315-4.785-5.376-8.342-5.376h-49.498c-19.127,0-35.301,14.956-35.912,34.073 c-0.641,19.969,15.439,36.413,35.277,36.372c11.631-0.023,21.143,9.934,21.143,21.564v25.527c-1.803-2.807-3.777-5.523-5.938-8.128 c-15.697-18.937-38.807-29.798-63.404-29.798h-28.797c-3.59,0-6.5,2.91-6.5,6.5s2.91,6.5,6.5,6.5h27.781 c19.91,0,39.148,8.079,52.484,22.864c14.619,16.206,20.709,38.035,16.688,59.354l-2.469,13.08L435.619,303.3v1.037 c0,19.934,6.451,34.401,19.135,42.97c0.014,0.012,1.148,1.44,0.408,6.465l-7.902,66.439l-0.045,0.383v40.492h-23.283v-79.943 c0-15.744-7.369-30.549-19.709-39.598c-13.746-10.104-19.508-26.029-21.92-37.617c-1.17-5.578-1.492-9.902-1.58-11.529 c-0.139-2.434-1.479-4.614-3.584-5.834c-2.102-1.217-4.656-1.294-6.811-0.217c-9.379,4.643-33.104,13.426-55.754,13.426 c-20.578,0-40.236-6.697-58.436-19.914c-2.592-1.875-6.057-1.852-8.621,0.056c-2.563,1.905-3.58,5.214-2.525,8.248 c2.531,7.224,5.967,21.767,0.527,38.015c-1.902,5.694-4.717,11.059-8.365,15.945c-2.414,3.236-5.193,6.252-8.262,8.965 l-2.547,2.253l12.67,107.747h-23.385l-25.336-102.501c15.141-18.089,24.033-40.386,25.492-63.909 c0.232-3.742-2.746-6.906-6.494-6.906c-3.422,0-6.268,2.652-6.479,6.066c-1.389,22.512-10.49,43.754-25.98,60.365l-3.127,3.355 l-15.346,103.527H134.5l6.818-96.25l-10.072-50.029l1.596-0.885c1.242-0.689,25.504-14.488,37.992-46.999 c0.168,3.524-0.158,7.106-1.311,10.434l-7.951,22.974l18.355-15.939c1.688-1.465,39.264-34.567,42.516-76.247 c0.299-3.834-2.771-7.096-6.617-7.019c-3.373,0.068-6.084,2.709-6.352,6.071c-1.785,22.299-15.59,42.494-26.068,54.838 c-1.57-12.296-6.822-22.343-7.154-22.969l-9.4-17.695l-2.777,19.844c-5.018,35.861-26.75,53.991-34.672,59.499 c-22.25-13.707-29.055-57.521-29.123-57.978l-2.9-19.544l-9.27,17.448c-0.328,0.617-5.447,10.411-7.09,22.488 c-13.893-17.172-33.273-48.849-20.328-80.591h5.111c20.115,0,37.033-7.825,48.926-22.63c10.783-13.425,16.723-32.189,16.723-52.839 v-6.062c0-6.222-4.715-11.67-10.623-14.614c-4.293-2.14-9.34,0.944-9.34,5.739l0,0c0,2.525,1.457,4.866,3.779,5.857 c1.693,0.723,3.184,1.807,3.184,3.018v6.062c0,28.817-13.789,62.469-52.648,62.469h-1.785c-16.016-1.472-17.547-5.3-17.561-5.338 c-0.123-0.353-0.039-1.222,0.061-2.228c0.072-0.732,0.146-1.563,0.184-2.476H59.18c3.59,0,6.5-2.91,6.5-6.5s-2.91-6.5-6.5-6.5 H43.146c-1.533-2.438-3.527-4.703-6.008-6.765v-3.624c0-2.688,1.582-4.823,2.908-6.141l25.605-26.33 c4.059-4.174,9.727-6.567,15.549-6.567h12.355c3.59,0,6.5-2.91,6.5-6.5s-2.91-6.5-6.5-6.5H81.201c-1.15,0-2.297,0.06-3.436,0.175 c0.563-0.604,1.16-1.18,1.826-1.686l26.594-20.177c9.777-7.417,21.707-11.544,33.979-11.468 c38.365,0.237,69.504,31.522,69.504,69.942v39.866c-11.215-4.382-20.424-13.35-24.822-24.979l-12.16,4.599 c8.221,21.735,29.357,36.338,52.594,36.338h82.789c3.59,0,6.5-2.91,6.5-6.5s-2.91-6.5-6.5-6.5h-82.789 c-0.875,0-1.744-0.035-2.611-0.088v-42.736c0-45.735-37.209-82.944-82.945-82.944c-14.697,0-29.242,4.893-40.951,13.777 L71.734,72.202c-5.861,4.448-9.693,11.122-10.684,18.343c-1.682,1.196-3.268,2.537-4.719,4.028l-25.486,26.21 c-4.326,4.314-6.707,9.755-6.707,15.324v10.292l2.834,1.936C30.441,150.702,32.602,153.34,33.398,156.176z"
        fill={c.tree}
      />
    </g>
  );
}

function FlyingBirdSVG({
  x,
  y,
  scale = 0.038,
  opacity = 0.72,
  c,
}: {
  x: number;
  y: number;
  scale?: number;
  opacity?: number;
  c: MountainPalette;
}) {
  return (
    <g
      transform={`translate(${x}, ${y}) scale(${scale})`}
      opacity={opacity}
      style={{ animation: "birdGlideSlow 7.5s ease-in-out infinite" }}
    >
      <path
        d="M191.179 273.824C240.235 297.511 305.516 282.723 327.848 235.07C343.653 201.345 294.142 174.478 268.869 180.597C249.795 185.215 238.443 210.424 226.139 201.065C216.677 165.605 199.9 119.51 135.192 107.37C114.091 103.412 83.5311 110.64 102.336 135.815C116.496 154.766 137.36 163.983 158.442 173.765C164.792 176.714 169.78 183.842 176.581 185.72C178.199 186.166 181.717 185.007 181.525 186.671C181.105 190.238 113.899 155.977 108.125 179.498C103.955 196.484 152.426 206.208 162.693 208.177C163.338 208.3 167.696 208.583 167.631 209.126C167.291 212.044 128.996 205.366 122.548 219.126C113.925 237.519 146.169 239.099 156.097 238.053C164.394 237.176 172.809 236.947 180.889 235.438C181.156 235.389 194.153 233.997 169.23 238.769C147.16 242.995 90.4779 253.756 88.9641 262.487C87.4503 271.218 95.0462 273.682 99.275 281.556C103.504 289.429 106.52 291.001 110.939 295.051C115.357 299.1 142.753 259.14 172.051 268.915M323.418 199.974C348.126 209.727 352.589 199.404 329.977 213.31M291.997 210.007C291.781 209.411 291.563 208.813 291.345 208.215"
        stroke={c.mid}
        strokeWidth="16"
        strokeLinecap="round"
        strokeLinejoin="round"
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
    <div
      className="absolute bottom-0 left-0 right-0 w-full pointer-events-none"
      style={{ height: "40vh", minHeight: 190 }}
    >
      <svg
        viewBox="0 0 1440 340"
        preserveAspectRatio="none"
        className="absolute bottom-0 left-0 w-full h-full"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* ── 1. Grand Alpine Peaks (Back Mountain Range) ── */}
        <path
          fill={c.back}
          d="M0,340 L0,220 L60,165 L130,195 L220,120 L310,165 L410,95
             L490,135 L580,75 L670,120 L770,55 L860,110 L950,48
             L1040,95 L1130,58 L1220,95 L1310,45 L1390,75 L1440,65 L1440,340 Z"
        />

        {/* Highlighted sharp ridge facets on the back peaks */}
        <g stroke={c.mid} strokeWidth="1" opacity={0.35}>
          <line x1="770" y1="55" x2="790" y2="155" />
          <line x1="950" y1="48" x2="975" y2="140" />
          <line x1="1130" y1="58" x2="1155" y2="150" />
          <line x1="1310" y1="45" x2="1330" y2="130" />
        </g>

        {/* ── 2. Mid Mountain Crags & Rugged Ridges ── */}
        <path
          fill={c.mid}
          d="M0,340 L0,250 L75,210 L160,230 L250,175 L340,205 L440,158
             L530,185 L620,140 L710,170 L800,128 L890,160 L980,122
             L1070,152 L1160,115 L1250,148 L1330,110 L1440,132 L1440,340 Z"
        />

        {/* ── 3. Soaring Birds across Sky (from bird.svg) ── */}
        {period === "dawn" && (
          <g>
            <FlyingBirdSVG x={480} y={92} scale={0.038} opacity={0.7} c={c} />
            <FlyingBirdSVG x={540} y={76} scale={0.032} opacity={0.55} c={c} />
          </g>
        )}
        {period === "day" && (
          <g>
            <FlyingBirdSVG x={430} y={68} scale={0.04} opacity={0.75} c={c} />
            <FlyingBirdSVG x={590} y={54} scale={0.032} opacity={0.6} c={c} />
            <FlyingBirdSVG x={660} y={82} scale={0.036} opacity={0.7} c={c} />
          </g>
        )}
        {period === "sunset" && (
          <g>
            <FlyingBirdSVG x={490} y={85} scale={0.038} opacity={0.8} c={c} />
            <FlyingBirdSVG x={550} y={72} scale={0.032} opacity={0.65} c={c} />
            <FlyingBirdSVG x={595} y={92} scale={0.035} opacity={0.75} c={c} />
          </g>
        )}

        {/* ── 4. Pine trees (left cluster) ── */}
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

        {/* ── 5. Farm Barn (day & sunset) ── */}
        {(period === "day" || period === "sunset") && (
          <FarmBarnSVG x={340} y={250} scale={1.05} c={c} />
        )}

        {/* ── 6. Cozy Hillside House (home-1.svg) ── */}
        <HouseSVG x={210} y={248} scale={1.35} isLit={isHouseLit} c={c} />

        {/* ── 7. Animal Shelter (animal-shelter.svg) ── */}
        {period !== "sunset" && (
          <AnimalShelterSVG x={262} y={262} scale={1.0} isNight={period === "night"} c={c} />
        )}

        {/* ── 8. Rooster Crowing at Dawn (animal-chicken-rooster.svg) ── */}
        {period === "dawn" && (
          <RoosterSVG x={185} y={256} scale={0.38} c={c} />
        )}

        {/* ── 9. Farm Goats Grazing / Moving (animal-domestic-farm.svg) ── */}
        {period === "dawn" && (
          <FarmGoatSVG x={735} y={262} scale={0.026} animated={false} c={c} />
        )}
        {period === "day" && (
          <g>
            <FarmGoatSVG x={735} y={262} scale={0.026} animated={true} c={c} />
            <FarmGoatSVG x={765} y={266} scale={0.02} flip={true} animated={false} c={c} />
          </g>
        )}
        {period === "sunset" && (
          <FarmGoatSVG x={640} y={264} scale={0.026} flip={true} animated={true} c={c} />
        )}

        {/* ── 10. Noble Lion on Rocky Cliff (animal-leo-lion.svg) ── */}
        {(period === "sunset" || period === "night") && (
          <LionSVG x={1140} y={240} scale={0.042} isNight={period === "night"} c={c} />
        )}

        {/* ── 11. Pine trees (right cluster) ── */}
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

        {/* ── 12. Night Fireflies ── */}
        {period === "night" && (
          <g>
            <circle cx="280" cy="272" r="1.5" fill="#fef08a" opacity={0.85} style={{ filter: "drop-shadow(0 0 4px #fef08a)" }} />
            <circle cx="310" cy="260" r="1.8" fill="#a7f3d0" opacity={0.9} style={{ filter: "drop-shadow(0 0 5px #a7f3d0)" }} />
            <circle cx="210" cy="278" r="1.4" fill="#fef08a" opacity={0.75} style={{ filter: "drop-shadow(0 0 4px #fef08a)" }} />
            <circle cx="1135" cy="264" r="1.6" fill="#fef08a" opacity={0.85} style={{ filter: "drop-shadow(0 0 5px #fef08a)" }} />
            <circle cx="1215" cy="268" r="1.3" fill="#a7f3d0" opacity={0.7} style={{ filter: "drop-shadow(0 0 4px #a7f3d0)" }} />
          </g>
        )}

        {/* ── 13. Front hills (ground silhouette) ── */}
        <path
          fill={c.front}
          d="M0,340 L0,295 Q120,268 240,284 Q360,302 480,278
             Q600,262 720,276 Q840,290 960,270
             Q1080,256 1200,276 Q1320,296 1440,284 L1440,340 Z"
        />
      </svg>
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

        {/* Crescent Phase */}
        {moonPhase === "crescent" && (
          <>
            <path d="M 50,14 A 36,36 0 0,0 50,86 Q 74,50 50,14 Z" fill="#e8eeff" />
            <circle cx="34" cy="50" r="3.2" fill="rgba(165,180,252,0.4)" />
            <circle cx="41" cy="36" r="2.4" fill="rgba(165,180,252,0.35)" />
            <circle cx="39" cy="65" r="2.8" fill="rgba(165,180,252,0.35)" />
            <circle cx="30" cy="60" r="1.8" fill="rgba(165,180,252,0.3)" />
          </>
        )}

        {/* Quarter / Half Moon Phase */}
        {moonPhase === "quarter" && (
          <>
            <path d="M 50,14 A 36,36 0 0,0 50,86 L 50,14 Z" fill="#e8eeff" />
            <circle cx="35" cy="50" r="3.5" fill="rgba(165,180,252,0.35)" />
            <circle cx="41" cy="35" r="3" fill="rgba(165,180,252,0.3)" />
            <circle cx="37" cy="66" r="2.8" fill="rgba(165,180,252,0.3)" />
            <circle cx="28" cy="54" r="2" fill="rgba(165,180,252,0.25)" />
          </>
        )}

        {/* Gibbous (3/4) Phase */}
        {moonPhase === "gibbous" && (
          <>
            <path d="M 50,14 A 36,36 0 0,0 50,86 Q 26,50 50,14 Z" fill="#e8eeff" />
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
function CelestialBody({ period, moonPhase }: { period: TimePeriod; moonPhase: MoonPhase }) {
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

      {/* ── Blazing Sun at Day (Tinggi di Tengah Langit) ── */}
      {period === "day" && (
        <div
          className="absolute pointer-events-none select-none"
          style={{
            top: "14%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 104,
            height: 104,
            transition: "all 2.4s ease",
          }}
        >
          <div
            style={{
              width: 104,
              height: 104,
              filter: "drop-shadow(0 0 22px rgba(251, 191, 36, 0.95)) drop-shadow(0 0 44px rgba(245, 158, 11, 0.55))",
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
   AURORA BANDS
───────────────────────────────────────────── */
function AuroraBands() {
  return (
    <div className="absolute top-0 left-0 right-0 h-[60vh] overflow-hidden pointer-events-none" style={{ mixBlendMode: "screen" }}>
      <div className="absolute -top-28 -left-[20%] w-[140%] h-[340px] blur-[56px] opacity-70" style={{ background: "radial-gradient(ellipse at 50% 50%, rgba(16,185,129,0.42), rgba(20,184,166,0.22), transparent 75%)", animation: "aurora1 14s ease-in-out infinite alternate" }} />
      <div className="absolute -top-20 left-[5%] w-[130%] h-[390px] blur-[64px] opacity-60" style={{ background: "radial-gradient(ellipse at 40% 60%, rgba(6,182,212,0.36), rgba(56,189,248,0.22), transparent 70%)", animation: "aurora2 18s ease-in-out infinite alternate" }} />
      <div className="absolute -top-10 left-0 w-[120%] h-[360px] blur-[68px] opacity-45" style={{ background: "radial-gradient(ellipse at 65% 45%, rgba(139,92,246,0.32), rgba(99,102,241,0.18), transparent 68%)", animation: "aurora3 16s ease-in-out infinite alternate" }} />
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
            style={{ backgroundColor: WEATHER_OVERLAY[weather], transition: "background-color 1.2s ease" }}
          />
        )}

        {/* Night: stars + aurora */}
        {isNight && weather === "clear" && (<><StarsCanvas /><AuroraBands /></>)}
        {isNight && weather === "overcast" && (
          <div className="absolute inset-0 bg-gradient-to-b from-gray-900/80 to-gray-800/60 pointer-events-none" />
        )}

        {/* Daytime clouds */}
        {period === "day" && weather === "clear" && (
          <>
            <div className="absolute top-[8%] left-[5%] w-80 h-24 rounded-full bg-white/60 blur-2xl pointer-events-none" style={{ animation: "fogDrift 35s linear infinite" }} />
            <div className="absolute top-[15%] right-[10%] w-64 h-16 rounded-full bg-white/50 blur-2xl pointer-events-none" style={{ animation: "fogDrift 48s linear infinite reverse" }} />
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
        <CelestialBody period={period} moonPhase={moonPhase} />

        {/* Mountains & trees silhouette — all periods */}
        {hasMountains && <MountainScene period={period} />}

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
