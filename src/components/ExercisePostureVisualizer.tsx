import React, { useState, useEffect } from 'react';
import {
  Shield,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Activity,
  Play,
  Pause,
  RotateCw,
  Compass,
  Layers,
  ArrowRight,
  Zap,
  Info
} from 'lucide-react';

interface ExercisePostureVisualizerProps {
  exerciseName: string;
  targetMuscle: string;
  secondaryMuscles?: string[];
  equipment: string;
  formCue: string;
  conditionNote?: string;
  illustrationType?: string;
  postureKeypoints?: string[];
  defaultOpen?: boolean;
}

type MotionPhase = 'setup' | 'eccentric' | 'pause' | 'concentric';
type ViewAngle = 'isometric' | 'sagittal' | 'frontal';

export const ExercisePostureVisualizer: React.FC<ExercisePostureVisualizerProps> = ({
  exerciseName,
  targetMuscle,
  secondaryMuscles = [],
  equipment,
  formCue,
  conditionNote,
  illustrationType = 'general',
  postureKeypoints = [],
  defaultOpen = false
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const [phase, setPhase] = useState<MotionPhase>('setup');
  const [isPlaying, setIsPlaying] = useState(false);
  const [viewAngle, setViewAngle] = useState<ViewAngle>('isometric');

  // Auto-play the 4D temporal motion loop (Dimension 4: Time)
  useEffect(() => {
    if (!isPlaying) return;

    const phases: MotionPhase[] = ['setup', 'eccentric', 'pause', 'concentric'];
    const phaseDurations = { setup: 1200, eccentric: 1800, pause: 900, concentric: 1200 };

    const timeout = setTimeout(() => {
      setPhase((prev) => {
        const nextIdx = (phases.indexOf(prev) + 1) % phases.length;
        return phases[nextIdx];
      });
    }, phaseDurations[phase]);

    return () => clearTimeout(timeout);
  }, [isPlaying, phase]);

  const nameLower = exerciseName.toLowerCase();
  const isPush = nameLower.includes('press') || nameLower.includes('push') || nameLower.includes('extension') || nameLower.includes('raise');
  const isPull = nameLower.includes('row') || nameLower.includes('pull') || nameLower.includes('chin') || nameLower.includes('curl') || nameLower.includes('lat');
  const isLegs = nameLower.includes('squat') || nameLower.includes('deadlift') || nameLower.includes('thrust') || nameLower.includes('lunge') || nameLower.includes('calf') || nameLower.includes('split');
  const isCore = !isLegs && !isPush && !isPull;

  // Phase-dependent offset calculations for 4D biomechanical displacement
  let displacementY = 0;
  let displacementX = 0;
  let muscleTension = 70; // percentage
  let phaseText = 'Setup: Core braced, spine neutral';
  let tempoCounter = '0s';

  if (phase === 'setup') {
    displacementY = 0;
    displacementX = 0;
    muscleTension = 55;
    phaseText = 'Phase 1: Setup Stance & Joint Lockout';
    tempoCounter = '0s';
  } else if (phase === 'eccentric') {
    displacementY = 22;
    displacementX = isPull ? -12 : 6;
    muscleTension = 85;
    phaseText = 'Phase 2: Controlled Eccentric Lowering (3s Negative)';
    tempoCounter = '-3.0s';
  } else if (phase === 'pause') {
    displacementY = 26;
    displacementX = isPull ? -16 : 8;
    muscleTension = 100;
    phaseText = 'Phase 3: Deep Muscle Stretch & Inversion Pivot';
    tempoCounter = 'Pause 1s';
  } else if (phase === 'concentric') {
    displacementY = 8;
    displacementX = isPull ? -4 : 2;
    muscleTension = 95;
    phaseText = 'Phase 4: Explosive Concentric Power Drive';
    tempoCounter = '+1.0s';
  }

  const render4DGraphic = () => {
    return (
      <svg
        viewBox="0 0 460 220"
        className="w-full h-56 bg-[#07090e] rounded-xl border border-white/10 select-none overflow-hidden"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="neonRed4D" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ff2a51" stopOpacity="1" />
            <stop offset="100%" stopColor="#990920" stopOpacity="0.8" />
          </linearGradient>
          <linearGradient id="jointCyan" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#38bdf8" />
            <stop offset="100%" stopColor="#0284c7" />
          </linearGradient>
          <linearGradient id="gridGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#e6193c" stopOpacity="0.1" />
            <stop offset="100%" stopColor="#0e1015" stopOpacity="0.8" />
          </linearGradient>
          <filter id="hologramGlow" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
          <filter id="brightPulse" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* 4D Isometric Grid Floor (X and Z Depth Dimensions) */}
        <g opacity="0.45">
          <path d="M 30 185 L 230 145 L 430 185 L 230 215 Z" fill="url(#gridGrad)" stroke="#ffffff" strokeOpacity="0.2" strokeWidth="1" />
          <line x1="80" y1="175" x2="280" y2="155" stroke="#ffffff" strokeOpacity="0.15" strokeDasharray="3 3" />
          <line x1="130" y1="165" x2="330" y2="165" stroke="#ffffff" strokeOpacity="0.15" strokeDasharray="3 3" />
          <line x1="180" y1="155" x2="380" y2="175" stroke="#ffffff" strokeOpacity="0.15" strokeDasharray="3 3" />
          
          <line x1="100" y1="195" x2="160" y2="150" stroke="#ffffff" strokeOpacity="0.15" strokeDasharray="3 3" />
          <line x1="180" y1="205" x2="240" y2="150" stroke="#ffffff" strokeOpacity="0.15" strokeDasharray="3 3" />
          <line x1="260" y1="205" x2="320" y2="150" stroke="#ffffff" strokeOpacity="0.15" strokeDasharray="3 3" />
        </g>

        {/* Floating 4D Motion Axis Indicator */}
        <g transform="translate(20, 25)" opacity="0.85">
          <line x1="0" y1="20" x2="28" y2="20" stroke="#38bdf8" strokeWidth="1.5" />
          <text x="32" y="23" fill="#38bdf8" fontSize="8" fontFamily="monospace" fontWeight="bold">X (Width)</text>
          
          <line x1="0" y1="20" x2="0" y2="0" stroke="#34d399" strokeWidth="1.5" />
          <text x="3" y="4" fill="#34d399" fontSize="8" fontFamily="monospace" fontWeight="bold">Y (Height)</text>
          
          <line x1="0" y1="20" x2="16" y2="30" stroke="#f43f5e" strokeWidth="1.5" />
          <text x="20" y="34" fill="#f43f5e" fontSize="8" fontFamily="monospace" fontWeight="bold">Z (Depth)</text>
          
          <circle cx="0" cy="20" r="2.5" fill="#ffffff" />
        </g>

        {/* 4D Time / Rep Phase Watermark */}
        <g transform="translate(300, 22)">
          <rect x="0" y="0" width="145" height="24" rx="6" fill="#131620" stroke="#e6193c" strokeOpacity="0.4" strokeWidth="1" />
          <circle cx="12" cy="12" r="4" fill="#e6193c" filter="url(#brightPulse)" />
          <text x="22" y="15" fill="#ffffff" fontSize="9" fontFamily="sans-serif" fontWeight="bold">
            TIME 4D: {tempoCounter}
          </text>
        </g>

        {/* SPECIFIC 4D ANATOMICAL MODEL BY CATEGORY */}
        {isLegs ? (
          /* LEGS / SQUATS / HINGE 4D MODEL */
          <g transform={`translate(180, ${40 + displacementY * 0.7})`}>
            {/* Motion Trajectory Guide Path */}
            <path d="M 40 -10 L 40 45" stroke="#38bdf8" strokeWidth="1.5" strokeDasharray="3 3" opacity="0.6" />
            <polygon points="37,42 43,42 40,48" fill="#38bdf8" />

            {/* Spine Column Vector */}
            <line
              x1="40"
              y1="0"
              x2={viewAngle === 'sagittal' ? '25' : '40'}
              y2="55"
              stroke="#6b7280"
              strokeWidth="10"
              strokeLinecap="round"
            />
            {/* Head Silhouette */}
            <circle cx="40" cy="-14" r="14" fill="#374151" stroke="#9ca3af" strokeWidth="1" />

            {/* Active Prime Movers (Glute & Quads) */}
            <circle
              cx={viewAngle === 'sagittal' ? '20' : '40'}
              cy="55"
              r="13"
              fill="url(#neonRed4D)"
              filter="url(#hologramGlow)"
              opacity={muscleTension / 100}
            />

            {/* Thigh / Femur Angle */}
            <line
              x1={viewAngle === 'sagittal' ? '20' : '40'}
              y1="55"
              x2={viewAngle === 'sagittal' ? '70' : '80'}
              y2={55 + displacementY * 0.3}
              stroke="#4b5563"
              strokeWidth="12"
              strokeLinecap="round"
            />

            {/* Knee Joint Pivot */}
            <circle
              cx={viewAngle === 'sagittal' ? '70' : '80'}
              cy={55 + displacementY * 0.3}
              r="7"
              fill="url(#jointCyan)"
            />

            {/* Tibia / Shin (Vertical Safe Vector) */}
            <line
              x1={viewAngle === 'sagittal' ? '70' : '80'}
              y1={55 + displacementY * 0.3}
              x2={viewAngle === 'sagittal' ? '70' : '80'}
              y2="115"
              stroke="url(#neonRed4D)"
              strokeWidth="9"
              strokeLinecap="round"
            />

            {/* Ankle Joint & Foot Plane */}
            <circle cx={viewAngle === 'sagittal' ? '70' : '80'} cy="115" r="5" fill="#facc15" />
            <path
              d={`M ${viewAngle === 'sagittal' ? '55' : '65'} 120 L ${viewAngle === 'sagittal' ? '95' : '105'} 120`}
              stroke="#ffffff"
              strokeWidth="6"
              strokeLinecap="round"
            />

            {/* Barbell / Load Depth Indicator */}
            <rect x="0" y="-8" width="80" height="7" rx="2" fill="#d1d5db" />
            <circle cx="5" cy="-5" r="12" fill="#e6193c" filter="url(#hologramGlow)" />
            <circle cx="75" cy="-5" r="12" fill="#e6193c" filter="url(#hologramGlow)" />

            {/* 4D Callout Annotation */}
            <g transform="translate(95, 20)">
              <rect x="0" y="0" width="135" height="34" rx="4" fill="#0d111b" stroke="#38bdf8" strokeWidth="1" />
              <text x="8" y="14" fill="#38bdf8" fontSize="9" fontWeight="bold">Shin Angle: 90° Safe</text>
              <text x="8" y="26" fill="#ff8093" fontSize="8">Glute Tension: {muscleTension}%</text>
            </g>
          </g>
        ) : isPush ? (
          /* PUSH / BENCH / OVERHEAD 4D MODEL */
          <g transform={`translate(160, ${60 + displacementY * 0.6})`}>
            {/* Bench Plane */}
            <rect x="-20" y="55" width="180" height="14" rx="4" fill="#1f2937" stroke="#374151" strokeWidth="1.5" />
            <line x1="20" y1="70" x2="20" y2="105" stroke="#374151" strokeWidth="6" />
            <line x1="120" y1="70" x2="120" y2="105" stroke="#374151" strokeWidth="6" />

            {/* Athlete Torso */}
            <circle cx="0" cy="45" r="13" fill="#374151" />
            <rect x="12" y="38" width="85" height="22" rx="8" fill="#4b5563" />

            {/* Active Pectoralis Clavicular & Sternal Zone */}
            <rect
              x="25"
              y="38"
              width="45"
              height="20"
              rx="6"
              fill="url(#neonRed4D)"
              filter="url(#hologramGlow)"
              opacity={muscleTension / 100}
            />

            {/* Shoulder Scapular Pivot */}
            <circle cx="30" cy="48" r="6" fill="url(#jointCyan)" />

            {/* Arm Vector (30-45° Scapular Plane) */}
            <line
              x1="30"
              y1="48"
              x2="55"
              y2={10 - displacementY * 0.4}
              stroke="#d1d5db"
              strokeWidth="8"
              strokeLinecap="round"
            />
            {/* Elbow Pivot */}
            <circle cx="55" cy={10 - displacementY * 0.4} r="6" fill="#facc15" />

            {/* Forearm & Gripping Hands */}
            <line
              x1="55"
              y1={10 - displacementY * 0.4}
              x2="55"
              y2={-15 - displacementY * 0.8}
              stroke="#ffffff"
              strokeWidth="7"
              strokeLinecap="round"
            />

            {/* Barbell / Dumbbell Loaded */}
            <rect x="25" y={-26 - displacementY * 0.8} width="60" height="8" rx="2" fill="#e5e7eb" />
            <circle cx="28" cy={-22 - displacementY * 0.8} r="12" fill="#e6193c" filter="url(#hologramGlow)" />
            <circle cx="82" cy={-22 - displacementY * 0.8} r="12" fill="#e6193c" filter="url(#hologramGlow)" />

            {/* 4D Callout Annotation */}
            <g transform="translate(100, -30)">
              <rect x="0" y="0" width="145" height="34" rx="4" fill="#0d111b" stroke="#34d399" strokeWidth="1" />
              <text x="8" y="14" fill="#34d399" fontSize="9" fontWeight="bold">Scapular Plane: 45° Flare</text>
              <text x="8" y="26" fill="#ffccd5" fontSize="8">Chest Mechanical Tension: {muscleTension}%</text>
            </g>
          </g>
        ) : isPull ? (
          /* PULL / ROWS / LATS 4D MODEL */
          <g transform={`translate(160, ${50 + displacementY * 0.5})`}>
            {/* Incline / Chest Support Pad */}
            <line x1="20" y1="120" x2="80" y2="40" stroke="#1f2937" strokeWidth="14" strokeLinecap="round" />

            {/* Athlete Torso */}
            <line x1="30" y1="110" x2="85" y2="45" stroke="#374151" strokeWidth="16" strokeLinecap="round" />
            <circle cx="95" cy="35" r="13" fill="#374151" />

            {/* Active Latissimus Dorsi & Rhomboids Glow */}
            <line
              x1="45"
              y1="95"
              x2="80"
              y2="55"
              stroke="url(#neonRed4D)"
              strokeWidth="11"
              strokeLinecap="round"
              filter="url(#hologramGlow)"
              opacity={muscleTension / 100}
            />

            {/* Arm pulling back towards hip */}
            <line
              x1="70"
              y1="55"
              x2={40 + displacementX}
              y2={85 + displacementY * 0.2}
              stroke="#ffffff"
              strokeWidth="8"
              strokeLinecap="round"
            />
            {/* Elbow joint driving to pocket */}
            <circle cx={40 + displacementX} cy={85 + displacementY * 0.2} r="7" fill="url(#jointCyan)" />

            {/* Weight / Grip Attachment */}
            <rect x={28 + displacementX} y={80 + displacementY * 0.2} width="24" height="10" rx="3" fill="#fbbf24" />

            {/* Pull Trajectory Vector */}
            <path d="M 90 95 L 45 75" stroke="#34d399" strokeWidth="2" strokeDasharray="3 3" />
            <polygon points="45,71 41,78 49,76" fill="#34d399" />

            {/* 4D Callout Annotation */}
            <g transform="translate(110, 10)">
              <rect x="0" y="0" width="145" height="34" rx="4" fill="#0d111b" stroke="#e6193c" strokeWidth="1" />
              <text x="8" y="14" fill="#ffccd5" fontSize="9" fontWeight="bold">Elbow Drive: Pocket Angle</text>
              <text x="8" y="26" fill="#34d399" fontSize="8">Spinal Load: 0 kg (Decompressed)</text>
            </g>
          </g>
        ) : (
          /* CORE / ANTI-ROTATION / MOBILITY 4D MODEL */
          <g transform={`translate(160, ${65 + displacementY * 0.3})`}>
            {/* Torso & Head */}
            <circle cx="50" cy="30" r="14" fill="#374151" />
            <line x1="50" y1="44" x2="50" y2="105" stroke="#4b5563" strokeWidth="14" strokeLinecap="round" />

            {/* Deep Transverse Abdominis & Core Cylindrical Glow */}
            <rect
              x="42"
              y="55"
              width="16"
              height="40"
              rx="4"
              fill="url(#neonRed4D)"
              filter="url(#hologramGlow)"
              opacity={muscleTension / 100}
            />

            {/* Extended Arms holding tension anchor */}
            <line
              x1="50"
              y1="60"
              x2="115"
              y2={60 + displacementY * 0.2}
              stroke="#ffffff"
              strokeWidth="7"
              strokeLinecap="round"
            />
            <circle cx="115" cy={60 + displacementY * 0.2} r="6" fill="#facc15" />

            {/* Anti-Rotation Vector Lock */}
            <line x1="115" y1="60" x2="200" y2="60" stroke="#38bdf8" strokeWidth="2.5" strokeDasharray="4 4" />
            <polygon points="120,56 120,64 113,60" fill="#38bdf8" />

            {/* 4D Callout Annotation */}
            <g transform="translate(100, 0)">
              <rect x="0" y="0" width="145" height="34" rx="4" fill="#0d111b" stroke="#38bdf8" strokeWidth="1" />
              <text x="8" y="14" fill="#38bdf8" fontSize="9" fontWeight="bold">Anti-Rotation Lock: 100%</text>
              <text x="8" y="26" fill="#ffccd5" fontSize="8">Lumbar Shear: Neutral / Protected</text>
            </g>
          </g>
        )}

        {/* Dynamic 4D HUD Footer Bar */}
        <g transform="translate(20, 192)">
          <text x="0" y="0" fill="#9ca3af" fontSize="9" fontFamily="sans-serif">
            Current 4D Dynamic Focus: <tspan fill="#ffffff" fontWeight="bold">{phaseText}</tspan>
          </text>
        </g>
      </svg>
    );
  };

  return (
    <div className="mt-3.5 pt-3.5 border-t border-white/10">
      {/* Visualizer Header Action Strip */}
      <div className="flex flex-wrap items-center justify-between gap-2.5">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="text-xs font-bold uppercase tracking-wider text-[#ff8093] hover:text-white transition-colors flex items-center gap-2 cursor-pointer select-none group"
        >
          <div className="px-2 py-0.5 rounded bg-gradient-to-r from-[#e6193c] to-[#990920] text-white text-[10px] font-black uppercase tracking-wider flex items-center gap-1 shadow-md shadow-[#e6193c]/30">
            <Zap className="w-3 h-3 fill-white" />
            <span>4D Posture & Movement Model</span>
          </div>
          <span className="text-neutral-200 group-hover:text-white">
            {isOpen ? 'Close 4D Diagram' : 'Open 4D Motion Diagram'}
          </span>
          {isOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>

        {isOpen && (
          <div className="flex items-center gap-2">
            {/* Auto-play 4D motion loop */}
            <button
              type="button"
              onClick={() => setIsPlaying(!isPlaying)}
              className={`px-2.5 py-1 rounded text-[11px] font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer border ${
                isPlaying
                  ? 'bg-emerald-600 text-white border-emerald-500 shadow-md shadow-emerald-600/30'
                  : 'bg-white/5 text-neutral-300 border-white/10 hover:border-white/30'
              }`}
            >
              {isPlaying ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3 fill-current" />}
              <span>{isPlaying ? 'Pause 4D' : 'Play 4D Motion Loop'}</span>
            </button>

            {/* Camera angle toggle */}
            <div className="flex bg-black/50 p-0.5 rounded border border-white/10 text-[10px] font-bold">
              {(['isometric', 'sagittal', 'frontal'] as ViewAngle[]).map((a) => (
                <button
                  key={a}
                  type="button"
                  onClick={() => setViewAngle(a)}
                  className={`px-2 py-0.5 rounded uppercase transition-colors cursor-pointer ${
                    viewAngle === a ? 'bg-[#e6193c] text-white' : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  {a === 'isometric' ? '3D Iso' : a === 'sagittal' ? 'Side' : 'Front'}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Expanded 4D Holographic Workspace */}
      {isOpen && (
        <div className="mt-3.5 p-4 bg-[#090c13] border border-white/15 rounded-xl space-y-4 animate-in fade-in zoom-in-95 duration-200 shadow-2xl">
          {/* Header Row */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono uppercase bg-[#e6193c]/20 text-[#ff8093] px-2 py-0.5 rounded font-bold border border-[#e6193c]/30">
                  4-Dimensional Biomechanical Blueprint
                </span>
                <span className="text-[11px] text-neutral-400">· {equipment}</span>
              </div>
              <h6 className="font-display text-lg font-black uppercase text-white mt-0.5">
                {exerciseName}
              </h6>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-neutral-400">Prime Mover:</span>
              <span className="text-xs font-bold uppercase px-2.5 py-1 rounded bg-[#e6193c] text-white shadow-sm">
                {targetMuscle}
              </span>
            </div>
          </div>

          {/* 4D Temporal Phase Selector Pills */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {[
              { id: 'setup' as MotionPhase, label: '1. Setup & Brace', time: '0s' },
              { id: 'eccentric' as MotionPhase, label: '2. Negative Eccentric', time: '3s' },
              { id: 'pause' as MotionPhase, label: '3. Full Stretch', time: '1s' },
              { id: 'concentric' as MotionPhase, label: '4. Explosive Drive', time: '1s' }
            ].map((pItem) => {
              const active = phase === pItem.id;
              return (
                <button
                  key={pItem.id}
                  type="button"
                  onClick={() => {
                    setPhase(pItem.id);
                    setIsPlaying(false);
                  }}
                  className={`p-2 rounded-lg text-left transition-all border cursor-pointer ${
                    active
                      ? 'bg-[#e6193c]/20 border-[#e6193c] shadow-md shadow-[#e6193c]/20'
                      : 'bg-black/30 border-white/10 hover:border-white/20'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className={`text-[10px] font-bold uppercase ${active ? 'text-[#ff8093]' : 'text-neutral-400'}`}>
                      {pItem.time}
                    </span>
                    {active && <span className="w-1.5 h-1.5 rounded-full bg-[#e6193c]" />}
                  </div>
                  <div className={`text-xs font-bold ${active ? 'text-white' : 'text-neutral-300'}`}>
                    {pItem.label}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Hologram SVG Graphic Canvas */}
          <div className="relative">
            {render4DGraphic()}
          </div>

          {/* 3-Point Posture Alignment Checkpoints */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
            <div className="bg-black/40 border border-white/5 p-3 rounded-xl space-y-1">
              <div className="flex items-center gap-1.5 text-amber-300 font-bold uppercase text-[10px]">
                <Shield className="w-3.5 h-3.5" />
                <span>1. Skeletal Alignment</span>
              </div>
              <p className="text-neutral-300 text-[11px] leading-relaxed">
                Pack cervical spine, tuck ribs into pelvis, and anchor feet/hands on the torque axis.
              </p>
            </div>

            <div className="bg-black/40 border border-white/5 p-3 rounded-xl space-y-1">
              <div className="flex items-center gap-1.5 text-[#ff8093] font-bold uppercase text-[10px]">
                <Activity className="w-3.5 h-3.5" />
                <span>2. Mechanical Vector</span>
              </div>
              <p className="text-neutral-300 text-[11px] leading-relaxed">
                Initiate purely through the prime mover: drive elbows down or push heels through the floor.
              </p>
            </div>

            <div className="bg-black/40 border border-white/5 p-3 rounded-xl space-y-1">
              <div className="flex items-center gap-1.5 text-emerald-300 font-bold uppercase text-[10px]">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>3. Joint Deceleration</span>
              </div>
              <p className="text-neutral-300 text-[11px] leading-relaxed">
                Control the load across the entire 3-second negative descent; never allow free-fall momentum.
              </p>
            </div>
          </div>

          {/* Coach Yash Badgujar Specific Directive */}
          <div className="bg-gradient-to-r from-[#170509] to-[#0c0f16] border border-[#e6193c]/30 p-3.5 rounded-xl text-xs space-y-1.5">
            <div className="flex items-center gap-1.5 text-white font-bold">
              <Sparkles className="w-3.5 h-3.5 text-[#e6193c]" />
              <span>Head Coach Execution Rule:</span>
            </div>
            <p className="text-neutral-300 text-[11px] leading-relaxed">
              "{formCue}"
            </p>
            {conditionNote && (
              <p className="text-[11px] text-emerald-300 font-medium pt-1.5 border-t border-white/10 flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>{conditionNote}</span>
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
