import { useState, useEffect, useRef, forwardRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { EmotionalButtonProps, Mood } from './types';
import { stripConflictingProps } from './types';
import { useClickFlash } from './useClickFlash';

/**
 * OverthinkingButton — Shows a loading spinner the instant you hover,
 * with cycling tooltips: "Considering all possibilities..." →
 * "But what if..." → "Have I thought of everything?"
 * Click works instantly. The overthinking is purely performative.
 */

const thoughts = [
	'Considering all possibilities...',
	'But what if...',
	'Have I thought of everything?',
];

const extremeThoughts = [
	'Considering all possibilities...',
	'But what if...',
	'Have I thought of everything?',
	"What if I'm wrong?",
	'Let me reconsider...',
	'Actually, never mind. Or should I?',
];

function getThoughts(mood: Mood) {
	if (mood === 'extreme') return extremeThoughts;
	if (mood === 'subtle') return thoughts.slice(0, 2);
	return thoughts;
}

export const OverthinkingButton = forwardRef<
	HTMLButtonElement,
	EmotionalButtonProps
>(
	(
		{
			children = 'Decide',
			mood = 'normal',
			className = '',
			onClick,
			...rest
		},
		ref,
	) => {
		const [hovered, setHovered] = useState(false);
		const [thoughtIndex, setThoughtIndex] = useState(0);
		const safeRest = stripConflictingProps(rest);
		const { clicked, trigger } = useClickFlash();
		const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
		const allThoughts = getThoughts(mood);

		const handleClick = useCallback(
			(e: React.MouseEvent<HTMLButtonElement>) => {
				trigger();
				onClick?.(e);
			},
			[onClick, trigger],
		);

		useEffect(() => {
			if (hovered) {
				setThoughtIndex(0);
				const speed = mood === 'extreme' ? 800 : 1200;
				intervalRef.current = setInterval(() => {
					setThoughtIndex((prev) => (prev + 1) % allThoughts.length);
				}, speed);
			} else {
				if (intervalRef.current) clearInterval(intervalRef.current);
			}

			return () => {
				if (intervalRef.current) clearInterval(intervalRef.current);
			};
		}, [hovered, mood, allThoughts.length]);

		return (
			<div className="relative inline-block">
				<motion.button
					ref={ref}
					whileTap={{ scale: 0.98 }}
					className={`
            relative px-6 py-2.5 rounded-lg font-medium
            bg-violet-500 text-white border border-violet-600
            hover:bg-violet-600
            focus:outline-none
            focus-visible:ring-2 focus-visible:ring-violet-400 focus-visible:ring-offset-2
            transition-colors transition-transform
            ${clicked ? 'outline outline-2 outline-offset-2 outline-violet-200/40' : ''}
            ${className}
          `}
					onMouseEnter={() => setHovered(true)}
					onMouseLeave={() => setHovered(false)}
					onClick={handleClick}
					aria-label={
						typeof children === 'string'
							? children
							: 'Overthinking button'
					}
					{...safeRest}
				>
					<span className="flex items-center gap-2">
						{/* Spinner shows immediately on hover */}
						{hovered && (
							<svg
								className="animate-spin h-4 w-4 text-white/80"
								viewBox="0 0 24 24"
								fill="none"
							>
								<circle
									className="opacity-25"
									cx="12"
									cy="12"
									r="10"
									stroke="currentColor"
									strokeWidth="4"
								/>
								<path
									className="opacity-75"
									fill="currentColor"
									d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
								/>
							</svg>
						)}
						{children}
					</span>
				</motion.button>

				{/* Cycling tooltip thoughts */}
				<AnimatePresence>
					{hovered && (
						<div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 z-10 pointer-events-none">
							<motion.div
								role="tooltip"
								initial={{ opacity: 0, y: 4 }}
								animate={{ opacity: 1, y: 0 }}
								exit={{ opacity: 0, y: 4 }}
								className="w-max max-w-[280px] text-center px-3 py-1.5 rounded-md text-xs
                         bg-violet-900 text-violet-100 shadow-lg"
							>
								<AnimatePresence mode="wait" initial={false}>
									<motion.span
										key={thoughtIndex}
										initial={{ opacity: 0 }}
										animate={{ opacity: 1 }}
										exit={{ opacity: 0 }}
										transition={{ duration: 0.2 }}
										className="inline-block"
									>
										{allThoughts[thoughtIndex]}
									</motion.span>
								</AnimatePresence>
								<div
									className="absolute left-1/2 -translate-x-1/2 top-full
                              w-2 h-2 bg-violet-900 rotate-45 -mt-1"
								/>
							</motion.div>
						</div>
					)}
				</AnimatePresence>
			</div>
		);
	},
);

OverthinkingButton.displayName = 'OverthinkingButton';
