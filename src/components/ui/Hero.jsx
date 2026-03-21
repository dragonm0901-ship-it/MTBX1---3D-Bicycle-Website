import { useEffect, useRef } from 'react';
import gsap from 'gsap';

const STATS = [
  { value: '2.1', unit: 'KG', label: 'Frame Weight' },
  { value: '203', unit: 'MM', label: 'Travel' },
  { value: '63.5', unit: '°', label: 'Head Angle' },
  { value: '100', unit: 'UNITS', label: 'Worldwide' },
];

export default function Hero({ onBookClick, onEnterGarage }) {
  const heroRef = useRef();

  useEffect(() => {
    // Staggered entrance
    const ctx = gsap.context(() => {
      gsap.fromTo('.hero-text-block',
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, duration: 1.2, ease: 'power4.out', stagger: 0.1, delay: 0.6 }
      );
      gsap.fromTo('.hero-stat',
        { y: 24, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out', stagger: 0.08, delay: 1.2 }
      );
    }, heroRef);
    return () => ctx.revert();
  }, []);

  return (
    <section
      id="hero"
      ref={heroRef}
      className="h-screen w-full flex items-center justify-start px-[8%] md:px-[10%] relative z-10"
    >
      <div className="flex flex-col gap-5 max-w-2xl mt-[-6vh]">
        
        {/* Eyebrow */}
        <div className="hero-text-block flex items-center gap-4 mt-3 sm:mt-0">
          <div className="h-px w-10 bg-gradient-to-r from-transparent to-gold" />
          <span className="text-red-accent font-bold tracking-[6px] text-[11px] uppercase font-grotesk">
            2025 Elite Series · Limited 100
          </span>
        </div>

        {/* Main Headline */}
        <h1 className="hero-text-block font-syncopate text-[16vw] sm:text-[10vw] md:text-[8vw] lg:text-[7vw] leading-[0.82] tracking-[-0.03em]">
          <span className="text-gradient-platinum block">ULTRA</span>
          <span className="text-gradient-gold block">CARBON</span>
        </h1>

        {/* Subtext */}
        <p className="hero-text-block text-white/50 font-grotesk text-base md:text-lg font-light leading-relaxed max-w-sm mt-2 pl-5 border-l border-red-accent/30">
          Precision sculpted for maximum<br />vertical dominance. Engineering<br />the impossible.
        </p>

        {/* CTAs */}
        <div className="hero-text-block flex flex-wrap gap-4 mt-6 pointer-events-auto">
          <button
            onClick={onBookClick}
            className="relative overflow-hidden bg-red-accent text-white px-9 py-4 rounded-full font-bold tracking-[0.2em] text-[11px] hover:bg-red-hot transition-all shadow-red-glow hover:-translate-y-0.5 shimmer"
          >
            BOOK A RIDE
          </button>
          <button
            onClick={onEnterGarage}
            className="group flex items-center gap-3 glass border border-white/10 text-white px-9 py-4 rounded-full font-bold tracking-[0.2em] text-[11px] hover:bg-white/10 transition-all hover:-translate-y-0.5"
          >
            ENTER GARAGE
            <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </button>
        </div>

        {/* Stat Badges */}
        <div className="flex flex-wrap gap-3 mt-4">
          {STATS.map((s) => (
            <div
              key={s.label}
              className="hero-stat glass rounded-2xl px-4 py-3 flex flex-col items-center min-w-[80px]"
            >
              <div className="font-syncopate text-lg text-white leading-none">
                {s.value}<span className="text-gold text-xs ml-0.5">{s.unit}</span>
              </div>
              <div className="text-white/30 text-[8px] font-bold tracking-widest uppercase mt-1">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 pointer-events-none">
        <span className="text-white/20 text-[9px] font-bold tracking-[0.4em] uppercase">Scroll</span>
        <div className="w-px h-10 bg-gradient-to-b from-white/10 to-transparent" />
      </div>
    </section>
  );
}
