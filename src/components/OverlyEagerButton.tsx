import { useState, forwardRef, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import type { EmotionalButtonProps, Mood } from './types';
import { stripConflictingProps } from './types';
import { useClickFlash } from './useClickFlash';

/**
 * OverlyEagerButton — Normal-sized button with a much larger invisible hitbox.
 * Grows or bounces excitedly as soon as the cursor enters the hitbox,
 * like a golden retriever spotting its owner at the door.
 */

const scaleValues: Record<Mood, number> = {
	subtle: 1.05,
	normal: 1.12,
	extreme: 1.25,
};

export const OverlyEagerButton = forwardRef<
	HTMLButtonElement,
	EmotionalButtonProps
>(
	(
		{
			children = 'Click',
			mood = 'normal',
			className = '',
			onClick,
			...rest
		},
		ref,
	) => {
		const [eager, setEager] = useState(false);
		const safeRest = stripConflictingProps(rest);
		const { clicked, trigger } = useClickFlash();

		const handleClick = useCallback(
			(e: React.MouseEvent<HTMLButtonElement>) => {
				trigger();
				onClick?.(e);
			},
			[onClick, trigger],
		);

		const displayLabel =
			eager && typeof children === 'string'
				? children.trim().toLowerCase() === 'click'
					? 'Click me! Please!'
					: `${children} me! Please!`
				: children;

		return (
			/* Large invisible hitbox */
			<div
				className="relative inline-flex items-center justify-center p-10"
				onMouseEnter={() => setEager(true)}
				onMouseLeave={() => setEager(false)}
			>
				<motion.button
					ref={ref}
					layout
					whileTap={{ scale: 0.97 }}
					animate={
						eager
							? {
									scale: [
										1,
										scaleValues[mood],
										1,
										scaleValues[mood],
									],
									transition: {
										repeat: Infinity,
										duration:
											mood === 'extreme' ? 0.35 : 0.6,
									},
								}
							: { scale: 1 }
					}
					className={`
            relative px-6 py-2.5 rounded-lg font-semibold
            bg-gray-100 text-gray-800 border border-gray-300
            hover:bg-gray-200 shadow-sm
            focus:outline-none
            focus-visible:ring-2 focus-visible:ring-gray-400 focus-visible:ring-offset-2
            transition-colors transition-transform
            ${clicked ? 'outline outline-2 outline-offset-2 outline-gray-500/40' : ''}
            ${className}
          `}
					onClick={handleClick}
					aria-label={
						typeof displayLabel === 'string'
							? displayLabel
							: 'Overly eager button'
					}
					{...safeRest}
				>
					<AnimatePresence mode="wait" initial={false}>
						<motion.span
							key={eager ? 'eager' : 'calm'}
							layout
							initial={{ opacity: 0, y: 3 }}
							animate={{ opacity: 1, y: 0 }}
							exit={{ opacity: 0, y: -3 }}
							transition={{ duration: 0.18 }}
							className="inline-block whitespace-nowrap"
						>
							{displayLabel}
						</motion.span>
					</AnimatePresence>
				</motion.button>
			</div>
		);
	},
);

OverlyEagerButton.displayName = 'OverlyEagerButton';
