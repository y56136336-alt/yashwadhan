import {
  UserAssessment,
  BodyMetrics,
  WorkoutPlan,
  WorkoutDay,
  Exercise,
  BodyCondition,
  FitnessGoal,
  TrainingEnvironment
} from '../types/fitness';

/**
 * Calculate BMI and category
 */
export function calculateBMI(weightKg: number, heightCm: number): { bmi: number; category: BodyMetrics['bmiCategory'] } {
  const heightM = heightCm / 100;
  const bmi = parseFloat((weightKg / (heightM * heightM)).toFixed(1));
  let category: BodyMetrics['bmiCategory'] = 'Normal';
  if (bmi < 18.5) category = 'Underweight';
  else if (bmi < 25) category = 'Normal';
  else if (bmi < 30) category = 'Overweight';
  else category = 'Obese';
  return { bmi, category };
}

/**
 * Calculate BMR using Mifflin-St Jeor equation
 */
export function calculateBMR(weightKg: number, heightCm: number, age: number, gender: string): number {
  let bmr = 10 * weightKg + 6.25 * heightCm - 5 * age;
  if (gender === 'female') {
    bmr -= 161;
  } else {
    bmr += 5;
  }
  return Math.round(bmr);
}

/**
 * Calculate TDEE and tailored target calories & macros
 */
export function calculateNutrition(assessment: UserAssessment): BodyMetrics {
  const { bmi, category } = calculateBMI(assessment.weight, assessment.height);
  const bmr = calculateBMR(assessment.weight, assessment.height, assessment.age, assessment.gender);

  // Activity multiplier based on days per week and condition
  let activityFactor = 1.2; // Sedentary base
  if (assessment.daysPerWeek === 3) activityFactor = 1.375;
  else if (assessment.daysPerWeek === 4) activityFactor = 1.45;
  else if (assessment.daysPerWeek === 5) activityFactor = 1.55;
  else if (assessment.daysPerWeek >= 6) activityFactor = 1.7;

  const tdee = Math.round(bmr * activityFactor);

  let targetCalories = tdee;
  let proteinPerKg = 2.0;
  let fatPercent = 0.25;

  switch (assessment.goal) {
    case 'weight_gain':
      // Moderate clean calorie surplus (+400 kcal)
      targetCalories = tdee + 420;
      proteinPerKg = 2.1;
      fatPercent = 0.25;
      break;
    case 'weight_loss':
      // Controlled sustainable deficit (-450 kcal)
      targetCalories = Math.max(1200, tdee - 450);
      proteinPerKg = 2.3; // Higher protein to spare lean muscle mass during deficit
      fatPercent = 0.27;
      break;
    case 'muscle_building':
      // Lean hypertrophy surplus (+220 kcal)
      targetCalories = tdee + 220;
      proteinPerKg = 2.2;
      fatPercent = 0.25;
      break;
    case 'remain_fit':
      // Maintenance
      targetCalories = tdee;
      proteinPerKg = 1.8;
      fatPercent = 0.26;
      break;
  }

  const proteinGrams = Math.round(assessment.weight * proteinPerKg);
  const fatGrams = Math.round((targetCalories * fatPercent) / 9);
  const remainingCalories = Math.max(0, targetCalories - (proteinGrams * 4 + fatGrams * 9));
  const carbsGrams = Math.round(remainingCalories / 4);
  const fiberGrams = Math.round((targetCalories / 1000) * 14); // 14g per 1000 kcal
  const waterLiters = parseFloat((assessment.weight * 0.038 + (assessment.daysPerWeek > 4 ? 0.5 : 0.2)).toFixed(1));

  return {
    bmi,
    bmiCategory: category,
    bmr,
    tdee,
    macros: {
      calories: targetCalories,
      proteinGrams,
      carbsGrams,
      fatGrams,
      fiberGrams,
      waterLiters
    }
  };
}

/**
 * Exercise database filtered and adapted dynamically based on condition & environment
 */
interface ExerciseTemplate {
  name: string;
  targetMuscle: string;
  secondary: string[];
  equipment: 'barbell' | 'dumbbell' | 'cable' | 'machine' | 'bodyweight' | 'bands';
  sets: number;
  reps: string;
  rest: number;
  rpe: string;
  formCue: string;
  conditionSafetyNote?: string;
  avoidForConditions?: BodyCondition[];
  allowedEnvironments: TrainingEnvironment[];
  category: 'compound' | 'isolation' | 'core' | 'mobility' | 'cardio';
  alternatives: { id: string; name: string; equipment: string; reason: string }[];
}

