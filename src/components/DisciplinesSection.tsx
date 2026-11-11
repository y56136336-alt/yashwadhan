import React, { useState } from 'react';
import { Dumbbell, Flame, Activity, Shield, Zap, Sparkles, ChevronRight, ArrowUpRight } from 'lucide-react';
import { FitnessGoal } from '../types/fitness';

interface DisciplinesSectionProps {
  onSelectDiscipline: (goal: FitnessGoal) => void;
}

interface Discipline {
  id: string;
  name: string;
  category: string;
  mappedGoal: FitnessGoal;
  intensity: 'High' | 'Very High' | 'Moderate' | 'Peak';
  description: string;
  keyExercises: string[];
  repScheme: string;
  energySystem: string;
}

export const DisciplinesSection: React.FC<DisciplinesSectionProps> = ({ onSelectDiscipline }) => {
  const [selectedDiscipline, setSelectedDiscipline] = useState<Discipline | null>(null);

  const disciplines: Discipline[] = [
    {
      id: 'strength',
      name: 'STRENGTH & POWER',
      category: 'Neural Drive & Maximal Force',
      mappedGoal: 'muscle_building',
      intensity: 'Peak',
      description: 'Focuses on heavy multi-joint compound barbell and dumbbell movements to recruit high-threshold motor units and build absolute force output.',
      keyExercises: ['Barbell Back Squat', 'Romanian Deadlift', 'Incline Dumbbell Press', 'Weighted Pull-Ups'],
      repScheme: '4 - 6 reps @ RPE 8-9',
      energySystem: 'Phosphagen (ATP-CP) system'
    },
    {
      id: 'hypertrophy',
      name: 'HYPERTROPHY & DENSITY',
      category: 'Muscle Volume & Architecture',
      mappedGoal: 'weight_gain',
      intensity: 'High',
      description: 'Engineered for maximum mechanical tension and sarcoplasmic cell volumization. Ideal for clean bulking and sculpting symmetric muscle density.',
      keyExercises: ['Incline DB Press', 'Chest-Supported Row', 'Bulgarian Split Squat', 'Cable Lateral Raises'],
      repScheme: '8 - 12 reps @ RPE 8',
      energySystem: 'Fast Glycolytic pathway'
    },
    {
      id: 'conditioning',
      name: 'HIIT & METABOLIC COND',
      category: 'Caloric Burn & Work Capacity',
      mappedGoal: 'weight_loss',
      intensity: 'Very High',
      description: 'Combines dynamic resistance intervals with short rest windows to accelerate EPOC (excess post-exercise oxygen consumption) and torch stubborn fat.',
      keyExercises: ['Kettlebell Swings', 'Deficit Push-Ups', 'Box Step-Downs', 'Battle Ropes / Sled Push'],
      repScheme: '12 - 15 reps / timed intervals',
      energySystem: 'Oxidative & Glycolytic hybrid'
    },
    {
      id: 'mobility',
      name: 'MOBILITY & REHAB',
      category: 'Joint Decompression & Armor',
      mappedGoal: 'remain_fit',
      intensity: 'Moderate',
      description: 'Dedicated functional range conditioning, spinal decompression, and active stabilizer reinforcement for desk workers and injury-prone athletes.',
      keyExercises: ['Pallof Anti-Rotation Press', 'Deadbug Pair', '90/90 Hip Flow', 'Thoracic Extension Slides'],
      repScheme: '10 - 15 controlled reps with isometric holds',
      energySystem: 'Aerobic & Neuromuscular control'
    },
    {
      id: 'combat',
      name: 'BOXING & ATHLETIC ENGINE',
      category: 'Rotational Power & Speed',
      mappedGoal: 'remain_fit',
      intensity: 'High',
      description: 'Rotational kinetic chain power, footwork agility, and explosive cardiovascular stamina inspired by professional fight camps.',
      keyExercises: ['Landmine Rotational Punch', 'Med Ball Slams', 'Plyometric Push-Ups', 'Jump Rope Intervals'],
      repScheme: '3-minute explosive rounds',
      energySystem: 'Anaerobic Lactic & Aerobic base'
    },
    {
      id: 'calisthenics',
      name: 'CALISTHENICS & LEVERAGE',
      category: 'Relative Strength & Core Mastery',
      mappedGoal: 'remain_fit',
      intensity: 'High',
      description: 'Mastery over your own bodyweight across space. Builds dense relative strength, indestructible connective tissue, and core armor.',
      keyExercises: ['Inverted Doorframe Rows', 'Deficit Push-Ups', 'Hanging Knee Raises', 'Pistol Squat Progressions'],
      repScheme: '8 - 15 reps with slow eccentrics',
      energySystem: 'Glycolytic & Neuromuscular'
    }
  ];

  return (
    <section id="disciplines" className="py-24 bg-[#0d0f14] border-t border-white/10 text-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14">
          <div className="space-y-3 max-w-xl">
            <div className="flex items-center gap-2 text-xs font-bold tracking-widest text-[#e6193c] uppercase">
              <span className="w-2 h-2 rounded-full bg-[#e6193c]" />
              <span>Training Methodologies</span>
            </div>
            <h2 className="font-display text-4xl sm:text-5xl font-extrabold uppercase tracking-tight text-white">
              PICK YOUR DISCIPLINE
            </h2>
            <p className="text-neutral-400 text-sm leading-relaxed">
              Every training stimulus serves a distinct adaptation. Explore our 6 signature athletic training protocols and integrate them directly into your custom exercise chart.
            </p>
          </div>

          <a
            href="#assessment"
            className="text-xs font-bold uppercase tracking-wider text-[#e6193c] hover:text-white flex items-center gap-1.5 transition-colors group shrink-0"
          >
            <span>Match to your body condition</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </a>
        </div>

        {/* Disciplines Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {disciplines.map((d) => (
            <div
              key={d.id}
              className="bg-[#12151e] border border-white/10 hover:border-[#e6193c]/50 rounded-2xl p-6 sm:p-7 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-[#e6193c]/10 flex flex-col justify-between group interactive-card"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
                    {d.category}
                  </span>
                  <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${
                    d.intensity === 'Peak' ? 'bg-[#e6193c]/20 text-[#ffccd5]' : 'bg-white/10 text-neutral-300'
                  }`}>
                    {d.intensity} Intensity
                  </span>
                </div>

                <h3 className="font-display text-2xl sm:text-3xl font-extrabold uppercase tracking-wide text-white group-hover:text-[#ffccd5] transition-colors">
                  {d.name}
                </h3>

                <p className="text-xs text-neutral-300 leading-relaxed">
                  {d.description}
                </p>

                {/* Key exercises preview */}
                <div className="bg-black/30 border border-white/5 rounded-xl p-3.5 space-y-1.5">
                  <span className="text-[10px] font-semibold text-neutral-400 uppercase block">
                    Core Movements:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {d.keyExercises.slice(0, 3).map((ex, i) => (
                      <span key={i} className="text-[11px] bg-white/5 text-neutral-300 px-2 py-0.5 rounded">
                        {ex}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Bottom Card CTA */}
              <div className="pt-6 border-t border-white/10 mt-6 flex items-center justify-between">
                <span className="text-xs font-mono text-neutral-400">
                  {d.repScheme.split('@')[0]}
                </span>

                <button
                  onClick={() => onSelectDiscipline(d.mappedGoal)}
                  className="px-3.5 py-2 bg-white/5 hover:bg-[#e6193c] text-white text-xs font-bold uppercase tracking-wider rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <span>Build Routine</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
