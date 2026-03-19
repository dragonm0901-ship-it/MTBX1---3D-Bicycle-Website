import { useState, useEffect, useRef } from 'react';

const PART_DATA = {
  wheels: {
    title: "Wheel System",
    subtitle: "ROTATIONAL DYNAMICS",
    icon: "○",
    accentColor: "#0a8aff",
    content: "32mm internal-width carbon rims engineered for high-speed descent stability. Asymmetric layup for maximum lateral stiffness with minimal rotational inertia.",
    specs: [
      { label: "Rim Width", value: "32mm Internal" },
      { label: "Wheel Size", value: "29\" Carbon" },
      { label: "Hubs", value: "DT Swiss 240" },
      { label: "System", value: "Tubeless Ready" },
    ],
    metrics: [
      { label: "Stiffness", pct: 94 },
      { label: "Weight",    pct: 88 },
      { label: "Aero",      pct: 76 },
    ]
  },
  handlebars: {
    title: "Cockpit System",
    subtitle: "INTEGRATED CONTROL",
    icon: "⊢",
    accentColor: "#c9a227",
    content: "Uninterrupted lines. Fully internal cable routing through a proprietary stem interface. 800mm width, 20mm rise, designed for maximum mechanical advantage.",
    specs: [
      { label: "Width", value: "800mm Carbon" },
      { label: "Clamp", value: "35mm Bore" },
      { label: "Hardware", value: "Titanium Bolts" },
      { label: "Routing", value: "Fully Internal" },
    ],
    metrics: [
      { label: "Control", pct: 97 },
      { label: "Weight",  pct: 90 },
      { label: "Stiff",   pct: 92 },
    ]
  },
  drivetrain: {
    title: "Power Transfer",
    subtitle: "HIGH-FIDELITY LINKAGE",
    icon: "⚙",
    accentColor: "#2dcf52",
    content: "XTR Di2 electronic shifting synchronized with a 10-51T cascade cassette. Ceramic bearings throughout for absolute minimum frictional loss.",
    specs: [
      { label: "System", value: "12-Speed Di2" },
      { label: "Bearings", value: "Ceramic coated" },
      { label: "Crankset", value: "Carbon Arms" },
      { label: "Chain", value: "Titanium-Nit DLC" },
    ],
    metrics: [
      { label: "Efficiency", pct: 99 },
      { label: "Shifting",   pct: 98 },
      { label: "Durability", pct: 85 },
    ]
  },
  frame: {
    title: "Frame Structure",
    subtitle: "AEROSPACE MONOCOQUE",
    icon: "◈",
    accentColor: "#b90202",
    content: "T1000 High-Modulus Carbon Fiber with aerospace-grade impact-dispersion geometry. Optimized for extreme high-speed downhill stability.",
    specs: [
      { label: "Material", value: "T1000 Carbon" },
      { label: "Weight", value: "2.1kg Medium" },
      { label: "Warranty", value: "Lifetime Frame" },
      { label: "Finish", value: "Custom Lacquer" },
    ],
    metrics: [
      { label: "Rigidity",   pct: 98 },
      { label: "Lightness",  pct: 90 },
      { label: "Compliance", pct: 80 },
    ]
  },
  suspension: {
    title: "Suspension Circuit",
    subtitle: "KINETIC ABSORPTION",
    icon: "↕",
    accentColor: "#9b59b6",
    content: "Fox Factory 40 Float GRIP2 with Kashima coating delivering 203mm of buttery-smooth travel. Independently tunable compression and rebound for any terrain.",
    specs: [
      { label: "Travel", value: "203mm" },
      { label: "Damper", value: "GRIP2 Factory" },
      { label: "Coating", value: "Kashima" },
      { label: "Offset", value: "44mm" },
    ],
    metrics: [
      { label: "Absorption", pct: 97 },
      { label: "Adjustability", pct: 95 },
      { label: "Sensitivity", pct: 93 },
    ]
  },
};

