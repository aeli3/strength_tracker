import type { Exercise } from '../types';

export { MUSCLE_GROUPS } from '../types';

export const ALL_EXERCISES: Exercise[] = [
  // Chest
  { id: 'bench-press', name: 'Bench Press', muscleGroup: 'Chest' },
  { id: 'incline-bench-press', name: 'Incline Bench Press', muscleGroup: 'Chest' },
  { id: 'decline-bench-press', name: 'Decline Bench Press', muscleGroup: 'Chest' },
  { id: 'dumbbell-flyes', name: 'Dumbbell Flyes', muscleGroup: 'Chest' },
  { id: 'push-ups', name: 'Push-Ups', muscleGroup: 'Chest' },
  { id: 'cable-crossover', name: 'Cable Crossover', muscleGroup: 'Chest' },
  { id: 'chest-dips', name: 'Chest Dips', muscleGroup: 'Chest' },
  { id: 'chest-press-machine', name: 'Chest Press Machine', muscleGroup: 'Chest' },
  { id: 'pec-deck', name: 'Pec Deck', muscleGroup: 'Chest' },

  // Back
  { id: 'deadlift', name: 'Deadlift', muscleGroup: 'Back' },
  { id: 'pull-up', name: 'Pull-Up', muscleGroup: 'Back' },
  { id: 'chin-up', name: 'Chin-Up', muscleGroup: 'Back' },
  { id: 'bent-over-row', name: 'Bent Over Row', muscleGroup: 'Back' },
  { id: 'lat-pulldown', name: 'Lat Pulldown', muscleGroup: 'Back' },
  { id: 'seated-cable-row', name: 'Seated Cable Row', muscleGroup: 'Back' },
  { id: 'face-pull', name: 'Face Pull', muscleGroup: 'Back' },
  { id: 't-bar-row', name: 'T-Bar Row', muscleGroup: 'Back' },
  { id: 'single-arm-dumbbell-row', name: 'Single Arm Dumbbell Row', muscleGroup: 'Back' },
  { id: 'chest-supported-row', name: 'Chest Supported Row', muscleGroup: 'Back' },
  { id: 'straight-arm-pulldown', name: 'Straight Arm Pulldown', muscleGroup: 'Back' },
  { id: 'back-extension', name: 'Back Extension', muscleGroup: 'Back' },

  // Shoulders
  { id: 'overhead-press', name: 'Overhead Press', muscleGroup: 'Shoulders' },
  { id: 'dumbbell-shoulder-press', name: 'Dumbbell Shoulder Press', muscleGroup: 'Shoulders' },
  { id: 'lateral-raise', name: 'Lateral Raise', muscleGroup: 'Shoulders' },
  { id: 'front-raise', name: 'Front Raise', muscleGroup: 'Shoulders' },
  { id: 'arnold-press', name: 'Arnold Press', muscleGroup: 'Shoulders' },
  { id: 'shrugs', name: 'Shrugs', muscleGroup: 'Shoulders' },
  { id: 'reverse-flyes', name: 'Reverse Flyes', muscleGroup: 'Shoulders' },
  { id: 'upright-row', name: 'Upright Row', muscleGroup: 'Shoulders' },

  // Arms
  { id: 'bicep-curl', name: 'Bicep Curl', muscleGroup: 'Arms' },
  { id: 'hammer-curl', name: 'Hammer Curl', muscleGroup: 'Arms' },
  { id: 'preacher-curl', name: 'Preacher Curl', muscleGroup: 'Arms' },
  { id: 'concentration-curl', name: 'Concentration Curl', muscleGroup: 'Arms' },
  { id: 'incline-dumbbell-curl', name: 'Incline Dumbbell Curl', muscleGroup: 'Arms' },
  { id: 'tricep-dip', name: 'Tricep Dip', muscleGroup: 'Arms' },
  { id: 'skull-crusher', name: 'Skull Crusher', muscleGroup: 'Arms' },
  { id: 'cable-tricep-pushdown', name: 'Cable Tricep Pushdown', muscleGroup: 'Arms' },
  { id: 'close-grip-bench', name: 'Close-Grip Bench Press', muscleGroup: 'Arms' },
  { id: 'overhead-tricep-extension', name: 'Overhead Tricep Extension', muscleGroup: 'Arms' },
  { id: 'pullover', name: 'Pullover', muscleGroup: 'Arms' },
  { id: 'wrist-curl', name: 'Wrist Curl', muscleGroup: 'Arms' },
  { id: 'reverse-curl', name: 'Reverse Curl', muscleGroup: 'Arms' },

  // Core
  { id: 'plank', name: 'Plank', muscleGroup: 'Core' },
  { id: 'crunches', name: 'Crunches', muscleGroup: 'Core' },
  { id: 'russian-twist', name: 'Russian Twist', muscleGroup: 'Core' },
  { id: 'leg-raise', name: 'Leg Raise', muscleGroup: 'Core' },
  { id: 'cable-crunch', name: 'Cable Crunch', muscleGroup: 'Core' },
  { id: 'ab-wheel', name: 'Ab Wheel Rollout', muscleGroup: 'Core' },
  { id: 'hanging-knee-raise', name: 'Hanging Knee Raise', muscleGroup: 'Core' },
  { id: 'side-plank', name: 'Side Plank', muscleGroup: 'Core' },
  { id: 'dead-bug', name: 'Dead Bug', muscleGroup: 'Core' },
  { id: 'pallof-press', name: 'Pallof Press', muscleGroup: 'Core' },
  { id: 'dragon-flag', name: 'Dragon Flag', muscleGroup: 'Core' },

  // Legs
  { id: 'squat', name: 'Squat', muscleGroup: 'Legs' },
  { id: 'front-squat', name: 'Front Squat', muscleGroup: 'Legs' },
  { id: 'leg-press', name: 'Leg Press', muscleGroup: 'Legs' },
  { id: 'romanian-deadlift', name: 'Romanian Deadlift', muscleGroup: 'Legs' },
  { id: 'leg-curl', name: 'Leg Curl', muscleGroup: 'Legs' },
  { id: 'leg-extension', name: 'Leg Extension', muscleGroup: 'Legs' },
  { id: 'calf-raise', name: 'Calf Raise', muscleGroup: 'Legs' },
  { id: 'walking-lunge', name: 'Walking Lunge', muscleGroup: 'Legs' },
  { id: 'hack-squat', name: 'Hack Squat', muscleGroup: 'Legs' },
  { id: 'sissy-squat', name: 'Sissy Squat', muscleGroup: 'Legs' },
  { id: 'nordic-curl', name: 'Nordic Curl', muscleGroup: 'Legs' },
  { id: 'seated-calf-raise', name: 'Seated Calf Raise', muscleGroup: 'Legs' },

  // Glutes
  { id: 'hip-thrust', name: 'Hip Thrust', muscleGroup: 'Glutes' },
  { id: 'bulgarian-split-squat', name: 'Bulgarian Split Squat', muscleGroup: 'Glutes' },
  { id: 'sumo-deadlift', name: 'Sumo Deadlift', muscleGroup: 'Glutes' },
  { id: 'glute-bridge', name: 'Glute Bridge', muscleGroup: 'Glutes' },
  { id: 'cable-kickback', name: 'Cable Kickback', muscleGroup: 'Glutes' },
  { id: 'abductor-machine', name: 'Abductor Machine', muscleGroup: 'Glutes' },
  { id: 'adductor-machine', name: 'Adductor Machine', muscleGroup: 'Glutes' },
  { id: 'step-up', name: 'Step Up', muscleGroup: 'Glutes' },

  // Cardio
  { id: 'running', name: 'Running', muscleGroup: 'Cardio' },
  { id: 'cycling', name: 'Cycling', muscleGroup: 'Cardio' },
  { id: 'rowing-machine', name: 'Rowing Machine', muscleGroup: 'Cardio' },
  { id: 'jump-rope', name: 'Jump Rope', muscleGroup: 'Cardio' },
  { id: 'stair-climber', name: 'Stair Climber', muscleGroup: 'Cardio' },
  { id: 'elliptical', name: 'Elliptical', muscleGroup: 'Cardio' },
  { id: 'assault-bike', name: 'Assault Bike', muscleGroup: 'Cardio' },
  { id: 'sled-push', name: 'Sled Push', muscleGroup: 'Cardio' },
  { id: 'battle-ropes', name: 'Battle Ropes', muscleGroup: 'Cardio' },
];