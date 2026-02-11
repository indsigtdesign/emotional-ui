# Emotional Buttons 🎭

A React component library where every button has feelings. Some of them need therapy.

Built with **React**, **TypeScript**, **Tailwind CSS**, and **Framer Motion**.

## Installation

```bash
npm install
npm run dev
```

## Components

### 1. 😰 AnxiousButton

Subtle shake animation on hover. A tooltip appears even though nobody asked for it.

```tsx
import { AnxiousButton } from './components';

<AnxiousButton mood="normal" onClick={() => console.log('clicked')}>
	Submit
</AnxiousButton>;
```

### 2. 🙂 PassiveAggressiveButton

Looks completely normal at first with "Click" as the label. Click it and the text changes to _"Sure. If you want."_ with a smooth transition, then reverts back after a moment. The emotional damage lingers.

```tsx
import { PassiveAggressiveButton } from './components';

<PassiveAggressiveButton onClick={() => console.log('fine')} />;
```

### 3. 🧊 EmotionallyUnavailableButton

Always looks disabled — no explanation given. Has a larger hitbox that shows `cursor: not-allowed`. Hover over the actual button and it moves away. Total mixed signals.

```tsx
import { EmotionallyUnavailableButton } from './components';

<EmotionallyUnavailableButton onClick={() => console.log('connected?')}>
	Connect
</EmotionallyUnavailableButton>;
```

### 4. 🐕 OverlyEagerButton

Normal-sized button with a much larger invisible hitbox. Shows "Click" by default, then smoothly expands to "Click me! Please!" when you hover. Bounces excitedly when the cursor enters the hitbox area.

```tsx
import { OverlyEagerButton } from './components';

<OverlyEagerButton mood="extreme" onClick={() => console.log('so happy!')}>
	Click me! Please!
</OverlyEagerButton>;
```

### 5. 🥺 PeoplePleasingButton

Cycles through multiple confirmation states before executing: _"Are you sure?" → "Really sure?" → "It's okay if not" → "Only if you want to"_ → finally runs.

```tsx
import { PeoplePleasingButton } from './components';

<PeoplePleasingButton
	onConfirm={() => console.log('finally!')}
	onClick={() => console.log('done')}
>
	Confirm
</PeoplePleasingButton>;
```

### 6. 😶‍🌫️ DissociatingButton

3-5 second delay after click. Label fades to 10% opacity while it stares out a window. 30% chance it forgets what it was supposed to do.

```tsx
import { DissociatingButton } from './components';

<DissociatingButton
	forgetChance={0.3}
	onClick={() => console.log('remembered!')}
>
	Process
</DissociatingButton>;
```

### 7. 🪞 GaslightingButton

Label starts as "Save." On click, briefly flashes "Delete" for 0.5 seconds, then reverts. Tooltip: _"I never said that."_ Actually saves.

```tsx
import { GaslightingButton } from './components';

<GaslightingButton
	gaslightLabel="Delete"
	onClick={() => console.log('saved (definitely saved)')}
>
	Save
</GaslightingButton>;
```

### 8. 🌀 OverthinkingButton

Loading spinner appears _immediately_ on hover. Cycling tooltips: _"Considering all possibilities…" → "But what if…" → "Have I thought of everything?"_ Click works instantly.

```tsx
import { OverthinkingButton } from './components';

<OverthinkingButton onClick={() => console.log('decided!')}>
	Decide
</OverthinkingButton>;
```

### 9. 🫣 ImposterSyndromeButton

Bold primary button styling. Starts with "Save" but on hover appends "Probably?" to become "Save Probably?" — showing its doubt. Includes a worried tooltip. Works perfectly despite its lack of confidence.

```tsx
import { ImposterSyndromeButton } from './components';

<ImposterSyndromeButton onClick={() => console.log('saved (sorry)')}>
	Probably Save?
</ImposterSyndromeButton>;
```

### 10. 🎭 IdentityCrisisButton

On hover, continuously morphs through UI design eras with smooth, overlapping crossfades — no blank gaps, just pure identity confusion:

| Era           | Visual                                         |
| ------------- | ---------------------------------------------- |
| Skeuomorphic  | Bevel, inner shadow, glossy gradient           |
| Flat          | Solid color, no shadows, sharp corners         |
| Material      | Soft shadow, elevation, ripple hint            |
| Glassmorphism | Backdrop-blur, translucent, frosted glass      |
| Brutalist     | Thick black border, system font, high contrast |
| Web 2.0       | Loud gradient, pill-shaped, reflection shine   |

Each transition includes subtle translate, scale, and blur effects to create a true era-to-era morph feel. Snaps back to default on mouse-leave like nothing happened.

```tsx
import { IdentityCrisisButton } from './components';

<IdentityCrisisButton
	cycleDuration={7500}
	onClick={() => console.log('clicked (whoever I am)')}
>
	Click Me
</IdentityCrisisButton>;
```

## Mood Prop

Every button accepts a `mood` prop to control intensity:

| Value     | Effect                                             |
| --------- | -------------------------------------------------- |
| `subtle`  | Toned-down animations and behaviors                |
| `normal`  | Default experience                                 |
| `extreme` | Over-the-top animations and more chaotic behaviors |

```tsx
<AnxiousButton mood="extreme">Submit</AnxiousButton>
```

## Props

All buttons extend `ButtonHTMLAttributes<HTMLButtonElement>` so you can pass any standard button prop:

```tsx
interface EmotionalButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
	children?: ReactNode;
	mood?: 'subtle' | 'normal' | 'extreme';
}
```

Specialized props:

- **PeoplePleasingButton**: `onConfirm?: () => void`
- **DissociatingButton**: `forgetChance?: number` (0-1, default 0.3)
- **GaslightingButton**: `gaslightLabel?: string` (default "Delete")
- **IdentityCrisisButton**: `cycleDuration?: number` (ms, default 7500)

## UX & Accessibility

All buttons include thoughtful interaction details:

- **Keyboard-friendly**: Focus rings appear for keyboard navigation (`focus-visible`) but not on mouse clicks
- **Click feedback**: Brief outline flash on every successful click so you know it registered
- **Smooth transitions**: Label changes and state transitions use Framer Motion for buttery animations
- **Centered tooltips**: Positioned correctly even during complex animations
- **Standard props**: Full support for `disabled`, `aria-label`, and all standard button attributes

## Tech Stack

- [React 19](https://react.dev)
- [TypeScript](https://www.typescriptlang.org)
- [Tailwind CSS 3](https://tailwindcss.com)
- [Framer Motion](https://www.framer.com/motion/)
- [Vite](https://vite.dev)

## License

MIT — use responsibly. Buttons have feelings too.
