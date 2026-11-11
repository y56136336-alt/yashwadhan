import React, { useState } from 'react';
import { UserAssessment, WorkoutPlan, FitnessGoal } from './types/fitness';
import { generateWorkoutPlan } from './utils/fitnessCalculator';
import { CustomCursor } from './components/CustomCursor';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { AssessmentForm } from './components/AssessmentForm';
import { ExerciseChartPlan } from './components/ExerciseChartPlan';
import { PhilosophySection } from './components/PhilosophySection';
import { DisciplinesSection } from './components/DisciplinesSection';
import { FloorSchedule } from './components/FloorSchedule';
import { CoachesSection } from './components/CoachesSection';
import { TransformationsSection } from './components/TransformationsSection';
import { Footer } from './components/Footer';
import { Dumbbell } from 'lucide-react';

export default function App() {
  // Default Initial Assessment so user has an immediate interactive experience
  const defaultAssessment: UserAssessment = {
    weight: 74,
    weightUnit: 'kg',
    rawWeight: 74,
    height: 178,
    heightUnit: 'cm',
    rawHeightCm: 178,
    rawHeightFt: 5,
    rawHeightIn: 10,
    age: 25,
    gender: 'male',
    bodyCondition: 'healthy',
    goal: 'muscle_building',
    experienceLevel: 'intermediate',
    trainingEnvironment: 'commercial_gym',
    daysPerWeek: 4,
    sessionDurationMin: 60
  };

  const [assessment, setAssessment] = useState<UserAssessment>(defaultAssessment);
  const [currentPlan, setCurrentPlan] = useState<WorkoutPlan>(() => generateWorkoutPlan(defaultAssessment));
  const [hasCustomized, setHasCustomized] = useState(false);

  const handlePlanGenerated = (newAssessment: UserAssessment) => {
    setAssessment(newAssessment);
    const newPlan = generateWorkoutPlan(newAssessment);
    setCurrentPlan(newPlan);
    setHasCustomized(true);
  };

  const handleQuickDemo = (presetType: 'bulk' | 'loss' | 'posture') => {
    let demoAssessment: UserAssessment;
    if (presetType === 'bulk') {
      demoAssessment = {
        weight: 72,
        weightUnit: 'kg',
        rawWeight: 72,
        height: 176,
        heightUnit: 'cm',
        rawHeightCm: 176,
        age: 24,
        gender: 'male',
        bodyCondition: 'healthy',
        goal: 'weight_gain',
        experienceLevel: 'intermediate',
        trainingEnvironment: 'commercial_gym',
        daysPerWeek: 5,
        sessionDurationMin: 60
      };
    } else if (presetType === 'loss') {
      demoAssessment = {
        weight: 88,
        weightUnit: 'kg',
        rawWeight: 88,
        height: 175,
        heightUnit: 'cm',
        rawHeightCm: 175,
        age: 31,
        gender: 'male',
        bodyCondition: 'knee_friendly',
        goal: 'weight_loss',
        experienceLevel: 'intermediate',
        trainingEnvironment: 'commercial_gym',
        daysPerWeek: 4,
        sessionDurationMin: 55
      };
    } else {
      demoAssessment = {
        weight: 66,
        weightUnit: 'kg',
        rawWeight: 66,
        height: 168,
        heightUnit: 'cm',
        rawHeightCm: 168,
        age: 28,
        gender: 'female',
        bodyCondition: 'lower_back_care',
        goal: 'remain_fit',
        experienceLevel: 'beginner',
        trainingEnvironment: 'home_gym',
        daysPerWeek: 3,
        sessionDurationMin: 45
      };
    }

    setAssessment(demoAssessment);
    const plan = generateWorkoutPlan(demoAssessment);
    setCurrentPlan(plan);
    setHasCustomized(true);

    const planElem = document.getElementById('exercise-chart');
    if (planElem) {
      planElem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSelectDiscipline = (disciplineGoal: FitnessGoal) => {
    const updated = {
      ...assessment,
      goal: disciplineGoal
    };
    setAssessment(updated);
    const plan = generateWorkoutPlan(updated);
    setCurrentPlan(plan);
    setHasCustomized(true);

    const planElem = document.getElementById('exercise-chart');
    if (planElem) {
      planElem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToAssessment = () => {
    const el = document.getElementById('assessment');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToPlan = () => {
    const el = document.getElementById('exercise-chart');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#0c0d10] text-[#f3f4f6] selection:bg-[#e6193c] selection:text-white relative">
      {/* Interactive Cursor Follower with Glow Response */}
      <CustomCursor />

      {/* Primary Navigation Bar */}
      <Navbar
        onOpenAssessment={scrollToAssessment}
        hasGeneratedPlan={hasCustomized}
        onViewPlan={scrollToPlan}
      />

      {/* Hero Section */}
      <Hero
        onStartAssessment={scrollToAssessment}
        onQuickDemo={handleQuickDemo}
      />

      {/* Assessment Form: Weight, Height, Age, Gender, Body Condition, Goal */}
      <AssessmentForm
        onPlanGenerated={handlePlanGenerated}
        initialAssessment={assessment}
      />

      {/* Interactive Personalized Exercise Chart & Routine Tracker */}
      <ExerciseChartPlan
        plan={currentPlan}
        onModifyAssessment={scrollToAssessment}
      />

      {/* Built For The Work, Not The Mirror Section */}
      <PhilosophySection />

      {/* Pick Your Discipline Section */}
      <DisciplinesSection onSelectDiscipline={handleSelectDiscipline} />

      {/* This Week On The Floor Schedule */}
      <FloorSchedule />

      {/* The People Who Program You / Coaches Showcase */}
      <CoachesSection />

      {/* Transformations & Proof Section */}
      <TransformationsSection />

      {/* Footer */}
      <Footer />

      {/* Mobile Floating Action Button */}
      <div className="md:hidden fixed bottom-4 right-4 z-40 no-print">
        <button
          onClick={scrollToAssessment}
          className="px-4 py-3 bg-[#e6193c] text-white rounded-full shadow-2xl shadow-[#e6193c]/50 text-xs font-bold uppercase tracking-wider flex items-center gap-2 cursor-pointer border border-white/20 active:scale-95"
        >
          <Dumbbell className="w-4 h-4" />
          <span>My Plan</span>
        </button>
      </div>
    </div>
  );
}
