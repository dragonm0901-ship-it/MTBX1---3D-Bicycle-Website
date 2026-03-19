import { useProgress } from '@react-three/drei';
import { useEffect, useState, useRef } from 'react';

const LOADING_STEPS = [
  'Initializing 3D Engine',
  'Loading T1000 Frame Geometry',
  'Calibrating Suspension Matrix',
  'Applying Carbon Weave Shaders',
  'Finalizing Showroom Configuration',
];

export default function Loader() {
  const { progress, active } = useProgress();
  const [show, setShow] = useState(true);
  const [loadingStep, setLoadingStep] = useState(0);
  const stepTimerRef = useRef();

  // Cycle through loading steps
  useEffect(() => {
    if (!show) return;
    stepTimerRef.current = setInterval(() => {
      setLoadingStep(prev => (prev + 1) % LOADING_STEPS.length);
    }, 1400);
    return () => clearInterval(stepTimerRef.current);
  }, [show]);

  // Safety fallback
  useEffect(() => {
    const safetyTimer = setTimeout(() => setShow(false), 18000);
    if (progress === 100) {
      const timer = setTimeout(() => setShow(false), 900);
      return () => { clearTimeout(timer); clearTimeout(safetyTimer); };
    }
    return () => clearTimeout(safetyTimer);
  }, [progress, active]);

  const isFinished = progress === 100;
  if (!show) return null;

  return (
    <div
      className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center transition-all duration-1200 ease-in-out
        ${isFinished ? 'opacity-0 pointer-events-none scale-[1.04]' : 'opacity-100 scale-100'}`}
      style={{ background: '#050505' }}
    >
      {/* Animated background grid */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.8) 1px, transparent 1px)', backgroundSize: '60px 60px' }}
      />
      
      {/* Radial glows */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-red-900/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-64 h-64 bg-gold/5 rounded-full blur-[100px] pointer-events-none" />

      {/* Top corner brand marker */}
      <div className="absolute top-8 left-8 flex items-center gap-3">
        <div className="w-6 h-6 rounded-full bg-red-accent/20 border border-red-accent/30 flex items-center justify-center">
          <svg className="w-3 h-3 text-red-accent" fill="none" viewBox="0 0 24 24">
            <circle cx="6" cy="18" r="3" fill="none" stroke="currentColor" strokeWidth="2"/>
            <circle cx="18" cy="18" r="3" fill="none" stroke="currentColor" strokeWidth="2"/>
            <path d="M6 18 L12 6 L18 18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>
          </svg>
        </div>
        <span className="font-syncopate text-white/50 text-sm font-bold tracking-tight">MTBX1</span>
      </div>

      {/* Main loader content */}
      <div className="flex flex-col items-center relative z-10 gap-10">
        
        {/* Animated rotating ring */}
        <div className="relative w-24 h-24">
          <svg className="w-full h-full animate-rotate-slow" viewBox="0 0 96 96" fill="none">
            <circle cx="48" cy="48" r="44" stroke="rgba(255,255,255,0.04)" strokeWidth="2"/>
            <circle
              cx="48" cy="48" r="44"
              stroke="url(#loaderGrad)"
              strokeWidth="2"
              strokeLinecap="round"
              strokeDasharray="138 138"
              strokeDashoffset={138 - (138 * progress / 100)}
              style={{ transition: 'stroke-dashoffset 0.4s ease-out' }}
            />
            <defs>
              <linearGradient id="loaderGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#b90202"/>
                <stop offset="100%" stopColor="#c9a227"/>
              </linearGradient>
            </defs>
          </svg>
          {/* Center percentage */}
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="font-syncopate text-white text-lg font-bold tabular-nums">
              {Math.round(progress)}
            </span>
          </div>
        </div>

        {/* Brand name */}
        <div className="text-center space-y-2">
          <h2 className="font-syncopate text-3xl md:text-5xl font-bold tracking-tight text-white flex items-baseline gap-4">
            MTB PRO
            <span className="text-white/15 font-light text-xl">SYSTEMS</span>
          </h2>
          <div className="text-gold tracking-[0.6em] text-[9px] uppercase font-bold opacity-60">
            2026 Elite Series
          </div>
        </div>

        {/* Loading step indicator */}
        <div className="text-center space-y-3 min-h-[42px] flex flex-col items-center justify-center">
          <div
            key={loadingStep}
            className="text-white/35 text-xs font-grotesk tracking-widest uppercase"
            style={{ animation: 'counter-anim 0.4s ease-out' }}
          >
            {LOADING_STEPS[loadingStep]}
          </div>
          
          {/* Dots */}
          <div className="flex gap-1.5">
            {LOADING_STEPS.map((_, i) => (
              <div
                key={i}
                className={`rounded-full transition-all duration-500 ${i === loadingStep ? 'w-6 h-1 bg-red-accent' : 'w-1 h-1 bg-white/15'}`}
              />
            ))}
          </div>
        </div>

        {/* Progress bar */}
        <div className="w-64 max-w-[80vw] space-y-2">
          <div className="h-px bg-white/8 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-500 ease-out"
              style={{
                width: `${progress}%`,
                background: 'linear-gradient(90deg, #b90202, #c9a227)',
                boxShadow: '0 0 12px rgba(185,2,2,0.5)',
              }}
            />
          </div>
        </div>
      </div>

      {/* Bottom brand tagline */}
      <div className="absolute bottom-10 text-center">
        <p className="text-white/10 text-[9px] font-bold tracking-[0.5em] uppercase">
          ENGINEERING THE IMPOSSIBLE
        </p>
      </div>
    </div>
  );
}
