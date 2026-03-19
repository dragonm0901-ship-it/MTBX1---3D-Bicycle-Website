import { useEffect, useRef, useState } from 'react';

const AWARD_ITEMS = [
  '⬡ Eurobike Gold Award 2025',
  '⬡ Red Dot Design Award Winner',
  '⬡ MBUK Bike of the Year 2026',
  '⬡ CyclingTips Editor\'s Choice',
  '⬡ UCI Approved Frame',
];

const ENGINEERING_FACTS = [
  { stat: '850G', label: 'Frame Weight',         desc: 'M size raw frame in T1000 carbon' },
  { stat: '22%',  label: 'Lateral Stiffness',    desc: 'vs prev-gen platform' },
  { stat: '203',  label: 'mm Travel',             desc: 'Front & rear absorption' },
  { stat: '3',    label: 'Year R&D',              desc: 'World Cup race development' },
  { stat: '63.5', label: '° Head Angle',          desc: 'Descending geometry' },
  { stat: '14%',  label: 'Drag Reduction',        desc: 'Internal cable routing benefit' },
];

export default function About() {
  const [countersTriggered, setCountersTriggered] = useState(false);
  const sectionRef = useRef();

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setCountersTriggered(true); },
      { threshold: 0.3 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section id="about" ref={sectionRef} className="py-32 px-[5%] md:px-[8%] bg-zinc-950 relative z-10 overflow-hidden">
      {/* Subtle background grid */}
      <div className="absolute inset-0 opacity-5"
        style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)', backgroundSize: '80px 80px' }} />

      {/* Background glow */}
      <div className="absolute top-1/3 right-0 w-96 h-96 bg-red-900/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-64 h-64 bg-gold/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-8">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="h-px w-8 bg-red-accent" />
              <span className="text-red-accent font-bold tracking-[0.4em] uppercase text-[10px]">Legacy of Speed</span>
            </div>
            <h2 className="font-syncopate text-5xl md:text-7xl font-black tracking-tighter leading-none text-white">
              BEYOND<br/><span className="text-gradient-gold">THE LIMIT</span>
            </h2>
          </div>
          <p className="text-white/40 font-grotesk text-base leading-relaxed font-light max-w-md border-l border-white/10 pl-6 md:pb-2">
            Three years of iterative battlefield engineering. Every watt of rider output translated into vertical dominance.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-20">
          {ENGINEERING_FACTS.map((f, i) => (
            <div
              key={f.label}
              className="glass rounded-2xl p-5 group hover:-translate-y-1 transition-all duration-300 hover:border-gold/20"
              style={{ animationDelay: `${i * 100}ms` }}
            >
              <div
                className={`font-syncopate text-2xl text-white mb-1 transition-opacity duration-700 ${countersTriggered ? 'opacity-100' : 'opacity-0'}`}
                style={{ transitionDelay: `${i * 150}ms` }}
              >
                {f.stat}
              </div>
              <div className="text-gold text-[9px] font-bold tracking-widest uppercase mb-2">{f.label}</div>
              <div className="text-white/25 text-[10px] leading-relaxed">{f.desc}</div>
            </div>
          ))}
        </div>

        {/* Two Column Feature */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left: The Frame Story */}
          <div className="space-y-8">
            <div>
              <div className="text-[9px] font-bold tracking-[0.4em] text-red-accent mb-4 uppercase">T1000 Carbon Construction</div>
              <h3 className="font-syncopate text-3xl text-white font-bold leading-tight mb-6">
                AEROSPACE<br/>MONOCOQUE
              </h3>
              <p className="text-white/50 font-grotesk leading-relaxed font-light">
                We start with sheets of T1000 High-Modulus carbon fiber—the same grade used in aerospace structures—and hand-lay them into a monocoque frame using proprietary pre-preg resin systems cured at 130°C.
              </p>
            </div>
            
            {/* Feature bars */}
            <div className="space-y-4">
              {[
                { label: 'Structural Integrity', pct: 98 },
                { label: 'Torsional Rigidity', pct: 95 },
                { label: 'Impact Resistance', pct: 89 },
              ].map((bar, i) => (
                <div key={bar.label}>
                  <div className="flex justify-between text-[10px] mb-2">
                    <span className="text-white/50 font-bold tracking-widest uppercase">{bar.label}</span>
                    <span className="text-gold font-bold">{bar.pct}%</span>
                  </div>
                  <div className="h-px bg-white/8 relative">
                    <div
                      className="absolute top-0 left-0 h-full bg-gradient-to-r from-red-accent to-gold transition-all duration-1000 ease-out"
                      style={{
                        width: countersTriggered ? `${bar.pct}%` : '0%',
                        transitionDelay: `${i * 200 + 400}ms`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Carbon Weave Visual + Awards */}
          <div className="relative">
            <div
              className="aspect-square rounded-[48px] overflow-hidden flex flex-col relative"
              style={{
                background: 'repeating-conic-gradient(rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.03) 25%, transparent 0%, transparent 50%) 0 0 / 20px 20px, #0a0a0a',
                border: '1px solid rgba(255,255,255,0.06)',
              }}
            >
              {/* Glow orb */}
              <div className="absolute inset-0 bg-radial-glow-red opacity-30" />

              {/* Center content */}
              <div className="flex-1 flex flex-col items-center justify-center relative z-10 p-10">
                <div className="w-20 h-20 rounded-full border border-gold/25 flex items-center justify-center mb-6 float-anim">
                  <svg className="w-10 h-10 text-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h4 className="font-syncopate text-2xl text-white text-center mb-3">KINETIC<br/>ENERGY</h4>
                <p className="text-white/35 text-sm font-light text-center max-w-xs leading-relaxed">
                  Optimized center of gravity for unparalleled cornering stability at extreme speeds.
                </p>
              </div>

              {/* Awards Marquee */}
              <div className="border-t border-white/5 py-4 overflow-hidden">
                <div className="marquee-inner flex gap-8 whitespace-nowrap">
                  {[...AWARD_ITEMS, ...AWARD_ITEMS].map((award, i) => (
                    <span key={i} className="text-white/25 text-[9px] font-bold tracking-widest uppercase shrink-0">
                      {award}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Floating badge */}
            <div
              className="absolute -top-4 -right-4 glass-gold rounded-2xl px-4 py-3 float-anim-delay"
              style={{ boxShadow: '0 0 30px rgba(201,162,39,0.15)' }}
            >
              <div className="text-gold font-syncopate text-xl font-bold">2026</div>
              <div className="text-white/40 text-[8px] tracking-widest uppercase">ELITE</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
