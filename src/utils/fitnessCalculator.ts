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
 * Evaluate BMI health status as Good, Moderate, Bad, or Worst according to user's condition
 */
export function evaluateBmiHealth(
  bmi: number,
  condition: BodyCondition,
  goal: FitnessGoal
): { rating: 'good' | 'moderate' | 'bad' | 'worst'; label: string; verdict: string } {
  if (bmi >= 18.5 && bmi <= 24.9) {
    let verdict = 'Optimal healthy weight. Excellent biological baseline for athletic recovery and joint longevity.';
    if (condition === 'knee_friendly') {
      verdict = 'GOOD: Your body weight places minimal excess load on knee cartilage, allowing safe joint rehabilitation without high patellar shear.';
    } else if (condition === 'lower_back_care') {
      verdict = 'GOOD: Low abdominal mass reduces anterior gravitational pull on the lumbar spine and anterior pelvic tilt.';
    } else if (condition === 'sedentary_posture') {
      verdict = 'GOOD: Favorable weight baseline to focus on fixing glute amnesia, thoracic mobility, and desk posture.';
    }
    return {
      rating: 'good',
      label: 'GOOD (Optimal & Healthy)',
      verdict
    };
  } else if (bmi < 18.5) {
    if (bmi < 16.5) {
      return {
        rating: 'worst',
        label: 'WORST (Severely Underweight)',
        verdict: 'WORST: Severely low body mass. High vulnerability to muscle wasting, joint fragility, and hormonal dysregulation. Immediate clean calorie surplus is critical.'
      };
    }
    return {
      rating: 'bad',
      label: 'BAD (Underweight / Low Lean Mass)',
      verdict: 'BAD: Below healthy mass baseline. Lack of protective muscle padding leaves joints exposed to fatigue. Focus on clean mass building.'
    };
  } else if (bmi >= 25 && bmi < 30) {
    if (goal === 'muscle_building' || goal === 'weight_gain') {
      return {
        rating: 'moderate',
        label: 'MODERATE (Muscular Overload / Bulk Phase)',
        verdict: 'MODERATE: Slightly elevated BMI, common among muscular lifters with dense bone and contractile tissue. Maintain cardiovascular health.'
      };
    }
    if (condition === 'knee_friendly') {
      return {
        rating: 'bad',
        label: 'BAD for Knee Joints (Overweight)',
        verdict: 'BAD: Every additional 1kg of body mass exerts 4kg of extra compressive mechanical force on the patella during walking. Controlled fat loss will drastically relieve knee pain.'
      };
    } else if (condition === 'lower_back_care') {
      return {
        rating: 'bad',
        label: 'BAD for Spine (Excess Lumbar Pressure)',
        verdict: 'BAD: Extra visceral weight increases anterior pelvic tilt, compressing lumbar discs L4-L5. Prioritize fat loss to permanently relieve back ache.'
      };
    }
    return {
      rating: 'moderate',
      label: 'MODERATE (Overweight)',
      verdict: 'MODERATE: Mildly elevated body mass. Increasing weekly training volume and following your prescribed deficit will lower joint strain.'
    };
  } else {
    // bmi >= 30
    if (bmi >= 35) {
      return {
        rating: 'worst',
        label: 'WORST (High Joint & Cardiovascular Risk)',
        verdict: 'WORST: Severe systemic strain on cardiovascular health, knee cartilage, and spinal discs. Immediate structured caloric deficit with joint-safe walking required.'
      };
    }
    return {
      rating: 'bad',
      label: 'BAD (Obesity Range)',
      verdict: 'BAD: Excessive mechanical loading on hips, knees, and lumbar spine. Joint-friendly training without jumping or axial compression is mandatory.'
    };
  }
}

/**
 * Calculate TDEE and tailored target calories & macros based on goal & stats
 */
