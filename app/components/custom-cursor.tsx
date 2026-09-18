import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router";
import { useSkyTheme, type TimePeriod } from "./sky-theme-context";

/* ─────────────────────────────────────────────
   NIGHT: Full moon crescent (blue-white glow)
   Pure vector path + native CSS drop-shadow
───────────────────────────────────────────── */
function MoonCursor({ opacity }: { opacity: number }) {
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        opacity,
        transition: "opacity 0.5s ease",
        filter: "drop-shadow(0 0 6px rgba(199, 210, 254, 0.9))",
      }}
    >
      <svg viewBox="0 0 44 44" width="44" height="44" xmlns="http://www.w3.org/2000/svg">
        {/* Soft outer aura */}
        <circle cx="22" cy="22" r="18" fill="rgba(199,210,254,0.08)" />
        {/* Pure crescent path — zero mask, zero filter */}
        <path d="M 22,7 A 15,15 0 0,0 22,37 Q 32,22 22,7 Z" fill="#dde6ff" />
        {/* Subtle craters */}
        <circle cx="15" cy="22" r="1.4" fill="rgba(147,160,220,0.4)" />
        <circle cx="18" cy="16" r="1.1" fill="rgba(147,160,220,0.35)" />
        <circle cx="17" cy="28" r="1.2" fill="rgba(147,160,220,0.35)" />
        {/* Small stars nearby */}
        <circle cx="36" cy="10" r="1.2" fill="rgba(199,210,254,0.8)" />
        <circle cx="8"  cy="8"  r="0.9" fill="rgba(199,210,254,0.6)" />
        <circle cx="37" cy="31" r="0.8" fill="rgba(199,210,254,0.6)" />
      </svg>
    </div>
  );
}

/* ─────────────────────────────────────────────
   DAWN: Sunrise glow (soft rose-amber)
───────────────────────────────────────────── */
function DawnCursor({ opacity }: { opacity: number }) {
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        opacity,
        transition: "opacity 0.5s ease",
        filter: "drop-shadow(0 0 7px rgba(251, 146, 60, 0.9))",
      }}
    >
      <svg viewBox="0 0 44 44" width="44" height="44" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <radialGradient id="dawn-c-grad" cx="50%" cy="50%" r="50%">
            <stop offset="0%"   stopColor="#fff7ed" />
            <stop offset="50%"  stopColor="#fdba74" />
            <stop offset="100%" stopColor="#f97316" />
          </radialGradient>
        </defs>
        {/* Horizon line */}
        <line x1="6" y1="28" x2="38" y2="28" stroke="rgba(244,162,97,0.5)" strokeWidth="1.5" strokeLinecap="round" />
        {/* Rising sun arc */}
        <path d="M 12,28 A 10,10 0 0,1 32,28 Z" fill="url(#dawn-c-grad)" />
        {/* Sun rays above horizon */}
        {[-40, -20, 0, 20, 40].map((deg, i) => {
          const rad = (deg * Math.PI) / 180 - Math.PI / 2;
          return (
            <line key={i}
              x1={22 + 12 * Math.cos(rad)} y1={28 + 12 * Math.sin(rad)}
              x2={22 + 18 * Math.cos(rad)} y2={28 + 18 * Math.sin(rad)}
              stroke="rgba(251,191,36,0.7)" strokeWidth="1.5" strokeLinecap="round"
            />
          );
        })}
      </svg>
    </div>
  );
}

/* ─────────────────────────────────────────────
   DAY: Sun with 8 rays
───────────────────────────────────────────── */
function SunCursor({ opacity }: { opacity: number }) {
  const rays = Array.from({ length: 8 }, (_, i) => {
    const angle = (Math.PI / 4) * i;
    return {
      x1: 22 + 13 * Math.cos(angle), y1: 22 + 13 * Math.sin(angle),
      x2: 22 + 19 * Math.cos(angle), y2: 22 + 19 * Math.sin(angle),
    };
  });
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        opacity,
        transition: "opacity 0.5s ease",
        filter: "drop-shadow(0 0 8px rgba(251, 191, 36, 0.95))",
      }}
    >
      <svg viewBox="0 0 44 44" width="44" height="44" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <radialGradient id="sun-c-grad" cx="50%" cy="50%" r="50%">
            <stop offset="0%"   stopColor="#ffffff" />
            <stop offset="45%"  stopColor="#fde68a" />
            <stop offset="100%" stopColor="#fbbf24" />
          </radialGradient>
        </defs>
        {/* Outer subtle halo */}
        <circle cx="22" cy="22" r="18" fill="rgba(251,191,36,0.12)" />
        {rays.map((r, i) => (
          <line key={i} x1={r.x1} y1={r.y1} x2={r.x2} y2={r.y2}
            stroke="rgba(251,191,36,0.85)" strokeWidth="2" strokeLinecap="round" />
        ))}
        <circle cx="22" cy="22" r="8" fill="url(#sun-c-grad)" />
      </svg>
    </div>
  );
}

