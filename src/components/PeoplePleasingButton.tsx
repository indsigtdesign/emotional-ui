import { useState, useCallback, forwardRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { PeoplePleasingButtonProps, Mood } from './types';
import { stripConflictingProps } from './types';
import { useClickFlash } from './useClickFlash';

/**
 * PeoplePleasingButton — Cycles through multiple confirmation states
 * before finally executing the action, because it wants to make sure
 * you're *really* sure and not just being polite.
 */

const confirmationStages = [
	'Are you sure?',
	'Really sure?',
	"It's okay if not",
	'Only if you want to',
];

const extremeStages = [
	'Are you sure?',
	'Really sure?',
	"It's okay if not",
	'Only if you want to',
	"I don't want to be a burden",
	'Last chance to back out...',
];

function getStages(mood: Mood) {
	if (mood === 'subtle') return confirmationStages.slice(0, 2);
	if (mood === 'extreme') return extremeStages;
	return confirmationStages;
}

export const PeoplePleasingButton = forwardRef<
	HTMLButtonElement,
	PeoplePleasingButtonProps
>(
	(
		{
			children = 'Confirm',
			mood = 'normal',
			className = '',
			onClick,
			onConfirm,
			...rest
		},
		ref,
	) => {
		const [clickCount, setClickCount] = useState(0);
		const stages = getStages(mood);
		const safeRest = stripConflictingProps(rest);
		const { clicked, trigger } = useClickFlash();
		const isConfirming = clickCount > 0 && clickCount <= stages.length;
		const label = isConfirming ? stages[clickCount - 1] : children;

		const handleClick = useCallback(
			(e: React.MouseEvent<HTMLButtonElement>) => {
				trigger();
				const next = clickCount + 1;

				if (next > stages.length) {
					// Finally execute
					onClick?.(e);
					onConfirm?.();
					setClickCount(0);
				} else {
					setClickCount(next);
				}
			},
			[clickCount, stages.length, onClick, onConfirm, trigger],
		);

		return (
			<div className="relative inline-block">
				<motion.button
					ref={ref}
					whileTap={{ scale: 0.98 }}
					className={`
            px-6 py-2.5 rounded-lg font-medium border
            transition-[colors,transform] focus:outline-none
            focus-visible:ring-2 focus-visible:ring-offset-2
            ${
				isConfirming
					? 'bg-pink-100 text-pink-700 border-pink-300 focus-visible:ring-pink-400'
					: 'bg-indigo-500 text-white border-indigo-600 hover:bg-indigo-600 focus-visible:ring-indigo-400'
			}
            ${clicked ? 'outline outline-2 outline-offset-2 outline-pink-400/30' : ''}
            ${className}
          `}
					onClick={handleClick}
					aria-label={
						typeof label === 'string'
							? label
							: 'People pleasing button'
					}
					{...safeRest}
				>
					<AnimatePresence mode="wait">
						<motion.span
							key={clickCount}
							initial={{ opacity: 0, y: 6 }}
							animate={{ opacity: 1, y: 0 }}
							exit={{ opacity: 0, y: -6 }}
							transition={{ duration: 0.15 }}
							className="inline-block"
						>
							{label}
						</motion.span>
					</AnimatePresence>
				</motion.button>

				{/* Progress dots */}
				{isConfirming && (
					<div className="flex gap-1 justify-center mt-1.5">
						{stages.map((_, i) => (
							<div
								key={i}
								className={`w-1.5 h-1.5 rounded-full transition-colors ${
									i < clickCount
										? 'bg-pink-500'
										: 'bg-pink-200'
								}`}
							/>
						))}
					</div>
				)}
			</div>
		);
	},
);

PeoplePleasingButton.displayName = 'PeoplePleasingButton';
