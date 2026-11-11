import React from 'react';
import { Target, Zap, ShieldCheck, HeartHandshake } from 'lucide-react';

export const PhilosophySection: React.FC = () => {
  return (
    <section className="py-24 bg-[#0a0b0e] border-t border-white/10 text-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Bold Statement */}
          <div className="lg:col-span-6 space-y-6">
            <div className="flex items-center gap-2 text-xs font-bold tracking-widest text-[#e6193c] uppercase">
              <span className="w-2 h-2 rounded-full bg-[#e6193c]" />
              <span>Core Athletic Ethos</span>
            </div>

            <h2 className="font-display text-5xl sm:text-6xl md:text-7xl font-extrabold uppercase tracking-tight leading-[0.9] text-white">
              BUILT FOR THE WORK, <br />
              <span className="text-[#e6193c]">NOT THE MIRROR.</span>
            </h2>

            <p className="text-neutral-300 text-base sm:text-lg leading-relaxed max-w-xl">
              Too much of modern fitness revolves around empty aesthetics and superficial vanity. 
              At FitHub, we build bodies capable of relentless physical output: dense contractile muscle, iron-clad joints, resilient spinal posture, and cardiovascular horsepower.
            </p>

            <p className="text-neutral-400 text-sm leading-relaxed max-w-xl">
              Whether you are looking to gain lean weight, drop stubborn body fat, or overcome nagging knee and back pain, our plans are grounded in fundamental biomechanical laws—not fitness fads.
            </p>

            {/* Proof Metric Strips */}
            <div className="grid grid-cols-3 gap-4 pt-4 border-t border-white/10">
              <div>
                <span className="font-display text-3xl sm:text-4xl font-black text-white tabular-nums block">
                  10,000+
                </span>
                <span className="text-xs text-neutral-400 uppercase font-semibold">
                  Custom Charts Built
                </span>
              </div>

              <div>
                <span className="font-display text-3xl sm:text-4xl font-black text-[#e6193c] tabular-nums block">
                  98.4%
                </span>
                <span className="text-xs text-neutral-400 uppercase font-semibold">
                  Joint Safety Record
                </span>
              </div>

              <div>
                <span className="font-display text-3xl sm:text-4xl font-black text-white tabular-nums block">
                  8+ Yrs
                </span>
                <span className="text-xs text-neutral-400 uppercase font-semibold">
                  Yash Badgujar Coaching
                </span>
              </div>
            </div>
          </div>

          {/* Right Column: 4 Pillars of Biomechanical Engineering */}
          <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            <div className="bg-[#12141c] border border-white/10 rounded-2xl p-6 space-y-3 hover:border-white/20 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-[#e6193c]/15 text-[#e6193c] flex items-center justify-center">
                <Target className="w-5 h-5" />
              </div>
              <h3 className="font-display text-xl font-bold uppercase text-white tracking-wide">
                Mechanical Tension
              </h3>
              <p className="text-xs text-neutral-400 leading-relaxed">
                We prioritize exercises that maximize muscular tension through full functional ranges of motion without unnecessary joint shearing.
              </p>
            </div>

            <div className="bg-[#12141c] border border-white/10 rounded-2xl p-6 space-y-3 hover:border-white/20 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-[#e6193c]/15 text-[#e6193c] flex items-center justify-center">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="font-display text-xl font-bold uppercase text-white tracking-wide">
                Spine & Joint Longevity
              </h3>
              <p className="text-xs text-neutral-400 leading-relaxed">
                Every routine automatically switches out high-risk loading angles whenever you report knee tenderness, lower back tightness, or shoulder impingement.
              </p>
            </div>

            <div className="bg-[#12141c] border border-white/10 rounded-2xl p-6 space-y-3 hover:border-white/20 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-[#e6193c]/15 text-[#e6193c] flex items-center justify-center">
                <Zap className="w-5 h-5" />
              </div>
              <h3 className="font-display text-xl font-bold uppercase text-white tracking-wide">
                Strict Progressive Overload
              </h3>
              <p className="text-xs text-neutral-400 leading-relaxed">
                No guessing games. Specific repetition targets, planned RPE thresholds, and dedicated rest timers ensure measurable adaptations week after week.
              </p>
            </div>

            <div className="bg-[#12141c] border border-white/10 rounded-2xl p-6 space-y-3 hover:border-white/20 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-[#e6193c]/15 text-[#e6193c] flex items-center justify-center">
                <HeartHandshake className="w-5 h-5" />
              </div>
              <h3 className="font-display text-xl font-bold uppercase text-white tracking-wide">
                Metabolic Fuel Matching
              </h3>
              <p className="text-xs text-neutral-400 leading-relaxed">
                Your workout chart connects seamlessly with precision calorie and macronutrient allocations to ensure your fuel directly matches your effort.
              </p>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
