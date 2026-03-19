import { useState, useEffect } from 'react';

export default function Navbar({ onTechClick, onSpecsClick, onBookClick }) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <nav
        className={`fixed top-5 left-1/2 -translate-x-1/2 w-[92%] md:w-[75%] max-w-5xl rounded-full flex justify-between items-center px-5 md:px-8 py-4 z-50 transition-all duration-700 ${
          scrolled
            ? 'glass-dark shadow-luxury'
            : 'bg-gradient-to-r from-red-accent/95 to-red-accent/80 shadow-red-glow'
        }`}
      >
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${scrolled ? 'bg-red-accent/80' : 'bg-white/20'}`}>
            <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
              <circle cx="6" cy="18" r="3" fill="none" stroke="currentColor" strokeWidth="2"/>
              <circle cx="18" cy="18" r="3" fill="none" stroke="currentColor" strokeWidth="2"/>
              <path d="M6 18 L12 6 L18 18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>
              <path d="M6 18 L10 11" stroke="currentColor" strokeWidth="1.5"/>
            </svg>
          </div>
          <div className="text-white font-syncopate text-lg md:text-xl font-bold tracking-tight leading-none">
            MTB<span className={`font-light ${scrolled ? 'text-gold' : 'text-white/70'}`}>X1</span>
          </div>
        </div>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-8">
          <button
            onClick={onTechClick}
            className="text-white/80 font-bold tracking-[0.15em] text-[11px] hover:text-white transition-all hover:-translate-y-0.5"
          >
            TECH
          </button>
          <button
            onClick={onSpecsClick}
            className="text-white/80 font-bold tracking-[0.15em] text-[11px] hover:text-white transition-all hover:-translate-y-0.5"
          >
            SPECS
          </button>
          <div className="w-px h-5 bg-white/15" />
          <button
            className={`px-6 py-2.5 rounded-full font-bold tracking-[0.12em] text-[11px] transition-all duration-300 ${
              scrolled
                ? 'bg-red-accent text-white hover:bg-red-hot glow-pulse-red'
                : 'bg-white text-black hover:bg-black hover:text-white hover:border hover:border-white/20'
            }`}
            onClick={onBookClick}
          >
            BOOK A RIDE
          </button>
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden text-white flex flex-col justify-center items-center gap-1.5 w-8 h-8"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <span className={`w-5 h-0.5 bg-white rounded-full transition-all duration-300 ${menuOpen ? 'rotate-45 translate-y-2' : ''}`} />
          <span className={`w-5 h-0.5 bg-white rounded-full transition-all duration-300 ${menuOpen ? 'opacity-0' : ''}`} />
          <span className={`w-5 h-0.5 bg-white rounded-full transition-all duration-300 ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
        </button>
      </nav>

      {/* Mobile Menu */}
      <div
        className={`fixed inset-x-4 top-20 z-40 glass-dark rounded-3xl overflow-hidden transition-all duration-500 md:hidden ${
          menuOpen ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 -translate-y-4 pointer-events-none'
        }`}
        style={{ boxShadow: '0 20px 60px rgba(0,0,0,0.7)' }}
      >
        <div className="p-6 space-y-1">
          {['TECH', 'SPECS'].map((item, i) => (
            <button
              key={item}
              onClick={() => { i === 0 ? onTechClick() : onSpecsClick(); setMenuOpen(false); }}
              className="w-full text-left px-4 py-4 text-white/70 font-bold tracking-[0.2em] text-sm hover:text-white hover:bg-white/5 rounded-xl transition-all"
            >
              {item}
            </button>
          ))}
          <div className="h-px bg-white/5 mx-4 my-2" />
          <button
            className="w-full bg-red-accent text-white py-4 rounded-xl font-bold tracking-[0.2em] text-sm hover:bg-red-hot transition-all"
            onClick={() => { onBookClick(); setMenuOpen(false); }}
          >
            BOOK A RIDE
          </button>
        </div>
      </div>
    </>
  );
}
