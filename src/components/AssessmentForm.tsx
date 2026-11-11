import React, { useState } from 'react';
import {
  UserAssessment,
  Gender,
  BodyCondition,
  FitnessGoal,
  ExperienceLevel,
  TrainingEnvironment,
  WeightUnit,
  HeightUnit
} from '../types/fitness';
import { calculateBMI, calculateBMR, evaluateBmiHealth } from '../utils/fitnessCalculator';
import { soundEffects } from '../utils/soundEffects';
import {
  Activity,
  Flame,
  ShieldCheck,
  Zap,
  Dumbbell,
  Heart,
  Sparkles,
  ChevronRight,
  Info,
  CheckCircle2
} from 'lucide-react';

interface AssessmentFormProps {
  onPlanGenerated: (assessment: UserAssessment) => void;
  initialAssessment?: UserAssessment;
}

export const AssessmentForm: React.FC<AssessmentFormProps> = ({
  onPlanGenerated,
  initialAssessment
}) => {
  // Metric Inputs
  const [weightUnit, setWeightUnit] = useState<WeightUnit>(initialAssessment?.weightUnit || 'kg');
  const [weightInput, setWeightInput] = useState<number>(initialAssessment ? initialAssessment.rawWeight : 72);

  const [heightUnit, setHeightUnit] = useState<HeightUnit>(initialAssessment?.heightUnit || 'cm');
  const [heightCmInput, setHeightCmInput] = useState<number>(initialAssessment ? initialAssessment.rawHeightCm : 175);
  const [heightFtInput, setHeightFtInput] = useState<number>(initialAssessment?.rawHeightFt || 5);
  const [heightInInput, setHeightInInput] = useState<number>(initialAssessment?.rawHeightIn || 9);

  const [age, setAge] = useState<number>(initialAssessment?.age || 26);
  const [gender, setGender] = useState<Gender>(initialAssessment?.gender || 'male');
  
  // Body Condition & Goals
  const [bodyCondition, setBodyCondition] = useState<BodyCondition>(initialAssessment?.bodyCondition || 'healthy');
  const [goal, setGoal] = useState<FitnessGoal>(initialAssessment?.goal || 'muscle_building');
  const [experienceLevel, setExperienceLevel] = useState<ExperienceLevel>(initialAssessment?.experienceLevel || 'intermediate');
  
  // Scheduling & Gear
  const [trainingEnvironment, setTrainingEnvironment] = useState<TrainingEnvironment>(initialAssessment?.trainingEnvironment || 'commercial_gym');
  const [daysPerWeek, setDaysPerWeek] = useState<3 | 4 | 5 | 6>(initialAssessment?.daysPerWeek || 4);
  const [durationMin, setDurationMin] = useState<number>(initialAssessment?.sessionDurationMin || 60);

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Compute normalized values
  const normalizedWeightKg = weightUnit === 'kg' ? weightInput : parseFloat((weightInput * 0.453592).toFixed(1));
  const normalizedHeightCm = heightUnit === 'cm' 
    ? heightCmInput 
    : parseFloat(((heightFtInput * 12 + heightInInput) * 2.54).toFixed(1));

  const { bmi, category: bmiCategory } = calculateBMI(normalizedWeightKg, normalizedHeightCm);
  const bmrEst = calculateBMR(normalizedWeightKg, normalizedHeightCm, age, gender);
  const bmiEval = evaluateBmiHealth(bmi, bodyCondition, goal);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    soundEffects.playSuccessChime();

    const assessment: UserAssessment = {
      weight: normalizedWeightKg,
      weightUnit,
      rawWeight: weightInput,
      height: normalizedHeightCm,
      heightUnit,
      rawHeightCm: heightCmInput,
      rawHeightFt: heightFtInput,
      rawHeightIn: heightInInput,
      age,
      gender,
      bodyCondition,
      goal,
      experienceLevel,
      trainingEnvironment,
      daysPerWeek,
      sessionDurationMin: durationMin
    };

    // Immediately pass the newly calibrated assessment
    onPlanGenerated(assessment);

    setTimeout(() => {
      setIsSubmitting(false);

      // Smooth scroll directly to the newly generated exercise chart
      const planElem = document.getElementById('exercise-chart');
      if (planElem) {
        planElem.scrollIntoView({ behavior: 'smooth' });
      }
    }, 300);
  };

  return (
    <section id="assessment" className="py-20 bg-[#0e1015] border-t border-white/10 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
          <div className="flex items-center justify-center gap-2 text-xs font-bold tracking-widest text-[#e6193c] uppercase">
            <Sparkles className="w-4 h-4 text-[#e6193c]" />
            <span>Biometric Assessment Engine</span>
          </div>
          <h2 className="font-display text-4xl sm:text-5xl font-extrabold uppercase tracking-tight text-white">
            Tell Us Your Body Metrics & Condition
          </h2>
          <p className="text-neutral-400 text-sm sm:text-base leading-relaxed text-balance">
            FitHub does not believe in generic one-size-fits-all routines. Enter your physical metrics, joint condition, and primary body target to generate an exact tailored exercise chart with custom sets, reps, and nutrition.
          </p>
        </div>

        {/* Assessment Card Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Main Form: 8 cols */}
          <div className="lg:col-span-8 bg-[#13161f] border border-white/10 rounded-2xl p-6 sm:p-8 shadow-xl">
            <form onSubmit={handleSubmit} className="space-y-8">
              
              {/* Step 1: Physical Metrics */}
              <div>
                <div className="flex items-center gap-2 mb-4 border-b border-white/10 pb-3">
                  <span className="w-6 h-6 rounded-full bg-[#e6193c] text-white flex items-center justify-center text-xs font-bold">1</span>
                  <h3 className="font-display text-xl font-bold uppercase text-white tracking-wide">
                    Biometric Measurements
                  </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  
                  {/* Body Weight */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-semibold text-neutral-300 uppercase tracking-wider">
                        Body Weight
                      </label>
                      <div className="flex bg-black/40 p-0.5 rounded border border-white/10 text-[11px] font-bold">
                        <button
                          type="button"
                          onClick={() => {
                            if (weightUnit === 'lbs') {
                              setWeightInput(parseFloat((weightInput * 0.453592).toFixed(1)));
                              setWeightUnit('kg');
                            }
                          }}
                          className={`px-2 py-0.5 rounded transition-colors ${weightUnit === 'kg' ? 'bg-[#e6193c] text-white' : 'text-neutral-400 hover:text-white'}`}
                        >
                          KG
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            if (weightUnit === 'kg') {
                              setWeightInput(parseFloat((weightInput / 0.453592).toFixed(1)));
                              setWeightUnit('lbs');
                            }
                          }}
                          className={`px-2 py-0.5 rounded transition-colors ${weightUnit === 'lbs' ? 'bg-[#e6193c] text-white' : 'text-neutral-400 hover:text-white'}`}
                        >
                          LBS
                        </button>
                      </div>
                    </div>

                    <div className="relative">
                      <input
                        type="number"
                        min={30}
                        max={250}
                        step={0.5}
                        value={weightInput}
                        onChange={(e) => setWeightInput(parseFloat(e.target.value) || 0)}
                        className="w-full bg-[#0a0b0f] border border-white/15 focus:border-[#e6193c] focus:ring-1 focus:ring-[#e6193c] rounded-lg px-4 py-3 text-lg font-bold text-white tabular-nums outline-none transition-all"
                        required
                      />
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-neutral-400 uppercase">
                        {weightUnit}
                      </span>
                    </div>
                  </div>

                  {/* Height */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-semibold text-neutral-300 uppercase tracking-wider">
                        Height
                      </label>
                      <div className="flex bg-black/40 p-0.5 rounded border border-white/10 text-[11px] font-bold">
                        <button
                          type="button"
                          onClick={() => setHeightUnit('cm')}
                          className={`px-2 py-0.5 rounded transition-colors ${heightUnit === 'cm' ? 'bg-[#e6193c] text-white' : 'text-neutral-400 hover:text-white'}`}
                        >
                          CM
                        </button>
                        <button
                          type="button"
                          onClick={() => setHeightUnit('ft_in')}
                          className={`px-2 py-0.5 rounded transition-colors ${heightUnit === 'ft_in' ? 'bg-[#e6193c] text-white' : 'text-neutral-400 hover:text-white'}`}
                        >
                          FT / IN
                        </button>
                      </div>
                    </div>

                    {heightUnit === 'cm' ? (
                      <div className="relative">
                        <input
                          type="number"
                          min={120}
                          max={230}
                          value={heightCmInput}
                          onChange={(e) => setHeightCmInput(parseInt(e.target.value) || 0)}
                          className="w-full bg-[#0a0b0f] border border-white/15 focus:border-[#e6193c] focus:ring-1 focus:ring-[#e6193c] rounded-lg px-4 py-3 text-lg font-bold text-white tabular-nums outline-none transition-all"
                          required
                        />
                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-neutral-400 uppercase">
                          cm
                        </span>
                      </div>
                    ) : (
                      <div className="grid grid-cols-2 gap-2">
                        <div className="relative">
                          <input
                            type="number"
                            min={4}
                            max={7}
                            value={heightFtInput}
                            onChange={(e) => setHeightFtInput(parseInt(e.target.value) || 0)}
                            className="w-full bg-[#0a0b0f] border border-white/15 focus:border-[#e6193c] rounded-lg px-3 py-3 text-base font-bold text-white tabular-nums outline-none"
                            placeholder="Feet"
                          />
                          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-neutral-400">ft</span>
                        </div>
                        <div className="relative">
                          <input
                            type="number"
                            min={0}
                            max={11}
                            value={heightInInput}
                            onChange={(e) => setHeightInInput(parseInt(e.target.value) || 0)}
                            className="w-full bg-[#0a0b0f] border border-white/15 focus:border-[#e6193c] rounded-lg px-3 py-3 text-base font-bold text-white tabular-nums outline-none"
                            placeholder="Inches"
                          />
                          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-neutral-400">in</span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Age */}
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-neutral-300 uppercase tracking-wider">
                      Age (Years)
                    </label>
                    <input
                      type="number"
                      min={14}
                      max={85}
                      value={age}
                      onChange={(e) => setAge(parseInt(e.target.value) || 0)}
                      className="w-full bg-[#0a0b0f] border border-white/15 focus:border-[#e6193c] focus:ring-1 focus:ring-[#e6193c] rounded-lg px-4 py-3 text-lg font-bold text-white tabular-nums outline-none transition-all"
                      required
                    />
                  </div>

                  {/* Biological Gender */}
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-neutral-300 uppercase tracking-wider">
                      Gender (For Metabolic Equations)
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {(['male', 'female', 'other'] as Gender[]).map((g) => (
                        <button
                          key={g}
                          type="button"
                          onClick={() => setGender(g)}
                          className={`py-3 rounded-lg text-xs font-bold uppercase tracking-wider border transition-all cursor-pointer ${
                            gender === g
                              ? 'bg-[#e6193c] border-[#e6193c] text-white shadow-md shadow-[#e6193c]/30'
                              : 'bg-[#0a0b0f] border-white/10 text-neutral-400 hover:text-white hover:border-white/20'
                          }`}
                        >
                          {g}
                        </button>
                      ))}
                    </div>
                  </div>

                </div>
              </div>

              {/* Step 2: Primary Goal */}
              <div>
                <div className="flex items-center gap-2 mb-4 border-b border-white/10 pb-3">
                  <span className="w-6 h-6 rounded-full bg-[#e6193c] text-white flex items-center justify-center text-xs font-bold">2</span>
                  <h3 className="font-display text-xl font-bold uppercase text-white tracking-wide">
                    What Do You Want To Do With Your Body?
                  </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {[
                    {
                      id: 'weight_gain' as FitnessGoal,
                      title: 'Increase Body Weight',
                      subtitle: 'Clean Hypertrophy Bulk & Mass Building',
                      icon: Flame,
                      desc: 'Caloric surplus with high carbohydrate partitioning and progressive volume overload.'
                    },
                    {
                      id: 'weight_loss' as FitnessGoal,
                      title: 'Lose Body Weight',
                      subtitle: 'Fat Loss, Metabolic Conditioning & Tone',
                      icon: Activity,
                      desc: 'Calorie deficit with elevated protein to preserve muscle mass while burning body fat.'
                    },
                    {
                      id: 'muscle_building' as FitnessGoal,
                      title: 'Muscle Building & Power',
                      subtitle: 'Hypertrophy & Body Recomposition',
                      icon: Dumbbell,
                      desc: 'Targeted mechanical tension and hypertrophy rep ranges to pack on lean muscle tissue.'
                    },
                    {
                      id: 'remain_fit' as FitnessGoal,
                      title: 'Remain Fit & Athletic',
                      subtitle: 'Cardio Stamina, Agility & Longevity',
                      icon: Heart,
                      desc: 'Balanced functional endurance, core stabilization, and sustained vital metabolic health.'
                    }
                  ].map((gItem) => {
                    const Icon = gItem.icon;
                    const isSelected = goal === gItem.id;
                    return (
                      <div
                        key={gItem.id}
                        onClick={() => setGoal(gItem.id)}
                        className={`p-4 rounded-xl border transition-all cursor-pointer text-left relative ${
                          isSelected
                            ? 'bg-[#e6193c]/15 border-[#e6193c] shadow-lg shadow-[#e6193c]/15'
                            : 'bg-[#0a0b0f] border-white/10 hover:border-white/25 hover:bg-white/[0.02]'
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div className={`p-2 rounded-lg shrink-0 ${isSelected ? 'bg-[#e6193c] text-white' : 'bg-white/5 text-neutral-400'}`}>
                            <Icon className="w-5 h-5" />
                          </div>
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <h4 className="font-display text-base font-bold uppercase text-white tracking-wide">
                                {gItem.title}
                              </h4>
                              {isSelected && <CheckCircle2 className="w-4 h-4 text-[#e6193c]" />}
                            </div>
                            <p className="text-xs font-semibold text-[#ffccd5]">
                              {gItem.subtitle}
                            </p>
                            <p className="text-[11px] text-neutral-400 leading-normal">
                              {gItem.desc}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Step 3: Body Condition & Joint Restrictions */}
              <div>
                <div className="flex items-center gap-2 mb-4 border-b border-white/10 pb-3">
                  <span className="w-6 h-6 rounded-full bg-[#e6193c] text-white flex items-center justify-center text-xs font-bold">3</span>
                  <div>
                    <h3 className="font-display text-xl font-bold uppercase text-white tracking-wide">
                      Current Body Condition & Physical Baseline
                    </h3>
                    <p className="text-xs text-neutral-400 mt-0.5">
                      We modify joint angles, exercise mechanics, and load distributions to protect and rehab your body.
                    </p>
                  </div>
                </div>

                <div className="space-y-2.5">
                  {[
                    {
                      id: 'healthy' as BodyCondition,
                      label: 'Healthy & Full Mobility',
                      note: 'Standard progressive athletic compounds: heavy squats, deadlifts, and overhead presses without restriction.',
                      tag: 'Unrestricted'
                    },
                    {
                      id: 'knee_friendly' as BodyCondition,
                      label: 'Knee-Friendly / Patellar Care',
                      note: 'Replaces deep forward quad shear with vertical-shin Bulgarian split squats, Romanian deadlifts, and hip thrusts.',
                      tag: 'Protective'
                    },
                    {
                      id: 'lower_back_care' as BodyCondition,
                      label: 'Lower Back Care / Lumbar Friendly',
                      note: 'Eliminates heavy axial spinal compression; replaces bent-over rows with chest-supported dumbbell work and anti-rotation core.',
                      tag: 'Spinal Decompression'
                    },
                    {
                      id: 'shoulder_safe' as BodyCondition,
                      label: 'Shoulder-Safe / Rotator Cuff Protection',
                      note: 'Neutral-grip dumbbell presses, landmine angles, and high-repetition face pulls to eliminate subacromial impingement.',
                      tag: 'Rotator Longevity'
                    },
                    {
                      id: 'sedentary_posture' as BodyCondition,
                      label: 'Sedentary Desk Worker / Posture Rehab',
                      note: 'Counteracts prolonged sitting with glute reactivation, thoracic extension mobility, and posterior chain activation.',
                      tag: 'Postural Reset'
                    }
                  ].map((cond) => {
                    const isSelected = bodyCondition === cond.id;
                    return (
                      <div
                        key={cond.id}
                        onClick={() => setBodyCondition(cond.id)}
                        className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-4 ${
                          isSelected
                            ? 'bg-[#e6193c]/15 border-[#e6193c]'
                            : 'bg-[#0a0b0f] border-white/10 hover:border-white/25 hover:bg-white/[0.02]'
                        }`}
                      >
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-2">
                            <span className="font-display text-sm font-bold uppercase text-white tracking-wide">
                              {cond.label}
                            </span>
                            <span className="text-[10px] uppercase font-bold text-neutral-400">
                              · {cond.tag}
                            </span>
                          </div>
                          <p className="text-xs text-neutral-400">
                            {cond.note}
                          </p>
                        </div>
                        <div className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 ${isSelected ? 'border-[#e6193c] bg-[#e6193c]' : 'border-white/20'}`}>
                          {isSelected && <span className="w-2 h-2 rounded-full bg-white" />}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Step 4: Schedule, Gear & Experience */}
              <div>
                <div className="flex items-center gap-2 mb-4 border-b border-white/10 pb-3">
                  <span className="w-6 h-6 rounded-full bg-[#e6193c] text-white flex items-center justify-center text-xs font-bold">4</span>
                  <h3 className="font-display text-xl font-bold uppercase text-white tracking-wide">
                    Training Setup & Availability
                  </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {/* Equipment */}
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-neutral-300 uppercase tracking-wider block">
                      Equipment Access
                    </label>
                    <select
                      value={trainingEnvironment}
                      onChange={(e) => setTrainingEnvironment(e.target.value as TrainingEnvironment)}
                      className="w-full bg-[#0a0b0f] border border-white/15 focus:border-[#e6193c] rounded-lg px-3 py-2.5 text-xs font-bold text-white uppercase outline-none"
                    >
                      <option value="bodyweight">Only Home Workout Without Any Weight (Calisthenics)</option>
                      <option value="home_bands">Home Workout with Resistance Bands</option>
                      <option value="home_gym">Home Gym (Dumbbells & Bench)</option>
                      <option value="commercial_gym">Commercial Gym (Full Equipment)</option>
                    </select>
                    {trainingEnvironment === 'bodyweight' && (
                      <span className="text-[10px] text-emerald-400 font-semibold block">
                        ✓ 100% Zero-Equipment Bodyweight Calisthenics Routine
                      </span>
                    )}
                  </div>

                  {/* Days per week */}
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-neutral-300 uppercase tracking-wider block">
                      Days Per Week
                    </label>
                    <div className="grid grid-cols-4 gap-1.5">
                      {[3, 4, 5, 6].map((d) => (
                        <button
                          key={d}
                          type="button"
                          onClick={() => setDaysPerWeek(d as 3 | 4 | 5 | 6)}
                          className={`py-2 rounded text-xs font-bold uppercase border transition-colors cursor-pointer ${
                            daysPerWeek === d
                              ? 'bg-[#e6193c] border-[#e6193c] text-white'
                              : 'bg-[#0a0b0f] border-white/10 text-neutral-400 hover:text-white'
                          }`}
                        >
                          {d}d
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Session Duration */}
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-neutral-300 uppercase tracking-wider block">
                      Target Session Time
                    </label>
                    <select
                      value={durationMin}
                      onChange={(e) => setDurationMin(parseInt(e.target.value) || 60)}
                      className="w-full bg-[#0a0b0f] border border-white/15 focus:border-[#e6193c] rounded-lg px-3 py-2.5 text-xs font-bold text-white uppercase outline-none"
                    >
                      <option value={30}>30 Minutes (Rapid)</option>
                      <option value={45}>45 Minutes (Efficient)</option>
                      <option value={60}>60 Minutes (Standard)</option>
                      <option value={75}>75 Minutes (Volume High)</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Submit CTA */}
              <div className="pt-4 border-t border-white/10">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 px-6 bg-gradient-to-r from-[#e6193c] via-[#cc1433] to-[#880b20] hover:from-[#f32448] hover:to-[#a7112a] text-white font-display uppercase tracking-wider rounded-xl shadow-xl shadow-[#e6193c]/35 hover:shadow-[0_0_35px_rgba(230,25,60,0.6)] hover:scale-[1.01] active:scale-[0.98] transition-all cursor-pointer flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-3 disabled:opacity-60 border border-white/20 select-none group"
                >
                  {isSubmitting ? (
                    <div className="flex items-center gap-3">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span className="text-xl sm:text-2xl font-black">Applying Biomechanical Safeguards...</span>
                    </div>
                  ) : (
                    <>
                      <div className="text-center sm:text-left">
                        <div className="text-xl sm:text-2xl font-black tracking-wide flex items-center justify-center sm:justify-start gap-2">
                          <span>Generate My Personalized Exercise Chart</span>
                          <Sparkles className="w-5 h-5 text-amber-300 group-hover:rotate-12 transition-transform" />
                        </div>
                        <div className="text-[11px] sm:text-xs font-sans font-medium text-red-100 normal-case tracking-normal mt-0.5">
                          Actively tailoring for: <strong className="text-white capitalize">{goal.replace(/_/g, ' ')}</strong> · <strong className="text-emerald-300 capitalize">{bodyCondition.replace(/_/g, ' ')}</strong> · <strong className="text-white">{daysPerWeek} Days/Week</strong>
                        </div>
                      </div>
                      <ChevronRight className="w-6 h-6 text-white group-hover:translate-x-1.5 transition-transform shrink-0 hidden sm:block" />
                    </>
                  )}
                </button>
              </div>

            </form>
          </div>

          {/* Right Sidebar: Real-Time Physiological Computation HUD (4 cols) */}
          <div className="lg:col-span-4 space-y-5 sticky top-28">
            
            {/* Live Metrics Card */}
            <div className="bg-[#13161f] border border-white/10 rounded-2xl p-6 shadow-xl space-y-5">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div className="flex items-center gap-2">
                  <Activity className="w-4 h-4 text-[#e6193c]" />
                  <span className="text-xs font-bold uppercase tracking-wider text-white">
                    Live Metric Calculations
                  </span>
                </div>
                <span className="text-[10px] text-neutral-400 font-mono">Formula: Mifflin-St Jeor</span>
              </div>

              {/* BMI Output with Health Rating according to condition */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-neutral-400">Body Mass Index (BMI)</span>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white tabular-nums text-sm">{bmi}</span>
                    <span className="text-neutral-500 font-mono text-[10px]">({bmiCategory})</span>
                  </div>
                </div>

                {/* Visual Bar */}
                <div className="h-2 w-full bg-black/40 rounded-full overflow-hidden flex">
                  <div 
                    className={`h-full transition-all duration-300 ${
                      bmiEval.rating === 'good' 
                        ? 'bg-emerald-400' 
                        : bmiEval.rating === 'moderate' 
                        ? 'bg-amber-400' 
                        : bmiEval.rating === 'bad' 
                        ? 'bg-orange-500' 
                        : 'bg-red-600'
                    }`} 
                    style={{ width: `${Math.min(100, Math.max(10, (bmi / 38) * 100))}%` }} 
                  />
                </div>

                {/* BMI Health Status Badge & Verdict according to Condition */}
                <div className="mt-2.5 p-3 rounded-xl border text-xs space-y-1.5 transition-all bg-black/40 border-white/10">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[10px] uppercase font-bold text-neutral-400">
                      Condition Verdict:
                    </span>
                    <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full border ${
                      bmiEval.rating === 'good'
                        ? 'bg-emerald-950/90 text-emerald-300 border-emerald-500/50'
                        : bmiEval.rating === 'moderate'
                        ? 'bg-amber-950/90 text-amber-300 border-amber-500/50'
                        : bmiEval.rating === 'bad'
                        ? 'bg-orange-950/90 text-orange-300 border-orange-500/50'
                        : 'bg-red-950/95 text-red-300 border-red-500/60'
                    }`}>
                      BMI IS {bmiEval.rating.toUpperCase()}
                    </span>
                  </div>
                  <p className="text-[11px] text-neutral-300 leading-relaxed">
                    {bmiEval.verdict}
                  </p>
                </div>
              </div>

              {/* BMR & Baseline TDEE Preview */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="bg-black/40 p-3 rounded-lg border border-white/5">
                  <span className="text-[10px] font-semibold text-neutral-400 uppercase block">Basal Metabolic Rate</span>
                  <span className="font-display text-2xl font-black text-white tabular-nums">{bmrEst}</span>
                  <span className="text-[10px] text-neutral-400 block">kcal at total rest</span>
                </div>
                <div className="bg-black/40 p-3 rounded-lg border border-white/5">
                  <span className="text-[10px] font-semibold text-neutral-400 uppercase block">Weekly Volume</span>
                  <span className="font-display text-2xl font-black text-[#ffccd5] tabular-nums">{daysPerWeek} Days</span>
                  <span className="text-[10px] text-neutral-400 block">{durationMin} min / session</span>
                </div>
              </div>

              {/* Goal Impact Summary */}
              <div className="bg-[#1b1f2b] p-3.5 rounded-xl border border-white/5 space-y-1.5 text-xs">
                <div className="flex items-center gap-1.5 text-emerald-400 font-bold">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Program Adaptation Active</span>
                </div>
                <p className="text-neutral-300 text-[11px] leading-relaxed">
                  {goal === 'weight_loss' && 'Applying a 450 kcal fat-loss deficit with 2.3g protein/kg to maximize body fat oxidation while protecting hard-earned muscle mass.'}
                  {goal === 'weight_gain' && 'Applying a +420 kcal clean lean-bulk surplus with high glycogen support to fuel hypertrophy and heavy strength progression.'}
                  {goal === 'muscle_building' && 'Applying lean hypertrophy recomposition targets with high mechanical tension loading schemes.'}
                  {goal === 'remain_fit' && 'Calibrating maintenance energy expenditure with metabolic cardio circuits and joint resilience mobility.'}
                </p>
              </div>

              {/* Coach Yash Badgujar Guarantee */}
              <div className="border-t border-white/10 pt-4 text-xs text-neutral-400 space-y-1">
                <p className="font-bold text-white uppercase text-[11px]">Yash Badgujar Coaching Standard:</p>
                <p className="text-[11px] leading-relaxed">
                  Every exercise in your chart includes explicit sets, rep targets, rest periods, RPE, form cues, and instant alternative swaps.
                </p>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
