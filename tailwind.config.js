/** @type {import('tailwindcss').Config} */
export default {
	content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
	theme: {
		extend: {
			keyframes: {
				shake: {
					'0%, 100%': { transform: 'translateX(0)' },
					'10%, 30%, 50%, 70%, 90%': {
						transform: 'translateX(-2px)',
					},
					'20%, 40%, 60%, 80%': { transform: 'translateX(2px)' },
				},
				'shake-extreme': {
					'0%, 100%': { transform: 'translateX(0)' },
					'10%, 30%, 50%, 70%, 90%': {
						transform: 'translateX(-4px) rotate(-1deg)',
					},
					'20%, 40%, 60%, 80%': {
						transform: 'translateX(4px) rotate(1deg)',
					},
				},
				bounce_eager: {
					'0%, 100%': { transform: 'scale(1)' },
					'50%': { transform: 'scale(1.15)' },
				},
				bounce_eager_extreme: {
					'0%, 100%': { transform: 'scale(1)' },
					'25%': { transform: 'scale(1.25) rotate(-2deg)' },
					'75%': { transform: 'scale(1.25) rotate(2deg)' },
				},
				ripple: {
					'0%': { transform: 'scale(0)', opacity: '0.6' },
					'100%': { transform: 'scale(4)', opacity: '0' },
				},
				'glossy-shine': {
					'0%': { backgroundPosition: '-200% 0' },
					'100%': { backgroundPosition: '200% 0' },
				},
			},
			animation: {
				shake: 'shake 0.5s ease-in-out infinite',
				'shake-extreme': 'shake-extreme 0.3s ease-in-out infinite',
				bounce_eager: 'bounce_eager 0.6s ease-in-out infinite',
				bounce_eager_extreme:
					'bounce_eager_extreme 0.4s ease-in-out infinite',
				ripple: 'ripple 0.6s linear',
				'glossy-shine': 'glossy-shine 2s ease-in-out infinite',
			},
		},
	},
	plugins: [],
};
