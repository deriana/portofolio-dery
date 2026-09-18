import { useEffect, useRef, useState } from "react";
import {
  Sun, Sunset, Moon, Sunrise, Cloud, CloudRain, Snowflake, Shuffle,
} from "lucide-react";
import {
  useSkyTheme,
  type TimePeriod,
  type WeatherType,
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
          {/* tree 1 */}
          <polygon points="30,270 55,210 80,270" />
          <polygon points="40,240 55,190 70,240" />
          <rect x="51" y="270" width="8" height="20" />
          {/* tree 2 */}
          <polygon points="75,275 105,205 135,275" />
          <polygon points="86,245 105,180 124,245" />
          <rect x="101" y="275" width="10" height="20" />
          {/* tree 3 */}
          <polygon points="140,280 162,228 185,280" />
          <polygon points="150,255 162,210 175,255" />
          <rect x="158" y="280" width="8" height="18" />
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
   Rendered BEFORE MountainScene so mountains
   appear in front of it.
───────────────────────────────────────────── */
function CelestialBody({ period }: { period: TimePeriod }) {
  // Position & size per period (% of viewport)
  const config: Record<TimePeriod, { top: string; left: string; size: number }> = {
    night:  { top: "10%",  left: "72%", size: 90  },
    dawn:   { top: "54%",  left: "50%", size: 110 }, // near horizon
    day:    { top: "8%",   left: "65%", size: 110 },
    sunset: { top: "52%",  left: "38%", size: 130 }, // low on horizon
  };
  const { top, left, size } = config[period];
  const half = size / 2;

  return (
    <div
      className="absolute pointer-events-none"
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
        <svg viewBox={`0 0 ${size} ${size}`} width={size} height={size} xmlns="http://www.w3.org/2000/svg">
          <defs>
            <filter id="cb-moon-glow" x="-60%" y="-60%" width="220%" height="220%">
              <feGaussianBlur stdDeviation="10" result="b1" />
              <feGaussianBlur stdDeviation="18" result="b2" />
              <feMerge><feMergeNode in="b2"/><feMergeNode in="b1"/><feMergeNode in="SourceGraphic"/></feMerge>
            </filter>
            <mask id="cb-moon-mask">
              <circle cx={half} cy={half} r={half * 0.72} fill="white" />
              <circle cx={half + half * 0.38} cy={half - half * 0.2} r={half * 0.58} fill="black" />
            </mask>
          </defs>
          {/* soft halo */}
          <circle cx={half} cy={half} r={half * 0.9} fill="rgba(199,210,254,0.06)" />
          <circle cx={half} cy={half} r={half * 0.78} fill="rgba(221,230,255,0.10)" filter="url(#cb-moon-glow)" />
          {/* moon body */}
          <circle cx={half} cy={half} r={half * 0.72} fill="#e8eeff" mask="url(#cb-moon-mask)" filter="url(#cb-moon-glow)" />
          {/* craters */}
          <circle cx={half * 0.62} cy={half * 1.1}  r={half * 0.09} fill="rgba(180,190,230,0.45)" mask="url(#cb-moon-mask)" />
          <circle cx={half * 0.48} cy={half * 0.72} r={half * 0.06} fill="rgba(180,190,230,0.35)" mask="url(#cb-moon-mask)" />
          <circle cx={half * 0.72} cy={half * 0.88} r={half * 0.04} fill="rgba(180,190,230,0.3)"  mask="url(#cb-moon-mask)" />
          <circle cx={half * 0.55} cy={half * 1.30} r={half * 0.05} fill="rgba(180,190,230,0.3)"  mask="url(#cb-moon-mask)" />
        </svg>
      )}

      {period === "dawn" && (
        <svg viewBox={`0 0 ${size} ${size}`} width={size} height={size} xmlns="http://www.w3.org/2000/svg">
          <defs>
            <radialGradient id="cb-dawn-grad" cx="50%" cy="50%" r="50%">
              <stop offset="0%"   stopColor="#fff7ed" stopOpacity="1"   />
              <stop offset="45%"  stopColor="#fcd34d" stopOpacity="0.95"/>
              <stop offset="80%"  stopColor="#f59e0b" stopOpacity="0.7" />
              <stop offset="100%" stopColor="#d97706" stopOpacity="0"   />
            </radialGradient>
            <filter id="cb-dawn-glow" x="-60%" y="-60%" width="220%" height="220%">
              <feGaussianBlur stdDeviation="14" result="b" />
              <feMerge><feMergeNode in="b"/><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
            </filter>
          </defs>
          {/* large soft halo */}
          <circle cx={half} cy={half} r={half} fill="url(#cb-dawn-grad)" />
          {/* bright core */}
          <circle cx={half} cy={half} r={half * 0.38} fill="#fff7ed" filter="url(#cb-dawn-glow)" />
          <circle cx={half} cy={half} r={half * 0.22} fill="white" />
        </svg>
      )}

      {period === "day" && (
        <svg viewBox={`0 0 ${size} ${size}`} width={size} height={size} xmlns="http://www.w3.org/2000/svg">
          <defs>
            <radialGradient id="cb-sun-grad" cx="50%" cy="50%" r="50%">
              <stop offset="0%"   stopColor="#ffffff" stopOpacity="1"   />
              <stop offset="30%"  stopColor="#fef08a" stopOpacity="1"   />
              <stop offset="65%"  stopColor="#fbbf24" stopOpacity="0.85"/>
              <stop offset="100%" stopColor="#f59e0b" stopOpacity="0"   />
            </radialGradient>
            <filter id="cb-sun-glow" x="-60%" y="-60%" width="220%" height="220%">
              <feGaussianBlur stdDeviation="12" result="b1" />
              <feGaussianBlur stdDeviation="22" result="b2" />
              <feMerge><feMergeNode in="b2"/><feMergeNode in="b1"/><feMergeNode in="SourceGraphic"/></feMerge>
            </filter>
          </defs>
          {/* corona / outer glow */}
          <circle cx={half} cy={half} r={half} fill="url(#cb-sun-grad)" />
          {/* rays */}
          {Array.from({ length: 12 }, (_, i) => {
            const a = (Math.PI / 6) * i;
            return (
              <line key={i}
                x1={half + half * 0.52 * Math.cos(a)} y1={half + half * 0.52 * Math.sin(a)}
                x2={half + half * 0.82 * Math.cos(a)} y2={half + half * 0.82 * Math.sin(a)}
                stroke="rgba(253,224,71,0.6)" strokeWidth={size * 0.025} strokeLinecap="round"
              />
            );
          })}
          {/* bright disc */}
          <circle cx={half} cy={half} r={half * 0.38} fill="#fef9c3" filter="url(#cb-sun-glow)" />
          <circle cx={half} cy={half} r={half * 0.22} fill="white" />
        </svg>
      )}

      {period === "sunset" && (
        <svg viewBox={`0 0 ${size} ${size}`} width={size} height={size} xmlns="http://www.w3.org/2000/svg">
          <defs>
            <radialGradient id="cb-set-grad" cx="50%" cy="50%" r="50%">
              <stop offset="0%"   stopColor="#fff7ed" stopOpacity="1"   />
              <stop offset="25%"  stopColor="#fca5a5" stopOpacity="1"   />
              <stop offset="55%"  stopColor="#ef4444" stopOpacity="0.85"/>
              <stop offset="80%"  stopColor="#dc2626" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#991b1b" stopOpacity="0"   />
            </radialGradient>
            <filter id="cb-set-glow" x="-60%" y="-60%" width="220%" height="220%">
              <feGaussianBlur stdDeviation="16" result="b1" />
              <feGaussianBlur stdDeviation="28" result="b2" />
              <feMerge><feMergeNode in="b2"/><feMergeNode in="b1"/><feMergeNode in="SourceGraphic"/></feMerge>
            </filter>
          </defs>
          {/* large blood-orange halo */}
          <circle cx={half} cy={half} r={half} fill="url(#cb-set-grad)" />
          {/* bright rim */}
          <circle cx={half} cy={half} r={half * 0.36} fill="#fed7aa" filter="url(#cb-set-glow)" />
          <circle cx={half} cy={half} r={half * 0.20} fill="#fff7ed" />
        </svg>
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
interface SimModalProps {
  forcedPeriod: TimePeriod | "auto";
  forcedWeather: WeatherType | "auto";
  onChangePeriod: (p: TimePeriod | "auto") => void;
  onChangeWeather: (w: WeatherType | "auto") => void;
  onClose: () => void;
}
function SimulationModal({ forcedPeriod, forcedWeather, onChangePeriod, onChangeWeather, onClose }: SimModalProps) {
  return (
    <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-black/30 backdrop-blur-sm" onClick={onClose}>
      <div className="relative w-full max-w-sm bg-card/95 backdrop-blur-xl border border-border rounded-3xl shadow-2xl p-6 space-y-5" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-foreground">Simulasi Suasana</h3>
            <p className="text-xs text-muted-foreground">Preview waktu & cuaca secara manual</p>
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

        {/* Randomize Button */}
        <div className="pt-2 border-t border-border/60">
          <button
            onClick={() => {
              const periods: TimePeriod[] = ["dawn", "day", "sunset", "night"];
              const weathers: WeatherType[] = ["clear", "rain", "snow", "overcast"];
              const randP = periods[Math.floor(Math.random() * periods.length)];
              const randW = weathers[Math.floor(Math.random() * weathers.length)];
              onChangePeriod(randP);
              onChangeWeather(randW);
            }}
            className="w-full flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-bold bg-primary/10 text-primary hover:bg-primary/20 border border-primary/25 shadow-sm transition-all cursor-pointer"
          >
            <Shuffle className="w-3.5 h-3.5" />
            <span>Acak Suasana & Cuaca (Random)</span>
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
  const { period, weather, forcedPeriod, forcedWeather, setForcedPeriod, setForcedWeather } = useSkyTheme();
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
        <CelestialBody period={period} />

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
          onChangePeriod={setForcedPeriod}
          onChangeWeather={setForcedWeather}
          onClose={() => setModalOpen(false)}
        />
      )}
    </>
  );
}
