import { ButtonHTMLAttributes, ReactNode } from 'react';

/**
 * Mood intensity levels for all emotional buttons.
 * - subtle: Toned-down animations and behaviors
 * - normal: Default experience
 * - extreme: Over-the-top animations and behaviors
 */
export type Mood = 'subtle' | 'normal' | 'extreme';

/**
 * Props that conflict between React's ButtonHTMLAttributes and
 * Framer Motion's HTMLMotionProps. We strip these before spreading
 * onto motion.button elements.
 */
const MOTION_CONFLICTING = [
  'onDrag', 'onDragStart', 'onDragEnd', 'onDragOver',
  'onAnimationStart', 'onAnimationEnd',
] as const;

/** Strips React drag/animation handlers that conflict with Framer Motion */
export function stripConflictingProps<T extends Record<string, unknown>>(
  props: T
): Omit<T, (typeof MOTION_CONFLICTING)[number]> {
  const clean = { ...props };
  for (const key of MOTION_CONFLICTING) {
    delete (clean as Record<string, unknown>)[key];
  }
  return clean as Omit<T, (typeof MOTION_CONFLICTING)[number]>;
}

/**
 * Base props shared by every Emotional Button variant.
 * Extends standard HTML button attributes so consumers can pass
 * onClick, disabled, className, aria-*, etc.
 */
export interface EmotionalButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Content rendered inside the button */
  children?: ReactNode;
  /** Adjusts the intensity of the emotional behavior */
  mood?: Mood;
}

/**
 * Props specific to the PeoplePleasingButton, which cycles through
 * confirmation states before finally executing the action.
 */
export interface PeoplePleasingButtonProps extends EmotionalButtonProps {
  /** Callback fired only after the user confirms through all states */
  onConfirm?: () => void;
}

/**
 * Props specific to the DissociatingButton, which may or may not
 * complete the action after a random delay.
 */
export interface DissociatingButtonProps extends EmotionalButtonProps {
  /** Probability (0-1) that the button "forgets" to complete. Default 0.3 */
  forgetChance?: number;
}

/**
 * Props specific to the GaslightingButton, which briefly shows a
 * different label before denying it ever changed.
 */
export interface GaslightingButtonProps extends EmotionalButtonProps {
  /** The label the button briefly flashes (default: "Delete") */
  gaslightLabel?: string;
}

/**
 * Props for the IdentityCrisisButton, which morphs through design eras.
 */
export interface IdentityCrisisButtonProps extends EmotionalButtonProps {
  /** Duration in ms for one full cycle through all eras (default: 1200) */
  cycleDuration?: number;
}
