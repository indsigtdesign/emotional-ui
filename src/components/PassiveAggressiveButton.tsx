import { forwardRef, useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import type { EmotionalButtonProps } from './types';
import { useClickFlash } from './useClickFlash';

/**
 * PassiveAggressiveButton — Looks completely normal.
 * Click works. But the copy? "Sure. If you want."
 * The emotional damage is in the words, not the code.
 */
export const PassiveAggressiveButton = forwardRef<
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
		const [showMessage, setShowMessage] = useState(false);
		const { clicked, trigger } = useClickFlash();
		const timeoutRef = useRef<number | null>(null);

		useEffect(() => {
			return () => {
				if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
			};
		}, []);

		const handleClick = useCallback(
			(e: React.MouseEvent<HTMLButtonElement>) => {
				trigger();
				setShowMessage(true);
				if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
				const duration =
					mood === 'subtle' ? 900 : mood === 'extreme' ? 2400 : 1500;
				timeoutRef.current = window.setTimeout(
					() => setShowMessage(false),
					duration,
				);
				onClick?.(e);
			},
			[mood, onClick, trigger],
		);

		const moodStyles = {
			subtle: 'bg-gray-100 text-gray-500 border-gray-200 hover:bg-gray-200',
			normal: 'bg-gray-100 text-gray-600 border-gray-300 hover:bg-gray-200',
			extreme:
				'bg-gray-100 text-gray-400 border-gray-200 hover:bg-gray-50 italic',
		};

		const label = showMessage ? 'Sure. If you want.' : children;

		return (
			<button
				ref={ref}
				className={`
          px-6 py-2.5 rounded-lg font-medium border
          focus:outline-none
          focus-visible:ring-2 focus-visible:ring-gray-400 focus-visible:ring-offset-2
          transition-colors transition-transform active:scale-[0.98]
          ${clicked ? 'outline outline-2 outline-offset-2 outline-gray-500/40' : ''}
          ${moodStyles[mood]} ${className}
        `}
				onClick={handleClick}
				aria-label={
					typeof label === 'string'
						? label
						: 'Passive aggressive button'
				}
				{...rest}
			>
				<AnimatePresence mode="wait" initial={false}>
					<motion.span
						key={showMessage ? 'passive' : 'normal'}
						initial={{ opacity: 0, y: 3 }}
						animate={{ opacity: 1, y: 0 }}
						exit={{ opacity: 0, y: -3 }}
						transition={{ duration: 0.16 }}
						className="inline-block"
					>
						{label}
					</motion.span>
				</AnimatePresence>
			</button>
		);
	},
);

PassiveAggressiveButton.displayName = 'PassiveAggressiveButton';
