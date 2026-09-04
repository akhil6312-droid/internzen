import confetti from 'canvas-confetti';

export type ConfettiType = 'standard' | 'milestone' | 'subtle';

/**
 * Fires customizable celebration confetti particles using the InternZen palette.
 */
export const fireConfetti = (type: ConfettiType = 'standard') => {
  if (typeof window === 'undefined') return;

  const brandColors = ['#8b5cf6', '#6366f1', '#10b981', '#06b6d4', '#f59e0b', '#ec4899'];

  if (type === 'milestone') {
    // Twin cannon celebration for major milestones like dispatching an application
    const end = Date.now() + 800;

    const frame = () => {
      confetti({
        particleCount: 4,
        angle: 60,
        spread: 55,
        origin: { x: 0, y: 0.7 },
        colors: brandColors,
        zIndex: 9999,
      });
      confetti({
        particleCount: 4,
        angle: 120,
        spread: 55,
        origin: { x: 1, y: 0.7 },
        colors: brandColors,
        zIndex: 9999,
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };

    frame();
  } else if (type === 'subtle') {
    // Compact burst for marking skill modules learned or micro-achievements
    confetti({
      particleCount: 35,
      spread: 45,
      origin: { y: 0.75 },
      colors: ['#10b981', '#34d399', '#6ee7b7', '#8b5cf6'],
      ticks: 120,
      gravity: 1.1,
      scalar: 0.8,
      zIndex: 9999,
    });
  } else {
    // Standard burst
    confetti({
      particleCount: 75,
      spread: 70,
      origin: { y: 0.65 },
      colors: brandColors,
      zIndex: 9999,
    });
  }
};
