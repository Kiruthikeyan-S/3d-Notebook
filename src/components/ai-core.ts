import { useMotionValue, type MotionValue } from "motion/react";
import { useEffect } from "react";

export type AIState =
  | "idle"
  | "listening"
  | "thinking"
  | "streaming"
  | "done"
  | "error";

export type AIAmplitude = number | MotionValue<number>;

export function useAmplitudeValue(amplitude?: AIAmplitude): MotionValue<number> {
  const fallback = useMotionValue(0);

  useEffect(() => {
    if (typeof amplitude === "number") {
      fallback.set(amplitude);
    }
  }, [amplitude, fallback]);

  if (amplitude && typeof amplitude !== "number") {
    return amplitude;
  }

  return fallback;
}

export function useSimulatedAmplitude(state: AIState): MotionValue<number> {
  const amplitude = useMotionValue(0);

  useEffect(() => {
    if (state !== "listening" && state !== "streaming") {
      amplitude.set(0);
      return;
    }

    let frameId: number;
    let time = 0;

    const animate = () => {
      time += 0.08;
      // Generate natural audio wave simulation
      const val = (Math.sin(time) * 0.4 + Math.cos(time * 2.3) * 0.3 + 0.5) * 0.7;
      amplitude.set(Math.max(0, Math.min(1, val)));
      frameId = requestAnimationFrame(animate);
    };

    frameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frameId);
  }, [state, amplitude]);

  return amplitude;
}

export function getAIStateMotion(state: AIState) {
  switch (state) {
    case "error":
      return { saturation: 0.4 };
    case "thinking":
      return { saturation: 0.85 };
    case "done":
      return { saturation: 1.1 };
    default:
      return { saturation: 1 };
  }
}
