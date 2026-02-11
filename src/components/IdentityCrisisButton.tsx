import { useState, useEffect, useRef, forwardRef } from 'react';
import { motion, useMotionValue, animate } from 'framer-motion';
import type { IdentityCrisisButtonProps } from './types';
import { stripConflictingProps } from './types';
import { useClickFlash } from './useClickFlash';

/**
 * IdentityCrisisButton — On hover, morphs through UI design eras
 * in a loop: Skeuomorphic → Flat → Material → Glassmorphism → Brutalist → Web 2.0.
 * On mouse-leave, snaps back to default like nothing happened. Click works throughout.
 * Who am I? What era is this?
 */

type DesignEra =
	| 'default'
	| 'skeuomorphic'
	| 'flat'
	| 'material'
	| 'glassmorphism'
	| 'brutalist'
	| 'web2';

const eras: DesignEra[] = [
	'skeuomorphic',
	'flat',
	'material',
	'glassmorphism',
	'brutalist',
	'web2',
];

/** Returns inline styles for each design era */
function getEraStyles(era: DesignEra): {
	className: string;
	background: string;
	color: string;
	border: string;
	borderRadius: string;
	boxShadow: string;
	textShadow: string;
	fontSize: string;
	fontWeight: string;
	letterSpacing: string;
	textTransform: string;
} {
	switch (era) {
		case 'skeuomorphic':
			return {
				className: 'font-sans',
				background:
					'linear-gradient(to bottom, #e8e8e8 0%, #c8c8c8 50%, #b0b0b0 51%, #c0c0c0 100%)',
				color: '#333',
				border: '1px solid #888',
				borderRadius: '6px',
				boxShadow:
					'inset 0 1px 0 rgba(255,255,255,0.6), 0 2px 4px rgba(0,0,0,0.3), inset 0 -1px 2px rgba(0,0,0,0.2)',
				textShadow: '0 1px 0 rgba(255,255,255,0.5)',
				fontSize: '16px',
				fontWeight: '700',
				letterSpacing: '0px',
				textTransform: 'none',
			};

		case 'flat':
			return {
				className: 'font-sans',
				background: '#3498db',
				color: '#fff',
				border: 'none',
				borderRadius: '0',
				boxShadow: 'none',
				textShadow: 'none',
				fontSize: '16px',
				fontWeight: '600',
				letterSpacing: '0px',
				textTransform: 'none',
			};

		case 'material':
			return {
				className: 'font-sans',
				background: '#6200ee',
				color: '#fff',
				border: 'none',
				borderRadius: '4px',
				boxShadow:
					'0 2px 4px rgba(0,0,0,0.2), 0 4px 8px rgba(0,0,0,0.15)',
				textShadow: 'none',
				fontSize: '14px',
				fontWeight: '500',
				letterSpacing: '1px',
				textTransform: 'uppercase',
			};

		case 'glassmorphism':
			return {
				className: 'font-sans',
				background: 'rgba(255,255,255,0.15)',
				color: '#fff',
				border: '1px solid rgba(255,255,255,0.3)',
				borderRadius: '12px',
				boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
				textShadow: '0 1px 2px rgba(0,0,0,0.3)',
				fontSize: '16px',
				fontWeight: '500',
				letterSpacing: '0px',
				textTransform: 'none',
			};

		case 'brutalist':
			return {
				className: 'font-mono',
				background: '#ffff00',
				color: '#000',
				border: '3px solid #000',
				borderRadius: '0',
				boxShadow: '4px 4px 0 #000',
				textShadow: 'none',
				fontSize: '15px',
				fontWeight: '700',
				letterSpacing: '1px',
				textTransform: 'uppercase',
			};

		case 'web2':
			return {
				className: 'font-sans',
				background:
					'linear-gradient(to bottom, #69b3ff 0%, #2b7de9 100%)',
				color: '#fff',
				border: '1px solid #1a5fb4',
				borderRadius: '999px',
				boxShadow:
					'0 1px 0 rgba(255,255,255,0.3) inset, 0 2px 4px rgba(0,0,0,0.2)',
				textShadow: '0 -1px 0 rgba(0,0,0,0.3)',
				fontSize: '16px',
				fontWeight: '700',
				letterSpacing: '0px',
				textTransform: 'none',
			};

		default:
			return {
				className: 'font-sans',
				background: '#6366f1',
				color: '#fff',
				border: '1px solid #4f46e5',
				borderRadius: '8px',
				boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
				textShadow: 'none',
				fontSize: '16px',
				fontWeight: '500',
				letterSpacing: '0px',
				textTransform: 'none',
			};
	}
}

