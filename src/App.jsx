import { Suspense, useState, useRef, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { Environment, Preload, useGLTF } from '@react-three/drei';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
// UI Components
import Navbar from './components/ui/Navbar';
import Hero from './components/ui/Hero';
import Configurator from './components/ui/Configurator';
import Loader from './components/ui/Loader';
import PartDetails from './components/ui/PartDetails';
import About from './components/ui/About';
import Gallery from './components/ui/Gallery';
import CTA from './components/ui/CTA';
import Footer from './components/ui/Footer';
// 3D Components
import Bike from './components/3d/Bike';
import SceneLighting from './components/3d/SceneLighting';
import CameraRig from './components/3d/CameraRig';
import GarageEnvironment from './components/3d/GarageEnvironment';
import HelmetDisplay from './components/3d/HelmetDisplay';
gsap.registerPlugin(ScrollTrigger);
// ── Custom Cursor ──────────────────────────────────────
function CustomCursor() {
  const dotRef = useRef();
  const ringRef = useRef();
  const pos = useRef({ x: -200, y: -200 });
  const ring = useRef({ x: -200, y: -200 });
  const rafRef = useRef();
  useEffect(() => {
    const onMove = (e) => {
      pos.current = { x: e.clientX, y: e.clientY };
      // Dot: instant snap
      if (dotRef.current) {
        dotRef.current.style.left = `${e.clientX}px`;
        dotRef.current.style.top = `${e.clientY}px`;
      }
    };
    window.addEventListener('mousemove', onMove, { passive: true });
    // Ring: fast lerp — 0.75 snaps almost instantly with a tiny organic feel
    const LERP = 0.38;
    const lerp = (a, b, t) => a + (b - a) * t;
    function tick() {
      ring.current.x = lerp(ring.current.x, pos.current.x, LERP);
      ring.current.y = lerp(ring.current.y, pos.current.y, LERP);
      if (ringRef.current) {
        ringRef.current.style.left = `${ring.current.x}px`;
        ringRef.current.style.top = `${ring.current.y}px`;
      }
      rafRef.current = requestAnimationFrame(tick);
    }
    rafRef.current = requestAnimationFrame(tick);
    // Interactive element hover
    const grow = () => {
      if (!ringRef.current) return;
      ringRef.current.style.transform = 'translate(-50%, -50%) scale(1.7)';
      ringRef.current.style.borderColor = 'rgba(201,162,39,0.7)';
    };
    const shrink = () => {
      if (!ringRef.current) return;
      ringRef.current.style.transform = 'translate(-50%, -50%) scale(1)';
      ringRef.current.style.borderColor = 'rgba(255,255,255,0.35)';
    };
    // Observe DOM for dynamically-added interactive elements too
    const els = document.querySelectorAll('a, button, [role="button"]');
    els.forEach(el => {
      el.addEventListener('mouseenter', grow);
      el.addEventListener('mouseleave', shrink);
    });
    return () => {
      window.removeEventListener('mousemove', onMove);
      cancelAnimationFrame(rafRef.current);
      els.forEach(el => {
        el.removeEventListener('mouseenter', grow);
        el.removeEventListener('mouseleave', shrink);
      });
    };
  }, []);
  return (
    <>
      <div
        ref={dotRef}
        style={{
          position: 'fixed',
          zIndex: 99999,
          pointerEvents: 'none',
          width: 6, height: 6,
          background: '#b90202',
          borderRadius: '50%',
          transform: 'translate(-50%, -50%)',
          top: -200, left: -200,
        }}
      />
      <div
        ref={ringRef}
        style={{
          position: 'fixed',
          zIndex: 99998,
          pointerEvents: 'none',
          width: 28, height: 28,
          border: '1px solid rgba(255,255,255,0.35)',
          borderRadius: '50%',
          transform: 'translate(-50%, -50%)',
          top: -200, left: -200,
          transition: 'transform 0.15s ease, border-color 0.15s ease',
        }}
      />
    </>
  );
}
// ── Garage HUD ─────────────────────────────────────────
function GarageHUD({ isOpen, onExit, selectedPart, onClearPart }) {
  if (!isOpen) return null;
  return (
    <>
      {/* Exit */}
      <button
        onClick={onExit}
        className="fixed top-5 left-5 z-[60] flex items-center gap-2.5 text-white/70 hover:text-white transition-all group"
        style={{
          background: 'rgba(5,5,8,0.92)',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: '14px', padding: '10px 18px',
          backdropFilter: 'blur(24px)',
          boxShadow: '0 6px 24px rgba(0,0,0,0.5)',
        }}
      >
        <svg className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        <span className="font-grotesk font-bold tracking-[0.18em] text-[10px] uppercase">Exit</span>
      </button>
      {/* Mode badge */}
      <div
        className="fixed top-5 left-1/2 -translate-x-1/2 z-[60] flex items-center gap-2.5"
        style={{ background: 'rgba(5,5,8,0.92)', border: '1px solid rgba(185,2,2,0.2)', borderRadius: '20px', padding: '7px 14px', backdropFilter: 'blur(24px)' }}
      >
        <div className="w-1.5 h-1.5 rounded-full bg-red-accent glow-pulse-red" />
        <span className="font-grotesk text-[10px] font-bold tracking-[0.22em] text-white/60 uppercase">Garage Mode</span>
        <span className="text-white/20">·</span>
        <span className="text-white/35 text-[10px] font-grotesk">
          {selectedPart ? 'Click × to exit inspection' : 'Click hotspots to inspect'}
        </span>
      </div>
      {/* Back to orbit (shown during part zoom) */}
      {selectedPart && (
        <button
          onClick={onClearPart}
          className="fixed top-16 left-1/2 -translate-x-1/2 z-[60] flex items-center gap-2 transition-all"
          style={{
            background: 'rgba(185,2,2,0.15)', border: '1px solid rgba(185,2,2,0.3)',
            borderRadius: '12px', padding: '6px 14px',
            backdropFilter: 'blur(20px)', color: '#ff6666',
            fontSize: 10, fontWeight: 700, letterSpacing: '0.2em',
            fontFamily: "'Space Grotesk', sans-serif", textTransform: 'uppercase',
          }}
        >
          ✕ &nbsp;BACK TO OVERVIEW
        </button>
      )}
      {/* Controls (only shown when no part focused) */}
      {!selectedPart && (
        <div
          className="fixed top-5 right-5 z-[60]"
          style={{
            background: 'rgba(5,5,8,0.88)', border: '1px solid rgba(255,255,255,0.06)',
            borderRadius: '14px', padding: '10px 14px',
            backdropFilter: 'blur(24px)',
          }}
        >
          <div className="space-y-1.5 text-white/30 text-[9px] font-bold tracking-[0.12em] uppercase font-grotesk">
            <div>Drag → Rotate</div>
            <div>Scroll → Zoom</div>
            <div>Click Hotspot → Inspect</div>
          </div>
        </div>
      )}
    </>
  );
}
// ── Main App ────────────────────────────────────────────
function App() {
  const [bikeColor, setBikeColor] = useState('#cc0000');
  const [isGarageOpen, setIsGarageOpen] = useState(false);
  const [selectedPart, setSelectedPart] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState('');
  const mainRef = useRef(null);
  // ── Scroll animations ──
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.utils.toArray('section').forEach((section) => {
        gsap.fromTo(section,
          { opacity: 0, y: 40 },
          { opacity: 1, y: 0, duration: 1.0,
            scrollTrigger: { trigger: section, start: 'top 82%', end: 'top 20%', toggleActions: 'play none none reverse' }
          }
        );
      });
      gsap.to('.canvas-container', {
        opacity: 0, pointerEvents: 'none',
        scrollTrigger: { trigger: '#hero', start: 'center top', end: 'bottom top', scrub: true },
      });
    });
    return () => ctx.revert();
  }, []);
  const openTechSpecs   = () => { setModalContent('tech'); setModalOpen(true); };
  const openComponents  = () => { setModalContent('components'); setModalOpen(true); };
  const handleBookRide  = () => alert('VIP Ride Booking Initialized. A precision tuning specialist will contact you shortly.');
  const handleFinalizeBuild = () => alert('Build specifications locked. Proceeding to carbon curing queue.');
  const toggleGarage = () => {
    setIsGarageOpen(prev => {
      const opening = !prev;
      if (opening) {
        window.scrollTo({ top: 0, behavior: 'auto' });
        document.body.style.overflow = 'hidden';
        gsap.to('.canvas-container', { opacity: 1, pointerEvents: 'auto', duration: 0.6, ease: 'power2.out' });
      } else {
        document.body.style.overflow = 'auto';
        setSelectedPart(null);
      }
      return opening;
    });
  };
  const clearSelectedPart = () => setSelectedPart(null);
  // Handle part selection from hotspots or bike click
  const handleSelectPart = (part) => {
    setSelectedPart(part);
  };
  return (
    <div className={`relative w-full overflow-x-hidden text-white min-h-screen transition-colors duration-1000 ${isGarageOpen ? 'overflow-hidden' : ''}`}
      style={{ background: '#050505' }}>
      <CustomCursor />
      {/* ── 3D Canvas ── */}
      <div className={`canvas-container fixed inset-0 w-full h-screen z-0 transition-opacity duration-1000 ${isGarageOpen ? 'opacity-100 !pointer-events-auto' : ''}`}>
        <Canvas
          camera={{ position: [-1.5, 0.2, 7.5], fov: 44 }}
          gl={{ antialias: true, alpha: true, powerPreference: 'high-performance', toneMapping: 3, toneMappingExposure: 1.15 }}
          shadows="soft"
          dpr={[1, 2]}
        >
          <Suspense fallback={null}>
            <CameraRig isGarageOpen={isGarageOpen} selectedPart={selectedPart} />
            <SceneLighting isGarageOpen={isGarageOpen} />
            {/* Main display bike */}
            <Bike
              color={bikeColor}
              isGarageOpen={isGarageOpen}
              onToggleGarage={toggleGarage}
              onSelectPart={handleSelectPart}
              selectedPart={selectedPart}
            />
            {/* Garage 3D environment (walls, floor, display bikes, lights) */}
            {isGarageOpen && <GarageEnvironment />}
            {/* Helmet display on left wall */}
            {isGarageOpen && <HelmetDisplay />}
            <Environment
              preset={isGarageOpen ? 'warehouse' : 'studio'}
              environmentIntensity={isGarageOpen ? 0.3 : 0.5}
            />
            <Preload all />
          </Suspense>
        </Canvas>
      </div>
      {/* ── Loader ── */}
      <Loader />
      {/* ── Part Details Slide Panel ── */}
      <PartDetails part={selectedPart} onUpdate={setSelectedPart} />
      {/* ── Garage HUD ── */}
      <GarageHUD
        isOpen={isGarageOpen}
        onExit={toggleGarage}
        selectedPart={selectedPart}
        onClearPart={clearSelectedPart}
      />
      {/* ── Main Content ── */}
      <Suspense fallback={null}>
        <div
          ref={mainRef}
          className={`relative z-10 w-full transition-all duration-700 ease-in-out ${isGarageOpen ? 'opacity-0 pointer-events-none translate-y-10 scale-95' : 'opacity-100 scale-100'}`}
        >
          <Navbar onTechClick={openTechSpecs} onSpecsClick={openComponents} onBookClick={handleBookRide} />
          <main className="relative">
            <Hero onBookClick={handleBookRide} onEnterGarage={toggleGarage} />
            <About />
            <Gallery />
            <CTA onBookClick={handleBookRide} />
          </main>
          <Footer />
        </div>
        {/* ── Configurator ── */}
        <Configurator
          currentColor={bikeColor}
          onChangeColor={setBikeColor}
          onFinalize={handleFinalizeBuild}
          isGarageOpen={isGarageOpen}
        />
      </Suspense>
      {/* ── Tech Specs Modal ── */}
      {modalOpen && (
        <div
          className="fixed inset-0 z-[80] flex items-center justify-center p-4 md:p-10"
          style={{ background: 'rgba(0,0,0,0.92)', backdropFilter: 'blur(12px)' }}
          onClick={() => setModalOpen(false)}
        >
          <div
            className="w-full max-w-5xl h-[80vh] overflow-hidden rounded-[32px] relative flex flex-col md:flex-row"
            style={{ background: 'rgba(8,8,10,0.98)', border: '1px solid rgba(255,255,255,0.08)', boxShadow: '0 0 100px rgba(0,0,0,0.8)' }}
            onClick={e => e.stopPropagation()}
          >
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-6 right-6 z-10 w-10 h-10 rounded-full flex items-center justify-center transition-all"
              style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}
            >
              <svg className="w-5 h-5 text-white/60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <div className="md:w-2/5 p-10 md:p-14 flex flex-col justify-center border-r border-white/5" style={{ background: 'rgba(255,255,255,0.01)' }}>
              <span className="text-red-accent font-bold tracking-[0.35em] uppercase text-[10px] mb-4">Engineering Insight</span>
              <h3 className="font-syncopate text-4xl md:text-5xl font-bold leading-tight tracking-tight text-white mb-6">
                {modalContent === 'tech' ? 'THE\nFRAME' : 'DRIVE\nTRAIN'}
              </h3>
              <p className="text-white/35 font-grotesk font-light leading-relaxed text-sm">
                Precision sculpted for maximum aerodynamic efficiency and structural integrity. Every millimeter calculated for dominance.
              </p>
            </div>
            <div className="md:w-3/5 p-10 md:p-14 overflow-y-auto custom-scroll">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                {(modalContent === 'tech' ? [
                  { label: 'Material Science', body: 'T1000 High-Modulus Carbon Fiber. Aerospace grade resins with integrated impact-dispersion layers.' },
                  { label: 'Geometry', body: 'Aggressive 63.5° head angle optimized for World Cup downhill courses and high-speed stability.' },
                  { label: 'Internalization', body: 'Zero-exposure cable routing. Reduces drag by 14% at 40km/h.' },
                  { label: 'Weight Class', body: 'Total frame weight: 2.1kg (Medium). The lightest DH platform engineered for pro use.' },
                ] : [
                  { label: 'Control Unit', body: 'XTR Di2 Electronic Shifter with programmable sync-shift and 0.02s response time.' },
                  { label: 'Transmission', body: 'Hyperglide+ technology for seamless shifting under 1000W of rider output.' },
                  { label: 'Braking', body: 'Ice-Tech Freeza Rotors with ceramic-piston calipers for fade-free performance.' },
                  { label: 'Suspension', body: 'Fox Factory 40 Float GRIP2 dampers with Kashima coating. 203mm travel.' },
                ]).map(({ label, body }) => (
                  <div key={label}>
                    <h4 className="text-gold font-bold tracking-[0.25em] uppercase text-[9px] mb-3">{label}</h4>
                    <p className="text-white text-base font-grotesk font-light leading-relaxed">{body}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
export default App;