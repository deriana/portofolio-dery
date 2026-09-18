import { useEffect, useRef, useState } from "react";
import {
  Sun, Sunset, Moon, Sunrise, Cloud, CloudRain, Snowflake, Shuffle,
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

function MountainScene({ period }: { period: TimePeriod }) {
  const c = MOUNTAIN_COLORS[period];
  if (!c) return null;

  return (
    <div
      className="absolute bottom-0 left-0 right-0 w-full pointer-events-none"
      style={{ height: "38vh", minHeight: 180 }}
    >
      <svg
        viewBox="0 0 1440 340"
        preserveAspectRatio="none"
        className="absolute bottom-0 left-0 w-full h-full"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* ── Flock of birds soaring across the sky (dawn, day, sunset) ── */}
        {period !== "night" && (
          <g fill={c.mid} opacity={0.65}>
            <path d="M 520,110 Q 528,103 536,110 Q 544,103 552,110 Q 544,106 536,112 Q 528,106 520,110 Z" />
            <path d="M 548,96 Q 554,90 560,96 Q 566,90 572,96 Q 566,93 560,98 Q 554,93 548,96 Z" />
            <path d="M 570,115 Q 575,110 580,115 Q 585,110 590,115 Q 585,112 580,117 Q 575,112 570,115 Z" />
            <path d="M 598,102 Q 603,98 608,102 Q 613,98 618,102 Q 613,100 608,104 Q 603,100 598,102 Z" />
          </g>
        )}

        {/* ── Back mountains (tallest, lightest silhouette) ── */}
        <path
          fill={c.back}
          d="M0,340 L0,220 L80,180 L160,200 L260,140 L340,160 L420,120
             L500,145 L580,105 L660,130 L740,90 L820,118 L900,80
             L980,110 L1060,75 L1140,100 L1220,65 L1300,95 L1380,60
             L1440,85 L1440,340 Z"
        />

        {/* ── Mid mountains ── */}
        <path
          fill={c.mid}
          d="M0,340 L0,260 L60,240 L120,250 L200,200 L280,220 L360,180
             L440,205 L520,165 L600,190 L680,155 L760,175 L840,145
             L920,170 L1000,135 L1080,165 L1160,130 L1240,155 L1320,120
             L1380,145 L1440,130 L1440,340 Z"
        />

        {/* ── Pine trees (left cluster) ── */}
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

        {/* ── Cozy Hillside Cabin with glowing warm window ── */}
        <g>
          {/* Cabin body */}
          <rect x="220" y="260" width="36" height="24" rx="2" fill={c.front} />
          {/* Pitched roof */}
          <polygon points="214,262 238,244 262,262" fill={c.tree} />
          {/* Chimney */}
          <rect x="250" y="247" width="5" height="12" fill={c.tree} />
          {/* Warm glowing window (fireside glow) */}
          <rect
            x="227" y="267" width="10" height="10" rx="1.5"
            fill="#fde047"
            opacity={period === "day" ? 0.35 : 0.95}
            style={{ filter: "drop-shadow(0 0 6px rgba(253, 224, 71, 0.9))" }}
          />
          {/* Window pane divider */}
          <line x1="232" y1="267" x2="232" y2="277" stroke={c.front} strokeWidth="1" />
          <line x1="227" y1="272" x2="237" y2="272" stroke={c.front} strokeWidth="1" />
          {/* Door */}
          <rect x="243" y="269" width="8" height="15" fill={c.mid} />
        </g>

        {/* ── Wild Deer Silhouette on hill crest ── */}
        <g fill={c.tree}>
          {/* Body */}
          <ellipse cx="1165" cy="263" rx="11" ry="6" />
          {/* Neck & Head */}
          <path d="M 1173,261 L 1179,247 L 1184,246 L 1186,250 L 1179,263 Z" />
          <circle cx="1185" cy="248" r="2.2" />
          {/* Ears */}
          <path d="M 1178,247 L 1174,242 L 1178,244 Z" />
          {/* Antlers */}
          <path
            d="M 1181,246 L 1180,235 M 1180,240 L 1185,238 M 1183,246 L 1187,236 M 1185,241 L 1190,240"
            stroke={c.tree} strokeWidth="1.8" strokeLinecap="round"
          />
          {/* 4 Legs */}
          <line x1="1158" y1="266" x2="1156" y2="284" stroke={c.tree} strokeWidth="2.2" strokeLinecap="round" />
          <line x1="1163" y1="266" x2="1162" y2="285" stroke={c.tree} strokeWidth="2" strokeLinecap="round" />
          <line x1="1171" y1="266" x2="1173" y2="284" stroke={c.tree} strokeWidth="2.2" strokeLinecap="round" />
          <line x1="1175" y1="266" x2="1177" y2="282" stroke={c.tree} strokeWidth="2" strokeLinecap="round" />
          {/* Tail */}
          <path d="M 1154,261 L 1150,264 L 1154,266 Z" />
        </g>

        {/* ── Pine trees (right cluster) ── */}
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

        {/* ── Night Fireflies ── */}
        {period === "night" && (
          <g>
            <circle cx="280" cy="272" r="1.5" fill="#fef08a" opacity="0.8" style={{ filter: "drop-shadow(0 0 4px #fef08a)" }} />
            <circle cx="310" cy="260" r="1.8" fill="#a7f3d0" opacity="0.9" style={{ filter: "drop-shadow(0 0 5px #a7f3d0)" }} />
            <circle cx="210" cy="278" r="1.4" fill="#fef08a" opacity="0.75" style={{ filter: "drop-shadow(0 0 4px #fef08a)" }} />
            <circle cx="1135" cy="264" r="1.6" fill="#fef08a" opacity="0.85" style={{ filter: "drop-shadow(0 0 5px #fef08a)" }} />
            <circle cx="1215" cy="268" r="1.3" fill="#a7f3d0" opacity="0.7" style={{ filter: "drop-shadow(0 0 4px #a7f3d0)" }} />
          </g>
        )}

        {/* ── Front hills (ground silhouette) ── */}
        <path
          fill={c.front}
          d="M0,340 L0,295 Q120,265 240,285 Q360,305 480,280
             Q600,258 720,275 Q840,292 960,272
             Q1080,255 1200,278 Q1320,300 1440,285 L1440,340 Z"
        />
      </svg>
    </div>
  );
}