export default function PartDetails({ part, onUpdate }) {
  const [visible, setVisible] = useState(false);
  const [animated, setAnimated] = useState(false);
  const panelRef = useRef();
  const metricsRef = useRef([]);

  useEffect(() => {
    if (part) {
      setVisible(true);
      setTimeout(() => setAnimated(true), 100);
    } else {
      setAnimated(false);
      setTimeout(() => setVisible(false), 500);
    }
  }, [part]);

  if (!visible) return null;
  const data = PART_DATA[part] ?? PART_DATA.frame;
  const accent = data.accentColor;

  return (
    <div
      ref={panelRef}
      className="fixed right-0 top-0 h-full z-[70] flex flex-col"
      style={{
        width: 'clamp(300px, 380px, 90vw)',
        transform: animated ? 'translateX(0)' : 'translateX(100%)',
        transition: 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
        background: 'rgba(4, 4, 6, 0.96)',
        backdropFilter: 'blur(40px) saturate(200%)',
        borderLeft: '1px solid rgba(255,255,255,0.07)',
        boxShadow: `-40px 0 80px rgba(0,0,0,0.6), inset 1px 0 0 rgba(255,255,255,0.04)`,
      }}
    >
      {/* Accent glow bar at top */}
      <div className="h-0.5 w-full" style={{ background: `linear-gradient(90deg, transparent, ${accent}, transparent)` }} />

      {/* Close Button */}
      <button
        onClick={() => { setAnimated(false); setTimeout(() => onUpdate(null), 600); }}
        className="absolute top-6 right-6 z-10 w-10 h-10 rounded-full flex items-center justify-center transition-all"
        style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}
        onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.12)'}
        onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
      >
        <svg className="w-4 h-4 text-white/60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      {/* Content */}
      <div className="flex flex-col gap-0 flex-1 overflow-y-auto custom-scroll p-8 pt-12">
        
        {/* Header */}
        <div className="mb-8">
          <div className="text-[10px] font-bold tracking-[0.4em] uppercase mb-3" style={{ color: accent }}>
            Component Specifications
          </div>
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl shrink-0"
              style={{ background: `${accent}15`, border: `1px solid ${accent}30` }}>
              {data.icon}
            </div>
            <div>
              <h2 className="font-syncopate text-2xl text-white font-bold leading-tight">{data.title}</h2>
              <div className="text-[9px] font-bold tracking-[0.3em] mt-1.5 uppercase" style={{ color: `${accent}90` }}>
                {data.subtitle}
              </div>
            </div>
          </div>
        </div>

        {/* Description */}
        <p className="text-white/50 font-light leading-relaxed text-sm mb-8 border-l-2 pl-4"
          style={{ borderColor: `${accent}40` }}>
          {data.content}
        </p>

        {/* Performance Metrics */}
        <div className="mb-8">
          <div className="text-[9px] font-bold tracking-[0.3em] uppercase text-white/25 mb-4">Performance Profile</div>
          <div className="space-y-3">
            {data.metrics.map((m, i) => (
              <div key={m.label}>
                <div className="flex justify-between text-[10px] mb-1.5">
                  <span className="text-white/40 font-bold tracking-widest uppercase">{m.label}</span>
                  <span className="font-bold tabular-nums" style={{ color: accent }}>{m.pct}%</span>
                </div>
                <div className="h-1 rounded-full bg-white/5 overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-1000 ease-out"
                    style={{
                      width: animated ? `${m.pct}%` : '0%',
                      background: `linear-gradient(90deg, ${accent}80, ${accent})`,
                      transitionDelay: `${i * 150 + 200}ms`,
                      boxShadow: `0 0 8px ${accent}60`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Specs Grid */}
        <div>
          <div className="text-[9px] font-bold tracking-[0.3em] uppercase text-white/25 mb-4">Technical Data</div>
          <div className="grid grid-cols-2 gap-2">
            {data.specs.map(spec => (
              <div
                key={spec.label}
                className="p-3.5 rounded-xl"
                style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}
              >
                <div className="text-[8px] font-bold tracking-[0.2em] uppercase mb-1" style={{ color: `${accent}80` }}>
                  {spec.label}
                </div>
                <div className="text-white text-xs font-bold">{spec.value}</div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="mt-8 pt-6 border-t border-white/5">
          <button
            className="w-full py-3 rounded-xl text-[10px] font-bold tracking-[0.25em] transition-all"
            style={{
              background: `${accent}15`,
              border: `1px solid ${accent}30`,
              color: accent,
            }}
            onMouseEnter={e => { e.currentTarget.style.background = `${accent}25`; }}
            onMouseLeave={e => { e.currentTarget.style.background = `${accent}15`; }}
          >
            CONFIGURE THIS COMPONENT ✦
          </button>
        </div>
      </div>
    </div>
  );
}
