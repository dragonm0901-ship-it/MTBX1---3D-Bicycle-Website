import { useState, useEffect, useRef } from 'react';

export default function CTA({ onBookClick }) {
  const [priceVisible, setPriceVisible] = useState(false);
  const sectionRef = useRef();

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setPriceVisible(true); },
      { threshold: 0.5 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative py-48 px-[8%] bg-zinc-950 z-10 flex items-center justify-center overflow-hidden"
    >
      {/* Complex layered background */}
      <div className="absolute inset-0">
        {/* Grid lines */}
        <div className="absolute inset-0 opacity-[0.03]"
          style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)', backgroundSize: '60px 60px' }} />
        
        {/* Red glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-red-900/15 rounded-full blur-[120px]" />
        
        {/* Corner accents */}
        <div className="absolute top-0 left-0 w-32 h-32 border-l border-t border-white/5" />
        <div className="absolute top-0 right-0 w-32 h-32 border-r border-t border-white/5" />
        <div className="absolute bottom-0 left-0 w-32 h-32 border-l border-b border-white/5" />
        <div className="absolute bottom-0 right-0 w-32 h-32 border-r border-b border-white/5" />
      </div>

      <div className="max-w-5xl w-full text-center space-y-12 relative z-10">
        
        {/* Eyebrow */}
        <div className="flex items-center justify-center gap-4">
          <div className="h-px w-16 bg-gradient-to-r from-transparent to-red-accent" />
          <span className="text-red-accent font-bold tracking-[0.5em] text-[10px] uppercase">Limited Edition · 100 units</span>
          <div className="h-px w-16 bg-gradient-to-l from-transparent to-red-accent" />
        </div>

        {/* Headline */}
        <div>
          <h2 className="font-syncopate text-6xl md:text-8xl font-black leading-none tracking-[-0.03em]">
            <span className="text-gradient-platinum">OWN THE</span>
            <br/>
            <span className="text-gradient-gold">MOUNTAIN</span>
          </h2>
        </div>

        {/* Price reveal */}
        <div
          className={`inline-flex flex-col items-center transition-all duration-1000 ${priceVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}
        >
          <div className="text-white/25 text-[10px] font-bold tracking-[0.5em] uppercase mb-2">Starting at</div>
          <div className="font-syncopate text-5xl md:text-6xl text-white font-bold tabular-nums">
            $12,800
          </div>
          <div className="text-gold text-[10px] font-bold tracking-[0.3em] uppercase mt-2">USD · Fully Configured</div>
        </div>

        {/* Description */}
        <p className="text-white/45 font-grotesk text-lg md:text-xl font-light max-w-2xl mx-auto leading-relaxed">
          Production is limited to 100 units worldwide. Each bicycle is hand-assembled by our master technicians and ships with a lifetime frame warranty.
        </p>

        {/* CTA Group */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={onBookClick}
            className="group relative overflow-hidden bg-white text-black px-12 py-5 rounded-full font-bold tracking-[0.2em] text-sm shadow-white transition-all duration-300 hover:shadow-[0_0_50px_rgba(255,255,255,0.3)] hover:-translate-y-1 shimmer"
          >
            <span className="relative z-10 flex items-center gap-4">
              SECURE YOUR BUILD
              <svg
                className="w-5 h-5 transition-transform group-hover:translate-x-1"
                fill="none" viewBox="0 0 24 24" stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-gold/10 to-red-accent/10 translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-500" />
          </button>
          
          <button className="group flex items-center gap-3 text-white/50 hover:text-white font-bold tracking-[0.2em] text-[11px] transition-all">
            <span className="w-2 h-2 rounded-full bg-red-accent glow-pulse-red" />
            DOWNLOAD SPEC SHEET
            <svg className="w-4 h-4 group-hover:translate-y-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
          </button>
        </div>

        {/* Trust signals */}
        <div className="flex flex-wrap items-center justify-center gap-8 pt-8 border-t border-white/5">
          {[
            { icon: '🏆', text: 'Eurobike Gold Award 2025' },
            { icon: '🌍', text: 'Ships Worldwide' },
            { icon: '♾', text: 'Lifetime Frame Warranty' },
            { icon: '🤝', text: 'White Glove Delivery' },
          ].map((trust) => (
            <div key={trust.text} className="flex items-center gap-2 text-white/25 hover:text-white/50 transition-colors">
              <span className="text-sm">{trust.icon}</span>
              <span className="text-[10px] font-bold tracking-[0.15em] uppercase">{trust.text}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