export function calculateNutrition(assessment: UserAssessment): BodyMetrics {
  const { bmi, category } = calculateBMI(assessment.weight, assessment.height);
  const bmr = calculateBMR(assessment.weight, assessment.height, assessment.age, assessment.gender);
  const bmiEval = evaluateBmiHealth(bmi, assessment.bodyCondition, assessment.goal);

  let activityFactor = 1.2;
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
      targetCalories = tdee + 420;
      proteinPerKg = 2.1;
      fatPercent = 0.25;
      break;
    case 'weight_loss':
      targetCalories = Math.max(1200, tdee - 450);
      proteinPerKg = 2.3;
      fatPercent = 0.27;
      break;
    case 'muscle_building':
      targetCalories = tdee + 220;
      proteinPerKg = 2.2;
      fatPercent = 0.25;
      break;
    case 'remain_fit':
      targetCalories = tdee;
      proteinPerKg = 1.8;
      fatPercent = 0.26;
      break;
  }

  const proteinGrams = Math.round(assessment.weight * proteinPerKg);
  const fatGrams = Math.round((targetCalories * fatPercent) / 9);
  const remainingCalories = Math.max(0, targetCalories - (proteinGrams * 4 + fatGrams * 9));
  const carbsGrams = Math.round(remainingCalories / 4);
  const fiberGrams = Math.round((targetCalories / 1000) * 14);
  const waterLiters = parseFloat((assessment.weight * 0.038 + (assessment.daysPerWeek > 4 ? 0.5 : 0.2)).toFixed(1));

  return {
    bmi,
    bmiCategory: category,
    bmiRating: bmiEval.rating,
    bmiRatingLabel: bmiEval.label,
    bmiConditionVerdict: bmiEval.verdict,
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
 * Exercise Definition Template
 */
interface MasterExercise {
  id: string;
  name: string;
  targetMuscle: string;
  secondary: string[];
  equipment: 'barbell' | 'dumbbell' | 'cable' | 'machine' | 'bodyweight' | 'bands';
  baseCategory: 'push' | 'pull' | 'legs' | 'core_and_mobility' | 'metabolic';
  exerciseCategory: 'compound' | 'isolation' | 'core' | 'mobility' | 'cardio';
  allowedEnvironments: TrainingEnvironment[];
  avoidConditions?: BodyCondition[];
  recommendedConditions?: BodyCondition[];
  formCue: string;
  safetyNotes: Record<BodyCondition, string>;
  alternatives: { id: string; name: string; equipment: string; reason: string }[];
}

/**
 * Comprehensive Master Exercise Library
 */
const MASTER_LIBRARY: MasterExercise[] = [
  // --- CHEST & PUSH ---
  {
    id: 'incline_db_press',
    name: 'Incline Dumbbell Bench Press',
    targetMuscle: 'Upper Chest',
    secondary: ['Front Delts', 'Triceps'],
    equipment: 'dumbbell',
    baseCategory: 'push',
    exerciseCategory: 'compound',
    allowedEnvironments: ['commercial_gym', 'home_gym'],
    recommendedConditions: ['shoulder_safe', 'healthy', 'lower_back_care'],
    formCue: 'Set bench to 30 degrees. Retract shoulder blades, keep elbows tucked at 45 degrees, lower smoothly to collarbone level and drive upward.',
    safetyNotes: {
      healthy: 'Optimal upper-chest clavicular head recruitment with free rotational freedom.',
      knee_friendly: 'Safe non-weight-bearing compound press.',
      lower_back_care: 'Back firmly supported against angled bench; zero axial spinal compression.',
      shoulder_safe: 'Rotator Cuff Safe: 30-degree incline and 45-degree elbow path opens the subacromial space.',
      sedentary_posture: 'Expands tight rib cage and stretches anterior pectorals.'
    },
    alternatives: [
      { id: 'floor_db_press', name: 'Dumbbell Floor Press', equipment: 'Dumbbells', reason: 'Zero shoulder hyperextension' },
      { id: 'incline_pushup', name: 'Decline Push-Ups', equipment: 'Bodyweight', reason: 'Upper chest calisthenics' }
    ]
  },
  {
    id: 'neutral_db_press',
    name: 'Neutral-Grip Dumbbell Flat Press',
    targetMuscle: 'Mid Chest & Deltoids',
    secondary: ['Triceps'],
    equipment: 'dumbbell',
    baseCategory: 'push',
    exerciseCategory: 'compound',
    allowedEnvironments: ['commercial_gym', 'home_gym'],
    recommendedConditions: ['shoulder_safe', 'lower_back_care'],
    formCue: 'Palms face directly inward toward each other throughout the repetition. Drive up smoothly without clanking weights.',
    safetyNotes: {
      healthy: 'Deep triceps and pec sternal head squeeze with minimal elbow strain.',
      knee_friendly: 'Zero knee impact.',
      lower_back_care: 'Flat bench support maintains neutral lordotic curvature.',
      shoulder_safe: 'Neutral grip completely eliminates internal shoulder rotation and impingement.',
      sedentary_posture: 'Stabilizes scapular retraction on bench pad.'
    },
    alternatives: [
      { id: 'landmine_press', name: 'Standing Landmine Press', equipment: 'Barbell', reason: 'Gentle arc trajectory' }
    ]
  },
  {
    id: 'barbell_bench_press',
    name: 'Barbell Flat Bench Press',
    targetMuscle: 'Pectoralis Major',
    secondary: ['Anterior Deltoids', 'Triceps'],
    equipment: 'barbell',
    baseCategory: 'push',
    exerciseCategory: 'compound',
    allowedEnvironments: ['commercial_gym'],
    avoidConditions: ['shoulder_safe'],
    recommendedConditions: ['healthy'],
    formCue: 'Bar over wrists, plant feet firmly, pull shoulder blades down and back, touch mid-sternum and drive explosively.',
    safetyNotes: {
      healthy: 'Gold standard compound movement for maximal upper-body pressing power and chest mass.',
      knee_friendly: 'Unrestricted pressing.',
      lower_back_care: 'Maintain gentle natural arch with feet planted; avoid violent bridging.',
      shoulder_safe: 'Not recommended for shoulder impingement; substituted with neutral dumbbells.',
      sedentary_posture: 'Ensure thoracic spine is arched and scaps retracted.'
    },
    alternatives: [
      { id: 'neutral_db_press', name: 'Neutral-Grip DB Press', equipment: 'Dumbbells', reason: 'Joint-friendly rotator cuff clearance' }
    ]
  },
  {
    id: 'calisthenic_pushup',
    name: 'Deficit / Tempo Push-Ups',
    targetMuscle: 'Chest & Serratus Anterior',
    secondary: ['Triceps', 'Core'],
    equipment: 'bodyweight',
    baseCategory: 'push',
    exerciseCategory: 'compound',
    allowedEnvironments: ['commercial_gym', 'home_gym', 'bodyweight'],
    formCue: 'Rigid body plank from head to heels. Lower chest to 1 inch from floor, push the floor away and actively protract scapulae at peak.',
    safetyNotes: {
      healthy: 'Free-floating scapular movement builds healthy shoulders and serratus anterior control.',
      knee_friendly: 'Zero knee torque.',
      lower_back_care: 'Strong core engagement protects lumbar spine from sagging.',
      shoulder_safe: 'Allows natural scapular protraction and upward rotation.',
      sedentary_posture: 'Reactivates core stabilizers and strengthens scapular stabilizers.'
    },
    alternatives: [
      { id: 'kneeling_pushup', name: 'Incline Hands-Elevated Push-Ups', equipment: 'Bench/Wall', reason: 'Reduced bodyweight load' }
    ]
  },
  {
    id: 'db_lateral_raise',
    name: 'Scapular-Plane DB Lateral Raise',
    targetMuscle: 'Lateral Deltoids',
    secondary: ['Traps'],
    equipment: 'dumbbell',
    baseCategory: 'push',
    exerciseCategory: 'isolation',
    allowedEnvironments: ['commercial_gym', 'home_gym'],
    formCue: 'Slight 15-degree forward torso lean. Raise dumbbells 30 degrees in front of torso (scapular plane), leading with elbows.',
    safetyNotes: {
      healthy: 'Builds wide 3D shoulder caps.',
      knee_friendly: 'Non-impact.',
      lower_back_care: 'Perform seated if lumbar fatigue is present.',
      shoulder_safe: 'Raising in scapular plane prevents subacromial tendon pinching.',
      sedentary_posture: 'Keeps shoulders pinned back.'
    },
    alternatives: [
      { id: 'band_lateral_raise', name: 'Resistance Band Lateral Raise', equipment: 'Bands', reason: 'Smooth continuous tension' }
    ]
  },
  {
    id: 'triceps_overhead_ext',
    name: 'Overhead DB / Band Triceps Extension',
    targetMuscle: 'Triceps (Long Head)',
    secondary: [],
    equipment: 'dumbbell',
    baseCategory: 'push',
    exerciseCategory: 'isolation',
    allowedEnvironments: ['commercial_gym', 'home_gym', 'bodyweight'],
    formCue: 'Elbows tucked beside ears. Lower dumbbell behind head for a deep stretch on the long head, extend without flaring elbows.',
    safetyNotes: {
      healthy: 'Maximal long-head stretch for complete arm thickness.',
      knee_friendly: 'Zero impact.',
      lower_back_care: 'Perform seated with back supported to avoid arching.',
      shoulder_safe: 'Keep elbows tucked to protect rotator cuff.',
      sedentary_posture: 'Promotes thoracic spine extension.'
    },
    alternatives: [
      { id: 'diamond_pushup', name: 'Diamond / Close-Grip Push-Ups', equipment: 'Bodyweight', reason: 'Calisthenics arm builder' }
    ]
  },

  // --- BACK & PULL ---
  {
    id: 'chest_supported_db_row',
    name: 'Chest-Supported Incline DB Row',
    targetMuscle: 'Mid-Back & Rhomboids',
    secondary: ['Lats', 'Biceps', 'Rear Delts'],
    equipment: 'dumbbell',
    baseCategory: 'pull',
    exerciseCategory: 'compound',
    allowedEnvironments: ['commercial_gym', 'home_gym'],
    recommendedConditions: ['lower_back_care', 'sedentary_posture', 'healthy'],
    formCue: 'Lie chest-down on 30-degree bench. Pull dumbbells towards hips, squeeze shoulder blades together for a full 1-second peak pause.',
    safetyNotes: {
      healthy: 'Strict isolation of upper and mid-back without swinging momentum.',
      knee_friendly: 'Zero leg loading.',
      lower_back_care: 'Spinal Decompression: The bench supports your entire torso, completely eliminating spinal compression.',
      shoulder_safe: 'Neutral hand grip protects rotator cuff.',
      sedentary_posture: 'Gold standard exercise to reverse rounded shoulders and desk hunch.'
    },
    alternatives: [
      { id: 'cable_seated_row', name: 'Seated Neutral Cable Row', equipment: 'Cable', reason: 'Continuous tension' }
    ]
  },
  {
    id: 'lat_pulldown_neutral',
    name: 'Neutral-Grip Lat Pulldown / Assisted Pull-Up',
    targetMuscle: 'Latissimus Dorsi',
    secondary: ['Biceps', 'Brachialis'],
    equipment: 'cable',
    baseCategory: 'pull',
    exerciseCategory: 'compound',
    allowedEnvironments: ['commercial_gym'],
    recommendedConditions: ['lower_back_care', 'shoulder_safe'],
    formCue: 'Slight 10-degree lean back. Depress shoulder blades down, pull elbows into your back pockets, control 3-second ascent.',
    safetyNotes: {
      healthy: 'Builds wide V-taper lats.',
      knee_friendly: 'Seated with zero knee loading.',
      lower_back_care: 'Decompresses the spine vertically while strengthening lats.',
      shoulder_safe: 'Neutral or shoulder-width grip eliminates impingement.',
      sedentary_posture: 'Strengthens lower and middle trap stabilizers.'
    },
    alternatives: [
      { id: 'band_lat_pulldown', name: 'Banded Lat Pulldown', equipment: 'Bands', reason: 'Home gym friendly' }
    ]
  },
  {
    id: 'barbell_deadlift',
    name: 'Conventional Barbell Deadlift',
    targetMuscle: 'Posterior Chain (Hamstrings, Glutes, Erectors)',
    secondary: ['Upper Back', 'Grip', 'Core'],
    equipment: 'barbell',
    baseCategory: 'pull',
    exerciseCategory: 'compound',
    allowedEnvironments: ['commercial_gym'],
    avoidConditions: ['lower_back_care', 'knee_friendly'],
    recommendedConditions: ['healthy'],
    formCue: 'Bar over midfoot, lock lats tight, wedge hips down, push floor away through heels without rounding lower back.',
    safetyNotes: {
      healthy: 'Unmatched king of posterior chain strength, dense spinal erectors, and full-body athletic power.',
      knee_friendly: 'Avoided for knee sensitivity; substituted with Romanian Deadlifts.',
      lower_back_care: 'Avoided to prevent heavy spinal shear force; substituted with chest-supported rows and RDLs.',
      shoulder_safe: 'Keep arms long like ropes.',
      sedentary_posture: 'Builds iron posterior chain.'
    },
    alternatives: [
      { id: 'trap_bar_dl', name: 'Trap Bar Deadlift (High Handles)', equipment: 'Trap Bar', reason: 'Upright torso relieves lumbar stress' }
    ]
  },
  {
    id: 'inverted_bodyweight_row',
    name: 'Inverted Bodyweight Row / Doorframe Row',
    targetMuscle: 'Upper Back & Posterior Delts',
    secondary: ['Biceps', 'Core'],
    equipment: 'bodyweight',
    baseCategory: 'pull',
    exerciseCategory: 'compound',
    allowedEnvironments: ['commercial_gym', 'home_gym', 'bodyweight'],
    recommendedConditions: ['lower_back_care', 'sedentary_posture', 'healthy'],
    formCue: 'Hold bar or doorframe anchor, keep body rigid like a plank. Pull sternum towards bar, squeeze shoulder blades firmly.',
    safetyNotes: {
      healthy: 'Exceptional relative horizontal pulling strength.',
      knee_friendly: 'Zero knee torque.',
      lower_back_care: 'Core remains horizontal; zero compressive axial load on lumbar discs.',
      shoulder_safe: 'Natural scapular retraction.',
      sedentary_posture: 'Directly counters desk slouching.'
    },
    alternatives: [
      { id: 'towel_door_row', name: 'Towel Door Rows', equipment: 'Bodyweight', reason: 'Zero equipment anywhere' }
    ]
  },
  {
    id: 'face_pull_rotator',
    name: 'Cable / Band Face Pull with External Rotation',
    targetMuscle: 'Rear Delts & Rotator Cuff (Infraspinatus)',
    secondary: ['Lower Traps', 'Rhomboids'],
    equipment: 'cable',
    baseCategory: 'pull',
    exerciseCategory: 'isolation',
    allowedEnvironments: ['commercial_gym', 'home_gym', 'bodyweight'],
    recommendedConditions: ['shoulder_safe', 'sedentary_posture', 'lower_back_care'],
    formCue: 'Set cable at face height. Pull towards bridge of nose while rotating thumbs backwards. Hold peak contraction for 2 full seconds.',
    safetyNotes: {
      healthy: 'Essential shoulder health insurance for all heavy benchers.',
      knee_friendly: 'Non-impact.',
      lower_back_care: 'Keep ribcage down and glutes braced.',
      shoulder_safe: 'Strengthens external rotators, stabilizing the humerus in the glenoid fossa.',
      sedentary_posture: 'Directly reverses internal rotation from keyboard and phone posture.'
    },
    alternatives: [
      { id: 'band_pullapart', name: 'Banded Pull-Apart', equipment: 'Bands', reason: 'Do anytime anywhere' }
    ]
  },
  {
    id: 'incline_biceps_curl',
    name: 'Incline DB / Hammer Biceps Curl',
    targetMuscle: 'Biceps Brachii & Brachialis',
    secondary: ['Forearms'],
    equipment: 'dumbbell',
    baseCategory: 'pull',
    exerciseCategory: 'isolation',
    allowedEnvironments: ['commercial_gym', 'home_gym'],
    formCue: 'Keep elbows strictly fixed at your sides. Curl upward with controlled cadence, squeeze peak biceps, lower over 3 seconds.',
    safetyNotes: {
      healthy: 'Full range biceps stretch and peak contraction.',
      knee_friendly: 'Zero impact.',
      lower_back_care: 'Seated against bench prevents cheating with lower back momentum.',
      shoulder_safe: 'Hammer grip spares wrist and bicipital tendon.',
      sedentary_posture: 'Improves arm alignment.'
    },
    alternatives: [
      { id: 'chinup_eccentric', name: 'Underhand Inverted Row / Chin-Up', equipment: 'Bodyweight', reason: 'Calisthenics biceps builder' }
    ]
  },

  // --- LEGS & POSTERIOR CHAIN ---
  {
    id: 'romanian_deadlift',
    name: 'Romanian Deadlift (RDL)',
    targetMuscle: 'Hamstrings & Gluteus Maximus',
    secondary: ['Erector Spinae', 'Adductors'],
    equipment: 'dumbbell',
    baseCategory: 'legs',
    exerciseCategory: 'compound',
    allowedEnvironments: ['commercial_gym', 'home_gym'],
    recommendedConditions: ['knee_friendly', 'healthy', 'sedentary_posture'],
    formCue: 'Slight unlock in knees, push hips backward like shutting a car door with glutes. Stop when hamstrings reach full stretch below knees, drive hips forward.',
    safetyNotes: {
      healthy: 'Premier hamstring hypertrophy movement with massive eccentric overload.',
      knee_friendly: 'Knee Safeguard: Tibia remains strictly vertical; zero forward knee migration and zero patellar tendon shear.',
      lower_back_care: 'Keep dumbbells tight against thighs; stop before spine flexes.',
      shoulder_safe: 'Arms stay straight.',
      sedentary_posture: 'Lengthens tight hamstrings and fires dormant glutes.'
    },
    alternatives: [
      { id: 'single_leg_rdl', name: 'Single-Leg Dumbbell RDL', equipment: 'Dumbbell', reason: 'Unilateral balance with half the load' }
    ]
  },
  {
    id: 'bulgarian_split_squat',
    name: 'Bulgarian Split Squat (Vertical Tibia)',
    targetMuscle: 'Quadriceps & Glutes',
    secondary: ['Adductors', 'Calves'],
    equipment: 'dumbbell',
    baseCategory: 'legs',
    exerciseCategory: 'compound',
    allowedEnvironments: ['commercial_gym', 'home_gym', 'bodyweight'],
    recommendedConditions: ['knee_friendly', 'lower_back_care', 'healthy'],
    formCue: 'Rear foot elevated on bench, torso tilted slightly forward. Descend keeping front knee over midfoot without excessive forward drive, push through front heel.',
    safetyNotes: {
      healthy: 'Brutal leg hypertrophy builder that fixes side-to-side muscle imbalances.',
      knee_friendly: 'Vertical Shin Cue: Positioning front foot slightly further forward keeps shin vertical and transfers load from knee to glute.',
      lower_back_care: 'Requires half the load of a back squat, vastly reducing spinal compression.',
      shoulder_safe: 'Dumbbells hang naturally at sides.',
      sedentary_posture: 'Opens rear hip flexor while strengthening front leg.'
    },
    alternatives: [
      { id: 'reverse_lunge', name: 'Dumbbell Reverse Lunge', equipment: 'Dumbbells', reason: 'Gentle step-back mechanics' }
    ]
  },
  {
    id: 'barbell_back_squat',
    name: 'Barbell Back Squat',
    targetMuscle: 'Quadriceps & Core',
    secondary: ['Glutes', 'Adductors'],
    equipment: 'barbell',
    baseCategory: 'legs',
    exerciseCategory: 'compound',
    allowedEnvironments: ['commercial_gym'],
    avoidConditions: ['knee_friendly', 'lower_back_care'],
    recommendedConditions: ['healthy'],
    formCue: 'Brace core with diaphragmatic breath, sit back and down between knees to parallel, drive up aggressively through entire foot.',
    safetyNotes: {
      healthy: 'Unrivaled foundation for maximal leg mass, explosive jumping power, and systemic strength.',
      knee_friendly: 'Avoided for knee sensitivity; substituted with vertical-shin Bulgarian Split Squats and RDLs.',
      lower_back_care: 'Avoided to prevent heavy spinal axial compression; substituted with Goblet Squats.',
      shoulder_safe: 'Use high bar or safety squat bar if shoulder mobility is restricted.',
      sedentary_posture: 'Ensure adequate hip and ankle mobility.'
    },
    alternatives: [
      { id: 'goblet_squat', name: 'Heavy Dumbbell Goblet Squat', equipment: 'Dumbbell', reason: 'Upright torso relieves lower back' }
    ]
  },
  {
    id: 'goblet_squat',
    name: 'Upright Goblet Squat / Box Squat',
    targetMuscle: 'Quads & Anterior Core',
    secondary: ['Glutes'],
    equipment: 'dumbbell',
    baseCategory: 'legs',
    exerciseCategory: 'compound',
    allowedEnvironments: ['commercial_gym', 'home_gym', 'bodyweight'],
    recommendedConditions: ['lower_back_care', 'sedentary_posture'],
    formCue: 'Hold dumbbell vertically against chest. Squat down with upright torso, spread knees, sit back onto box or to parallel, drive up.',
    safetyNotes: {
      healthy: 'Clean squat mechanics with high quad activation.',
      knee_friendly: 'Box squat eliminates knee bouncing at the bottom.',
      lower_back_care: 'The front weight counterbalances the torso, allowing you to stay completely vertical and avoid lumbar shear.',
      shoulder_safe: 'No shoulder extension required.',
      sedentary_posture: 'Teaches proper hip hinge and squat depth.'
    },
    alternatives: [
      { id: 'bodyweight_squat', name: 'Tempo Air Squats', equipment: 'Bodyweight', reason: 'Zero equipment' }
    ]
  },
  {
    id: 'hip_thrust',
    name: 'Barbell / Dumbbell Hip Thrust',
    targetMuscle: 'Gluteus Maximus',
    secondary: ['Hamstrings'],
    equipment: 'dumbbell',
    baseCategory: 'legs',
    exerciseCategory: 'compound',
    allowedEnvironments: ['commercial_gym', 'home_gym', 'bodyweight'],
    recommendedConditions: ['knee_friendly', 'lower_back_care', 'sedentary_posture', 'healthy'],
    formCue: 'Upper back against bench, chin tucked. Drive through heels to full horizontal hip lockout, squeeze glutes hard for 1 second at top.',
    safetyNotes: {
      healthy: 'Highest EMG glute activation of any exercise for sprinting and athletic glute power.',
      knee_friendly: 'Horizontal force vector completely eliminates knee shear force.',
      lower_back_care: 'Zero vertical spinal compression; keep ribs down to prevent hyperextending lumbar spine.',
      shoulder_safe: 'Non-stressful on upper body.',
      sedentary_posture: 'Reverses "glute amnesia" caused by sitting in a chair all day.'
    },
    alternatives: [
      { id: 'glute_bridge', name: 'Single-Leg Glute Bridge', equipment: 'Bodyweight', reason: 'Exceptional glute firing anywhere' }
    ]
  },
  {
    id: 'standing_calf_raise',
    name: 'Standing Calf Raise (Slow Eccentric)',
    targetMuscle: 'Gastrocnemius & Soleus',
    secondary: ['Achilles Tendon'],
    equipment: 'dumbbell',
    baseCategory: 'legs',
    exerciseCategory: 'isolation',
    allowedEnvironments: ['commercial_gym', 'home_gym', 'bodyweight'],
    formCue: 'Pause at bottom for 2 full seconds to eliminate Achilles elastic bounce. Rise onto balls of big toes, squeeze calf peak for 1 second.',
    safetyNotes: {
      healthy: 'Dense lower leg hypertrophy and ankle stabilization.',
      knee_friendly: 'Straight leg position is safe for patella.',
      lower_back_care: 'Hold dumbbells at sides.',
      shoulder_safe: 'Zero shoulder loading.',
      sedentary_posture: 'Restores ankle dorsiflexion mobility.'
    },
    alternatives: [
      { id: 'stair_calf_raise', name: 'Single-Leg Staircase Calf Raise', equipment: 'Bodyweight', reason: 'Full stretch range' }
    ]
  },

  // --- CORE, MOBILITY & METABOLIC ---
  {
    id: 'pallof_press',
    name: 'Pallof Anti-Rotation Press',
    targetMuscle: 'Transverse Abdominis & Obliques',
    secondary: ['Glutes', 'Quadratus Lumborum'],
    equipment: 'cable',
    baseCategory: 'core_and_mobility',
    exerciseCategory: 'core',
    allowedEnvironments: ['commercial_gym', 'home_gym', 'bodyweight'],
    recommendedConditions: ['lower_back_care', 'sedentary_posture', 'healthy'],
    formCue: 'Athletic stance, hold cable or band at sternum. Press straight out, hold for 3 seconds without letting torso twist a single millimeter.',
    safetyNotes: {
      healthy: 'Essential rotational core armor for transferring athletic power.',
      knee_friendly: 'Static athletic stance.',
      lower_back_care: 'Gold Standard Spine Rehab: Trains core to resist rotation, which is the primary cause of disc herniation.',
      shoulder_safe: 'Held at chest height.',
      sedentary_posture: 'Locks pelvic alignment in neutral.'
    },
    alternatives: [
      { id: 'band_pallof', name: 'Resistance Band Pallof Press', equipment: 'Bands', reason: 'Hook to any door or post' }
    ]
  },
  {
    id: 'deadbug_birddog',
    name: 'Deadbug & Bird-Dog Dynamic Pair',
    targetMuscle: 'Deep Spinal Stabilizers & Multifidus',
    secondary: ['Rectus Abdominis', 'Glutes'],
    equipment: 'bodyweight',
    baseCategory: 'core_and_mobility',
    exerciseCategory: 'core',
    allowedEnvironments: ['commercial_gym', 'home_gym', 'bodyweight'],
    recommendedConditions: ['lower_back_care', 'sedentary_posture'],
    formCue: 'Push lower back flat against floor. Extend opposite arm and leg slowly while exhaling fully. Never let lower back arch off floor.',
    safetyNotes: {
      healthy: 'Develops supreme lumbo-pelvic neuromuscular control.',
      knee_friendly: 'Zero joint compression.',
      lower_back_care: 'McGill Big 3 Foundation: Proven by spine biomechanics researchers to relieve lumbar compression.',
      shoulder_safe: 'Gentle overhead reaching.',
      sedentary_posture: 'Re-establishes cross-body neural pathways and resets posture.'
    },
    alternatives: [
      { id: 'forearm_plank', name: 'Hardstyle Forearm Plank', equipment: 'Bodyweight', reason: 'High anti-extension tension' }
    ]
  },
  {
    id: 'hanging_knee_raise',
    name: 'Hanging Knee Raise / Reverse Crunch',
    targetMuscle: 'Lower Rectus Abdominis',
    secondary: ['Hip Flexors', 'Grip'],
    equipment: 'bodyweight',
    baseCategory: 'core_and_mobility',
    exerciseCategory: 'core',
    allowedEnvironments: ['commercial_gym', 'home_gym', 'bodyweight'],
    formCue: 'Hang from bar or lie on mat. Curl pelvis upward towards ribcage (posterior pelvic tilt) to contract abs rather than just hip flexors.',
    safetyNotes: {
      healthy: 'Chiseled lower abdominal definition.',
      knee_friendly: 'Non-impact.',
      lower_back_care: 'Decompresses the lumbar spine while hanging.',
      shoulder_safe: 'Use mat reverse crunches if hanging strains shoulders.',
      sedentary_posture: 'Counters anterior pelvic tilt.'
    },
    alternatives: [
      { id: 'reverse_crunch', name: 'Mat Reverse Crunch', equipment: 'Bodyweight', reason: 'No hanging required' }
    ]
  },
  {
    id: 'kettlebell_swing',
    name: 'Kettlebell / DB Hip Hinge Swing',
    targetMuscle: 'Posterior Chain & Cardiovascular Engine',
    secondary: ['Hamstrings', 'Glutes', 'Core'],
    equipment: 'dumbbell',
    baseCategory: 'metabolic',
    exerciseCategory: 'cardio',
    allowedEnvironments: ['commercial_gym', 'home_gym'],
    recommendedConditions: ['knee_friendly', 'healthy'],
    formCue: 'Hinge at hips, snap glutes forward aggressively. The bell floats to chest height powered purely by hip drive, not arms.',
    safetyNotes: {
      healthy: 'Massive metabolic calorie burn and explosive hip power.',
      knee_friendly: 'Pure hip hinge; zero knee forward travel.',
      lower_back_care: 'Ensure core is braced; avoid hyperextending at top.',
      shoulder_safe: 'Arms act as loose pendulum.',
      sedentary_posture: 'Explosive glute wake-up call.'
    },
    alternatives: [
      { id: 'jump_rope', name: 'Speed Rope Intervals', equipment: 'Bodyweight', reason: 'Cardio conditioning' }
    ]
  }
];

/**
 * Filter and calibrate exercise sets, reps, rest and safety note according to user's exact condition, goal, and gear
 */
function buildCalibratedExercise(
  categoryKey: 'push' | 'pull' | 'legs' | 'core_and_mobility' | 'metabolic',
  preferredMuscle: string,
  assessment: UserAssessment
): Exercise {
  const condition = assessment.bodyCondition;
  const goal = assessment.goal;
  const env = assessment.trainingEnvironment;

  // Filter exercises matching category
  let candidates = MASTER_LIBRARY.filter(ex => ex.baseCategory === categoryKey);

  // Filter out avoided conditions
  candidates = candidates.filter(ex => !ex.avoidConditions || !ex.avoidConditions.includes(condition));

  // Filter environment compatibility
  candidates = candidates.filter(ex => {
    if (env === 'bodyweight') return ex.equipment === 'bodyweight' || ex.equipment === 'bands';
    if (env === 'home_gym') return ex.equipment === 'dumbbell' || ex.equipment === 'bodyweight' || ex.equipment === 'bands';
    return true;
  });

  // If no match found, fallback to category pool
  if (candidates.length === 0) {
    candidates = MASTER_LIBRARY.filter(ex => ex.baseCategory === categoryKey);
  }

  // Prioritize exercises specifically recommended for this condition or muscle
  let chosen = candidates.find(c => c.recommendedConditions && c.recommendedConditions.includes(condition) && c.targetMuscle.toLowerCase().includes(preferredMuscle.toLowerCase()));
  if (!chosen) {
    chosen = candidates.find(c => c.targetMuscle.toLowerCase().includes(preferredMuscle.toLowerCase()));
  }
  if (!chosen) {
    chosen = candidates[0] || MASTER_LIBRARY[0];
  }

  // Calibrate sets, reps, rest, and RPE dynamically according to user's GOAL
  let sets = 4;
  let reps = '8 - 10 reps';
  let restSeconds = 90;
  let rpe = 'RPE 8';

  switch (goal) {
    case 'weight_gain':
      // Hypertrophy Mass & Overload: Heavy volume, moderate reps, longer rest
      sets = chosen.exerciseCategory === 'compound' ? 4 : 3;
      reps = chosen.exerciseCategory === 'compound' ? '6 - 8 reps' : '8 - 10 reps';
      restSeconds = chosen.exerciseCategory === 'compound' ? 120 : 90;
      rpe = 'RPE 8-9';
      break;

    case 'weight_loss':
      // Metabolic Shred: Higher rep density, short rest, high caloric expenditure
      sets = chosen.exerciseCategory === 'compound' ? 4 : 3;
      reps = chosen.exerciseCategory === 'compound' ? '12 - 15 reps' : '15 - 20 reps';
      restSeconds = chosen.exerciseCategory === 'compound' ? 60 : 45;
      rpe = 'RPE 7-8 (Metabolic Tempo)';
      break;

    case 'muscle_building':
      // Recomposition & Strength: Compound strength + isolation tension
      sets = chosen.exerciseCategory === 'compound' ? 4 : 3;
      reps = chosen.exerciseCategory === 'compound' ? '8 - 10 reps' : '10 - 12 reps';
      restSeconds = chosen.exerciseCategory === 'compound' ? 90 : 60;
      rpe = 'RPE 8';
      break;

    case 'remain_fit':
      // Functional Stamina & Mobility: Controlled tempo, joint longevity
      sets = 3;
      reps = '12 - 15 reps (Controlled)';
      restSeconds = 60;
      rpe = 'RPE 7';
      break;
  }

  // Get condition-specific safety explanation
  const conditionSafetyNote = chosen.safetyNotes[condition] || chosen.safetyNotes.healthy;

  return {
    id: `${chosen.id}_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    name: chosen.name,
    targetMuscle: chosen.targetMuscle,
    secondaryMuscles: chosen.secondary,
    equipment: chosen.equipment,
    sets,
    reps,
    restSeconds,
    rpe,
    formCue: chosen.formCue,
    conditionNote: conditionSafetyNote,
    category: chosen.exerciseCategory,
    illustrationType: chosen.id,
    postureKeypoints: [
      '1. Setup Stance: Brace core, depress scapulae, plant feet firmly.',
      `2. Concentric Drive: Drive through ${chosen.targetMuscle} without momentum.`,
      '3. Eccentric Cadence: Lower under strict 3-second negative.'
    ],
    alternatives: chosen.alternatives
  };
}

/**
 * Generate full tailored Workout Plan based on ALL user conditions
 */
export function generateWorkoutPlan(assessment: UserAssessment): WorkoutPlan {
  const metrics = calculateNutrition(assessment);
  const condition = assessment.bodyCondition;
  const env = assessment.trainingEnvironment;
  const daysCount = assessment.daysPerWeek;
  const goal = assessment.goal;

  // Generate dynamic title reflecting their exact goal + condition
  let goalLabel = 'Hypertrophy Architecture';
  if (goal === 'weight_loss') goalLabel = 'Metabolic Shred & Fat-Loss';
  else if (goal === 'weight_gain') goalLabel = 'Mass Building & Anabolic Bulk';
  else if (goal === 'remain_fit') goalLabel = 'Functional Stamina & Longevity';

  let conditionLabel = 'Unrestricted Power';
  if (condition === 'knee_friendly') conditionLabel = 'Knee-Friendly';
  else if (condition === 'lower_back_care') conditionLabel = 'Lower Back Decompression';
  else if (condition === 'shoulder_safe') conditionLabel = 'Rotator-Safe';
  else if (condition === 'sedentary_posture') conditionLabel = 'Desk Posture Reset';

  const title = `${conditionLabel} ${goalLabel} Blueprint`;
  const subtitle = `Individually engineered for ${assessment.age}yo ${assessment.gender} (${assessment.weight}kg, ${assessment.height}cm) with ${condition.replace('_', ' ')} protocol over ${daysCount} training days.`;

  // Warmup customized to condition
  const baseWarmup = [
    { name: 'Cat-Cow Spinal Articulation', duration: '60 sec', cue: 'Sync breath with movement, mobilize thoracic spine' },
    { name: 'World\'s Greatest Stretch', duration: '90 sec', cue: 'Open hips, thoracic rotation, active hamstring stretch' },
    { name: 'Band Pull-Aparts / Scapular Wall Slides', duration: '60 sec', cue: 'Activate lower traps and rotator cuff without shrugging' }
  ];

  if (condition === 'knee_friendly') {
    baseWarmup[1] = { name: 'Knee-Friendly Glute Bridge & Hip Opener', duration: '90 sec', cue: 'Activate glute medius and hip flexors without patellar torque' };
  } else if (condition === 'lower_back_care') {
    baseWarmup[0] = { name: 'Bird-Dog & Pelvic Tilts', duration: '90 sec', cue: 'Lock lumbar spine in neutral, contract glutes' };
  } else if (condition === 'shoulder_safe') {
    baseWarmup[2] = { name: 'Scapular Wall Slides & External Rotations', duration: '90 sec', cue: 'Clear the acromion space with zero pain' };
  } else if (condition === 'sedentary_posture') {
    baseWarmup[0] = { name: 'Couch Stretch Hip Flexor Opening', duration: '90 sec', cue: 'Unclamp hip flexors tightened from prolonged desk sitting' };
  }

  const baseCooldown = [
    { name: '90/90 Hip Flow', duration: '2 min', cue: 'Internal and external hip rotation breathing rhythm' },
    { name: 'Child\'s Pose with Lat Reach', duration: '90 sec', cue: 'Deep diaphragmatic breathing to switch to parasympathetic mode' },
    { name: 'Couch Stretch / Hip Flexor Release', duration: '2 min', cue: 'Relieve quad and hip flexor tension' }
  ];

  const days: WorkoutDay[] = [];

  if (daysCount === 3) {
    // 3-Day Full Body Split
    days.push({
      dayNumber: 1,
      title: 'Day 1: Full Body Power & Press',
      focus: 'Chest, Quads, Upper Back & Anti-Rotation Core',
      estimatedMinutes: assessment.sessionDurationMin || 55,
      warmup: baseWarmup,
      exercises: [
        buildCalibratedExercise('push', 'Chest', assessment),
        buildCalibratedExercise('legs', condition === 'knee_friendly' ? 'Glute' : 'Quad', assessment),
        buildCalibratedExercise('pull', 'Mid-Back', assessment),
        buildCalibratedExercise('push', 'Lateral Deltoids', assessment),
        buildCalibratedExercise('core_and_mobility', 'Core', assessment)
      ],
      cooldown: baseCooldown
    });

    days.push({
      dayNumber: 2,
      title: 'Day 2: Full Body Posterior Chain & Pull',
      focus: 'Hamstrings, Lats, Shoulders & Core Stability',
      estimatedMinutes: assessment.sessionDurationMin || 55,
      warmup: baseWarmup,
      exercises: [
        buildCalibratedExercise('legs', 'Hamstrings', assessment),
        buildCalibratedExercise('pull', 'Lats', assessment),
        buildCalibratedExercise('push', 'Upper Chest', assessment),
        buildCalibratedExercise('pull', 'Rear Delts', assessment),
        buildCalibratedExercise('core_and_mobility', 'Core', assessment)
      ],
      cooldown: baseCooldown
    });

    days.push({
      dayNumber: 3,
      title: 'Day 3: Full Body Hypertrophy & Stability',
      focus: 'Glutes, Arms, Upper Back & Metabolic Stamina',
      estimatedMinutes: assessment.sessionDurationMin || 55,
      warmup: baseWarmup,
      exercises: [
        buildCalibratedExercise('legs', 'Glute', assessment),
        buildCalibratedExercise('pull', 'Upper Back', assessment),
        buildCalibratedExercise('push', 'Triceps', assessment),
        buildCalibratedExercise('pull', 'Biceps', assessment),
        buildCalibratedExercise('legs', 'Calf', assessment)
      ],
      cooldown: baseCooldown
    });

  } else if (daysCount === 4) {
    // 4-Day Upper / Lower Split
    days.push({
      dayNumber: 1,
      title: 'Day 1: Upper Body Power & Strength',
      focus: 'Chest, Upper Back, Shoulders & Triceps',
      estimatedMinutes: assessment.sessionDurationMin || 60,
      warmup: baseWarmup,
      exercises: [
        buildCalibratedExercise('push', 'Chest', assessment),
        buildCalibratedExercise('pull', 'Mid-Back', assessment),
        buildCalibratedExercise('push', 'Upper Chest', assessment),
        buildCalibratedExercise('push', 'Lateral Deltoids', assessment),
        buildCalibratedExercise('push', 'Triceps', assessment)
      ],
      cooldown: baseCooldown
    });

    days.push({
      dayNumber: 2,
      title: 'Day 2: Lower Body Strength & Stability',
      focus: 'Quads, Hamstrings, Glutes & Deep Core',
      estimatedMinutes: assessment.sessionDurationMin || 60,
      warmup: baseWarmup,
      exercises: [
        buildCalibratedExercise('legs', condition === 'knee_friendly' ? 'Glute' : 'Quad', assessment),
        buildCalibratedExercise('legs', 'Hamstrings', assessment),
        buildCalibratedExercise('legs', 'Glute', assessment),
        buildCalibratedExercise('legs', 'Calf', assessment),
        buildCalibratedExercise('core_and_mobility', 'Core', assessment)
      ],
      cooldown: baseCooldown
    });

    days.push({
      dayNumber: 3,
      title: 'Day 3: Upper Body Hypertrophy & Density',
      focus: 'Lats, Upper Chest, Rear Delts & Biceps',
      estimatedMinutes: assessment.sessionDurationMin || 60,
      warmup: baseWarmup,
      exercises: [
        buildCalibratedExercise('pull', 'Lats', assessment),
        buildCalibratedExercise('push', 'Upper Chest', assessment),
        buildCalibratedExercise('pull', 'Upper Back', assessment),
        buildCalibratedExercise('pull', 'Rear Delts', assessment),
        buildCalibratedExercise('pull', 'Biceps', assessment)
      ],
      cooldown: baseCooldown
    });

    days.push({
      dayNumber: 4,
      title: 'Day 4: Lower Body Volume & Core Armor',
      focus: 'Posterior Chain, Unilateral Legs & Obliques',
      estimatedMinutes: assessment.sessionDurationMin || 60,
      warmup: baseWarmup,
      exercises: [
        buildCalibratedExercise('legs', 'Glute', assessment),
        buildCalibratedExercise('legs', 'Hamstrings', assessment),
        buildCalibratedExercise('legs', condition === 'knee_friendly' ? 'Glute' : 'Quad', assessment),
        buildCalibratedExercise('core_and_mobility', 'Core', assessment),
        buildCalibratedExercise('legs', 'Calf', assessment)
      ],
      cooldown: baseCooldown
    });

  } else if (daysCount === 5) {
    // 5-Day Periodized Split
    days.push({
      dayNumber: 1,
      title: 'Day 1: Push Intensity (Chest, Shoulders & Triceps)',
      focus: 'Horizontal Pressing, Upper Chest, Deltoid Caps, Triceps & Core Armor',
      estimatedMinutes: assessment.sessionDurationMin || 60,
      warmup: baseWarmup,
      exercises: [
        buildCalibratedExercise('push', 'Chest', assessment),
        buildCalibratedExercise('push', 'Upper Chest', assessment),
        buildCalibratedExercise('push', 'Lateral Deltoids', assessment),
        buildCalibratedExercise('push', 'Triceps', assessment),
        buildCalibratedExercise('core_and_mobility', 'Core', assessment)
      ],
      cooldown: baseCooldown
    });

    days.push({
      dayNumber: 2,
      title: 'Day 2: Pull Intensity (Back, Posterior Chain & Biceps)',
      focus: 'Lat Width, Mid-Back Thickness, Rear Delts & Biceps',
      estimatedMinutes: assessment.sessionDurationMin || 60,
      warmup: baseWarmup,
      exercises: [
        buildCalibratedExercise('pull', 'Lats', assessment),
        buildCalibratedExercise('pull', 'Mid-Back', assessment),
        buildCalibratedExercise('pull', 'Rear Delts', assessment),
        buildCalibratedExercise('pull', 'Biceps', assessment),
        buildCalibratedExercise('core_and_mobility', 'Core', assessment)
      ],
      cooldown: baseCooldown
    });

    days.push({
      dayNumber: 3,
      title: 'Day 3: Lower Body Power (Quads, Glutes & Calves)',
      focus: 'Quad Overload, Hamstring Hinge, Glute Max & Core',
      estimatedMinutes: assessment.sessionDurationMin || 60,
      warmup: baseWarmup,
      exercises: [
        buildCalibratedExercise('legs', condition === 'knee_friendly' ? 'Glute' : 'Quad', assessment),
        buildCalibratedExercise('legs', 'Hamstrings', assessment),
        buildCalibratedExercise('legs', 'Glute', assessment),
        buildCalibratedExercise('legs', 'Calf', assessment),
        buildCalibratedExercise('core_and_mobility', 'Core', assessment)
      ],
      cooldown: baseCooldown
    });

    days.push({
      dayNumber: 4,
      title: 'Day 4: Upper Body Sculpt & Hypertrophy',
      focus: 'Pectorals, Rows, Lateral Raises & Arm Finisher',
      estimatedMinutes: assessment.sessionDurationMin || 55,
      warmup: baseWarmup,
      exercises: [
        buildCalibratedExercise('push', 'Upper Chest', assessment),
        buildCalibratedExercise('pull', 'Upper Back', assessment),
        buildCalibratedExercise('push', 'Lateral Deltoids', assessment),
        buildCalibratedExercise('pull', 'Biceps', assessment),
        buildCalibratedExercise('push', 'Triceps', assessment)
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
        buildCalibratedExercise('legs', 'Hamstrings', assessment),
        buildCalibratedExercise('core_and_mobility', 'Core', assessment),
        buildCalibratedExercise('legs', 'Glute', assessment),
        buildCalibratedExercise('pull', 'Rear Delts', assessment),
        buildCalibratedExercise('metabolic', 'Cardio', assessment)
      ],
      cooldown: baseCooldown
    });

  } else {
    // 6-Day Push / Pull / Legs Split
    const pplTitles = [
      'Day 1: Push A (Chest, Shoulders & Triceps Focus)',
      'Day 2: Pull A (Lat Width, Mid-Back & Biceps)',
      'Day 3: Legs A (Quad Overload, Hamstrings & Calves)',
      'Day 4: Push B (Upper Chest, Deltoid Cap & Triceps)',
      'Day 5: Pull B (Back Thickness, Rear Delts & Arms)',
      'Day 6: Legs B (Posterior Chain, Glutes & Core Stability)'
    ];

    pplTitles.forEach((t, idx) => {
      let exList: Exercise[] = [];
      if (idx % 3 === 0) {
        exList = [
          buildCalibratedExercise('push', 'Chest', assessment),
          buildCalibratedExercise('push', 'Upper Chest', assessment),
          buildCalibratedExercise('push', 'Lateral Deltoids', assessment),
          buildCalibratedExercise('push', 'Triceps', assessment),
          buildCalibratedExercise('core_and_mobility', 'Core', assessment)
        ];
      } else if (idx % 3 === 1) {
        exList = [
          buildCalibratedExercise('pull', 'Lats', assessment),
          buildCalibratedExercise('pull', 'Mid-Back', assessment),
          buildCalibratedExercise('pull', 'Rear Delts', assessment),
          buildCalibratedExercise('pull', 'Biceps', assessment),
          buildCalibratedExercise('core_and_mobility', 'Core', assessment)
        ];
      } else {
        exList = [
          buildCalibratedExercise('legs', condition === 'knee_friendly' ? 'Glute' : 'Quad', assessment),
          buildCalibratedExercise('legs', 'Hamstrings', assessment),
          buildCalibratedExercise('legs', 'Glute', assessment),
          buildCalibratedExercise('legs', 'Calf', assessment),
          buildCalibratedExercise('core_and_mobility', 'Core', assessment)
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
    `Daily Calorie Target: ${metrics.macros.calories} kcal (${assessment.goal === 'weight_loss' ? '450 kcal fat-loss deficit' : assessment.goal === 'weight_gain' ? '420 kcal clean lean-bulk surplus' : 'Maintenance baseline'})`,
    `Protein Target: ${metrics.macros.proteinGrams}g/day (~${(metrics.macros.proteinGrams / assessment.weight).toFixed(1)}g per kg body weight) to support optimal tissue remodeling.`,
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
    'Keep rest times between sets strict; use the built-in timer to maintain planned heart rate and metabolic stimulus.',
    condition !== 'healthy' ? `Condition Safeguard: Your plan is specially tailored for ${condition.replace('_', ' ')}. Never push through sharp joint pain; muscular burn is good, sharp joint pain is a stop signal.` : 'Maintain strict progressive overload: record weights and try to add 1 rep or 1-2kg every 1-2 weeks.'
  ];

  return {
    id: `fithub_plan_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    title,
    subtitle,
    splitName: `${daysCount}-Day ${conditionLabel} Split`,
    summary: `Tailored for a ${assessment.age}-year-old ${assessment.gender} weighing ${assessment.weight}kg (${assessment.height}cm), targeting ${assessment.goal.replace('_', ' ')} with ${condition.replace('_', ' ')} safeguards over ${daysCount} training days per week in a ${env.replace('_', ' ')} setting.`,
    frequency: `${daysCount} Days / Week`,
    userAssessment: assessment,
    metrics,
    days,
    nutritionTips,
    mealTiming,
    recoveryRules,
    coachAdvice: `Welcome to FitHub. As Head Coach Yash Badgujar, my core training rule is simple: Consistency beats intensity, and intelligent biomechanics beats reckless lifting. Every movement in this chart has been vetted for your ${condition.replace('_', ' ')} condition and ${goal.replace('_', ' ')} goal. Stick to this structured routine for 8-12 weeks, log your numbers, respect your rest intervals, and let the plan do the work.`
  };
}
