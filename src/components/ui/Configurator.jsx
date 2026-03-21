import { useState, useRef, useEffect } from 'react';
import { 
  Square, 
  Diamond, 
  Component, 
  Layers, 
  Sparkles, 
  Circle, 
  Sliders, 
  Settings, 
  ArrowUpDown, 
  Disc 
} from 'lucide-react';
import gsap from 'gsap';

const COLORS = [
  { name: 'Carbon Black',   hex: '#0a0a0a', label: 'CARBON',   category: 'matte' },
  { name: 'Stealth Gray',   hex: '#1c1c1e', label: 'STEALTH',  category: 'matte' },
  { name: 'Arctic White',   hex: '#f0efeb', label: 'ARCTIC',   category: 'gloss' },
  { name: 'Platinum',       hex: '#c0c0c8', label: 'PLATINUM', category: 'gloss' },
  { name: 'Racing Red',     hex: '#b90202', label: 'RACING',   category: 'gloss' },
  { name: 'Crimson',        hex: '#7b0000', label: 'CRIMSON',  category: 'matte' },
  { name: 'Electric Blue',  hex: '#005fa3', label: 'ELECTRIC', category: 'gloss' },
  { name: 'Deep Ocean',     hex: '#003865', label: 'OCEAN',    category: 'matte' },
  { name: 'Forest',         hex: '#1a4a2e', label: 'FOREST',   category: 'matte' },
  { name: 'Toxic Green',    hex: '#2dcf52', label: 'TOXIC',    category: 'gloss' },
  { name: 'Gold Chrome',    hex: '#c9a227', label: 'GOLD',     category: 'chrome' },
  { name: 'Raw Carbon',     hex: '#1a1a1a', label: 'RAW',      category: 'carbon' },
];

const MATERIAL_FINISHES = [
  { id: 'matte',  label: 'Matte', icon: Square },
  { id: 'gloss',  label: 'Gloss', icon: Diamond },
  { id: 'chrome', label: 'Chrome', icon: Component },
  { id: 'carbon', label: 'Carbon Weave', icon: Layers },
  { id: 'custom', label: 'Custom', icon: Sparkles },
];

const COMPONENTS = {
  wheels: {
    label: 'WHEELS',
    icon: Circle,
    options: [
      { id: 'stock',    name: 'DT Swiss OPM',     sub: 'Stock – 29" Carbon', price: 0 },
      { id: 'mid',      name: 'Industry Nine',     sub: '29" Carbon 1/1',    price: 850 },
      { id: 'elite',    name: 'Enve M Series',     sub: '29" Carbon XC',     price: 1800 },
      { id: 'factory',  name: 'Roval Traverse SL', sub: '29" Carbon Factory', price: 2600 },
    ]
  },
  handlebars: {
    label: 'COCKPIT',
    icon: Sliders,
    options: [
      { id: 'stock',    name: 'Race Face Atlas',   sub: 'Stock – 800mm 35mm', price: 0 },
      { id: 'mid',      name: 'Renthal Fatbar',    sub: '810mm Carbon',       price: 380 },
      { id: 'elite',    name: 'Enve M5 System',    sub: '810mm Full Carbon',  price: 890 },
      { id: 'factory',  name: 'Tune Barfly',       sub: '820mm Aerobar',      price: 1400 },
    ]
  },
  drivetrain: {
    label: 'DRIVETRAIN',
    icon: Settings,
    options: [
      { id: 'stock',    name: 'Shimano XT',        sub: '12-Speed Mech',      price: 0 },
      { id: 'mid',      name: 'Shimano XTR Mech',  sub: '12-Speed Precision', price: 680 },
      { id: 'elite',    name: 'Shimano XTR Di2',   sub: '12-Speed Electronic', price: 1950 },
      { id: 'factory',  name: 'SRAM XX Eagle AXS', sub: '12-Speed Wireless',  price: 2800 },
    ]
  },
  suspension: {
    label: 'SUSPENSION',
    icon: ArrowUpDown,
    options: [
      { id: 'stock',    name: 'Fox 38 Float',      sub: '29" 170mm Factory',  price: 0 },
      { id: 'mid',      name: 'Fox 38 Factory',    sub: '29" Kashima GRIP2',  price: 450 },
      { id: 'elite',    name: 'Öhlins RXF 38',     sub: '170mm Manual',       price: 1200 },
      { id: 'factory',  name: 'Öhlins RXF 38 M.2', sub: '170mm Inline',       price: 1800 },
    ]
  },
  brakes: {
    label: 'BRAKES',
    icon: Disc,
    options: [
      { id: 'stock',    name: 'Shimano XT M8120',  sub: '4-Piston Stock',     price: 0 },
      { id: 'mid',      name: 'Shimano XTR M9120', sub: '4-Piston Finned',    price: 320 },
      { id: 'elite',    name: 'Hope Tech 4 E4',    sub: '4-Piston Motox',     price: 480 },
      { id: 'factory',  name: 'Magura MT7 Pro',    sub: '4-Piston Carbotecture', price: 720 },
    ]
  },
};