const EXERCISE_LIBRARY: Record<string, ExerciseTemplate[]> = {
  push: [
    {
      name: 'Incline Dumbbell Bench Press',
      targetMuscle: 'Upper Chest',
      secondary: ['Front Delts', 'Triceps'],
      equipment: 'dumbbell',
      sets: 4,
      reps: '8 - 10 reps',
      rest: 90,
      rpe: 'RPE 8',
      formCue: 'Set bench to 30 degrees. Retract shoulder blades, lower with a 3-second eccentric to armpit line, press without clanking dumbbells.',
      conditionSafetyNote: 'Highly joint-friendly for shoulders compared to flat barbell pressing.',
      allowedEnvironments: ['commercial_gym', 'home_gym'],
      category: 'compound',
      alternatives: [
        { id: 'flat_db_press', name: 'Flat Dumbbell Press', equipment: 'Dumbbells', reason: 'Focuses more on mid-pectoral fibers' },
        { id: 'floor_press', name: 'Dumbbell Floor Press', equipment: 'Dumbbells', reason: 'Zero shoulder extension strain for shoulder care' }
      ]
    },
    {
      name: 'Barbell Flat Bench Press',
      targetMuscle: 'Chest',
      secondary: ['Triceps', 'Anterior Deltoids'],
      equipment: 'barbell',
      sets: 4,
      reps: '6 - 8 reps',
      rest: 120,
      rpe: 'RPE 8-9',
      formCue: 'Plant feet flat, maintain gentle lumbar arch, grip bar firmly, touch mid-chest and drive upward with leg drive.',
      avoidForConditions: ['shoulder_safe'],
      allowedEnvironments: ['commercial_gym'],
      category: 'compound',
      alternatives: [
        { id: 'neutral_db_press', name: 'Neutral-Grip Dumbbell Press', equipment: 'Dumbbells', reason: 'Spares the rotator cuff from internal rotation' }
      ]
    },
    {
      name: 'Neutral-Grip Dumbbell Press',
      targetMuscle: 'Chest & Shoulders',
      secondary: ['Triceps'],
      equipment: 'dumbbell',
      sets: 4,
      reps: '10 - 12 reps',
      rest: 90,
      rpe: 'RPE 7-8',
      formCue: 'Keep palms facing inward throughout the entire repetition. This protects the acromion space and eliminates shoulder pinching.',
      conditionSafetyNote: 'Essential modification for shoulder impingement and rotator cuff longevity.',
      allowedEnvironments: ['commercial_gym', 'home_gym'],
      category: 'compound',
      alternatives: [
        { id: 'landmine_press', name: 'Standing Landmine Press', equipment: 'Barbell', reason: 'Gentle natural upward trajectory' }
      ]
    },
    {
      name: 'Deficit Push-Ups / Standard Push-Ups',
      targetMuscle: 'Chest & Core',
      secondary: ['Triceps', 'Serratus Anterior'],
      equipment: 'bodyweight',
      sets: 3,
      reps: '12 - 15 reps',
      rest: 60,
      rpe: 'RPE 8',
      formCue: 'Lock hips and glutes, keep neck neutral. Lower chest until 1 inch from floor, push the floor away and actively protract scapulae at top.',
      allowedEnvironments: ['commercial_gym', 'home_gym', 'bodyweight'],
      category: 'compound',
      alternatives: [
        { id: 'incline_pushup', name: 'Hands-Elevated Push-Ups', equipment: 'Bench/Box', reason: 'Reduces bodyweight percentage load for beginners' }
      ]
    },
    {
      name: 'Standing Dumbbell Lateral Raise',
      targetMuscle: 'Lateral Deltoids',
      secondary: ['Traps'],
      equipment: 'dumbbell',
      sets: 4,
      reps: '12 - 15 reps',
      rest: 60,
      rpe: 'RPE 8-9',
      formCue: 'Slight forward torso lean (15 deg), raise arms in the scapular plane (30 deg forward of torso). Lead with elbows, not wrists.',
      conditionSafetyNote: 'Raising in scapular plane avoids subacromial impingement.',
      allowedEnvironments: ['commercial_gym', 'home_gym'],
      category: 'isolation',
      alternatives: [
        { id: 'cable_lateral_raise', name: 'Cable Lateral Raise', equipment: 'Cable', reason: 'Smooth continuous tension throughout range' },
        { id: 'band_lateral_raise', name: 'Resistance Band Lateral Raise', equipment: 'Bands', reason: 'Zero setup required at home' }
      ]
    },
    {
      name: 'Overhead Cable / DB Triceps Extension',
      targetMuscle: 'Triceps (Long Head)',
      secondary: [],
      equipment: 'dumbbell',
      sets: 3,
      reps: '10 - 12 reps',
      rest: 60,
      rpe: 'RPE 8',
      formCue: 'Keep elbows tucked beside ears, lower weight behind head to achieve full long-head stretch, extend fully without locking hard.',
      allowedEnvironments: ['commercial_gym', 'home_gym'],
      category: 'isolation',
      alternatives: [
        { id: 'cable_rope_pushdown', name: 'Cable Rope Pushdown', equipment: 'Cable', reason: 'Less elbow stress, great lateral head squeeze' }
      ]
    }
  ],

  pull: [
    {
      name: 'Chest-Supported Dumbbell Row',
      targetMuscle: 'Mid-Back & Lats',
      secondary: ['Biceps', 'Rear Delts'],
      equipment: 'dumbbell',
      sets: 4,
      reps: '10 - 12 reps',
      rest: 90,
      rpe: 'RPE 8',
      formCue: 'Lie chest-down on 30-degree incline bench. Pull dumbbells towards hips, squeeze shoulder blades together for 1 full second at top.',
      conditionSafetyNote: 'Zero axial loading on the lumbar spine. Safest back builder for lower back care.',
      allowedEnvironments: ['commercial_gym', 'home_gym'],
      category: 'compound',
      alternatives: [
        { id: 'cable_seated_row', name: 'Seated Cable Row with Neutral Grip', equipment: 'Cable', reason: 'Controlled spine angle and steady resistance' }
      ]
    },
    {
      name: 'Conventional Barbell Deadlift',
      targetMuscle: 'Posterior Chain (Hamstrings, Glutes, Erector Spinae)',
      secondary: ['Lats', 'Traps', 'Forearms'],
      equipment: 'barbell',
      sets: 3,
      reps: '5 - 6 reps',
      rest: 150,
      rpe: 'RPE 8',
      formCue: 'Bar over midfoot, pull chest tall to set lats, wedge hips, push floor away through heels without rounding lumbar spine.',
      avoidForConditions: ['lower_back_care', 'knee_friendly'],
      allowedEnvironments: ['commercial_gym'],
      category: 'compound',
      alternatives: [
        { id: 'trap_bar_deadlift', name: 'Trap Bar Deadlift (High Handles)', equipment: 'Trap Bar', reason: 'More upright torso, significantly less shear force on lower back' }
      ]
    },
    {
      name: 'Lat Pulldown / Assisted Pull-Up',
      targetMuscle: 'Latissimus Dorsi',
      secondary: ['Biceps', 'Rear Delts'],
      equipment: 'cable',
      sets: 4,
      reps: '8 - 12 reps',
      rest: 75,
      rpe: 'RPE 8',
      formCue: 'Lean back slightly (10 deg), initiate pull by depressing scapulae down and driving elbows down into back pockets.',
      allowedEnvironments: ['commercial_gym'],
      category: 'compound',
      alternatives: [
        { id: 'incline_db_pullover', name: 'Dumbbell Pullover', equipment: 'Dumbbell', reason: 'Great lat stretch for home gyms' },
        { id: 'band_pulldown', name: 'Banded Lat Pulldown', equipment: 'Bands', reason: 'Ideal home/bodyweight alternative' }
      ]
    },
    {
      name: 'Inverted Bodyweight Row / Doorframe Row',
      targetMuscle: 'Upper Back & Rhomboids',
      secondary: ['Biceps', 'Core'],
      equipment: 'bodyweight',
      sets: 4,
      reps: '10 - 15 reps',
      rest: 60,
      rpe: 'RPE 8',
      formCue: 'Keep body in rigid plank from head to heels. Pull sternum towards bar or anchor, squeeze scapulae without shrugging traps.',
      allowedEnvironments: ['commercial_gym', 'home_gym', 'bodyweight'],
      category: 'compound',
      alternatives: [
        { id: 'towel_door_row', name: 'Towel Door Rows', equipment: 'Bodyweight', reason: 'Zero equipment home back builder' }
      ]
    },
    {
      name: 'Face Pulls with External Rotation',
      targetMuscle: 'Rear Deltoids & Rotator Cuff',
      secondary: ['Rhomboids', 'Lower Traps'],
      equipment: 'cable',
      sets: 3,
      reps: '15 - 20 reps',
      rest: 60,
      rpe: 'RPE 7-8',
      formCue: 'Set rope to eye height. Pull rope towards nose while rotating thumbs backwards. Squeeze rear delts and hold for 2 seconds.',
      conditionSafetyNote: 'Crucial for reversing desk hunch, improving thoracic posture, and stabilizing the shoulder joint.',
      allowedEnvironments: ['commercial_gym'],
      category: 'isolation',
      alternatives: [
        { id: 'band_pullapart', name: 'Banded Face Pull / Pull-Apart', equipment: 'Bands', reason: 'Can be done anywhere anytime' }
      ]
    },
    {
      name: 'Incline Dumbbell Biceps Curl',
      targetMuscle: 'Biceps (Long Head)',
      secondary: ['Forearms'],
      equipment: 'dumbbell',
      sets: 3,
      reps: '10 - 12 reps',
      rest: 60,
      rpe: 'RPE 8',
      formCue: 'Lie back on 45-degree bench with arms hanging down. Curl upward while keeping upper arms strictly perpendicular to ground.',
      allowedEnvironments: ['commercial_gym', 'home_gym'],
      category: 'isolation',
      alternatives: [
        { id: 'hammer_curl', name: 'Dumbbell Hammer Curl', equipment: 'Dumbbells', reason: 'Spares wrist joints, targets brachialis for arm thickness' }
      ]
    }
  ],

  legs: [
    {
      name: 'Romanian Deadlift (RDL)',
      targetMuscle: 'Hamstrings & Glutes',
      secondary: ['Erectors', 'Adductors'],
      equipment: 'dumbbell',
      sets: 4,
      reps: '8 - 10 reps',
      rest: 90,
      rpe: 'RPE 8',
      formCue: 'Soft unlock at knees, push hips back like shutting a car door with glutes. Stop when hamstrings reach full stretch below knees, drive hips forward to lockout.',
      conditionSafetyNote: 'Knee-friendly: Maintains vertical shin angle, eliminating shear pressure on the patella.',
      allowedEnvironments: ['commercial_gym', 'home_gym'],
      category: 'compound',
      alternatives: [
        { id: 'single_leg_rdl', name: 'Single-Leg Dumbbell RDL', equipment: 'Dumbbell', reason: 'Unilateral stability with minimal spinal load' }
      ]
    },
    {
      name: 'Bulgarian Split Squat',
      targetMuscle: 'Quadriceps & Glute Max',
      secondary: ['Adductors', 'Calves'],
      equipment: 'dumbbell',
      sets: 3,
      reps: '8 - 10 reps per leg',
      rest: 90,
      rpe: 'RPE 8-9',
      formCue: 'Rear foot elevated on bench, torso tilted slightly forward. Descend until front thigh is parallel, push through front mid-foot and heel.',
      conditionSafetyNote: 'Massive leg hypertrophy stimulus with half the spinal load of barbell back squats.',
      allowedEnvironments: ['commercial_gym', 'home_gym', 'bodyweight'],
      category: 'compound',
      alternatives: [
        { id: 'reverse_lunge', name: 'Dumbbell Reverse Lunge', equipment: 'Dumbbells', reason: 'Slightly easier balance, exceptional knee safety' }
      ]
    },
    {
      name: 'Barbell Back Squat',
      targetMuscle: 'Quads & Glutes',
      secondary: ['Core', 'Adductors'],
      equipment: 'barbell',
      sets: 4,
      reps: '6 - 8 reps',
      rest: 120,
      rpe: 'RPE 8',
      formCue: 'Brace core with diaphragmatic breath, sit back and down between knees, reach hip crease below knee cap, drive up through whole foot.',
      avoidForConditions: ['lower_back_care', 'knee_friendly'],
      allowedEnvironments: ['commercial_gym'],
      category: 'compound',
      alternatives: [
        { id: 'goblet_squat', name: 'Heavy Goblet Squat', equipment: 'Dumbbell/Kettlebell', reason: 'Upright posture relieves lumbar spine stress' }
      ]
    },
    {
      name: 'Barbell / Dumbbell Hip Thrust',
      targetMuscle: 'Gluteus Maximus',
      secondary: ['Hamstrings'],
      equipment: 'barbell',
      sets: 3,
      reps: '10 - 12 reps',
      rest: 90,
      rpe: 'RPE 8',
      formCue: 'Upper back across bench, chin tucked. Drive through heels to full horizontal hip extension, hold 1 second at apex, don’t hyperextend lumbar spine.',
      conditionSafetyNote: 'Zero vertical spinal compression, knee-friendly horizontal vector.',
      allowedEnvironments: ['commercial_gym', 'home_gym'],
      category: 'compound',
      alternatives: [
        { id: 'single_leg_glute_bridge', name: 'Single-Leg Glute Bridge', equipment: 'Bodyweight', reason: 'Exceptional glute firing for posture rehab' }
      ]
    },
    {
      name: 'Standing Calf Raise',
      targetMuscle: 'Gastrocnemius & Soleus',
      secondary: [],
      equipment: 'dumbbell',
      sets: 4,
      reps: '12 - 15 reps',
      rest: 60,
      rpe: 'RPE 8-9',
      formCue: 'Full stretch at bottom for 2 seconds (eliminating tendon bounce), drive up onto big toe ball, squeeze calf at peak for 1 second.',
      allowedEnvironments: ['commercial_gym', 'home_gym', 'bodyweight'],
      category: 'isolation',
      alternatives: [
        { id: 'single_leg_stair_calf', name: 'Single-Leg Staircase Calf Raise', equipment: 'Bodyweight', reason: 'Full ankle dorsiflexion stretch' }
      ]
    }
  ],

  core_and_mobility: [
    {
      name: 'Pallof Press (Anti-Rotation)',
      targetMuscle: 'Transverse Abdominis & Obliques',
      secondary: ['Glutes'],
      equipment: 'cable',
      sets: 3,
      reps: '10 reps / side (hold 3s)',
      rest: 60,
      rpe: 'RPE 7-8',
      formCue: 'Athletic stance, hold cable or band at center of sternum. Press straight out without allowing torso to twist 1 millimeter.',
      conditionSafetyNote: 'Gold standard core stabilization for lower back rehabilitation and spinal health.',
      allowedEnvironments: ['commercial_gym', 'home_gym', 'bodyweight'],
      category: 'core',
      alternatives: [
        { id: 'band_pallof', name: 'Resistance Band Pallof Press', equipment: 'Bands', reason: 'Easily attached to any post or door' }
      ]
    },
    {
      name: 'Deadbug / Bird-Dog Dynamic Pair',
      targetMuscle: 'Deep Core & Spinal Stabilizers',
      secondary: ['Hip Flexors'],
      equipment: 'bodyweight',
      sets: 3,
      reps: '8 reps per side (controlled)',
      rest: 45,
      rpe: 'RPE 7',
      formCue: 'Push lower back flat against the floor. Extend opposite arm and leg slowly while keeping rib cage down. Exhale completely on extension.',
      conditionSafetyNote: 'Safest therapeutic core activation for posture and back relief.',
      allowedEnvironments: ['commercial_gym', 'home_gym', 'bodyweight'],
      category: 'core',
      alternatives: [
        { id: 'plank_reach', name: 'Forearm Plank with Arm Reach', equipment: 'Bodyweight', reason: 'High anti-extension challenge' }
      ]
    },
    {
      name: 'Hanging Knee / Leg Raises',
      targetMuscle: 'Lower Rectus Abdominis',
      secondary: ['Hip Flexors', 'Grip'],
      equipment: 'bodyweight',
      sets: 3,
      reps: '10 - 15 reps',
      rest: 60,
      rpe: 'RPE 8',
      formCue: 'Hang from bar without swinging. Curl pelvis upward towards ribcage (posterior pelvic tilt) to engage abs rather than just hip flexors.',
      allowedEnvironments: ['commercial_gym', 'home_gym'],
      category: 'core',
      alternatives: [
        { id: 'reverse_crunch', name: 'Decline Bench / Mat Reverse Crunch', equipment: 'Mat', reason: 'Controlled pelvis curl without grip fatigue' }
      ]
    }
  ]
};

