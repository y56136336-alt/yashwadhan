import React from 'react';
import { Award, ShieldCheck, Dumbbell, HeartPulse } from 'lucide-react';

export const CoachesSection: React.FC = () => {
  const coaches = [
    {
      name: 'Yash Badgujar',
      role: 'Founder & Head Performance Director',
      credentials: 'CSCS · ISSN · 8+ Yrs Elite Coaching',
      specialties: ['Biomechanical Tailoring', 'Mass & Strength Periodization', 'Spinal Mechanics'],
      philosophy: 'Real transformation is not an accident. It is the predictable outcome of correct mechanical stimulus, nutrient timing, and unbroken consistency.',
      initials: 'YB',
      accentColor: 'from-[#e6193c] to-[#7a051d]'
    },
    {
      name: 'Divyansh Sharma',
      role: 'Olympic Lifting & Conditioning Specialist',
      credentials: 'USAW-2 · High-Performance Conditioning Specialist',
      specialties: ['Triple Extension Power', 'Barbell Velocity', 'Metabolic Conditioning'],
      philosophy: 'Barbell mechanics will teach you humility, focus, and explosive power that transfers to every athletic pursuit.',
      initials: 'DS',
      accentColor: 'from-amber-600 to-amber-900'
    },
    {
      name: 'Tushar',
      role: 'Hypertrophy & Sarcoplasmic Volume Coach',
      credentials: 'CPT · Hypertrophy Specialist & Calisthenics Master',
      specialties: ['Tension Curve Optimization', 'Relative Bodyweight Strength', 'Chest/Arm Sculpting'],
      philosophy: 'Train muscles, not egos. Slow the eccentric down, control the turnaround, and make every fiber scream.',
      initials: 'TU',
      accentColor: 'from-sky-600 to-blue-900'
    },
    {
      name: 'Aayush',
      role: 'Physical Therapy & Joint Longevity Specialist',
      credentials: 'DPT · FRCms Joint Health Specialist',
      specialties: ['Knee/Patella Rehabilitation', 'Lower Back Decompression', 'Rotator Cuff Longevity'],
      philosophy: 'A strong muscle over an unstable joint is a breakdown waiting to happen. Bulletproof your foundation first.',
      initials: 'AY',
      accentColor: 'from-emerald-600 to-teal-900'
    }
  ];

  return (
    <section id="coaching" className="py-24 bg-[#0d0f14] border-t border-white/10 text-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <div className="flex items-center justify-center gap-2 text-xs font-bold tracking-widest text-[#e6193c] uppercase">
            <Award className="w-4 h-4 text-[#e6193c]" />
            <span>Master Coaches</span>
          </div>
          <h2 className="font-display text-4xl sm:text-5xl font-extrabold uppercase tracking-tight text-white">
            THE PEOPLE WHO PROGRAM YOU
          </h2>
          <p className="text-neutral-400 text-sm leading-relaxed">
            Every exercise cue, rep guideline, and condition safeguard in your chart is created and vetted by certified biomechanics and physical therapy specialists.
          </p>
        </div>

        {/* Coaches Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {coaches.map((c, i) => (
            <div
              key={i}
              className="bg-[#12141c] border border-white/10 hover:border-white/25 rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-xl flex flex-col justify-between"
            >
              <div>
                {/* Visual Avatar Banner */}
                <div className={`h-44 bg-gradient-to-br ${c.accentColor} relative flex items-center justify-center p-6`}>
                  <div className="w-20 h-20 rounded-2xl bg-black/40 border border-white/20 backdrop-blur-sm flex items-center justify-center font-display text-3xl font-black text-white shadow-xl">
                    {c.initials}
                  </div>
                  {c.name === 'Yash Badgujar' && (
                    <span className="absolute top-3 right-3 bg-white text-black text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded shadow">
                      Head Coach
                    </span>
                  )}
                </div>

                {/* Details */}
                <div className="p-6 space-y-3">
                  <div>
                    <h3 className="font-display text-2xl font-bold uppercase text-white tracking-wide">
                      {c.name}
                    </h3>
                    <p className="text-xs text-[#ffccd5] font-semibold">
                      {c.role}
                    </p>
                    <p className="text-[11px] text-neutral-400 font-mono mt-0.5">
                      {c.credentials}
                    </p>
                  </div>

                  <p className="text-xs text-neutral-300 italic leading-relaxed border-l border-white/20 pl-3">
                    "{c.philosophy}"
                  </p>

                  <div className="pt-2">
                    <span className="text-[10px] font-bold text-neutral-400 uppercase block mb-1.5">
                      Specializations:
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {c.specialties.map((spec, sIdx) => (
                        <span key={sIdx} className="text-[10px] bg-black/40 text-neutral-300 px-2 py-0.5 rounded border border-white/5">
                          {spec}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-6 pt-0">
                <a
                  href="#assessment"
                  className="w-full py-2.5 bg-white/5 hover:bg-[#e6193c] text-white rounded-lg text-xs font-bold uppercase tracking-wider transition-colors text-center block cursor-pointer"
                >
                  Get Programmed
                </a>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
