import React, { useState, useEffect } from 'react';
import {
  WorkoutPlan,
  WorkoutDay,
  Exercise
} from '../types/fitness';
import { soundEffects } from '../utils/soundEffects';
import {
  Dumbbell,
  Printer,
  Copy,
  Check,
  RotateCcw,
  Clock,
  Play,
  Pause,
  Volume2,
  VolumeX,
  ChevronRight,
  Shield,
  RefreshCw,
  Sparkles,
  Flame,
  Award,
  CheckCircle2,
  Calendar,
  Layers,
  ArrowUpDown
} from 'lucide-react';

interface ExerciseChartPlanProps {
  plan: WorkoutPlan;
  onModifyAssessment: () => void;
}

export const ExerciseChartPlan: React.FC<ExerciseChartPlanProps> = ({
  plan,
  onModifyAssessment
}) => {
  const [activeDayIndex, setActiveDayIndex] = useState(0);
  const [activeTab, setActiveTab] = useState<'chart' | 'nutrition' | 'recovery'>('chart');
  const [copied, setCopied] = useState(false);

  // Exercise Swap State
  const [swappingExercise, setSwappingExercise] = useState<{ dayIdx: number; exIdx: number; exercise: Exercise } | null>(null);
  const [currentPlan, setCurrentPlan] = useState<WorkoutPlan>(plan);

  useEffect(() => {
    setCurrentPlan(plan);
    setActiveDayIndex(0);
  }, [plan]);

  // Live Rest Timer State
  const [restTimerSeconds, setRestTimerSeconds] = useState<number | null>(null);
  const [restTimerTotal, setRestTimerTotal] = useState<number>(60);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Active Workout Tracker State
  const [isWorkoutActive, setIsWorkoutActive] = useState(false);
  const [workoutElapsedSeconds, setWorkoutElapsedSeconds] = useState(0);
  const [completedSets, setCompletedSets] = useState<Record<string, boolean>>({});
  const [workoutFinished, setWorkoutFinished] = useState(false);

  // Rest Timer Interval
  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;
    if (isTimerRunning && restTimerSeconds !== null && restTimerSeconds > 0) {
      timer = setInterval(() => {
        setRestTimerSeconds((prev) => {
          if (prev === null || prev <= 1) {
            setIsTimerRunning(false);
            if (soundEnabled) soundEffects.playSuccessChime();
            return 0;
          }
          if (prev <= 4 && soundEnabled) {
            soundEffects.playTick();
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isTimerRunning, restTimerSeconds, soundEnabled]);

  // Workout Session Duration Timer
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isWorkoutActive && !workoutFinished) {
      interval = setInterval(() => {
        setWorkoutElapsedSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isWorkoutActive, workoutFinished]);

  const startRestTimer = (seconds: number) => {
    setRestTimerTotal(seconds);
    setRestTimerSeconds(seconds);
    setIsTimerRunning(true);
  };

  const toggleSetComplete = (exerciseId: string, setIndex: number, restDuration: number) => {
    const key = `${exerciseId}_set_${setIndex}`;
    const nextState = !completedSets[key];
    setCompletedSets((prev) => ({
      ...prev,
      [key]: nextState
    }));

    if (nextState) {
      if (soundEnabled) soundEffects.playSuccessChime();
      startRestTimer(restDuration);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleCopy = () => {
    const text = `
FitHub Workout Plan: ${currentPlan.title}
Athlete: ${currentPlan.userAssessment.age}yo ${currentPlan.userAssessment.gender}, ${currentPlan.userAssessment.weight}kg, ${currentPlan.userAssessment.height}cm
Goal: ${currentPlan.userAssessment.goal.replace('_', ' ')}
Condition: ${currentPlan.userAssessment.bodyCondition.replace('_', ' ')}
Daily Calorie Target: ${currentPlan.metrics.macros.calories} kcal (P: ${currentPlan.metrics.macros.proteinGrams}g, C: ${currentPlan.metrics.macros.carbsGrams}g, F: ${currentPlan.metrics.macros.fatGrams}g)
Split: ${currentPlan.splitName}

Days:
${currentPlan.days.map((d) => `\n--- ${d.title} ---\nFocus: ${d.focus}\nExercises:\n${d.exercises.map((e) => `• ${e.name} - ${e.sets} sets x ${e.reps} (Rest: ${e.restSeconds}s, ${e.rpe})`).join('\n')}`).join('\n\n')}
    `.trim();

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSwap = (altId: string, altName: string, altEquipment: string) => {
    if (!swappingExercise) return;
    const { dayIdx, exIdx, exercise } = swappingExercise;

    const updatedDays = [...currentPlan.days];
    const targetEx = updatedDays[dayIdx].exercises[exIdx];

    // Create swapped exercise
    targetEx.name = altName;
    targetEx.formCue = `Alternative variation: Perform with strict tempo and controlled eccentric cadence using ${altEquipment}.`;
    targetEx.conditionNote = `Movement swapped for equipment/biomechanic preference (${altEquipment}).`;

    setCurrentPlan({
      ...currentPlan,
      days: updatedDays
    });

    setSwappingExercise(null);
  };

  const activeDay: WorkoutDay = currentPlan.days[activeDayIndex] || currentPlan.days[0];

  const formatTime = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <section id="exercise-chart" className="py-16 bg-[#0a0c10] border-t border-white/10 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Plan Header Card */}
        <div className="bg-[#13161f] border border-white/10 rounded-2xl p-6 sm:p-8 shadow-2xl mb-8 relative overflow-hidden">
          
          {/* Subtle crimson glow in background */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#e6193c]/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6 border-b border-white/10 pb-6 mb-6">
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#e6193c]">
                <span>FitHub Biomechanical Prescription</span>
                <span className="text-white/30">·</span>
                <span className="text-white">{currentPlan.frequency}</span>
                <span className="text-white/30">·</span>
                <span className="text-emerald-400">{currentPlan.userAssessment.bodyCondition.replace('_', ' ')} Safeguard Active</span>
              </div>
              <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-black uppercase tracking-tight text-white">
                {currentPlan.title}
              </h2>
              <p className="text-neutral-400 text-xs sm:text-sm max-w-2xl leading-relaxed">
                {currentPlan.summary}
              </p>
            </div>

            {/* Quick Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 no-print">
              <button
                onClick={handlePrint}
                className="px-4 py-2.5 bg-white/5 hover:bg-white/10 border border-white/15 text-white rounded-lg text-xs font-bold uppercase tracking-wider transition-colors flex items-center gap-2 cursor-pointer"
              >
                <Printer className="w-4 h-4 text-neutral-300" />
                <span>Print Chart</span>
              </button>

              <button
                onClick={handleCopy}
                className="px-4 py-2.5 bg-white/5 hover:bg-white/10 border border-white/15 text-white rounded-lg text-xs font-bold uppercase tracking-wider transition-colors flex items-center gap-2 cursor-pointer"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-neutral-300" />}
                <span>{copied ? 'Copied!' : 'Copy Text'}</span>
              </button>

              <button
                onClick={onModifyAssessment}
                className="px-4 py-2.5 bg-white/5 hover:bg-white/10 border border-white/15 text-white rounded-lg text-xs font-bold uppercase tracking-wider transition-colors flex items-center gap-2 cursor-pointer"
              >
                <RotateCcw className="w-4 h-4 text-neutral-300" />
                <span>Edit Metrics</span>
              </button>
            </div>
          </div>

          {/* Biometrics & Daily Fuel Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            <div className="bg-black/40 border border-white/5 rounded-xl p-3.5">
              <span className="text-[10px] font-semibold text-neutral-400 uppercase block">Daily Fuel Target</span>
              <div className="font-display text-2xl font-black text-white tabular-nums">
                {currentPlan.metrics.macros.calories} <span className="text-xs font-sans font-normal text-neutral-400">kcal</span>
              </div>
              <span className="text-[10px] text-[#ffccd5] block font-medium">TDEE calibrated</span>
            </div>

            <div className="bg-black/40 border border-white/5 rounded-xl p-3.5">
              <span className="text-[10px] font-semibold text-neutral-400 uppercase block">Protein Requirement</span>
              <div className="font-display text-2xl font-black text-[#e6193c] tabular-nums">
                {currentPlan.metrics.macros.proteinGrams} <span className="text-xs font-sans font-normal text-neutral-400">g</span>
              </div>
              <span className="text-[10px] text-neutral-400 block">{(currentPlan.metrics.macros.proteinGrams / currentPlan.userAssessment.weight).toFixed(1)}g / kg</span>
            </div>

            <div className="bg-black/40 border border-white/5 rounded-xl p-3.5">
              <span className="text-[10px] font-semibold text-neutral-400 uppercase block">Carbohydrates</span>
              <div className="font-display text-2xl font-black text-white tabular-nums">
                {currentPlan.metrics.macros.carbsGrams} <span className="text-xs font-sans font-normal text-neutral-400">g</span>
              </div>
              <span className="text-[10px] text-neutral-400 block">Glycogen fuel</span>
            </div>

            <div className="bg-black/40 border border-white/5 rounded-xl p-3.5">
              <span className="text-[10px] font-semibold text-neutral-400 uppercase block">Essential Fats</span>
              <div className="font-display text-2xl font-black text-white tabular-nums">
                {currentPlan.metrics.macros.fatGrams} <span className="text-xs font-sans font-normal text-neutral-400">g</span>
              </div>
              <span className="text-[10px] text-neutral-400 block">Hormonal health</span>
            </div>

            <div className="bg-black/40 border border-white/5 rounded-xl p-3.5">
              <span className="text-[10px] font-semibold text-neutral-400 uppercase block">Hydration Baseline</span>
              <div className="font-display text-2xl font-black text-sky-400 tabular-nums">
                {currentPlan.metrics.macros.waterLiters} <span className="text-xs font-sans font-normal text-neutral-400">Liters</span>
              </div>
              <span className="text-[10px] text-neutral-400 block">Daily intake</span>
            </div>

            <div className="bg-black/40 border border-white/5 rounded-xl p-3.5">
              <span className="text-[10px] font-semibold text-neutral-400 uppercase block">BMI / Weight Status</span>
              <div className="font-display text-2xl font-black text-white tabular-nums">
                {currentPlan.metrics.bmi}
              </div>
              <span className="text-[10px] text-emerald-400 block font-medium">{currentPlan.metrics.bmiCategory}</span>
            </div>
          </div>

        </div>

        {/* View Mode Tabs: Exercise Chart / Nutritional Breakdown / Recovery Rules */}
        <div className="flex items-center gap-2 mb-6 border-b border-white/10 pb-4 no-print overflow-x-auto">
          <button
            onClick={() => setActiveTab('chart')}
            className={`px-5 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap shrink-0 ${
              activeTab === 'chart'
                ? 'bg-[#e6193c] text-white shadow-md shadow-[#e6193c]/25'
                : 'bg-white/5 text-neutral-400 hover:text-white'
            }`}
          >
            <Dumbbell className="w-4 h-4" />
            <span>Interactive Exercise Chart ({currentPlan.days.length} Days)</span>
          </button>

          <button
            onClick={() => setActiveTab('nutrition')}
            className={`px-5 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap shrink-0 ${
              activeTab === 'nutrition'
                ? 'bg-[#e6193c] text-white shadow-md shadow-[#e6193c]/25'
                : 'bg-white/5 text-neutral-400 hover:text-white'
            }`}
          >
            <Flame className="w-4 h-4" />
            <span>Nutritional Protocol & Meal Timing</span>
          </button>

          <button
            onClick={() => setActiveTab('recovery')}
            className={`px-5 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap shrink-0 ${
              activeTab === 'recovery'
                ? 'bg-[#e6193c] text-white shadow-md shadow-[#e6193c]/25'
                : 'bg-white/5 text-neutral-400 hover:text-white'
            }`}
          >
            <Shield className="w-4 h-4" />
            <span>Condition Recovery & Yash's Rules</span>
          </button>
        </div>

        {/* TAB 1: INTERACTIVE EXERCISE CHART */}
        {activeTab === 'chart' && (
          <div className="space-y-6">
            
            {/* Day Selector Buttons & Live Workout Mode Toggle */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#13161f] border border-white/10 p-3 rounded-xl no-print">
              {/* Day selection tabs */}
              <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
                {currentPlan.days.map((day, idx) => (
                  <button
                    key={day.dayNumber}
                    onClick={() => {
                      setActiveDayIndex(idx);
                      setCompletedSets({});
                      setWorkoutFinished(false);
                    }}
                    className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap ${
                      activeDayIndex === idx
                        ? 'bg-white text-black shadow-md'
                        : 'bg-black/30 text-neutral-400 hover:text-white'
                    }`}
                  >
                    Day {day.dayNumber}
                  </button>
                ))}
              </div>

              {/* Start Workout Mode Button */}
              <div className="flex items-center gap-3 shrink-0">
                {!isWorkoutActive ? (
                  <button
                    onClick={() => {
                      setIsWorkoutActive(true);
                      setWorkoutElapsedSeconds(0);
                      setWorkoutFinished(false);
                    }}
                    className="px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 text-white rounded-lg text-xs font-bold uppercase tracking-wider transition-all shadow-md flex items-center gap-2 cursor-pointer"
                  >
                    <Play className="w-4 h-4 fill-white" />
                    <span>Start Day {activeDay.dayNumber} Workout Session</span>
                  </button>
                ) : (
                  <div className="flex items-center gap-2 bg-emerald-950/60 border border-emerald-500/40 px-3 py-1.5 rounded-lg">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-xs font-mono font-bold text-emerald-300">
                      Elapsed: {formatTime(workoutElapsedSeconds)}
                    </span>
                    <button
                      onClick={() => {
                        setIsWorkoutActive(false);
                        setWorkoutFinished(true);
                        if (soundEnabled) soundEffects.playSuccessChime();
                      }}
                      className="ml-2 px-2.5 py-1 bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-bold uppercase rounded cursor-pointer"
                    >
                      Finish
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Rest Timer Floating Bar if active */}
            {restTimerSeconds !== null && (
              <div className="bg-[#1b202e] border-2 border-[#e6193c] p-4 rounded-xl flex items-center justify-between shadow-2xl animate-in fade-in no-print">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#e6193c]/20 border border-[#e6193c] flex items-center justify-center font-display text-xl font-black text-white tabular-nums">
                    {restTimerSeconds}
                  </div>
                  <div>
                    <h4 className="font-display text-base font-bold uppercase text-white tracking-wide">
                      Rest Interval Stopwatch
                    </h4>
                    <p className="text-xs text-neutral-400">
                      Take deep nasal breaths, sip water, and let phosphocreatine stores replenish.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setIsTimerRunning(!isTimerRunning)}
                    className="p-2 bg-white/10 hover:bg-white/20 text-white rounded-lg text-xs cursor-pointer"
                    title={isTimerRunning ? 'Pause' : 'Resume'}
                  >
                    {isTimerRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  </button>

                  <button
                    onClick={() => startRestTimer(60)}
                    className="px-2.5 py-1.5 bg-black/40 hover:bg-black/60 text-xs font-bold rounded text-neutral-300"
                  >
                    60s
                  </button>
                  <button
                    onClick={() => startRestTimer(90)}
                    className="px-2.5 py-1.5 bg-black/40 hover:bg-black/60 text-xs font-bold rounded text-neutral-300"
                  >
                    90s
                  </button>
                  <button
                    onClick={() => startRestTimer(120)}
                    className="px-2.5 py-1.5 bg-black/40 hover:bg-black/60 text-xs font-bold rounded text-neutral-300"
                  >
                    120s
                  </button>

                  <button
                    onClick={() => setSoundEnabled(!soundEnabled)}
                    className="p-2 text-neutral-400 hover:text-white cursor-pointer"
                    title={soundEnabled ? 'Mute Chimes' : 'Unmute Chimes'}
                  >
                    {soundEnabled ? <Volume2 className="w-4 h-4 text-emerald-400" /> : <VolumeX className="w-4 h-4 text-neutral-500" />}
                  </button>

                  <button
                    onClick={() => setRestTimerSeconds(null)}
                    className="text-xs text-neutral-400 hover:text-white px-2 cursor-pointer"
                  >
                    Dismiss
                  </button>
                </div>
              </div>
            )}

            {/* Active Workout Celebration Banner */}
            {workoutFinished && (
              <div className="bg-emerald-950/80 border border-emerald-500/50 p-6 rounded-2xl text-center space-y-3">
                <div className="w-12 h-12 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto">
                  <Award className="w-6 h-6" />
                </div>
                <h3 className="font-display text-2xl font-bold uppercase text-white">
                  Day {activeDay.dayNumber} Session Completed!
                </h3>
                <p className="text-sm text-emerald-200 max-w-md mx-auto">
                  Outstanding discipline! Session duration: {formatTime(workoutElapsedSeconds)}. 
                  Ensure you consume your post-workout protein within 90 minutes.
                </p>
                <button
                  onClick={() => setWorkoutFinished(false)}
                  className="px-5 py-2 bg-emerald-500 text-black font-bold uppercase text-xs tracking-wider rounded-lg hover:bg-emerald-400 cursor-pointer"
                >
                  Close & View Chart
                </button>
              </div>
            )}

            {/* Day Overview Banner */}
            <div className="bg-[#13161f] border border-white/10 rounded-2xl p-6 sm:p-7 shadow-lg">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4 mb-5">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-[#e6193c]">
                    Current Session
                  </span>
                  <h3 className="font-display text-2xl sm:text-3xl font-extrabold uppercase text-white">
                    {activeDay.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-neutral-300 mt-1">
                    Target Focus: <strong className="text-white">{activeDay.focus}</strong>
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1.5 bg-black/40 px-3 py-1.5 rounded-lg border border-white/5 text-xs text-neutral-300">
                    <Clock className="w-4 h-4 text-neutral-400" />
                    <span>~{activeDay.estimatedMinutes} Mins</span>
                  </div>
                  <div className="bg-black/40 px-3 py-1.5 rounded-lg border border-white/5 text-xs text-neutral-300">
                    <span>{activeDay.exercises.length} Targeted Exercises</span>
                  </div>
                </div>
              </div>

              {/* Dynamic Warm-Up Sequence */}
              <div className="mb-8 bg-[#0a0b0f] p-4 rounded-xl border border-white/5">
                <div className="flex items-center gap-2 mb-3">
                  <Flame className="w-4 h-4 text-amber-400" />
                  <h4 className="font-display text-base font-bold uppercase text-white tracking-wide">
                    Pre-Workout Dynamic Warmup & Mobility (5-7 Mins)
                  </h4>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {activeDay.warmup.map((w, i) => (
                    <div key={i} className="bg-white/[0.02] border border-white/5 p-3 rounded-lg text-xs space-y-1">
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-neutral-200">{w.name}</span>
                        <span className="text-[11px] font-mono text-amber-400 font-bold">{w.duration}</span>
                      </div>
                      <p className="text-neutral-400 text-[11px] leading-relaxed">{w.cue}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* EXERCISE TABLE & DETAILED CARDS */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-display text-lg font-bold uppercase tracking-wide text-white flex items-center gap-2">
                    <Dumbbell className="w-4 h-4 text-[#e6193c]" />
                    <span>Prescribed Working Movements</span>
                  </h4>
                  <span className="text-xs text-neutral-400">
                    Click 'Swap' to adapt equipment or angles
                  </span>
                </div>

                <div className="space-y-3">
                  {activeDay.exercises.map((exercise, exIdx) => {
                    return (
                      <div
                        key={exercise.id}
                        className="bg-[#0e1017] border border-white/10 hover:border-white/20 rounded-xl p-4 sm:p-5 transition-all shadow-sm group"
                      >
                        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                          
                          {/* Exercise Meta & Name */}
                          <div className="space-y-1.5 max-w-xl">
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="px-2 py-0.5 bg-[#e6193c]/20 text-[#ff8093] text-[10px] font-bold uppercase tracking-wider rounded">
                                {exercise.targetMuscle}
                              </span>
                              <span className="text-[11px] text-neutral-400 uppercase font-semibold">
                                · {exercise.equipment}
                              </span>
                              {exercise.conditionNote && (
                                <span className="px-2 py-0.5 bg-emerald-950/60 text-emerald-400 text-[10px] font-bold uppercase tracking-wider rounded border border-emerald-500/20">
                                  Condition Safe
                                </span>
                              )}
                            </div>

                            <h5 className="font-display text-xl sm:text-2xl font-bold uppercase tracking-wide text-white group-hover:text-[#ffccd5] transition-colors">
                              {exercise.name}
                            </h5>

                            <p className="text-xs text-neutral-300 leading-relaxed">
                              <strong className="text-neutral-200">Form Cue:</strong> {exercise.formCue}
                            </p>

                            {exercise.conditionNote && (
                              <p className="text-[11px] text-emerald-300/90 italic">
                                ↳ {exercise.conditionNote}
                              </p>
                            )}
                          </div>

                          {/* Exercise Targets: Sets, Reps, Rest, RPE */}
                          <div className="flex flex-wrap items-center gap-3 sm:gap-4 shrink-0">
                            
                            <div className="bg-black/50 border border-white/5 rounded-lg px-3 py-2 text-center min-w-[70px]">
                              <span className="text-[10px] font-semibold text-neutral-400 uppercase block">Sets</span>
                              <span className="font-display text-xl font-black text-white tabular-nums">{exercise.sets}</span>
                            </div>

                            <div className="bg-black/50 border border-white/5 rounded-lg px-3 py-2 text-center min-w-[85px]">
                              <span className="text-[10px] font-semibold text-neutral-400 uppercase block">Reps</span>
                              <span className="font-display text-xl font-black text-white tabular-nums">{exercise.reps}</span>
                            </div>

                            <div className="bg-black/50 border border-white/5 rounded-lg px-3 py-2 text-center min-w-[85px]">
                              <span className="text-[10px] font-semibold text-neutral-400 uppercase block">Rest</span>
                              <span className="font-display text-xl font-black text-[#ffccd5] tabular-nums">{exercise.restSeconds}s</span>
                            </div>

                            <div className="bg-black/50 border border-white/5 rounded-lg px-3 py-2 text-center min-w-[75px]">
                              <span className="text-[10px] font-semibold text-neutral-400 uppercase block">Intensity</span>
                              <span className="font-display text-base font-black text-neutral-200">{exercise.rpe}</span>
                            </div>

                            {/* Actions: Start Rest Timer / Swap Movement */}
                            <div className="flex sm:flex-col gap-2 no-print">
                              <button
                                onClick={() => startRestTimer(exercise.restSeconds)}
                                className="px-3 py-1.5 bg-[#e6193c]/20 hover:bg-[#e6193c]/30 text-[#ffccd5] border border-[#e6193c]/40 rounded text-[11px] font-bold uppercase tracking-wider transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                                title="Start Rest Timer"
                              >
                                <Clock className="w-3.5 h-3.5" />
                                <span>Rest ({exercise.restSeconds}s)</span>
                              </button>

                              {exercise.alternatives && exercise.alternatives.length > 0 && (
                                <button
                                  onClick={() => setSwappingExercise({ dayIdx: activeDayIndex, exIdx, exercise })}
                                  className="px-3 py-1.5 bg-white/5 hover:bg-white/10 text-neutral-300 border border-white/10 rounded text-[11px] font-bold uppercase tracking-wider transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                                  title="Swap for alternative variation"
                                >
                                  <ArrowUpDown className="w-3.5 h-3.5" />
                                  <span>Swap</span>
                                </button>
                              )}
                            </div>

                          </div>

                        </div>

                        {/* Interactive Set Checkboxes when Workout is Active */}
                        {isWorkoutActive && (
                          <div className="mt-4 pt-3 border-t border-white/10 flex flex-wrap items-center gap-2">
                            <span className="text-xs font-semibold text-neutral-400 uppercase mr-2">
                              Log Sets:
                            </span>
                            {Array.from({ length: exercise.sets }).map((_, sIdx) => {
                              const key = `${exercise.id}_set_${sIdx}`;
                              const isDone = !!completedSets[key];
                              return (
                                <button
                                  key={sIdx}
                                  onClick={() => toggleSetComplete(exercise.id, sIdx, exercise.restSeconds)}
                                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer border ${
                                    isDone
                                      ? 'bg-emerald-600 text-white border-emerald-500 shadow-md shadow-emerald-600/30'
                                      : 'bg-black/40 text-neutral-300 border-white/10 hover:border-white/30'
                                  }`}
                                >
                                  <CheckCircle2 className={`w-3.5 h-3.5 ${isDone ? 'text-white' : 'text-neutral-500'}`} />
                                  <span>Set {sIdx + 1}</span>
                                </button>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Cool-Down & Parasympathetic Reset */}
              <div className="mt-8 bg-[#0a0b0f] p-4 rounded-xl border border-white/5">
                <div className="flex items-center gap-2 mb-3">
                  <Shield className="w-4 h-4 text-teal-400" />
                  <h4 className="font-display text-base font-bold uppercase text-white tracking-wide">
                    Post-Workout Cool-Down & Joint Decompression (4-5 Mins)
                  </h4>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {activeDay.cooldown.map((c, i) => (
                    <div key={i} className="bg-white/[0.02] border border-white/5 p-3 rounded-lg text-xs space-y-1">
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-neutral-200">{c.name}</span>
                        <span className="text-[11px] font-mono text-teal-400 font-bold">{c.duration}</span>
                      </div>
                      <p className="text-neutral-400 text-[11px] leading-relaxed">{c.cue}</p>
                    </div>
                  ))}
                </div>
              </div>

            </div>

          </div>
        )}

        {/* TAB 2: NUTRITIONAL BREAKDOWN & MEAL TIMING */}
        {activeTab === 'nutrition' && (
          <div className="space-y-6">
            <div className="bg-[#13161f] border border-white/10 rounded-2xl p-6 sm:p-8 shadow-xl space-y-6">
              
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#e6193c]">
                  Precision Energy Partitioning
                </span>
                <h3 className="font-display text-3xl font-extrabold uppercase text-white">
                  Target Calorie & Macronutrient Blueprint
                </h3>
                <p className="text-xs sm:text-sm text-neutral-400 mt-1 max-w-2xl">
                  Muscle growth and fat loss are governed by thermodynamics and amino acid availability. 
                  Below are your exact daily intake goals calculated for your body weight of {currentPlan.userAssessment.weight}kg.
                </p>
              </div>

              {/* Macro Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-black/40 border border-white/10 rounded-xl p-5 space-y-2">
                  <span className="text-xs font-bold uppercase text-neutral-400">Total Energy</span>
                  <div className="font-display text-4xl font-black text-white tabular-nums">
                    {currentPlan.metrics.macros.calories}
                  </div>
                  <span className="text-xs text-neutral-400 block">Kilocalories / Day</span>
                  <p className="text-[11px] text-neutral-500 pt-1 border-t border-white/5">
                    {currentPlan.userAssessment.goal === 'weight_loss' ? '450 kcal fat-loss deficit' : currentPlan.userAssessment.goal === 'weight_gain' ? '420 kcal lean hypertrophy surplus' : 'Maintenance baseline'}
                  </p>
                </div>

                <div className="bg-black/40 border border-white/10 rounded-xl p-5 space-y-2">
                  <span className="text-xs font-bold uppercase text-[#ff8093]">Protein (Anabolic)</span>
                  <div className="font-display text-4xl font-black text-[#e6193c] tabular-nums">
                    {currentPlan.metrics.macros.proteinGrams}g
                  </div>
                  <span className="text-xs text-neutral-400 block">4 kcal / g</span>
                  <p className="text-[11px] text-neutral-400 pt-1 border-t border-white/5">
                    Essential for muscle protein synthesis and tissue remodeling.
                  </p>
                </div>

                <div className="bg-black/40 border border-white/10 rounded-xl p-5 space-y-2">
                  <span className="text-xs font-bold uppercase text-amber-300">Carbohydrates</span>
                  <div className="font-display text-4xl font-black text-amber-400 tabular-nums">
                    {currentPlan.metrics.macros.carbsGrams}g
                  </div>
                  <span className="text-xs text-neutral-400 block">4 kcal / g</span>
                  <p className="text-[11px] text-neutral-400 pt-1 border-t border-white/5">
                    Replenishes muscle glycogen for high-intensity lifting performance.
                  </p>
                </div>

                <div className="bg-black/40 border border-white/10 rounded-xl p-5 space-y-2">
                  <span className="text-xs font-bold uppercase text-sky-300">Healthy Fats</span>
                  <div className="font-display text-4xl font-black text-sky-400 tabular-nums">
                    {currentPlan.metrics.macros.fatGrams}g
                  </div>
                  <span className="text-xs text-neutral-400 block">9 kcal / g</span>
                  <p className="text-[11px] text-neutral-400 pt-1 border-t border-white/5">
                    Regulates testosterone, cellular membranes, and joint lubrication.
                  </p>
                </div>
              </div>

              {/* Meal Timing Strategy */}
              <div className="space-y-3 pt-4 border-t border-white/10">
                <h4 className="font-display text-xl font-bold uppercase text-white tracking-wide">
                  Optimal Nutrient Timing Protocol
                </h4>
                <div className="space-y-3">
                  {currentPlan.mealTiming.map((meal, idx) => (
                    <div key={idx} className="bg-black/30 border border-white/5 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-mono font-bold text-[#e6193c]">{meal.time}</span>
                          <span className="text-white/40">·</span>
                          <span className="font-display text-base font-bold uppercase text-white">{meal.title}</span>
                        </div>
                        <p className="text-xs text-neutral-300 mt-0.5">{meal.recommendation}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Essential Hydration & Supplement Rules */}
              <div className="bg-[#1b1f2b] p-5 rounded-xl border border-white/10 space-y-3">
                <h4 className="font-display text-lg font-bold uppercase text-white tracking-wide flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#e6193c]" />
                  <span>Coach Yash Badgujar's Core Nutrition Laws</span>
                </h4>
                <ul className="space-y-2 text-xs text-neutral-300">
                  {currentPlan.nutritionTips.map((tip, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-[#e6193c] font-bold">✔</span>
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>

            </div>
          </div>
        )}

        {/* TAB 3: CONDITION RECOVERY & YASH'S COACHING ADVICE */}
        {activeTab === 'recovery' && (
          <div className="space-y-6">
            <div className="bg-[#13161f] border border-white/10 rounded-2xl p-6 sm:p-8 shadow-xl space-y-6">
              
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#e6193c]">
                  Regeneration & Biomechanics
                </span>
                <h3 className="font-display text-3xl font-extrabold uppercase text-white">
                  Recovery Protocols & Condition Safeguards
                </h3>
                <p className="text-xs sm:text-sm text-neutral-400 mt-1 max-w-2xl">
                  Workouts only break down muscle fibers; you only grow and become stronger during the recovery phase.
                </p>
              </div>

              {/* Head Coach Statement */}
              <div className="bg-gradient-to-r from-[#20050b] to-[#12141c] border border-[#e6193c]/30 rounded-2xl p-6 space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-[#e6193c] text-white flex items-center justify-center font-display text-xl font-bold">
                    YB
                  </div>
                  <div>
                    <h4 className="font-display text-lg font-bold uppercase text-white">
                      Yash Badgujar
                    </h4>
                    <span className="text-xs text-[#ffccd5] font-semibold">
                      Founder & Head Performance Architect, FitHub
                    </span>
                  </div>
                </div>
                <blockquote className="text-sm text-neutral-200 italic leading-relaxed border-l-2 border-[#e6193c] pl-4">
                  "{currentPlan.coachAdvice}"
                </blockquote>
              </div>

              {/* Condition Rules */}
              <div className="space-y-3">
                <h4 className="font-display text-xl font-bold uppercase text-white tracking-wide">
                  Non-Negotiable Recovery Pillars
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {currentPlan.recoveryRules.map((rule, idx) => (
                    <div key={idx} className="bg-black/30 border border-white/5 p-4 rounded-xl text-xs space-y-1">
                      <div className="font-bold text-white uppercase text-[11px] tracking-wide text-[#ffccd5]">
                        Pillar 0{idx + 1}
                      </div>
                      <p className="text-neutral-300 leading-relaxed">{rule}</p>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>
        )}

      </div>

      {/* SWAP EXERCISE MODAL */}
      {swappingExercise && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#13161f] border border-white/15 rounded-2xl max-w-lg w-full p-6 space-y-5 shadow-2xl animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#e6193c]">
                  Biomechanical Substitution
                </span>
                <h3 className="font-display text-2xl font-bold uppercase text-white">
                  Swap Movement: {swappingExercise.exercise.name}
                </h3>
              </div>
              <button
                onClick={() => setSwappingExercise(null)}
                className="text-neutral-400 hover:text-white text-sm"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-neutral-300">
              Select an alternative that suits your gym equipment or physical preference. Reps, sets, and rest intervals will transfer automatically.
            </p>

            <div className="space-y-2.5 max-h-80 overflow-y-auto pr-1">
              {swappingExercise.exercise.alternatives.map((alt) => (
                <div
                  key={alt.id}
                  onClick={() => handleSwap(alt.id, alt.name, alt.equipment)}
                  className="bg-black/40 border border-white/10 hover:border-[#e6193c] p-4 rounded-xl cursor-pointer transition-all space-y-1 group"
                >
                  <div className="flex items-center justify-between">
                    <h4 className="font-display text-base font-bold uppercase text-white group-hover:text-[#ffccd5]">
                      {alt.name}
                    </h4>
                    <span className="text-[10px] font-mono uppercase bg-white/10 px-2 py-0.5 rounded text-neutral-300">
                      {alt.equipment}
                    </span>
                  </div>
                  <p className="text-xs text-neutral-400">
                    {alt.reason}
                  </p>
                </div>
              ))}
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setSwappingExercise(null)}
                className="px-4 py-2 bg-white/5 hover:bg-white/10 text-neutral-300 text-xs font-bold uppercase rounded-lg"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
