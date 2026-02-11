import { useState, useCallback, forwardRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { GaslightingButtonProps } from './types';
import { stripConflictingProps } from './types';
import { useClickFlash } from './useClickFlash';

/**
 * GaslightingButton — Label starts as "Save." On click it briefly flashes
 * "Delete" for 0.5 seconds, then reverts. A tooltip whispers: "I never said that."
 * It actually saves. It always saved. You imagined the rest.
 */
export const GaslightingButton = forwardRef<
	HTMLButtonElement,
	GaslightingButtonProps
>(
	(
		{
			children = 'Save',
			mood = 'normal',
			className = '',
			onClick,
			gaslightLabel = 'Delete',
			...rest
		},
		ref,
	) => {
		const [showGaslight, setShowGaslight] = useState(false);
		const [showTooltip, setShowTooltip] = useState(false);
		const safeRest = stripConflictingProps(rest);
		const { clicked, trigger } = useClickFlash();

		const flashDuration =
			mood === 'subtle' ? 300 : mood === 'extreme' ? 800 : 500;

		const handleClick = useCallback(
			(e: React.MouseEvent<HTMLButtonElement>) => {
				trigger();
				// Actually perform the save action
				onClick?.(e);

				// Gaslight: briefly show the wrong label
				setShowGaslight(true);
				setTimeout(() => {
					setShowGaslight(false);
					// Then deny everything
					setShowTooltip(true);
					setTimeout(() => setShowTooltip(false), 2000);
				}, flashDuration);
			},
			[onClick, flashDuration, trigger],
		);

		const displayLabel = showGaslight ? gaslightLabel : children;

		return (
			<div className="relative inline-block">
				<motion.button
					ref={ref}
					whileTap={{ scale: 0.98 }}
					className={`
            px-6 py-2.5 rounded-lg font-medium border
            focus:outline-none
            focus-visible:ring-2 focus-visible:ring-offset-2
            transition-colors transition-transform
            ${
				showGaslight
					? 'bg-red-500 text-white border-red-600 focus-visible:ring-red-400'
					: 'bg-blue-500 text-white border-blue-600 hover:bg-blue-600 focus-visible:ring-blue-400'
			}
            ${clicked ? 'outline outline-2 outline-offset-2 outline-white/30' : ''}
            ${className}
          `}
					onClick={handleClick}
					aria-label={
						typeof children === 'string'
							? children
							: 'Gaslighting button'
					}
					{...safeRest}
				>
					<AnimatePresence mode="wait">
						<motion.span
							key={showGaslight ? 'gaslight' : 'normal'}
							initial={{ opacity: 0, scale: 0.9 }}
							animate={{ opacity: 1, scale: 1 }}
							exit={{ opacity: 0, scale: 0.9 }}
							transition={{ duration: 0.1 }}
							className="inline-block"
						>
							{displayLabel}
						</motion.span>
					</AnimatePresence>
				</motion.button>

				{/* "I never said that." */}
				<AnimatePresence>
					{showTooltip && (
						<div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 z-10 pointer-events-none">
							<motion.div
								role="tooltip"
								initial={{ opacity: 0, y: 4 }}
								animate={{ opacity: 1, y: 0 }}
								exit={{ opacity: 0, y: 4 }}
								className="w-max max-w-[260px] text-center px-3 py-1.5 rounded-md text-xs
                         bg-gray-900 text-gray-100 shadow-lg italic"
							>
								I never said that.
								<div
									className="absolute left-1/2 -translate-x-1/2 top-full
                              w-2 h-2 bg-gray-900 rotate-45 -mt-1"
								/>
							</motion.div>
						</div>
					)}
				</AnimatePresence>
			</div>
		);
	},
);

GaslightingButton.displayName = 'GaslightingButton';
