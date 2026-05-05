export const motion = {
  durations: {
    fast: 120,
    base: 200,
    slow: 320,
  },
  springs: {
    standard: { damping: 18, stiffness: 220 },
    emphasized: { damping: 15, stiffness: 300 },
    gentle: { damping: 22, stiffness: 180 },
  },
  presets: {
    fadeIn: {
      from: { opacity: 0 },
      to: { opacity: 1 },
      duration: 200,
    },
    slideUp: {
      from: { translateY: 20, opacity: 0 },
      to: { translateY: 0, opacity: 1 },
      duration: 240,
    },
    scaleIn: {
      from: { scale: 0.95, opacity: 0 },
      to: { scale: 1, opacity: 1 },
      duration: 200,
    },
    pressedScale: {
      scale: 0.95,
    },
  },
} as const;

export type MotionDuration = keyof typeof motion.durations;
export type MotionSpring = keyof typeof motion.springs;
export type MotionPreset = keyof typeof motion.presets;