/* ─────────────────────────────────────────────
   SUNSET: Ember orb with warm rings
───────────────────────────────────────────── */
function EmberCursor({ opacity }: { opacity: number }) {
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        opacity,
        transition: "opacity 0.5s ease",
        filter: "drop-shadow(0 0 8px rgba(249, 115, 22, 0.9))",
      }}
    >
      <svg viewBox="0 0 44 44" width="44" height="44" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <radialGradient id="ember-c-grad" cx="50%" cy="50%" r="50%">
            <stop offset="0%"   stopColor="#ffffff" />
            <stop offset="35%"  stopColor="#fed7aa" />
            <stop offset="70%"  stopColor="#f97316" />
            <stop offset="100%" stopColor="#ea580c" />
          </radialGradient>
        </defs>
        <circle cx="22" cy="22" r="19" fill="none" stroke="rgba(249,115,22,0.18)" strokeWidth="4" />
        <circle cx="22" cy="22" r="14" fill="none" stroke="rgba(249,115,22,0.25)" strokeWidth="2" />
        <circle cx="22" cy="22" r="9" fill="url(#ember-c-grad)" />
      </svg>
    </div>
  );
}

/* ─────────────────────────────────────────────
   CURSOR SHAPE MAP
───────────────────────────────────────────── */
const CURSOR_SHAPES: Record<TimePeriod, React.ElementType<{ opacity: number }>> = {
  night:  MoonCursor,
  dawn:   DawnCursor,
  day:    SunCursor,
  sunset: EmberCursor,
};

/* ─────────────────────────────────────────────
   MAIN CURSOR COMPONENT
───────────────────────────────────────────── */
export function CustomCursor() {
  const location = useLocation();
  const { period } = useSkyTheme();
  const wrapRef = useRef<HTMLDivElement>(null);
  const [isDesktop, setIsDesktop] = useState(true);
  const [activePeriod, setActivePeriod] = useState<TimePeriod>(period);
  const [prevPeriod, setPrevPeriod] = useState<TimePeriod | null>(null);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px) and (pointer: fine)");
    const onChange = (e: MediaQueryListEvent) => setIsDesktop(e.matches);
    setIsDesktop(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, [location.pathname]);

  useEffect(() => {
    if (period === activePeriod) return;
    setPrevPeriod(activePeriod);
    setActivePeriod(period);
    const t = setTimeout(() => setPrevPeriod(null), 600);
    return () => clearTimeout(t);
  }, [period, activePeriod]);

  useEffect(() => {
    if (!isDesktop) return;
    const wrap = wrapRef.current;
    if (!wrap) return;
    let raf: number;
    const move = (e: MouseEvent) => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        wrap.style.transform = `translate(${e.clientX - 22}px, ${e.clientY - 22}px)`;
      });
    };
    document.addEventListener("mousemove", move, { passive: true });
    return () => { document.removeEventListener("mousemove", move); cancelAnimationFrame(raf); };
  }, [isDesktop]);

  if (!isDesktop) return null;

  const ActiveShape = CURSOR_SHAPES[activePeriod];
  const PrevShape = prevPeriod ? CURSOR_SHAPES[prevPeriod] : null;

  return (
    <div
      ref={wrapRef}
      style={{
        width: 44, height: 44,
        position: "fixed", top: 0, left: 0,
        pointerEvents: "none", zIndex: 9999,
        transform: "translate(-100px, -100px)",
      }}
    >
      {/* Outer pulse ring */}
      <div style={{
        position: "absolute", inset: 0,
        borderRadius: "50%",
        border: "1px solid var(--primary)",
        opacity: 0.3,
        animation: "cursorPulse 2.6s ease-in-out infinite",
      }} />

      {PrevShape && <PrevShape opacity={0} />}
      <ActiveShape opacity={1} />

      <style>{`
        @keyframes cursorPulse {
          0%, 100% { transform: scale(1);    opacity: 0.3; }
          50%       { transform: scale(1.4); opacity: 0.08; }
        }
      `}</style>
    </div>
  );
}
