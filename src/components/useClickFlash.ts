import { useCallback, useRef, useState } from 'react';

/**
 * Shared click feedback for Emotional Buttons.
 * We use a short-lived outline flash so it's obvious a click landed,
 * without relying on persistent focus rings.
 */
export function useClickFlash(durationMs: number = 220) {
	const [clicked, setClicked] = useState(false);
	const timeoutRef = useRef<number | null>(null);

	const trigger = useCallback(() => {
		setClicked(true);
		if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
		timeoutRef.current = window.setTimeout(
			() => setClicked(false),
			durationMs,
		);
	}, [durationMs]);

	return { clicked, trigger };
}