/**
 * Filter exercises matching user's body condition and training environment
 */
function selectExercise(
  categoryKey: 'push' | 'pull' | 'legs' | 'core_and_mobility',
  condition: BodyCondition,
  environment: TrainingEnvironment,
  preferredMuscle?: string
): Exercise {
  const pool = EXERCISE_LIBRARY[categoryKey];
  
  // Find candidates that do NOT have the avoid condition
  const candidates = pool.filter(ex => {
    if (ex.avoidForConditions && ex.avoidForConditions.includes(condition)) {
      return false;
    }
    // Check environment support
    if (environment === 'bodyweight') {
      return ex.equipment === 'bodyweight' || ex.equipment === 'bands';
    } else if (environment === 'home_gym') {
      return ex.equipment === 'dumbbell' || ex.equipment === 'bodyweight' || ex.equipment === 'bands';
    }
    return true; // commercial_gym supports everything
  });

  const selected = candidates.length > 0 
    ? (preferredMuscle ? (candidates.find(c => c.targetMuscle.toLowerCase().includes(preferredMuscle.toLowerCase())) || candidates[0]) : candidates[0])
    : pool[0];

  return {
    id: `${categoryKey}_${selected.name.toLowerCase().replace(/[^a-z0-9]/g, '_')}`,
    name: selected.name,
    targetMuscle: selected.targetMuscle,
    secondaryMuscles: selected.secondary,
    equipment: selected.equipment,
    sets: selected.sets,
    reps: selected.reps,
    restSeconds: selected.rest,
    rpe: selected.rpe,
    formCue: selected.formCue,
    conditionNote: selected.conditionSafetyNote,
    category: selected.category,
    alternatives: selected.alternatives
  };
}

