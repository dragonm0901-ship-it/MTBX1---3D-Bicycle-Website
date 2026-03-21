import { Instagram, Youtube, Linkedin, Twitter } from 'lucide-react';

const FOOTER_LINKS = {
  Architecture: ['V10 Platform', 'T1000 Carbon', 'Suspension Logic', 'Frame Geometry'],
  Performance:  ['XTR Di2 System', 'Fox Factory 40', 'Enve Wheels', 'Magura MT7'],
  Support:      ['Find a Dealer', 'Warranty', 'Service Network', 'Contact'],
};

const SOCIAL = [
  { icon: Twitter, label: 'X' },
  { icon: Instagram, label: 'IG' },
  { icon: Youtube, label: 'YT' },
  { icon: Linkedin, label: 'LI' },
];

export default function Footer() {
  return (
    <footer className="bg-black border-t border-white/5 pt-28 pb-10 px-[8%] relative z-10 overflow-hidden">
      {/* Top glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />

      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-12 md:gap-16 mb-20">
          
          {/* Brand Column */}
          <div className="md:col-span-2 space-y-7">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-red-accent/20 border border-red-accent/30 flex items-center justify-center">
                <svg className="w-5 h-5 text-red-accent" fill="none" viewBox="0 0 24 24">
                  <circle cx="6" cy="18" r="3" fill="none" stroke="currentColor" strokeWidth="1.5"/>
                  <circle cx="18" cy="18" r="3" fill="none" stroke="currentColor" strokeWidth="1.5"/>
                  <path d="M6 18 L12 6 L18 18" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
                </svg>
              </div>
              <h3 className="font-syncopate text-2xl font-bold tracking-tight text-white">
                MTB<span className="text-white/40">PRO</span>
              </h3>
            </div>

            <p className="text-white/30 font-grotesk font-light text-sm max-w-xs leading-relaxed">
              Engineering the world's most capable mountain bikes. Precision, performance, and uncompromising quality since 2026.
            </p>

            {/* Price highlight */}
            <div
              className="rounded-2xl p-5 space-y-1"
              style={{ background: 'rgba(201,162,39,0.06)', border: '1px solid rgba(201,162,39,0.12)' }}
            >
              <div className="text-gold text-[9px] font-bold tracking-[0.4em] uppercase">Build from</div>
              <div className="font-syncopate text-3xl text-white font-bold">$12,800</div>
              <div className="text-white/25 text-[9px] tracking-widest uppercase">100 units · 2026 production</div>
            </div>

            {/* Socials */}
            <div className="flex gap-4">
              {SOCIAL.map(s => (
                <button
                  key={s.label}
                  className="w-9 h-9 rounded-xl border border-white/8 flex items-center justify-center text-white/25 hover:text-white hover:border-white/25 transition-all"
                  aria-label={s.label}
                >
                  <s.icon size={16} />
                </button>
              ))}
            </div>
          </div>

          {/* Link Columns */}
          {Object.entries(FOOTER_LINKS).map(([heading, links]) => (
            <div key={heading} className="space-y-6">
              <h4 className="text-gold text-[9px] font-bold tracking-[0.35em] uppercase">{heading}</h4>
              <ul className="space-y-3">
                {links.map(link => (
                  <li key={link}>
                    <button className="text-white/40 hover:text-white font-grotesk text-sm transition-colors hover:translate-x-0.5 inline-flex items-center gap-2 group">
                      <span className="w-0 group-hover:w-3 h-px bg-gold transition-all duration-300" />
                      {link}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Divider */}
        <div className="h-px w-full bg-gradient-to-r from-transparent via-white/8 to-transparent mb-10" />

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <span className="text-white/15 text-[9px] font-bold tracking-[0.3em] uppercase">
            © 2026 MTB PRO LIMITED. ALL RIGHTS RESERVED.
          </span>
          <div className="flex gap-8">
            {['Privacy Policy', 'Terms of Use', 'Cookie Policy'].map(item => (
              <button key={item} className="text-white/15 hover:text-white/50 text-[9px] font-bold tracking-[0.2em] uppercase transition-colors">
                {item}
              </button>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
