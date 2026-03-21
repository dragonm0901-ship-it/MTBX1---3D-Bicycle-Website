import { Component, Circle, Sliders, ArrowUpDown } from 'lucide-react';

const GALLERY_ITEMS = [
  {
    title: "Carbon Weave",
    sub: "T1000 Aerospace Grade",
    aspect: "col-span-2 row-span-2",
    gradient: "from-zinc-900 via-zinc-800 to-zinc-950",
    accent: "#c9a227",
    icon: Component,
    number: "01",
  },
  {
    title: "Precision Hubs",
    sub: "DT Swiss 240 Internals",
    aspect: "col-span-1 row-span-1",
    gradient: "from-zinc-900 to-zinc-950",
    accent: "#0a8aff",
    icon: Circle,
    number: "02",
  },
  {
    title: "Cockpit",
    sub: "Zero Cable Architecture",
    aspect: "col-span-1 row-span-1",
    gradient: "from-zinc-950 to-black",
    accent: "#2dcf52",
    icon: Sliders,
    number: "03",
  },
  {
    title: "Downhill Stance",
    sub: "World Cup Geometry",
    aspect: "col-span-2 row-span-1",
    gradient: "from-zinc-900 to-stone-950",
    accent: "#b90202",
    icon: ArrowUpDown,
    number: "04",
  },
];

export default function Gallery() {
  return (
    <section id="gallery" className="py-32 px-[5%] md:px-[8%] bg-zinc-950 relative z-10 overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60vw] h-[60vw] bg-red-900/5 rounded-full blur-[150px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="h-px w-8 bg-gold" />
              <span className="text-gold font-bold tracking-[0.5em] uppercase text-[10px]">Aesthetic Engineering</span>
            </div>
            <h2 className="font-syncopate text-5xl md:text-6xl font-bold tracking-tight text-white">
              PORTFOLIO
            </h2>
          </div>
          <p className="text-white/35 text-sm font-grotesk max-w-xs md:text-right">
            Every surface curated. Every angle intentional.
          </p>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 auto-rows-[240px] md:auto-rows-[260px] gap-4">
          {GALLERY_ITEMS.map((item, idx) => (
            <div
              key={idx}
              className={`${item.aspect} group relative overflow-hidden rounded-3xl cursor-crosshair`}
              style={{
                background: `linear-gradient(135deg, ${item.accent}08 0%, transparent 60%)`,
                border: '1px solid rgba(255,255,255,0.06)',
              }}
            >
              {/* Carbon texture layer */}
              <div className="absolute inset-0 carbon-texture opacity-60" />
              
              {/* Gradient overlay */}
              <div className={`absolute inset-0 bg-gradient-to-t ${item.gradient} opacity-80`} />
              
              {/* Hover Accent Glow */}
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700"
                style={{ background: `radial-gradient(ellipse at center, ${item.accent}20 0%, transparent 70%)` }}
              />
              
              {/* Scale on hover */}
              <div
                className="absolute inset-0 bg-white/0 group-hover:bg-white/[0.02] transition-colors duration-700 scale-100 group-hover:scale-[1.03] transition-transform origin-center"
                style={{ transitionDuration: '700ms' }}
              />

              {/* Number badge */}
              <div className="absolute top-6 right-6 z-20">
                <span className="text-white/10 font-syncopate text-5xl font-bold leading-none">
                  {item.number}
                </span>
              </div>

              <div
                className="absolute top-6 left-6 z-20 w-10 h-10 rounded-xl flex items-center justify-center text-lg opacity-60 group-hover:opacity-100 group-hover:scale-110 transition-all duration-500"
                style={{ background: `${item.accent}20`, border: `1px solid ${item.accent}30`, color: item.accent }}
              >
                <item.icon size={20} />
              </div>

              {/* Label */}
              <div className="absolute bottom-0 left-0 right-0 z-20 p-6 translate-y-2 group-hover:translate-y-0 transition-transform duration-500 ease-out">
                <div className="text-[9px] font-bold tracking-[0.3em] uppercase mb-1.5" style={{ color: `${item.accent}` }}>
                  {item.sub}
                </div>
                <h4 className="font-syncopate text-lg md:text-xl text-white font-bold leading-tight">
                  {item.title}
                </h4>
              </div>

              {/* Bottom border accent */}
              <div
                className="absolute bottom-0 left-0 w-0 group-hover:w-full h-0.5 transition-all duration-700 ease-out"
                style={{ background: `linear-gradient(90deg, ${item.accent}, transparent)` }}
              />
            </div>
          ))}
        </div>

        {/* Bottom CTA row */}
        <div className="mt-12 flex items-center justify-between">
          <div className="flex gap-2">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className={`h-0.5 rounded-full transition-all ${i === 1 ? 'w-8 bg-white' : 'w-2 bg-white/20'}`} />
            ))}
          </div>
          <div className="text-white/20 text-[9px] font-bold tracking-[0.3em] uppercase">
            4 / 4 PANELS
          </div>
        </div>
      </div>
    </section>
  );
}