/**
 * Generate full tailored Workout Plan
 */
export function generateWorkoutPlan(assessment: UserAssessment): WorkoutPlan {
  const metrics = calculateNutrition(assessment);
  const condition = assessment.bodyCondition;
  const env = assessment.trainingEnvironment;
  const daysCount = assessment.daysPerWeek;

  let splitName = 'High-Performance 4-Day Split';
  let title = 'Hypertrophy & Athletic Strength Blueprint';
  let subtitle = 'Customized for your biomechanics, metabolic rate, and conditioning level';

  if (assessment.goal === 'weight_loss') {
    title = 'Metabolic Lean & Shred Protocol';
    subtitle = 'Optimized for high caloric expenditure, lean muscle retention, and joint longevity';
  } else if (assessment.goal === 'weight_gain') {
    title = 'Hypertrophy Mass & Power Builder';
    subtitle = 'Progressive volume architecture designed for maximum muscular growth and strength';
  } else if (assessment.goal === 'remain_fit') {
    title = 'Longevity & Functional Athletic Engine';
    subtitle = 'Cardiovascular stamina, core stability, and bulletproof joint mobility';
  }

  // Generate Warmup Routines adapted to condition
  const baseWarmup = [
    { name: 'Cat-Cow Spinal Articulation', duration: '60 sec', cue: 'Sync breath with movement, mobilize thoracic spine' },
    { name: 'World\'s Greatest Stretch', duration: '90 sec', cue: 'Open hips, thoracic rotation, active hamstring stretch' },
    { name: 'Band Pull-Aparts / Scapular Wall Slides', duration: '60 sec', cue: 'Activate lower traps and rotator cuff without shrugging' }
  ];

  if (condition === 'knee_friendly') {
    baseWarmup[1] = { name: 'Knee-Friendly Glute Bridge & Hip Opener', duration: '90 sec', cue: 'Activate glute medius and hip flexors without patellar torque' };
  } else if (condition === 'lower_back_care') {
    baseWarmup[0] = { name: 'Bird-Dog & Pelvic Tilts', duration: '90 sec', cue: 'Lock lumbar spine in neutral, contract glutes' };
  }

  const baseCooldown = [
    { name: '90/90 Hip Flow', duration: '2 min', cue: 'Internal and external hip rotation breathing rhythm' },
    { name: 'Child\'s Pose with Lat Reach', duration: '90 sec', cue: 'Deep diaphragmatic breathing to switch to parasympathetic mode' },
    { name: 'Couch Stretch / Hip Flexor Release', duration: '2 min', cue: 'Relieve quad and hip flexor tension' }
  ];

  const days: WorkoutDay[] = [];

  if (daysCount === 3) {
    splitName = '3-Day Full Body Athletic Foundation';
    
    // Day 1: Full Body Power & Press
    days.push({
      dayNumber: 1,
      title: 'Day 1: Full Body Power & Horizontal Press',
      focus: 'Chest, Quads, Upper Back & Anti-Rotation Core',
      estimatedMinutes: assessment.sessionDurationMin || 55,
      warmup: baseWarmup,
      exercises: [
        selectExercise('push', condition, env, 'Chest'),
        selectExercise('legs', condition, env, 'Quadriceps'),
        selectExercise('pull', condition, env, 'Mid-Back'),
        selectExercise('push', condition, env, 'Lateral Deltoids'),
        selectExercise('core_and_mobility', condition, env)
      ],
      cooldown: baseCooldown
    });

    // Day 2: Full Body Posterior Chain & Pull
    days.push({
      dayNumber: 2,
      title: 'Day 2: Full Body Posterior Chain & Vertical Pull',
      focus: 'Hamstrings, Lats, Shoulders & Posterior Core',
      estimatedMinutes: assessment.sessionDurationMin || 55,
      warmup: baseWarmup,
      exercises: [
        selectExercise('legs', condition, env, 'Hamstrings'),
        selectExercise('pull', condition, env, 'Latissimus'),
        selectExercise('push', condition, env, 'Upper Chest'),
        selectExercise('pull', condition, env, 'Rear Deltoids'),
        selectExercise('core_and_mobility', condition, env)
      ],
      cooldown: baseCooldown
    });

    // Day 3: Full Body Hypertrophy & Unilateral Balance
    days.push({
      dayNumber: 3,
      title: 'Day 3: Full Body Hypertrophy & Unilateral Stability',
      focus: 'Glutes, Arms, Upper Back & Metabolic Core',
      estimatedMinutes: assessment.sessionDurationMin || 55,
      warmup: baseWarmup,
      exercises: [
        selectExercise('legs', condition, env, 'Gluteus'),
        selectExercise('pull', condition, env, 'Upper Back'),
        selectExercise('push', condition, env, 'Triceps'),
        selectExercise('pull', condition, env, 'Biceps'),
        selectExercise('legs', condition, env, 'Calves')
      ],
      cooldown: baseCooldown
    });

  } else if (daysCount === 4) {
    splitName = '4-Day Upper / Lower Athletic Split';

    // Day 1: Upper Body Power
    days.push({
      dayNumber: 1,
      title: 'Day 1: Upper Body Power & Strength',
      focus: 'Chest, Upper Back, Shoulders & Arms',
      estimatedMinutes: assessment.sessionDurationMin || 60,
      warmup: baseWarmup,
      exercises: [
        selectExercise('push', condition, env, 'Chest'),
        selectExercise('pull', condition, env, 'Mid-Back'),
        selectExercise('push', condition, env, 'Lateral Deltoids'),
        selectExercise('pull', condition, env, 'Rear Deltoids'),
        selectExercise('push', condition, env, 'Triceps')
      ],
      cooldown: baseCooldown
    });

    // Day 2: Lower Body & Posterior Chain
    days.push({
      dayNumber: 2,
      title: 'Day 2: Lower Body Strength & Stability',
      focus: 'Quads, Hamstrings, Glutes & Deep Core',
      estimatedMinutes: assessment.sessionDurationMin || 60,
      warmup: baseWarmup,
      exercises: [
        selectExercise('legs', condition, env, 'Quadriceps'),
        selectExercise('legs', condition, env, 'Hamstrings'),
        selectExercise('legs', condition, env, 'Gluteus'),
        selectExercise('legs', condition, env, 'Calves'),
        selectExercise('core_and_mobility', condition, env)
      ],
      cooldown: baseCooldown
    });

    // Day 3: Upper Body Hypertrophy & Density
    days.push({
      dayNumber: 3,
      title: 'Day 3: Upper Body Hypertrophy & Volume',
      focus: 'Lats, Upper Chest, Deltoid Cap & Biceps',
      estimatedMinutes: assessment.sessionDurationMin || 60,
      warmup: baseWarmup,
      exercises: [
        selectExercise('pull', condition, env, 'Latissimus'),
        selectExercise('push', condition, env, 'Upper Chest'),
        selectExercise('pull', condition, env, 'Mid-Back'),
        selectExercise('push', condition, env, 'Lateral Deltoids'),
        selectExercise('pull', condition, env, 'Biceps')
      ],
      cooldown: baseCooldown
    });

    // Day 4: Lower Body Hypertrophy & Core Armor
    days.push({
      dayNumber: 4,
      title: 'Day 4: Lower Body Volume & Core Armor',
      focus: 'Posterior Chain, Unilateral Legs & Obliques',
      estimatedMinutes: assessment.sessionDurationMin || 60,
      warmup: baseWarmup,
      exercises: [
        selectExercise('legs', condition, env, 'Gluteus'),
        selectExercise('legs', condition, env, 'Hamstrings'),
        selectExercise('legs', condition, env, 'Quadriceps'),
        selectExercise('core_and_mobility', condition, env),
        selectExercise('legs', condition, env, 'Calves')
      ],
      cooldown: baseCooldown
    });

  } else if (daysCount === 5) {
    splitName = '5-Day Push / Pull / Legs / Upper / Lower Periodization';

    days.push({
      dayNumber: 1,
      title: 'Day 1: Push Intensity (Chest & Shoulders)',
      focus: 'Horizontal Pressing, Deltoid Caps & Triceps',
      estimatedMinutes: assessment.sessionDurationMin || 60,
      warmup: baseWarmup,
      exercises: [
        selectExercise('push', condition, env, 'Chest'),
        selectExercise('push', condition, env, 'Upper Chest'),
        selectExercise('push', condition, env, 'Lateral Deltoids'),
        selectExercise('push', condition, env, 'Triceps')
      ],
      cooldown: baseCooldown
    });

    days.push({
      dayNumber: 2,
      title: 'Day 2: Pull Intensity (Back & Biceps)',
      focus: 'Lat Width, Mid-Back Thickness & Arm Density',
      estimatedMinutes: assessment.sessionDurationMin || 60,
      warmup: baseWarmup,
      exercises: [
        selectExercise('pull', condition, env, 'Latissimus'),
        selectExercise('pull', condition, env, 'Mid-Back'),
        selectExercise('pull', condition, env, 'Rear Deltoids'),
        selectExercise('pull', condition, env, 'Biceps')
      ],
      cooldown: baseCooldown
    });

    days.push({
      dayNumber: 3,
      title: 'Day 3: Lower Body Power (Quads & Glutes)',
      focus: 'Quad Overload, Hamstring Hinge & Calves',
      estimatedMinutes: assessment.sessionDurationMin || 60,
      warmup: baseWarmup,
      exercises: [
        selectExercise('legs', condition, env, 'Quadriceps'),
        selectExercise('legs', condition, env, 'Hamstrings'),
        selectExercise('legs', condition, env, 'Gluteus'),
        selectExercise('legs', condition, env, 'Calves')
      ],
      cooldown: baseCooldown
    });

    days.push({
      dayNumber: 4,
      title: 'Day 4: Upper Body Sculpt & Hypertrophy',
      focus: 'Chest Flyes, Rows, Lateral Raises & Arm Finisher',
      estimatedMinutes: assessment.sessionDurationMin || 55,
      warmup: baseWarmup,
      exercises: [
        selectExercise('push', condition, env, 'Upper Chest'),
        selectExercise('pull', condition, env, 'Upper Back'),
        selectExercise('push', condition, env, 'Lateral Deltoids'),
        selectExercise('pull', condition, env, 'Biceps'),
        selectExercise('push', condition, env, 'Triceps')
      ],
      cooldown: baseCooldown
    });

    days.push({
      dayNumber: 5,
      title: 'Day 5: Functional Conditioning & Core Armor',
      focus: 'Posterior Chain, Anti-Rotation & Metabolic Stamina',
      estimatedMinutes: assessment.sessionDurationMin || 50,
      warmup: baseWarmup,
      exercises: [
        selectExercise('legs', condition, env, 'Hamstrings'),
        selectExercise('core_and_mobility', condition, env),
        selectExercise('legs', condition, env, 'Gluteus'),
        selectExercise('pull', condition, env, 'Rear Deltoids')
      ],
      cooldown: baseCooldown
    });

  } else {
    // 6 Days: PPL x 2
    splitName = '6-Day Push / Pull / Legs High-Performance Split';

    const pplTitles = [
      'Day 1: Push A (Chest & Triceps Focus)',
      'Day 2: Pull A (Lat Width & Upper Back)',
      'Day 3: Legs A (Quad Overload & Calves)',
      'Day 4: Push B (Deltoid Cap & Incline Press)',
      'Day 5: Pull B (Back Thickness & Biceps)',
      'Day 6: Legs B (Posterior Chain & Core Stability)'
    ];

    pplTitles.forEach((t, idx) => {
      let exList: Exercise[] = [];
      if (idx % 3 === 0) {
        exList = [
          selectExercise('push', condition, env, 'Chest'),
          selectExercise('push', condition, env, 'Upper Chest'),
          selectExercise('push', condition, env, 'Lateral Deltoids'),
          selectExercise('push', condition, env, 'Triceps')
        ];
      } else if (idx % 3 === 1) {
        exList = [
          selectExercise('pull', condition, env, 'Latissimus'),
          selectExercise('pull', condition, env, 'Mid-Back'),
          selectExercise('pull', condition, env, 'Rear Deltoids'),
          selectExercise('pull', condition, env, 'Biceps')
        ];
      } else {
        exList = [
          selectExercise('legs', condition, env, 'Quadriceps'),
          selectExercise('legs', condition, env, 'Hamstrings'),
          selectExercise('legs', condition, env, 'Gluteus'),
          selectExercise('legs', condition, env, 'Calves'),
          selectExercise('core_and_mobility', condition, env)
        ];
      }

      days.push({
        dayNumber: idx + 1,
        title: t,
        focus: 'High density stimulus with active recovery on Day 7',
        estimatedMinutes: assessment.sessionDurationMin || 55,
        warmup: baseWarmup,
        exercises: exList,
        cooldown: baseCooldown
      });
    });
  }

  // Nutrition Advice tailored to goals
  const nutritionTips = [
    `Daily Calorie Target: ${metrics.macros.calories} kcal (${assessment.goal === 'weight_loss' ? '450 kcal deficit' : assessment.goal === 'weight_gain' ? '420 kcal surplus' : 'Balanced maintenance'})`,
    `Protein Target: ${metrics.macros.proteinGrams}g/day (~${(metrics.macros.proteinGrams / assessment.weight).toFixed(1)}g per kg body weight) to support muscle recovery.`,
    `Hydration: Minimum ${metrics.macros.waterLiters} Liters of water daily, drinking 500ml upon waking and 750ml during workout.`
  ];

  if (assessment.goal === 'weight_gain') {
    nutritionTips.push('Focus on calorie-dense whole foods: oats, natural nut butters, olive oil, eggs, salmon, and Greek yogurt.');
    nutritionTips.push('Add an intra-workout or post-workout carb+protein shake to hit your surplus comfortably.');
  } else if (assessment.goal === 'weight_loss') {
    nutritionTips.push('Anchor every meal with at least 35-45g of lean protein to maximize satiety and thermogenesis.');
    nutritionTips.push('Prioritize high-volume fibrous vegetables (broccoli, spinach, asparagus) to feel full while maintaining deficit.');
  }

  const mealTiming = [
    { time: '07:30 - 08:30 AM', title: 'Breakfast / Anabolic Ignition', recommendation: 'High protein + complex low-GI carbs (e.g., eggs, oatmeal with berries & whey).' },
    { time: '12:30 - 01:30 PM', title: 'Lunch / Sustained Energy Fuel', recommendation: 'Lean poultry or fish, sweet potato or brown rice, large dark leafy salad with olive oil.' },
    { time: '60-90 min Pre-Workout', title: 'Performance Priming', recommendation: 'Easily digestible carbs + light protein (e.g., banana + rice cake with light peanut butter).' },
    { time: 'Within 90 min Post-Workout', title: 'Muscle Protein Synthesis Window', recommendation: 'Rapid recovery protein (chicken, whey, tofu) + jasmine rice or fruit to replenish glycogen.' },
    { time: '08:00 - 09:00 PM', title: 'Dinner / Recovery Meal', recommendation: 'Salmon or lean steak/paneer with roasted cruciferous vegetables and avocado.' }
  ];

  const recoveryRules = [
    'Aim for 7.5 to 8.5 hours of uninterrupted sleep; 95% of human growth hormone is released during stage 3 deep sleep.',
    'Take a 10-15 minute post-meal walk twice a day to improve insulin sensitivity and lower blood glucose spikes.',
    'Keep rest times between heavy compound sets strict (75-120 seconds); use the built-in timer to stay focused.',
    condition !== 'healthy' ? `Condition Care Note: Your plan is specially customized for ${condition.replace('_', ' ')}. Never push through sharp joint pain; fatigue is good, pain is a signal.` : 'Maintain strict progressive overload: record weights and try to add 1 rep or 1-2kg every 1-2 weeks.'
  ];

  return {
    id: `fithub_plan_${Date.now()}`,
    title,
    subtitle,
    splitName,
    summary: `Tailored for a ${assessment.age}-year-old ${assessment.gender} weighing ${assessment.weight}kg (${assessment.height}cm), targeting ${assessment.goal.replace('_', ' ')} with ${condition.replace('_', ' ')} adaptation over ${daysCount} training days per week.`,
    frequency: `${daysCount} Days / Week`,
    userAssessment: assessment,
    metrics,
    days,
    nutritionTips,
    mealTiming,
    recoveryRules,
    coachAdvice: `Welcome to FitHub. As Head Coach Yash Badgujar, my core training rule is simple: Consistency beats intensity, and intelligent biomechanics beats reckless lifting. Stick to this structured routine for 8-12 weeks, log your numbers, respect your rest intervals, and let the plan do the work.`
  };
}
