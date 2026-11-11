import React, { useState } from 'react';
import { Clock, Users, Flame, Check, Sparkles, Calendar } from 'lucide-react';

interface ScheduleClass {
  id: string;
  time: string;
  title: string;
  focus: string;
  coach: string;
  intensity: 'Moderate' | 'High' | 'Extreme';
  spotsAvailable: number;
  totalSpots: number;
}

export const FloorSchedule: React.FC = () => {
  const [activeDay, setActiveDay] = useState<'MON' | 'TUE' | 'WED' | 'THU' | 'FRI' | 'SAT' | 'SUN'>('MON');
  const [bookedClasses, setBookedClasses] = useState<Record<string, boolean>>({});

  const scheduleData: Record<string, ScheduleClass[]> = {
    MON: [
      { id: 'mon_1', time: '06:30 AM', title: 'Heavy Barbell Strength Club', focus: 'Squats, Bench Press & Core Stability', coach: 'Yash Badgujar', intensity: 'Extreme', spotsAvailable: 3, totalSpots: 16 },
      { id: 'mon_2', time: '09:00 AM', title: 'Hypertrophy Forge: Upper Armor', focus: 'Chest, Shoulders & Triceps Density', coach: 'Tushar', intensity: 'High', spotsAvailable: 6, totalSpots: 18 },
      { id: 'mon_3', time: '12:00 PM', title: 'Lunchtime Express Engine', focus: 'Full Body Kettlebell & HIIT Intervals', coach: 'Divyansh Sharma', intensity: 'High', spotsAvailable: 4, totalSpots: 15 },
      { id: 'mon_4', time: '05:30 PM', title: 'Posterior Chain & Deadlift Lab', focus: 'Hamstrings, Glute Drive & Spinal Neutrality', coach: 'Yash Badgujar', intensity: 'Extreme', spotsAvailable: 2, totalSpots: 16 },
      { id: 'mon_5', time: '07:00 PM', title: 'Joint Decompression & Flow', focus: 'Thoracic Mobility & Pelvic Tilts', coach: 'Aayush', intensity: 'Moderate', spotsAvailable: 8, totalSpots: 20 }
    ],
    TUE: [
      { id: 'tue_1', time: '06:30 AM', title: 'Metabolic Conditioning: Burn', focus: 'Rowing Intervals & Plyometric Push-Ups', coach: 'Divyansh Sharma', intensity: 'Extreme', spotsAvailable: 5, totalSpots: 16 },
      { id: 'tue_2', time: '09:00 AM', title: 'Back Thickness & Lat Pulldowns', focus: 'Vertical & Horizontal Rows, Biceps', coach: 'Tushar', intensity: 'High', spotsAvailable: 7, totalSpots: 18 },
      { id: 'tue_3', time: '05:30 PM', title: 'Olympic Clean & Jerk Technique', focus: 'Barbell Triple Extension & Speed', coach: 'Divyansh Sharma', intensity: 'Extreme', spotsAvailable: 1, totalSpots: 12 },
      { id: 'tue_4', time: '07:00 PM', title: 'Shoulder Longevity & Core Armor', focus: 'Rotator Cuff, Face Pulls, Pallof Press', coach: 'Aayush', intensity: 'Moderate', spotsAvailable: 9, totalSpots: 20 }
    ],
    WED: [
      { id: 'wed_1', time: '06:30 AM', title: 'Lower Body Unilateral Mastery', focus: 'Bulgarian Split Squats & RDLs', coach: 'Yash Badgujar', intensity: 'Extreme', spotsAvailable: 4, totalSpots: 16 },
      { id: 'wed_2', time: '12:00 PM', title: 'Upper Body Pump & Arms', focus: 'Biceps, Triceps, Delts Hypertrophy', coach: 'Tushar', intensity: 'High', spotsAvailable: 8, totalSpots: 18 },
      { id: 'wed_3', time: '05:30 PM', title: 'Boxing & Kinetic Chain Agility', focus: 'Heavy Bag Rotational Power & Core', coach: 'Yash Badgujar', intensity: 'High', spotsAvailable: 3, totalSpots: 14 },
      { id: 'wed_4', time: '07:00 PM', title: 'Active Postural Recovery', focus: 'Hip Flexor Release & 90/90 Stretches', coach: 'Aayush', intensity: 'Moderate', spotsAvailable: 10, totalSpots: 20 }
    ],
    THU: [
      { id: 'thu_1', time: '06:30 AM', title: 'Strength Foundations: Press', focus: 'Incline Dumbbell & Overhead Presses', coach: 'Tushar', intensity: 'High', spotsAvailable: 6, totalSpots: 16 },
      { id: 'thu_2', time: '09:00 AM', title: 'Athletic Speed & Agility', focus: 'Sled Pushes, Medicine Ball Throws', coach: 'Divyansh Sharma', intensity: 'Extreme', spotsAvailable: 5, totalSpots: 15 },
      { id: 'thu_3', time: '05:30 PM', title: 'Posterior Hypertrophy & Glutes', focus: 'Barbell Hip Thrusts & Hamstrings', coach: 'Yash Badgujar', intensity: 'High', spotsAvailable: 2, totalSpots: 16 }
    ],
    FRI: [
      { id: 'fri_1', time: '06:30 AM', title: 'Full Body Barbell Complex', focus: 'Heavy Triples & Compound Density', coach: 'Yash Badgujar', intensity: 'Extreme', spotsAvailable: 2, totalSpots: 16 },
      { id: 'fri_2', time: '12:00 PM', title: 'Friday Engine & Sweathouse', focus: '45-Min High Output Aerobic Circuit', coach: 'Divyansh Sharma', intensity: 'Extreme', spotsAvailable: 4, totalSpots: 20 },
      { id: 'fri_3', time: '05:30 PM', title: 'Arms & Shoulders Golden Hour', focus: 'Tri-Sets & Peak Contraction Hypertrophy', coach: 'Tushar', intensity: 'High', spotsAvailable: 6, totalSpots: 18 }
    ],
    SAT: [
      { id: 'sat_1', time: '08:00 AM', title: 'Weekend Heavy Barbell Marathon', focus: 'Big 3 Lifts with Technical Audits', coach: 'Yash Badgujar', intensity: 'Extreme', spotsAvailable: 1, totalSpots: 20 },
      { id: 'sat_2', time: '10:00 AM', title: 'Combat Athletics & Core Armor', focus: 'Boxing Rounds & Anti-Extension Core', coach: 'Tushar', intensity: 'High', spotsAvailable: 5, totalSpots: 16 },
      { id: 'sat_3', time: '11:30 AM', title: 'Complete Body Decompression Clinic', focus: 'Full Spinal Alignment & Joint Prehab', coach: 'Aayush', intensity: 'Moderate', spotsAvailable: 7, totalSpots: 22 }
    ],
    SUN: [
      { id: 'sun_1', time: '09:00 AM', title: 'Regeneration, Mobility & Breath', focus: 'Parasympathetic Reset & Deep Tissue Flow', coach: 'Aayush', intensity: 'Moderate', spotsAvailable: 11, totalSpots: 20 },
      { id: 'sun_2', time: '11:00 AM', title: 'Next Week Preparation & Technique', focus: 'Form Checks & Warmup Blueprint', coach: 'Yash Badgujar', intensity: 'Moderate', spotsAvailable: 8, totalSpots: 15 }
    ]
  };

  const handleBook = (classId: string) => {
    setBookedClasses(prev => ({
      ...prev,
      [classId]: !prev[classId]
    }));
  };

  const currentClasses = scheduleData[activeDay] || scheduleData.MON;

  return (
    <section id="schedule" className="py-24 bg-[#0a0c10] border-t border-white/10 text-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header matching reference: THIS WEEK ON THE FLOOR */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="space-y-3 max-w-xl">
            <div className="flex items-center gap-2 text-xs font-bold tracking-widest text-[#e6193c] uppercase">
              <Calendar className="w-4 h-4 text-[#e6193c]" />
              <span>Live Floor Programming</span>
            </div>
            <h2 className="font-display text-4xl sm:text-5xl font-extrabold uppercase tracking-tight text-white">
              THIS WEEK ON THE FLOOR
            </h2>
            <p className="text-neutral-400 text-sm leading-relaxed">
              Every day at FitHub features structured small-group coaching led by specialist trainers. Reserve your platform or integrate these sessions into your personalized chart.
            </p>
          </div>

          {/* Day Filter Strip */}
          <div className="flex items-center gap-1.5 p-1 bg-[#13161f] border border-white/10 rounded-xl overflow-x-auto">
            {(['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'] as const).map((d) => (
              <button
                key={d}
                onClick={() => setActiveDay(d)}
                className={`px-3.5 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap ${
                  activeDay === d
                    ? 'bg-[#e6193c] text-white shadow-md shadow-[#e6193c]/20'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                {d}
              </button>
            ))}
          </div>
        </div>

        {/* Schedule Table */}
        <div className="bg-[#12141c] border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-black/50 border-b border-white/10 text-[11px] font-bold uppercase tracking-wider text-neutral-400">
                <tr>
                  <th className="py-4 px-6">Time Slot</th>
                  <th className="py-4 px-6">Session & Focus</th>
                  <th className="py-4 px-6 hidden md:table-cell">Head Coach</th>
                  <th className="py-4 px-6 hidden sm:table-cell">Intensity</th>
                  <th className="py-4 px-6 hidden lg:table-cell">Availability</th>
                  <th className="py-4 px-6 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 font-sans">
                {currentClasses.map((item) => {
                  const isBooked = !!bookedClasses[item.id];
                  const remaining = isBooked ? item.spotsAvailable - 1 : item.spotsAvailable;
                  return (
                    <tr key={item.id} className="hover:bg-white/[0.02] transition-colors">
                      
                      {/* Time */}
                      <td className="py-4 px-6 font-display text-base sm:text-lg font-bold text-white whitespace-nowrap tabular-nums">
                        {item.time}
                      </td>

                      {/* Title & Focus */}
                      <td className="py-4 px-6">
                        <div className="font-display text-base font-bold uppercase text-white tracking-wide">
                          {item.title}
                        </div>
                        <div className="text-xs text-neutral-400 mt-0.5">
                          {item.focus}
                        </div>
                      </td>

                      {/* Coach */}
                      <td className="py-4 px-6 hidden md:table-cell whitespace-nowrap">
                        <span className="font-semibold text-neutral-200">
                          {item.coach}
                        </span>
                        {item.coach === 'Yash Badgujar' && (
                          <span className="text-[10px] text-[#ff8093] ml-1.5 font-bold uppercase block">Head Coach</span>
                        )}
                      </td>

                      {/* Intensity */}
                      <td className="py-4 px-6 hidden sm:table-cell whitespace-nowrap">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-[11px] font-bold uppercase tracking-wider ${
                          item.intensity === 'Extreme'
                            ? 'bg-[#e6193c]/20 text-[#ff8093]'
                            : item.intensity === 'High'
                            ? 'bg-amber-950/60 text-amber-300'
                            : 'bg-emerald-950/60 text-emerald-400'
                        }`}>
                          <Flame className="w-3.5 h-3.5" />
                          <span>{item.intensity}</span>
                        </span>
                      </td>

                      {/* Availability */}
                      <td className="py-4 px-6 hidden lg:table-cell whitespace-nowrap text-xs text-neutral-400">
                        <span className="tabular-nums font-bold text-white">{remaining}</span> / {item.totalSpots} spots left
                      </td>

                      {/* Book Action */}
                      <td className="py-4 px-6 text-right whitespace-nowrap">
                        <button
                          onClick={() => handleBook(item.id)}
                          className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                            isBooked
                              ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                              : 'bg-white/5 hover:bg-[#e6193c] text-white border border-white/10 hover:border-transparent'
                          }`}
                        >
                          {isBooked ? (
                            <span className="flex items-center gap-1.5">
                              <Check className="w-3.5 h-3.5" />
                              Reserved
                            </span>
                          ) : (
                            <span>Reserve Spot</span>
                          )}
                        </button>
                      </td>

                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </section>
  );
};
