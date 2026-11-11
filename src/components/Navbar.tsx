import React, { useState } from 'react';
import { Menu, X, Dumbbell, Sparkles } from 'lucide-react';

interface NavbarProps {
  onOpenAssessment: () => void;
  hasGeneratedPlan: boolean;
  onViewPlan: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenAssessment,
  hasGeneratedPlan,
  onViewPlan
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [poppedItem, setPoppedItem] = useState<string | null>(null);

  const triggerPop = (id: string) => {
    setPoppedItem(id);
    setTimeout(() => {
      setPoppedItem((prev) => (prev === id ? null : prev));
    }, 450);
  };

  return (
    <header className="sticky top-0 z-50 bg-[#0d0f14]/90 backdrop-blur-md border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-8 h-20">
          {/* Zone 1: Single text wordmark */}
          <a
            href="#home"
            className="flex items-center gap-2.5 text-2xl font-display font-extrabold tracking-wider text-white uppercase whitespace-nowrap shrink-0 group"
          >
            <span className="w-8 h-8 rounded-md bg-gradient-to-br from-[#e6193c] to-[#880b20] flex items-center justify-center text-white shadow-md shadow-[#e6193c]/30 group-hover:scale-105 transition-transform">
              <Dumbbell className="w-5 h-5 text-white" />
            </span>
            <span>
              FIT<span className="text-[#e6193c]">HUB</span>
            </span>
          </a>

          {/* Zone 2: 4-5 concise single-line nav links with pop-up animation */}
          <nav className="hidden md:flex items-center gap-7 text-xs font-semibold tracking-wider text-neutral-300 uppercase">
            <a
              href="#home"
              onClick={() => triggerPop('home')}
              className={`transition-all duration-200 transform whitespace-nowrap shrink-0 hover:text-white hover:-translate-y-0.5 active:scale-125 active:-translate-y-1.5 cursor-pointer select-none ${
                poppedItem === 'home' ? 'animate-nav-pop text-white font-bold' : ''
              }`}
            >
              Home
            </a>
            <a
              href="#assessment"
              onClick={() => triggerPop('assessment')}
              className={`transition-all duration-200 transform whitespace-nowrap shrink-0 hover:text-white hover:-translate-y-0.5 active:scale-125 active:-translate-y-1.5 cursor-pointer select-none ${
                poppedItem === 'assessment' ? 'animate-nav-pop text-white font-bold' : ''
              }`}
            >
              Custom Chart
            </a>
            {hasGeneratedPlan && (
              <button
                onClick={() => {
                  triggerPop('plan');
                  onViewPlan();
                }}
                className={`text-[#e6193c] hover:text-[#ff3b5c] transition-all duration-200 transform whitespace-nowrap shrink-0 flex items-center gap-1.5 cursor-pointer hover:-translate-y-0.5 active:scale-125 active:-translate-y-1.5 select-none ${
                  poppedItem === 'plan' ? 'animate-nav-pop text-white font-bold' : ''
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>My Active Plan</span>
              </button>
            )}
            <a
              href="#disciplines"
              onClick={() => triggerPop('disciplines')}
              className={`transition-all duration-200 transform whitespace-nowrap shrink-0 hover:text-white hover:-translate-y-0.5 active:scale-125 active:-translate-y-1.5 cursor-pointer select-none ${
                poppedItem === 'disciplines' ? 'animate-nav-pop text-white font-bold' : ''
              }`}
            >
              Disciplines
            </a>
            <a
              href="#schedule"
              onClick={() => triggerPop('schedule')}
              className={`transition-all duration-200 transform whitespace-nowrap shrink-0 hover:text-white hover:-translate-y-0.5 active:scale-125 active:-translate-y-1.5 cursor-pointer select-none ${
                poppedItem === 'schedule' ? 'animate-nav-pop text-white font-bold' : ''
              }`}
            >
              Floor Schedule
            </a>
            <a
              href="#coaching"
              onClick={() => triggerPop('coaching')}
              className={`transition-all duration-200 transform whitespace-nowrap shrink-0 hover:text-white hover:-translate-y-0.5 active:scale-125 active:-translate-y-1.5 cursor-pointer select-none ${
                poppedItem === 'coaching' ? 'animate-nav-pop text-white font-bold' : ''
              }`}
            >
              Coaching
            </a>
          </nav>

          {/* Zone 3: 1 primary action */}
          <div className="hidden md:flex items-center gap-3 shrink-0">
            <button
              onClick={onOpenAssessment}
              className="px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-white bg-gradient-to-r from-[#e6193c] to-[#a7112a] hover:from-[#f32448] hover:to-[#c91836] rounded-md transition-all shadow-lg shadow-[#e6193c]/25 hover:shadow-[#e6193c]/40 active:scale-95 whitespace-nowrap shrink-0 cursor-pointer"
            >
              Build My Exercise Chart
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-neutral-300 hover:text-white focus:outline-none"
              aria-label="Toggle mobile menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#11141b] border-b border-white/10 px-4 pt-3 pb-6 space-y-3">
          <nav className="flex flex-col space-y-3 text-sm font-semibold tracking-wide text-neutral-300 uppercase">
            <a
              href="#home"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1 hover:text-white transition-colors"
            >
              Home
            </a>
            <a
              href="#assessment"
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenAssessment();
              }}
              className="py-1 text-[#e6193c] hover:text-white transition-colors"
            >
              Custom Exercise Chart
            </a>
            {hasGeneratedPlan && (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onViewPlan();
                }}
                className="py-1 text-left text-[#e6193c] font-bold flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4" />
                View Generated Plan
              </button>
            )}
            <a
              href="#disciplines"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1 hover:text-white transition-colors"
            >
              Disciplines
            </a>
            <a
              href="#schedule"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1 hover:text-white transition-colors"
            >
              Floor Schedule
            </a>
            <a
              href="#coaching"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1 hover:text-white transition-colors"
            >
              Coaches & Yash Badgujar
            </a>
          </nav>
          <div className="pt-2">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenAssessment();
              }}
              className="w-full py-3 text-xs font-bold uppercase tracking-wider text-white bg-[#e6193c] hover:bg-[#c91836] rounded-md transition-all shadow-md shadow-[#e6193c]/30 text-center"
            >
              Build My Exercise Chart
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
