import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router";
import { useSkyTheme, type TimePeriod } from "./sky-theme-context";

/* ─────────────────────────────────────────────
   NIGHT: Full moon crescent (blue-white glow)
───────────────────────────────────────────── */
function MoonCursor({ opacity }: { opacity: number }) {
  return (
    <svg viewBox="0 0 44 44" width="44" height="44"
      style={{ position: "absolute", inset: 0, opacity, transition: "opacity 0.5s ease" }}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <filter id="moon-glow" x="-80%" y="-80%" width="260%" height="260%">
          <feGaussianBlur stdDeviation="5" result="blur1" />
          <feGaussianBlur stdDeviation="9" result="blur2" />
          <feMerge>
            <feMergeNode in="blur2" /><feMergeNode in="blur1" /><feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <mask id="moon-mask-n">
          <circle cx="22" cy="22" r="14" fill="white" />
          <circle cx="29" cy="18" r="11" fill="black" />
        </mask>
      </defs>
      {/* outer haze */}
      <circle cx="22" cy="22" r="21" fill="rgba(165,180,252,0.08)" />
      <circle cx="22" cy="22" r="18" fill="rgba(199,210,254,0.10)" />
      {/* moon body */}
      <circle cx="22" cy="22" r="14" fill="#dde6ff" mask="url(#moon-mask-n)" filter="url(#moon-glow)" />
      {/* subtle craters */}
      <circle cx="16" cy="19" r="1.5" fill="rgba(147,160,220,0.4)" mask="url(#moon-mask-n)" />
      <circle cx="20" cy="26" r="1"   fill="rgba(147,160,220,0.35)" mask="url(#moon-mask-n)" />
      <circle cx="13" cy="25" r="0.8" fill="rgba(147,160,220,0.3)"  mask="url(#moon-mask-n)" />
      {/* small stars nearby */}
      <circle cx="36" cy="10" r="1.2" fill="rgba(199,210,254,0.75)" />
      <circle cx="8"  cy="8"  r="0.9" fill="rgba(199,210,254,0.6)"  />
      <circle cx="38" cy="30" r="0.7" fill="rgba(199,210,254,0.5)"  />
      <circle cx="5"  cy="33" r="1"   fill="rgba(199,210,254,0.55)" />
    </svg>
  );
}

/* ─────────────────────────────────────────────
   DAWN: Sunrise glow (soft rose-amber)
───────────────────────────────────────────── */
function DawnCursor({ opacity }: { opacity: number }) {
  return (
    <svg viewBox="0 0 44 44" width="44" height="44"
      style={{ position: "absolute", inset: 0, opacity, transition: "opacity 0.5s ease" }}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <radialGradient id="dawn-grad" cx="50%" cy="50%" r="50%">
          <stop offset="0%"   stopColor="#fff7ed" stopOpacity="1"   />
          <stop offset="40%"  stopColor="#fdba74" stopOpacity="0.95"/>
          <stop offset="75%"  stopColor="#c4607a" stopOpacity="0.7" />
          <stop offset="100%" stopColor="#9f3a68" stopOpacity="0"   />
        </radialGradient>
        <filter id="dawn-glow" x="-70%" y="-70%" width="240%" height="240%">
          <feGaussianBlur stdDeviation="4.5" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
        <mask id="dawn-half">
          <rect x="0" y="22" width="44" height="22" fill="black" />
          <rect x="0" y="0"  width="44" height="22" fill="white" />
        </mask>
      </defs>
      {/* outer warm haze */}
      <circle cx="22" cy="22" r="21" fill="url(#dawn-grad)" />
      {/* horizon line */}
      <line x1="5" y1="28" x2="39" y2="28" stroke="rgba(244,162,97,0.4)" strokeWidth="1" strokeLinecap="round" />
      {/* rising sun peeking from bottom */}
      <circle cx="22" cy="30" r="9" fill="#fce8bb" filter="url(#dawn-glow)" mask="url(#dawn-half)" />
      {/* rays above horizon */}
      {[-40, -20, 0, 20, 40].map((deg, i) => {
        const rad = (deg * Math.PI) / 180 - Math.PI / 2;
        return (
          <line key={i}
            x1={22 + 11 * Math.cos(rad)} y1={30 + 11 * Math.sin(rad)}
            x2={22 + 17 * Math.cos(rad)} y2={30 + 17 * Math.sin(rad)}
            stroke="rgba(251,191,36,0.6)" strokeWidth="1.5" strokeLinecap="round"
          />
        );
      })}
    </svg>
  );
}

/* ─────────────────────────────────────────────
   DAY: Sun with 8 rays
───────────────────────────────────────────── */
function SunCursor({ opacity }: { opacity: number }) {
  const rays = Array.from({ length: 8 }, (_, i) => {
    const angle = (Math.PI / 4) * i;
    return {
      x1: 22 + 14 * Math.cos(angle), y1: 22 + 14 * Math.sin(angle),
      x2: 22 + 20 * Math.cos(angle), y2: 22 + 20 * Math.sin(angle),
    };
  });
  return (
    <svg viewBox="0 0 44 44" width="44" height="44"
      style={{ position: "absolute", inset: 0, opacity, transition: "opacity 0.5s ease" }}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <radialGradient id="sun-grad" cx="50%" cy="50%" r="50%">
          <stop offset="0%"   stopColor="#ffffff" stopOpacity="1"   />
          <stop offset="40%"  stopColor="#fde68a" stopOpacity="1"   />
          <stop offset="100%" stopColor="#fbbf24" stopOpacity="0.8" />
        </radialGradient>
        <filter id="sun-glow" x="-70%" y="-70%" width="240%" height="240%">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>
      <circle cx="22" cy="22" r="21" fill="rgba(251,191,36,0.07)" />
      <circle cx="22" cy="22" r="17" fill="rgba(253,230,138,0.12)" />
      {rays.map((r, i) => (
        <line key={i} x1={r.x1} y1={r.y1} x2={r.x2} y2={r.y2}
          stroke="rgba(251,191,36,0.85)" strokeWidth="2" strokeLinecap="round" filter="url(#sun-glow)" />
      ))}
      <circle cx="22" cy="22" r="10" fill="url(#sun-grad)" filter="url(#sun-glow)" />
      <circle cx="22" cy="22" r="4.5" fill="white" />
    </svg>
  );
}

/* ─────────────────────────────────────────────
   SUNSET: Ember orb with warm rings
───────────────────────────────────────────── */
function EmberCursor({ opacity }: { opacity: number }) {
  return (
    <svg viewBox="0 0 44 44" width="44" height="44"
      style={{ position: "absolute", inset: 0, opacity, transition: "opacity 0.5s ease" }}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <radialGradient id="ember-grad" cx="50%" cy="50%" r="50%">
          <stop offset="0%"   stopColor="#ffffff" stopOpacity="1"   />
          <stop offset="30%"  stopColor="#fed7aa" stopOpacity="1"   />
          <stop offset="65%"  stopColor="#f97316" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#ea580c" stopOpacity="0.5" />
        </radialGradient>
        <filter id="ember-glow" x="-70%" y="-70%" width="240%" height="240%">
          <feGaussianBlur stdDeviation="4" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>
      <circle cx="22" cy="22" r="21" fill="none" stroke="rgba(249,115,22,0.15)" strokeWidth="5" />
      <circle cx="22" cy="22" r="15" fill="none" stroke="rgba(249,115,22,0.22)" strokeWidth="2.5" />
      <circle cx="22" cy="22" r="11" fill="url(#ember-grad)" filter="url(#ember-glow)" />
    </svg>
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
