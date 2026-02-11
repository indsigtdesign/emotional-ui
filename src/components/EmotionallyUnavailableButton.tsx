import { useState, forwardRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import type { EmotionalButtonProps, Mood } from './types';
import { stripConflictingProps } from './types';
import { useClickFlash } from './useClickFlash';

/**
 * EmotionallyUnavailableButton — Always looks disabled (no explanation).
 * Has a larger invisible hitbox that shows cursor: not-allowed.
 * When you actually hover the button itself, cursor becomes pointer,
 * but the button subtly moves away. Total mixed signals.
 */

const avoidDistance: Record<Mood, number> = {
	subtle: 4,
	normal: 8,
	extreme: 16,
};

export const EmotionallyUnavailableButton = forwardRef<
	HTMLButtonElement,
	EmotionalButtonProps
>(
	(
		{
			children = 'Connect',
			mood = 'normal',
			className = '',
			onClick,
			...rest
		},
		ref,
	) => {
		const [offset, setOffset] = useState({ x: 0, y: 0 });
		const [inHitbox, setInHitbox] = useState(false);
		const safeRest = stripConflictingProps(rest);
		const { clicked, trigger } = useClickFlash();

		const handleMouseMove = useCallback(
			(e: React.MouseEvent<HTMLDivElement>) => {
				const btn = e.currentTarget.querySelector('button');
				if (!btn) return;
				const rect = btn.getBoundingClientRect();
				const cx = rect.left + rect.width / 2;
				const cy = rect.top + rect.height / 2;
				const dx = e.clientX - cx;
				const dy = e.clientY - cy;
				const dist = Math.sqrt(dx * dx + dy * dy);

				// Only avoid when cursor is close to the actual button
				if (dist < rect.width) {
					const d = avoidDistance[mood];
					setOffset({
						x: dx > 0 ? -d : d,
						y: dy > 0 ? -d : d,
					});
				}
			},
			[mood],
		);

		return (
			// Invisible hitbox — larger than the button, cursor: not-allowed
			<div
				className="relative inline-flex items-center justify-center p-8"
				style={{ cursor: inHitbox ? 'not-allowed' : 'default' }}
				onMouseEnter={() => setInHitbox(true)}
				onMouseLeave={() => {
					setInHitbox(false);
					setOffset({ x: 0, y: 0 });
				}}
				onMouseMove={handleMouseMove}
			>
				<motion.button
					ref={ref}
					whileTap={{ scale: 0.98 }}
					animate={{ x: offset.x, y: offset.y }}
					transition={{ type: 'spring', stiffness: 300, damping: 20 }}
					className={`
            relative px-6 py-2.5 rounded-lg font-medium
            bg-gray-200 text-gray-400 border border-gray-300
            cursor-pointer
            focus:outline-none
            focus-visible:ring-2 focus-visible:ring-gray-300 focus-visible:ring-offset-2
            transition-transform
            ${clicked ? 'outline outline-2 outline-offset-2 outline-gray-500/30' : ''}
            ${className}
          `}
					style={{ cursor: 'pointer' }}
					onClick={(e) => {
						trigger();
						onClick?.(e);
					}}
					aria-label={
						typeof children === 'string'
							? children
							: 'Emotionally unavailable button'
					}
					aria-disabled="true"
					{...safeRest}
				>
					{children}
				</motion.button>
			</div>
		);
	},
);

EmotionallyUnavailableButton.displayName = 'EmotionallyUnavailableButton';