export const IdentityCrisisButton = forwardRef<
	HTMLButtonElement,
	IdentityCrisisButtonProps
>(
	(
		{
			children = 'Click Me',
			mood = 'normal',
			className = '',
			onClick,
			cycleDuration = 6000,
			...rest
		},
		ref,
	) => {
		const [currentEra, setCurrentEra] = useState<DesignEra>('default');
		const [hovered, setHovered] = useState(false);
		const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
		const indexRef = useRef(0);
		const { clicked, trigger } = useClickFlash();
		const safeRest = stripConflictingProps(rest);

		const speed =
			mood === 'subtle'
				? cycleDuration * 1.35
				: mood === 'extreme'
					? cycleDuration * 0.55
					: cycleDuration;

		// Each era gets equal time
		const eraInterval = speed / eras.length;

		useEffect(() => {
			if (hovered) {
				if (intervalRef.current) clearInterval(intervalRef.current);
				indexRef.current = 0;
				setCurrentEra(eras[0]);

				intervalRef.current = setInterval(() => {
					indexRef.current = (indexRef.current + 1) % eras.length;
					setCurrentEra(eras[indexRef.current]);
				}, eraInterval);
			} else {
				if (intervalRef.current) clearInterval(intervalRef.current);
				setCurrentEra('default');
			}

			return () => {
				if (intervalRef.current) clearInterval(intervalRef.current);
			};
		}, [hovered, eraInterval]);

		const currentStyles = getEraStyles(currentEra);

		// For glassmorphism we need a colored background behind it
		const needsBackdrop = currentEra === 'glassmorphism';

		return (
			<div
				className="relative inline-block"
				style={
					needsBackdrop
						? {
								background:
									'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
								borderRadius: '14px',
								padding: '2px',
							}
						: undefined
				}
			>
				<motion.button
					ref={ref}
					className={`
            relative px-6 py-2.5 overflow-hidden
            focus:outline-none
            focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:ring-offset-2
            transition-transform active:scale-[0.98]
            ${clicked ? 'outline outline-2 outline-offset-2 outline-indigo-300/50' : ''}
            ${currentStyles.className} ${className}
          `}
					style={{
						minWidth: '140px',
					}}
					animate={{
						background: currentStyles.background,
						color: currentStyles.color,
						border: currentStyles.border,
						borderRadius: currentStyles.borderRadius,
						boxShadow: currentStyles.boxShadow,
						textShadow: currentStyles.textShadow,
					}}
					transition={{
						duration: 0.8,
						ease: [0.4, 0, 0.2, 1], // Custom easing for smooth morph
					}}
					onMouseEnter={() => setHovered(true)}
					onMouseLeave={() => setHovered(false)}
					onClick={(e) => {
						trigger();
						onClick?.(e);
					}}
					aria-label={
						typeof children === 'string'
							? children
							: 'Identity crisis button'
					}
					{...safeRest}
				>
					{/* Decorative elements for specific eras */}
					{currentEra === 'skeuomorphic' && (
						<motion.span
							className="absolute inset-x-0 top-0 h-1/2 pointer-events-none"
							style={{
								background:
									'linear-gradient(to bottom, rgba(255,255,255,0.4), rgba(255,255,255,0))',
								borderRadius: '6px 6px 0 0',
							}}
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							exit={{ opacity: 0 }}
							transition={{ duration: 0.6 }}
						/>
					)}

					{currentEra === 'web2' && (
						<motion.span
							className="absolute top-0 left-0 w-full h-1/2 pointer-events-none"
							style={{
								background:
									'linear-gradient(to bottom, rgba(255,255,255,0.35), rgba(255,255,255,0))',
								borderRadius: '999px 999px 0 0',
							}}
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							exit={{ opacity: 0 }}
							transition={{ duration: 0.6 }}
						/>
					)}

					{currentEra === 'material' && (
						<motion.span
							className="absolute inset-0 pointer-events-none"
							style={{
								background:
									'radial-gradient(circle at center, rgba(255,255,255,0.15) 0%, transparent 70%)',
							}}
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							exit={{ opacity: 0 }}
							transition={{ duration: 0.6 }}
						/>
					)}

					{/* Text with morph */}
					<motion.span
						className="relative z-10"
						animate={{
							fontSize: currentStyles.fontSize,
							fontWeight: currentStyles.fontWeight,
							letterSpacing: currentStyles.letterSpacing,
							textTransform: currentStyles.textTransform as any,
						}}
						transition={{
							duration: 0.8,
							ease: [0.4, 0, 0.2, 1],
						}}
					>
						{children}
					</motion.span>
				</motion.button>
			</div>
		);
	},
);

IdentityCrisisButton.displayName = 'IdentityCrisisButton';
