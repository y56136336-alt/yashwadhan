import React, { useState } from 'react';
import { Quote, ArrowRight, ShieldCheck, Flame, Heart } from 'lucide-react';

interface CaseStudy {
  id: string;
  name: string;
  age: number;
  profession: string;
  category: 'weight_loss' | 'muscle_gain' | 'rehab';
  initialStats: string;
  resultStats: string;
  timeframe: string;
  quote: string;
  conditionNote: string;
  metrics: { label: string; value: string }[];
}

export const TransformationsSection: React.FC = () => {
  const [filter, setFilter] = useState<'all' | 'weight_loss' | 'muscle_gain' | 'rehab'>('all');

  const caseStudies: CaseStudy[] = [
    {
      id: '1',
      name: 'Rahul Mehta',
      age: 28,
      profession: 'Senior Software Engineer',
      category: 'rehab',
      initialStats: '86kg · Chronic L4-L5 Lumbar Ache',
      resultStats: '74kg · Zero Back Pain · Deadbug Pro',
      timeframe: '16 Weeks',
      quote: 'I had avoided lifting for 3 years because of desk hunch and lower back pain. Yash Badgujar rebuilt my chart with chest-supported rows, Romanian deadlifts, and Pallof presses. Within 8 weeks the aching was gone, and I am leaner than I was in college.',
      conditionNote: 'Lower Back Care Protocol Active',
      metrics: [
        { label: 'Body Weight', value: '-12 kg' },
        { label: 'Back Pain Frequency', value: '0 Days' },
        { label: 'Core Endurance', value: '+140%' }
      ]
    },
    {
      id: '2',
      name: 'Devin Thorne',
      age: 24,
      profession: 'Digital Designer',
      category: 'muscle_gain',
      initialStats: '65kg · Hardgainer / Underweight',
      resultStats: '74.5kg · Visible Shoulder & Arm Density',
      timeframe: '20 Weeks',
      quote: 'I spent years spinning my wheels in the gym without gaining mass. FitHub calculated my exact +420 kcal surplus and structured a 4-day Upper/Lower split with strict rest timers. Gained 9.5kg of solid contractile tissue.',
      conditionNote: 'Hypertrophy Mass Builder Active',
      metrics: [
        { label: 'Lean Mass Gained', value: '+9.5 kg' },
        { label: 'Bench 1RM', value: '+28 kg' },
        { label: 'Daily Fuel', value: '2,850 kcal' }
      ]
    },
    {
      id: '3',
      name: 'Priya Sharma',
      age: 33,
      profession: 'Corporate Consultant & Mother',
      category: 'weight_loss',
      initialStats: '79kg · Chronic Runner Knee Pain',
      resultStats: '66kg · Chiseled Definition · Running Pain-Free',
      timeframe: '14 Weeks',
      quote: 'Running always flared my patellar tendon. The FitHub knee-friendly protocol shifted my training to vertical-shin Bulgarian split squats and Romanian deadlifts. Dropped 13kg while building the strongest glutes and hamstrings of my life.',
      conditionNote: 'Knee-Friendly Protocol Active',
      metrics: [
        { label: 'Body Fat Reduced', value: '-11%' },
        { label: 'Scale Weight', value: '-13 kg' },
        { label: 'Knee Discomfort', value: 'Zero' }
      ]
    }
  ];

  const filtered = filter === 'all' ? caseStudies : caseStudies.filter(c => c.category === filter);

  return (
    <section className="py-24 bg-[#0a0c10] border-t border-white/10 text-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header matching reference quote */}
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-4">
          <div className="flex items-center justify-center gap-2 text-xs font-bold tracking-widest text-[#e6193c] uppercase">
            <Quote className="w-4 h-4 text-[#e6193c]" />
            <span>Proven Athlete Outcomes</span>
          </div>

          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-black uppercase tracking-tight text-white leading-tight">
            "I CAME IN WANTING LESS PAIN, <br className="hidden sm:inline" />
            <span className="text-[#e6193c]">I STAYED BECAUSE I LEARNED WHAT STRONG FEELS LIKE."</span>
          </h2>

          <p className="text-neutral-400 text-xs sm:text-sm max-w-xl mx-auto">
            Real outcomes from members whose routines were engineered based on their actual height, weight, joint condition, and primary goals.
          </p>

          {/* Filter Pills */}
          <div className="flex justify-center items-center gap-2 pt-2">
            {[
              { id: 'all', label: 'All Athletes' },
              { id: 'muscle_gain', label: 'Mass & Bulking' },
              { id: 'weight_loss', label: 'Fat Loss & Shred' },
              { id: 'rehab', label: 'Posture & Joint Care' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setFilter(tab.id as typeof filter)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                  filter === tab.id
                    ? 'bg-[#e6193c] text-white shadow-md'
                    : 'bg-white/5 text-neutral-400 hover:text-white'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Case Studies Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {filtered.map(item => (
            <div
              key={item.id}
              className="bg-[#12141c] border border-white/10 hover:border-white/25 rounded-2xl p-6 sm:p-7 flex flex-col justify-between space-y-6 transition-all duration-300 hover:-translate-y-1"
            >
              <div className="space-y-4">
                {/* Meta */}
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-display text-2xl font-bold uppercase text-white tracking-wide">
                      {item.name}
                    </h3>
                    <p className="text-xs text-neutral-400">
                      {item.age} yrs · {item.profession}
                    </p>
                  </div>
                  <span className="px-2.5 py-1 bg-white/5 border border-white/10 text-xs font-mono font-bold text-neutral-300 rounded">
                    {item.timeframe}
                  </span>
                </div>

                <div className="bg-black/40 border border-white/5 rounded-xl p-3 text-xs space-y-1">
                  <div className="text-neutral-400">
                    <span className="text-neutral-500 font-semibold uppercase text-[10px] block">Baseline:</span>
                    {item.initialStats}
                  </div>
                  <div className="text-emerald-400 font-medium pt-1 border-t border-white/5">
                    <span className="text-neutral-500 font-semibold uppercase text-[10px] block">Result:</span>
                    {item.resultStats}
                  </div>
                </div>

                {/* Quote */}
                <p className="text-xs sm:text-sm text-neutral-300 italic leading-relaxed">
                  "{item.quote}"
                </p>
              </div>

              {/* Quantitative Metrics Bar */}
              <div className="pt-4 border-t border-white/10 space-y-3">
                <div className="grid grid-cols-3 gap-2 text-center">
                  {item.metrics.map((m, mIdx) => (
                    <div key={mIdx} className="bg-white/[0.02] p-2 rounded-lg border border-white/5">
                      <span className="font-display text-base font-black text-white tabular-nums block">
                        {m.value}
                      </span>
                      <span className="text-[9px] uppercase tracking-wider text-neutral-400 block">
                        {m.label}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="text-[10px] font-bold uppercase tracking-wider text-[#ffccd5] flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{item.conditionNote}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
