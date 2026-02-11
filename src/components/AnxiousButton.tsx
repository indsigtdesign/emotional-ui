import { useState, forwardRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { EmotionalButtonProps, Mood } from './types';
import { stripConflictingProps } from './types';
import { useClickFlash } from './useClickFlash';

/**
 * AnxiousButton — Subtle shake animation on hover.
 * A tooltip appears uninvited, asking "Are you sure you want to do this?"
 * because anxiety never waits for an invitation.
 */

const shakeVariants: Record<Mood, { x: number[]; rotate?: number[] }> = {
	subtle: { x: [0, -1, 1, -1, 0] },
	normal: { x: [0, -2, 2, -2, 2, 0] },
	extreme: { x: [0, -4, 4, -4, 4, -2, 2, 0], rotate: [0, -1, 1, -1, 1, 0] },
};

export const AnxiousButton = forwardRef<
	HTMLButtonElement,
	EmotionalButtonProps
>(
	(
		{
			children = 'Submit',
			mood = 'normal',
			className = '',
			onClick,
			...rest
		},
		ref,
	) => {
		const [hovered, setHovered] = useState(false);
		const safeRest = stripConflictingProps(rest);
		const { clicked, trigger } = useClickFlash();

		const handleClick = useCallback(
			(e: React.MouseEvent<HTMLButtonElement>) => {
				trigger();
				onClick?.(e);
			},
			[onClick, trigger],
		);

		return (
			<motion.div
				className="relative inline-block"
				onMouseEnter={() => setHovered(true)}
				onMouseLeave={() => setHovered(false)}
				animate={
					hovered
						? {
								...shakeVariants[mood],
								transition: {
									repeat: Infinity,
									duration: mood === 'extreme' ? 0.3 : 0.5,
								},
							}
						: { x: 0, rotate: 0 }
				}
			>
				<motion.button
					ref={ref}
					whileTap={{ scale: 0.98 }}
					className={`
            relative px-6 py-2.5 rounded-lg font-medium
            bg-amber-100 text-amber-900 border border-amber-300
            hover:bg-amber-200 focus:outline-none
            focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-2
            transition-[colors,transform]
            ${clicked ? 'outline outline-2 outline-offset-2 outline-amber-500/50' : ''}
            ${className}
          `}
					onClick={handleClick}
					aria-label={
						typeof children === 'string'
							? children
							: 'Anxious button'
					}
					{...safeRest}
				>
					{children}
				</motion.button>

				{/* Tooltip that appears on hover — nobody asked for it */}
				<AnimatePresence>
					{hovered && (
						<div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 z-10 pointer-events-none">
							<motion.div
								role="tooltip"
								initial={{ opacity: 0, y: 4 }}
								animate={{ opacity: 1, y: 0 }}
								exit={{ opacity: 0, y: 4 }}
								transition={{ duration: 0.15 }}
								className="w-max max-w-[280px] text-center px-3 py-1.5 rounded-md text-xs
                         bg-amber-900 text-amber-50 shadow-lg"
							>
								Are you sure you want to do this? I'm just
								asking...
								<div
									className="absolute left-1/2 -translate-x-1/2 top-full
                              w-2 h-2 bg-amber-900 rotate-45 -mt-1"
								/>
							</motion.div>
						</div>
					)}
				</AnimatePresence>
			</motion.div>
		);
	},
);

AnxiousButton.displayName = 'AnxiousButton';
