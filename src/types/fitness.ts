/**
 * FitHub by Yash Badgujar - Core Fitness & Assessment Type Definitions
 */

export type Gender = 'male' | 'female' | 'other';
export type WeightUnit = 'kg' | 'lbs';
export type HeightUnit = 'cm' | 'ft_in';

export type BodyCondition = 
  | 'healthy'           // No restrictions, full mobility
  | 'knee_friendly'     // Knee joint sensitivity / patellar tendon care
  | 'lower_back_care'   // Lumbar spine sensitivity / avoids heavy axial compression
  | 'shoulder_safe'     // Impingement / rotator cuff safe angles
  | 'sedentary_posture'; // Desk worker / postural rehab, tight hip flexors, weak glutes

export type FitnessGoal = 
  | 'weight_gain'       // Increase body weight / clean bulk / mass building
  | 'weight_loss'       // Lose body weight / fat loss / metabolic conditioning
  | 'muscle_building'   // Hypertrophy & power / body recomposition
  | 'remain_fit';       // Functional endurance, cardiovascular health & mobility

export type ExperienceLevel = 'beginner' | 'intermediate' | 'advanced';

export type TrainingEnvironment = 
  | 'commercial_gym'      // Full Commercial Gym (Barbells, Cables, Dumbbells, Machines)
  | 'home_gym'            // Home Gym (Dumbbells & Adjustable Bench)
  | 'bodyweight'          // Only Home Workout Without Any Weight (Calisthenics / Zero Gear)
  | 'home_bands';         // Home Workout with Resistance Bands & Door Anchor

export type BmiRating = 'good' | 'moderate' | 'bad' | 'worst';

export interface UserAssessment {
  weight: number; // in kg
  weightUnit: WeightUnit;
  rawWeight: number; // user input value
  height: number; // in cm
  heightUnit: HeightUnit;
  rawHeightCm: number;
  rawHeightFt?: number;
  rawHeightIn?: number;
  age: number;
  gender: Gender;
  bodyCondition: BodyCondition;
  goal: FitnessGoal;
  experienceLevel: ExperienceLevel;
  trainingEnvironment: TrainingEnvironment;
  daysPerWeek: 3 | 4 | 5 | 6;
  sessionDurationMin: number;
}

export interface MacroBreakdown {
  calories: number;
  proteinGrams: number;
  carbsGrams: number;
  fatGrams: number;
  fiberGrams: number;
  waterLiters: number;
}

export interface BodyMetrics {
  bmi: number;
  bmiCategory: 'Underweight' | 'Normal' | 'Overweight' | 'Obese';
  bmiRating: BmiRating; // 'good' | 'moderate' | 'bad' | 'worst'
  bmiRatingLabel: string; // e.g. "Good / Optimal", "Bad", "Worst"
  bmiConditionVerdict: string; // Specific biomechanical evaluation according to user's condition
  bmr: number;
  tdee: number;
  macros: MacroBreakdown;
}

export interface Exercise {
  id: string;
  name: string;
  targetMuscle: string;
  secondaryMuscles: string[];
  equipment: 'barbell' | 'dumbbell' | 'cable' | 'machine' | 'bodyweight' | 'bands';
  sets: number;
  reps: string;
  restSeconds: number;
  rpe: string; // Rate of Perceived Exertion (e.g. "RPE 7-8")
  formCue: string;
  conditionNote?: string;
  category: 'compound' | 'isolation' | 'core' | 'mobility' | 'cardio';
  illustrationType: string;
  postureKeypoints: string[];
  alternatives: { id: string; name: string; equipment: string; reason: string }[];
}

export interface WorkoutDay {
  dayNumber: number;
  title: string;
  focus: string;
  estimatedMinutes: number;
  warmup: { name: string; duration: string; cue: string }[];
  exercises: Exercise[];
  cooldown: { name: string; duration: string; cue: string }[];
}

export interface WorkoutPlan {
  id: string;
  title: string;
  subtitle: string;
  splitName: string;
  summary: string;
  frequency: string;
  userAssessment: UserAssessment;
  metrics: BodyMetrics;
  days: WorkoutDay[];
  nutritionTips: string[];
  mealTiming: { time: string; title: string; recommendation: string }[];
  recoveryRules: string[];
  coachAdvice: string;
}

export interface WorkoutLogEntry {
  exerciseId: string;
  setIndex: number;
  weightKg?: number;
  repsCompleted?: number;
  completed: boolean;
}
