import React from 'react';
import { ArrowRight, Flame, ShieldCheck, Activity, Users } from 'lucide-react';

interface HeroProps {
  onStartAssessment: () => void;
  onQuickDemo: (presetType: 'bulk' | 'loss' | 'posture') => void;
}

export const Hero: React.FC<HeroProps> = ({ onStartAssessment, onQuickDemo }) => {
  return (
    <section id="home" className="relative overflow-hidden bg-[#78061c] text-white">
      {/* Background Gradient & Athletic Lighting Overlays */}
      <div 
        className="absolute inset-0 bg-gradient-to-br from-[#850820] via-[#a20c29] to-[#42040e] pointer-events-none" 
      />
      
      {/* Subtle athletic texture grid */}
      <div 
        className="absolute inset-0 opacity-10 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" 
      />

      {/* Hero Content Container */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-16 lg:pt-20 lg:pb-28">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
          
          {/* Left Column: Bold Typographic Statement & Value Prop */}
          <div className="lg:col-span-7 space-y-7 z-10">
            {/* Athletic Brand Kicker */}
            <div className="flex items-center gap-2 text-xs font-bold tracking-widest text-red-200 uppercase">
              <span className="w-2 h-2 rounded-full bg-white shadow-sm shadow-white/50" />
              <span>FitHub Master Training System</span>
              <span aria-hidden="true" className="text-white/40">/</span>
              <span>By Yash Badgujar</span>
            </div>

            {/* Giant Condensed Headline matching reference: FUEL BUILD PERFORM */}
            <h1 className="font-display text-6xl sm:text-7xl md:text-8xl lg:text-[6.8rem] font-extrabold uppercase tracking-tight leading-[0.88] text-white drop-shadow-md text-balance">
              FUEL <span className="text-[#ffccd5]">BUILD</span> <br />
              PERFORM
            </h1>

            {/* Sub-headline & Concrete Proposition */}
            <p className="text-base sm:text-lg text-red-100/90 font-normal max-w-xl leading-relaxed text-balance">
              Athletes and everyday lifters are being asked to push harder, move smarter, and train with purpose. 
              Input your height, weight, age, and physical condition to generate a science-backed, personalized exercise chart with sets, reps, and nutrition.
            </p>

            {/* Primary Action Button & Quick Presets */}
            <div className="space-y-4 pt-2">
              <div className="flex flex-wrap items-center gap-4">
                <button
                  onClick={onStartAssessment}
                  className="px-8 py-4 bg-white text-[#880b20] hover:bg-neutral-100 hover:text-[#6e0719] font-display text-xl font-black uppercase tracking-wider rounded-md shadow-2xl shadow-black/40 transition-all hover:scale-[1.02] active:scale-95 flex items-center gap-3 cursor-pointer group"
                >
                  <span>Build Custom Exercise Chart</span>
                  <ArrowRight className="w-5 h-5 text-[#880b20] group-hover:translate-x-1 transition-transform" />
                </button>

                <a
                  href="#assessment"
                  className="px-6 py-4 border border-white/30 hover:border-white text-white font-display text-lg font-bold uppercase tracking-wider rounded-md hover:bg-white/10 transition-colors"
                >
                  Explore Assessment Engine
                </a>
              </div>

              {/* Quick Preset Buttons for Instant Evaluation */}
              <div className="pt-2">
                <span className="text-xs uppercase tracking-wider text-red-200/80 font-semibold block mb-2">
                  Test with 1-click athlete profiles:
                </span>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => onQuickDemo('bulk')}
                    className="text-xs font-semibold px-3 py-1.5 bg-black/25 hover:bg-black/40 text-white rounded border border-white/15 transition-colors cursor-pointer flex items-center gap-1.5"
                  >
                    <Flame className="w-3.5 h-3.5 text-[#ffccd5]" />
                    Hypertrophy Muscle Bulk (74kg, 24yo)
                  </button>
                  <button
                    onClick={() => onQuickDemo('loss')}
                    className="text-xs font-semibold px-3 py-1.5 bg-black/25 hover:bg-black/40 text-white rounded border border-white/15 transition-colors cursor-pointer flex items-center gap-1.5"
                  >
                    <Activity className="w-3.5 h-3.5 text-[#ffccd5]" />
                    Knee-Friendly Fat Loss (88kg, 31yo)
                  </button>
                  <button
                    onClick={() => onQuickDemo('posture')}
                    className="text-xs font-semibold px-3 py-1.5 bg-black/25 hover:bg-black/40 text-white rounded border border-white/15 transition-colors cursor-pointer flex items-center gap-1.5"
                  >
                    <ShieldCheck className="w-3.5 h-3.5 text-[#ffccd5]" />
                    Desk Posture & Lower Back Care (68kg, 28yo)
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Visual Anchor with Athletic Focus Card */}
          <div className="lg:col-span-5 relative flex justify-center">
            {/* Visual Backplate */}
            <div className="relative w-full max-w-md bg-gradient-to-b from-black/40 to-black/80 rounded-2xl border border-white/15 p-6 backdrop-blur-sm shadow-2xl shadow-black/60 space-y-6">
              
              {/* Header inside card */}
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#ffccd5]">Live Engine Preview</span>
                  <h3 className="font-display text-2xl font-bold uppercase text-white">Custom Plan Blueprint</h3>
                </div>
                <div className="px-2.5 py-1 bg-[#e6193c] text-white rounded text-[11px] font-bold uppercase tracking-wider">
                  Adaptive
                </div>
              </div>

              {/* Sample Metrics Mockup */}
              <div className="grid grid-cols-3 gap-2.5">
                <div className="bg-white/5 border border-white/10 rounded-lg p-3 text-center">
                  <span className="text-[10px] font-semibold text-neutral-300 uppercase block">Calculated BMI</span>
                  <span className="font-display text-2xl font-black text-white tabular-nums">23.4</span>
                  <span className="text-[10px] text-emerald-400 block font-medium">Optimal</span>
                </div>
                <div className="bg-white/5 border border-white/10 rounded-lg p-3 text-center">
                  <span className="text-[10px] font-semibold text-neutral-300 uppercase block">Daily Fuel</span>
                  <span className="font-display text-2xl font-black text-[#ffccd5] tabular-nums">2,650</span>
                  <span className="text-[10px] text-neutral-300 block">kcal target</span>
                </div>
                <div className="bg-white/5 border border-white/10 rounded-lg p-3 text-center">
                  <span className="text-[10px] font-semibold text-neutral-300 uppercase block">Protein Goal</span>
                  <span className="font-display text-2xl font-black text-white tabular-nums">165g</span>
                  <span className="text-[10px] text-neutral-300 block">2.2g/kg</span>
                </div>
              </div>

              {/* Key Features List */}
              <div className="space-y-2.5 text-xs text-neutral-200">
                <div className="flex items-center gap-2.5 bg-black/30 p-2.5 rounded-lg border border-white/5">
                  <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Joint-Specific Safeguards (Knee, Lumbar Spine, Shoulders)</span>
                </div>
                <div className="flex items-center gap-2.5 bg-black/30 p-2.5 rounded-lg border border-white/5">
                  <Activity className="w-4 h-4 text-[#ffccd5] shrink-0" />
                  <span>Interactive Rest Stopwatch & Workout Set Check-offs</span>
                </div>
                <div className="flex items-center gap-2.5 bg-black/30 p-2.5 rounded-lg border border-white/5">
                  <Users className="w-4 h-4 text-sky-400 shrink-0" />
                  <span>Direct Biomechanical Guidance by Yash Badgujar</span>
                </div>
              </div>

              {/* Callout quote */}
              <div className="border-t border-white/10 pt-4 flex items-center justify-between">
                <div>
                  <p className="text-xs text-neutral-300 italic">"The essential ingredient for stronger bodies and lasting results."</p>
                  <p className="text-[11px] font-bold text-white uppercase mt-0.5">— Yash Badgujar, Founder</p>
                </div>
                <button
                  onClick={onStartAssessment}
                  className="px-3.5 py-2 bg-[#e6193c] hover:bg-[#ff1e46] text-white text-xs font-bold uppercase tracking-wider rounded transition-colors cursor-pointer"
                >
                  Start
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Running Marquee Strip matching reference image */}
      <div className="w-full bg-[#0a0b0d] border-y border-white/10 py-3.5 overflow-hidden">
        <div className="animate-marquee flex items-center gap-8 text-sm sm:text-base font-display font-extrabold uppercase tracking-widest text-neutral-300 select-none">
          <span>STRENGTH</span>
          <span className="text-[#e6193c]">⬡</span>
          <span>CONDITIONING</span>
          <span className="text-[#e6193c]">⬡</span>
          <span>HYPERTROPHY</span>
          <span className="text-[#e6193c]">⬡</span>
          <span>MOBILITY & REHAB</span>
          <span className="text-[#e6193c]">⬡</span>
          <span>OLYMPIC LIFTING</span>
          <span className="text-[#e6193c]">⬡</span>
          <span>BOXING & COMBAT</span>
          <span className="text-[#e6193c]">⬡</span>
          <span>RECOVERY PROTOCOL</span>
          <span className="text-[#e6193c]">⬡</span>
          <span>METABOLIC POWER</span>
          <span className="text-[#e6193c]">⬡</span>
          {/* Repeated for seamless loop */}
          <span>STRENGTH</span>
          <span className="text-[#e6193c]">⬡</span>
          <span>CONDITIONING</span>
          <span className="text-[#e6193c]">⬡</span>
          <span>HYPERTROPHY</span>
          <span className="text-[#e6193c]">⬡</span>
          <span>MOBILITY & REHAB</span>
          <span className="text-[#e6193c]">⬡</span>
          <span>OLYMPIC LIFTING</span>
          <span className="text-[#e6193c]">⬡</span>
          <span>BOXING & COMBAT</span>
          <span className="text-[#e6193c]">⬡</span>
          <span>RECOVERY PROTOCOL</span>
          <span className="text-[#e6193c]">⬡</span>
          <span>METABOLIC POWER</span>
          <span className="text-[#e6193c]">⬡</span>
        </div>
      </div>
    </section>
  );
};
