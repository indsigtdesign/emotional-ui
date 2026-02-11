import { useState, forwardRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { EmotionalButtonProps } from './types';
import { stripConflictingProps } from './types';
import { useClickFlash } from './useClickFlash';

/**
 * ImposterSyndromeButton — Styled like a confident primary button,
 * but the label reads "Probably Save?" because deep down it's not
 * sure it deserves to be here. Works perfectly, then apologizes.
 */
export const ImposterSyndromeButton = forwardRef<
	HTMLButtonElement,
	EmotionalButtonProps
>(
	(
		{
			children = 'Save',
			mood = 'normal',
			className = '',
			onClick,
			...rest
		},
		ref,
	) => {
		const [showApology, setShowApology] = useState(false);
		const [hovered, setHovered] = useState(false);
		const safeRest = stripConflictingProps(rest);
		const { clicked, trigger } = useClickFlash();

		const apologyText =
			mood === 'extreme'
				? "I'm so sorry if that was wrong. I shouldn't even be a button."
				: mood === 'subtle'
					? 'Hope that was okay.'
					: 'Sorry if that was wrong.';

		const handleClick = useCallback(
			(e: React.MouseEvent<HTMLButtonElement>) => {
				trigger();
				onClick?.(e);
				setShowApology(true);
				setTimeout(() => setShowApology(false), 2500);
			},
			[onClick, trigger],
		);

		const label =
			hovered && typeof children === 'string'
				? `${children} Probably?`
				: children;

		return (
			<div className="relative inline-block">
				<motion.button
					ref={ref}
					whileTap={{ scale: 0.97 }}
					className={`
            px-8 py-3 rounded-lg font-bold text-lg
            bg-gradient-to-r from-blue-600 to-indigo-600
            text-white shadow-lg shadow-blue-500/25
            hover:shadow-xl hover:shadow-blue-500/30
            hover:from-blue-700 hover:to-indigo-700
            focus:outline-none
            focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2
            transition-all
            ${clicked ? 'outline outline-2 outline-offset-2 outline-blue-300/50' : ''}
            ${className}
          `}
					onClick={handleClick}
					onMouseEnter={() => setHovered(true)}
					onMouseLeave={() => setHovered(false)}
					aria-label={
						typeof label === 'string'
							? label
							: 'Imposter syndrome button'
					}
					{...safeRest}
				>
					{label}
				</motion.button>

				<AnimatePresence>
					{showApology && (
						<div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 z-10 pointer-events-none">
							<motion.div
								role="tooltip"
								initial={{ opacity: 0, y: 4 }}
								animate={{ opacity: 1, y: 0 }}
								exit={{ opacity: 0, y: 4 }}
								className="w-max max-w-[280px] text-center px-3 py-1.5 rounded-md text-xs
                         bg-blue-900 text-blue-100 shadow-lg"
							>
								{apologyText}
								<div
									className="absolute left-1/2 -translate-x-1/2 top-full
                              w-2 h-2 bg-blue-900 rotate-45 -mt-1"
								/>
							</motion.div>
						</div>
					)}
				</AnimatePresence>
			</div>
		);
	},
);

ImposterSyndromeButton.displayName = 'ImposterSyndromeButton';