const BASE_PRICE = 12_800;

export default function Configurator({ currentColor, onChangeColor, onFinalize, isGarageOpen }) {
  const [activeTab, setActiveTab] = useState('color');
  const [activeFinish, setActiveFinish] = useState('matte');
  const [selectedComponents, setSelectedComponents] = useState({
    wheels: 'stock', handlebars: 'stock', drivetrain: 'stock', suspension: 'stock', brakes: 'stock',
  });
  const panelRef = useRef();
  const pricePrevRef = useRef(BASE_PRICE);

  // ── Calculate total build price ──
  const upgradeCost = Object.entries(selectedComponents).reduce((sum, [cat, id]) => {
    const opt = COMPONENTS[cat]?.options.find(o => o.id === id);
    return sum + (opt?.price ?? 0);
  }, 0);
  const totalPrice = BASE_PRICE + upgradeCost;

  // ── Price counter animation ──
  const priceRef = useRef();
  useEffect(() => {
    if (!priceRef.current) return;
    const start = pricePrevRef.current;
    const end = totalPrice;
    const duration = 800;
    const startTime = performance.now();
    function tick(now) {
      const t = Math.min((now - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      priceRef.current.textContent = `$${Math.round(start + (end - start) * eased).toLocaleString()}`;
      if (t < 1) requestAnimationFrame(tick);
      else pricePrevRef.current = end;
    }
    requestAnimationFrame(tick);
  }, [totalPrice]);

  // ── Entrance animation ──
  useEffect(() => {
    if (!panelRef.current) return;
    if (isGarageOpen) {
      gsap.fromTo(panelRef.current,
        { y: 80, opacity: 0, scale: 0.96 },
        { y: 0, opacity: 1, scale: 1, duration: 0.8, ease: 'power4.out', delay: 0.2 }
      );
    }
  }, [isGarageOpen]);

  const handleComponentSelect = (category, id) => {
    setSelectedComponents(prev => ({ ...prev, [category]: id }));
  };

  const tabs = [
    { id: 'color', label: 'FINISH', count: null },
    { id: 'wheels', label: 'WHEELS', count: null },
    { id: 'handlebars', label: 'COCKPIT', count: null },
    { id: 'drivetrain', label: 'DRIVE', count: null },
    { id: 'suspension', label: 'SUSPENSION', count: null },
    { id: 'brakes', label: 'BRAKES', count: null },
  ];

  return (
    <div className={`fixed bottom-0 left-0 right-0 flex justify-center pb-6 z-40 transition-all duration-700 pointer-events-none ${isGarageOpen ? 'opacity-100' : 'translate-y-full opacity-0'}`}>
      
      {isGarageOpen && (
        <div
          ref={panelRef}
          className="pointer-events-auto w-full max-w-5xl mx-4 overflow-hidden"
          style={{
            background: 'rgba(5, 5, 8, 0.92)',
            backdropFilter: 'blur(40px) saturate(200%)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: '24px',
            boxShadow: '0 -20px 60px rgba(0,0,0,0.7), 0 0 0 1px rgba(255,255,255,0.04)',
          }}
        >
          {/* ── Top Bar: Tabs + Price ── */}
          <div className="flex items-center justify-between px-6 pt-4 pb-3 border-b border-white/5">
            {/* Tab Navigation */}
            <div className="flex items-center gap-1 overflow-x-auto custom-scroll">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-4 py-2 rounded-xl text-[10px] font-bold tracking-[0.2em] whitespace-nowrap transition-all duration-200 ${
                    activeTab === tab.id
                      ? 'bg-white text-black'
                      : 'text-white/40 hover:text-white/80 hover:bg-white/5'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Live Price */}
            <div className="flex items-center gap-6 shrink-0 ml-4">
              <div className="text-right hidden sm:block">
                <div className="text-white/30 text-[9px] font-bold tracking-[0.3em] uppercase">Total Build</div>
                <div
                  ref={priceRef}
                  className="text-gold font-syncopate text-xl font-bold tracking-tight tabular-nums"
                >
                  ${totalPrice.toLocaleString()}
                </div>
              </div>
              <button
                onClick={onFinalize}
                className="group relative overflow-hidden bg-red-accent text-white px-5 py-2.5 rounded-xl font-bold tracking-[0.12em] text-[10px] transition-all hover:bg-red-hot shadow-red-glow"
              >
                <span className="relative z-10 flex items-center gap-2">
                  LOCK BUILD
                  <svg className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </span>
              </button>
            </div>
          </div>

          {/* ── Tab Content ── */}
          <div className="p-5 custom-scroll" style={{ maxHeight: '220px', overflowY: 'auto' }}>
            
            {/* ── COLOR / FINISH TAB ── */}
            {activeTab === 'color' && (
              <div className="space-y-4">
                {/* Material selectors */}
                <div className="flex items-center gap-2">
                  <span className="text-white/25 text-[9px] font-bold tracking-[0.3em] uppercase w-16 shrink-0">MATERIAL</span>
                  <div className="flex gap-2 flex-wrap">
                    {MATERIAL_FINISHES.map(f => (
                      <button
                        key={f.id}
                        onClick={() => setActiveFinish(f.id)}
                        className={`px-3 py-1.5 rounded-lg text-[9px] font-bold tracking-[0.15em] transition-all duration-200 flex items-center gap-1.5 ${
                          activeFinish === f.id
                            ? 'bg-white/15 text-white border border-white/20'
                            : 'text-white/35 hover:text-white/70 border border-transparent hover:border-white/10'
                        }`}
                      >
                        <f.icon size={11} className={activeFinish === f.id ? 'text-white' : 'text-white/40'} />
                        {f.label.toUpperCase()}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Color swatches */}
                <div className="flex items-center gap-3">
                  <span className="text-white/25 text-[9px] font-bold tracking-[0.3em] uppercase w-16 shrink-0">COLOR</span>
                  <div className="flex flex-wrap gap-3">
                    {COLORS.map((c) => (
                      <button
                        key={c.hex}
                        onClick={() => onChangeColor(c.hex)}
                        title={c.name}
                        className="relative group flex flex-col items-center gap-1.5 transition-all duration-200"
                      >
                        <div
                          className={`w-8 h-8 rounded-full transition-all duration-300 ${
                            currentColor === c.hex
                              ? 'scale-125 ring-2 ring-white ring-offset-2 ring-offset-black shadow-white'
                              : 'hover:scale-110'
                          }`}
                          style={{
                            backgroundColor: c.hex,
                            boxShadow: currentColor === c.hex ? `0 0 16px ${c.hex}66` : 'none',
                            border: c.hex === '#f0efeb' ? '1px solid rgba(255,255,255,0.15)' : 'none',
                          }}
                        />
                        <span className={`text-[8px] font-bold tracking-[0.1em] transition-all ${
                          currentColor === c.hex ? 'text-white' : 'text-white/25 group-hover:text-white/50'
                        }`}>
                          {c.label}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Selected color info */}
                <div className="flex items-center gap-3 pt-1 border-t border-white/5">
                  <div className="w-5 h-5 rounded-full shrink-0" style={{ backgroundColor: currentColor }} />
                  <div>
                    <div className="text-white text-xs font-bold">
                      {COLORS.find(c => c.hex === currentColor)?.name ?? 'Custom'}
                    </div>
                    <div className="text-white/35 text-[9px] tracking-widest uppercase">
                      {MATERIAL_FINISHES.find(f => f.id === activeFinish)?.label} Finish · {currentColor.toUpperCase()}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ── COMPONENT TABS ── */}
            {Object.keys(COMPONENTS).map(cat => (
              activeTab === cat && (
                <div key={cat} className="space-y-2">
                  <div className="text-white/25 text-[9px] font-bold tracking-[0.3em] uppercase mb-3">
                    SELECT UPGRADE TIER
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {COMPONENTS[cat].options.map((opt) => {
                      const isSelected = selectedComponents[cat] === opt.id;
                      const tierColors = {
                        stock:   { bg: 'rgba(255,255,255,0.04)', border: 'rgba(255,255,255,0.08)', tag: '#666', tagLabel: 'STOCK' },
                        mid:     { bg: 'rgba(0,160,255,0.06)',   border: 'rgba(0,160,255,0.15)',  tag: '#0a6fa0', tagLabel: 'MID' },
                        elite:   { bg: 'rgba(201,162,39,0.08)',  border: 'rgba(201,162,39,0.2)',  tag: '#c9a227', tagLabel: 'ELITE' },
                        factory: { bg: 'rgba(185,2,2,0.08)',     border: 'rgba(185,2,2,0.2)',      tag: '#b90202', tagLabel: 'FACTORY' },
                      };
                      const tier = tierColors[opt.id];
                      return (
                        <button
                          key={opt.id}
                          onClick={() => handleComponentSelect(cat, opt.id)}
                          className="relative text-left p-3 rounded-xl transition-all duration-300"
                          style={{
                            background: isSelected ? tier.bg : 'rgba(255,255,255,0.02)',
                            border: `1px solid ${isSelected ? tier.border : 'rgba(255,255,255,0.05)'}`,
                            boxShadow: isSelected ? `0 0 20px ${tier.border}` : 'none',
                            transform: isSelected ? 'translateY(-1px)' : 'none',
                          }}
                        >
                          <div className="flex items-start justify-between mb-2">
                            <span className="text-[8px] font-bold tracking-[0.2em]" style={{ color: tier.tag }}>
                              {tier.tagLabel}
                            </span>
                            {isSelected && (
                              <svg className="w-3 h-3 text-white shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                            )}
                          </div>
                          <div className="text-white text-xs font-bold leading-tight">{opt.name}</div>
                          <div className="text-white/35 text-[9px] mt-0.5">{opt.sub}</div>
                          <div className="mt-2 text-[9px] font-bold" style={{ color: tier.tag }}>
                            {opt.price === 0 ? 'INCLUDED' : `+$${opt.price.toLocaleString()}`}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )
            ))}
          </div>

          {/* ── Bottom bar: Active upgrades summary ── */}
          <div className="px-6 py-3 border-t border-white/5 flex items-center justify-between gap-4">
            <div className="flex flex-wrap gap-2">
              {Object.entries(selectedComponents)
                .filter(([, id]) => id !== 'stock')
                .map(([cat, id]) => {
                  const opt = COMPONENTS[cat]?.options.find(o => o.id === id);
                  if (!opt) return null;
                  return (
                    <span key={cat} className="bg-white/5 border border-white/8 rounded-lg px-2.5 py-1 text-[9px] font-bold tracking-[0.1em] text-white/60 flex items-center gap-1.5">
                      <span className="text-gold">✦</span>
                      {opt.name}
                      <span className="text-white/30">+${opt.price.toLocaleString()}</span>
                    </span>
                  );
                })}
              {Object.values(selectedComponents).every(v => v === 'stock') && (
                <span className="text-white/20 text-[9px] tracking-widest">NO UPGRADES SELECTED</span>
              )}
            </div>
            <div className="text-white/20 text-[9px] uppercase tracking-widest shrink-0">
              {Object.values(selectedComponents).filter(v => v !== 'stock').length} UPGRADES
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
