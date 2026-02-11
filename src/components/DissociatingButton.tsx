import { useState, useCallback, forwardRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { DissociatingButtonProps, Mood } from './types';
import { stripConflictingProps } from './types';
import { useClickFlash } from './useClickFlash';

/**
 * DissociatingButton — After clicking, stares out the window for 3-5 seconds.
 * The label fades to near-invisibility while it "processes."
 * 30% chance it forgets what it was supposed to do entirely.
 */

function getDelay(mood: Mood): number {
	const base = 3000 + Math.random() * 2000; // 3-5s
	if (mood === 'subtle') return base * 0.5;
	if (mood === 'extreme') return base * 1.5;
	return base;
}

export const DissociatingButton = forwardRef<
	HTMLButtonElement,
	DissociatingButtonProps
>(
	(
		{
			children = 'Process',
			mood = 'normal',
			className = '',
			onClick,
			forgetChance = 0.3,
			...rest
		},
		ref,
	) => {
		const [state, setState] = useState<'idle' | 'loading' | 'forgot'>(
			'idle',
		);
		const safeRest = stripConflictingProps(rest);
		const { clicked, trigger } = useClickFlash();

		const handleClick = useCallback(
			(e: React.MouseEvent<HTMLButtonElement>) => {
				if (state !== 'idle') return;
				trigger();
				setState('loading');

				const delay = getDelay(mood);
				const willForget =
					Math.random() < (mood === 'extreme' ? 0.6 : forgetChance);

				setTimeout(() => {
					if (willForget) {
						setState('forgot');
						setTimeout(() => setState('idle'), 2000);
					} else {
						onClick?.(e);
						setState('idle');
					}
				}, delay);
			},
			[state, mood, forgetChance, onClick, trigger],
		);

		return (
			<div className="relative inline-block">
				<motion.button
					ref={ref}
					whileTap={{ scale: 0.98 }}
					className={`
            relative px-6 py-2.5 rounded-lg font-medium
            bg-slate-600 text-white border border-slate-700
            hover:bg-slate-700 disabled:cursor-wait
            focus:outline-none
            focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2
            transition-[colors,transform]
            ${clicked ? 'outline outline-2 outline-offset-2 outline-slate-200/30' : ''}
            ${className}
          `}
					disabled={state !== 'idle'}
					onClick={handleClick}
					aria-label={
						typeof children === 'string'
							? children
							: 'Dissociating button'
					}
					aria-busy={state === 'loading'}
					{...safeRest}
				>
					<motion.span
						animate={{
							opacity: state === 'loading' ? 0.1 : 1,
						}}
						transition={{ duration: 1.5 }}
						className="inline-block"
					>
						{state === 'forgot' ? '...what was I doing?' : children}
					</motion.span>

					{/* Loading spinner */}
					{state === 'loading' && (
						<span className="absolute inset-0 flex items-center justify-center">
							<svg
								className="animate-spin h-5 w-5 text-white/60"
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
						</span>
					)}
				</motion.button>

				{/* Tooltip during loading */}
				<AnimatePresence>
					{state === 'loading' && (
						<div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 z-10 pointer-events-none">
							<motion.div
								role="tooltip"
								initial={{ opacity: 0, y: 4 }}
								animate={{ opacity: 1, y: 0 }}
								exit={{ opacity: 0, y: 4 }}
								className="w-max max-w-[260px] text-center px-3 py-1.5 rounded-md text-xs
                         bg-slate-800 text-slate-200 shadow-lg"
							>
								...where am I?
								<div
									className="absolute left-1/2 -translate-x-1/2 top-full
                              w-2 h-2 bg-slate-800 rotate-45 -mt-1"
								/>
							</motion.div>
						</div>
					)}
				</AnimatePresence>
			</div>
		);
	},
);

DissociatingButton.displayName = 'DissociatingButton';