/* ─────────────────────────────────────────────
   CELESTIAL BODY  (sun / moon in the sky)
   With 4 Moon Phases (crescent, quarter, gibbous, full)
───────────────────────────────────────────── */
function CelestialBody({ period, moonPhase }: { period: TimePeriod; moonPhase: MoonPhase }) {
  const config: Record<TimePeriod, { top: string; left: string; size: number }> = {
    night:  { top: "11%", left: "72%", size: 84  },
    dawn:   { top: "54%", left: "50%", size: 104 },
    day:    { top: "9%",  left: "65%", size: 104 },
    sunset: { top: "52%", left: "38%", size: 118 },
  };
  const { top, left, size } = config[period];

  return (
    <div
      className="absolute pointer-events-none select-none"
      style={{
        top,
        left,
        transform: "translate(-50%, -50%)",
        width: size,
        height: size,
        transition: "top 2.4s ease, left 2.4s ease, opacity 2s ease",
      }}
    >
      {period === "night" && (
        <div
          style={{
            width: size,
            height: size,
            filter: "drop-shadow(0 0 16px rgba(199, 210, 254, 0.85)) drop-shadow(0 0 32px rgba(129, 140, 248, 0.4))",
          }}
        >
          <svg viewBox="0 0 100 100" width={size} height={size} xmlns="http://www.w3.org/2000/svg">
            {/* Outer haze halo */}
            <circle cx="50" cy="50" r="44" fill="rgba(199,210,254,0.06)" />

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
      )}

      {period === "dawn" && (
        <div
          style={{
            width: size,
            height: size,
            filter: "drop-shadow(0 0 20px rgba(251, 146, 60, 0.9)) drop-shadow(0 0 40px rgba(244, 63, 94, 0.45))",
          }}
        >
          <svg viewBox="0 0 100 100" width={size} height={size} xmlns="http://www.w3.org/2000/svg">
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
      )}

      {period === "day" && (
        <div
          style={{
            width: size,
            height: size,
            filter: "drop-shadow(0 0 22px rgba(251, 191, 36, 0.95)) drop-shadow(0 0 44px rgba(245, 158, 11, 0.55))",
          }}
        >
          <svg viewBox="0 0 100 100" width={size} height={size} xmlns="http://www.w3.org/2000/svg">
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
      )}

      {period === "sunset" && (
        <div
          style={{
            width: size,
            height: size,
            filter: "drop-shadow(0 0 24px rgba(239, 68, 68, 0.95)) drop-shadow(0 0 50px rgba(249, 115, 22, 0.55))",
          }}
        >
          <svg viewBox="0 0 100 100" width={size} height={size} xmlns="http://www.w3.org/2000/svg">
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
      )}
    </div>
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
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors text-sm cursor-pointer">✕</button>
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
