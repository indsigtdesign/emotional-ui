import { useState } from 'react';
import {
	AnxiousButton,
	PassiveAggressiveButton,
	EmotionallyUnavailableButton,
	OverlyEagerButton,
	PeoplePleasingButton,
	DissociatingButton,
	GaslightingButton,
	OverthinkingButton,
	ImposterSyndromeButton,
	IdentityCrisisButton,
} from './components';
import type { Mood } from './components';

/** Demo card wrapper */
function Card({
	title,
	description,
	children,
}: {
	title: string;
	description: string;
	children: React.ReactNode;
}) {
	return (
		<div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-6 flex flex-col gap-4 hover:border-white/20 transition-colors">
			<div>
				<h2 className="text-lg font-bold text-white">{title}</h2>
				<p className="text-sm text-gray-400 mt-1">{description}</p>
			</div>
			<div className="flex items-center justify-center min-h-[100px]">
				{children}
			</div>
		</div>
	);
}

export default function App() {
	const [mood, setMood] = useState<Mood>('normal');

	const log = (name: string) => () => console.log(`✅ ${name} clicked!`);

	return (
		<div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-indigo-950 text-white">
			{/* Header */}
			<header className="border-b border-white/10 backdrop-blur-sm">
				<div className="max-w-6xl mx-auto px-6 py-8">
					<h1 className="text-4xl font-extrabold tracking-tight">
						Emotional Buttons
					</h1>
					<p className="text-gray-400 mt-2 text-lg">
						A component library where every button has feelings.
						<br />
						<span className="text-gray-500">
							Some of them need therapy.
						</span>
					</p>

					{/* Mood selector */}
					<div className="flex items-center gap-3 mt-6">
						<span className="text-sm text-gray-400">
							Mood intensity:
						</span>
						{(['subtle', 'normal', 'extreme'] as Mood[]).map(
							(m) => (
								<button
									key={m}
									onClick={() => setMood(m)}
									className={`
                  px-3 py-1 rounded-full text-sm font-medium transition-all
                  ${
						mood === m
							? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/20'
							: 'bg-white/10 text-gray-300 hover:bg-white/15'
					}
                `}
								>
									{m}
								</button>
							),
						)}
					</div>
				</div>
			</header>

			{/* Button grid */}
			<main className="max-w-6xl mx-auto px-6 py-10">
				<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
					{/* 1. Anxious */}
					<Card
						title="😰 Anxious"
						description="Trembles when you look at it. Offers unsolicited reassurance."
					>
						<AnxiousButton
							mood={mood}
							onClick={log('AnxiousButton')}
						>
							Submit
						</AnxiousButton>
					</Card>

					{/* 2. Passive-Aggressive */}
					<Card
						title="🙂 Passive-Aggressive"
						description="Works perfectly fine. The contempt is in the subtext."
					>
						<PassiveAggressiveButton
							mood={mood}
							onClick={log('PassiveAggressiveButton')}
						/>
					</Card>

					{/* 3. Emotionally Unavailable */}
					<Card
						title="🧊 Emotionally Unavailable"
						description="Says it's disabled. Moves away when you get close. It's complicated."
					>
						<EmotionallyUnavailableButton
							mood={mood}
							onClick={log('EmotionallyUnavailableButton')}
						>
							Connect
						</EmotionallyUnavailableButton>
					</Card>

					{/* 4. Overly Eager */}
					<Card
						title="🐕 Overly Eager"
						description="Detects your cursor from across the room. Zero chill."
					>
						<OverlyEagerButton
							mood={mood}
							onClick={log('OverlyEagerButton')}
						>
							Click
						</OverlyEagerButton>
					</Card>

					{/* 5. People-Pleasing */}
					<Card
						title="🥺 People-Pleasing"
						description="Needs constant reassurance. Click 5 times. It's fine. Really."
					>
						<PeoplePleasingButton
							mood={mood}
							onClick={log('PeoplePleasingButton')}
							onConfirm={() =>
								console.log(
									'🎉 People-pleasing finally confirmed!',
								)
							}
						>
							Confirm
						</PeoplePleasingButton>
					</Card>

					{/* 6. Dissociating */}
					<Card
						title="😶‍🌫️ Dissociating"
						description="Stares into the middle distance for 3-5 seconds. Sometimes forgets why it's here."
					>
						<DissociatingButton
							mood={mood}
							onClick={log('DissociatingButton')}
						>
							Process
						</DissociatingButton>
					</Card>

					{/* 7. Gaslighting */}
					<Card
						title="🪞 Gaslighting"
						description='Swears it said "Save." You saw "Delete" for a second. You must be crazy.'
					>
						<GaslightingButton
							mood={mood}
							onClick={log('GaslightingButton (saved)')}
						>
							Save
						</GaslightingButton>
					</Card>

					{/* 8. Overthinking */}
					<Card
						title="🌀 Overthinking"
						description="Spirals through every possible outcome. Works instantly anyway."
					>
						<OverthinkingButton
							mood={mood}
							onClick={log('OverthinkingButton')}
						>
							Decide
						</OverthinkingButton>
					</Card>

					{/* 9. Imposter Syndrome */}
					<Card
						title="🫣 Imposter Syndrome"
						description='Styled like a primary CTA. Labeled "Probably Save?" Apologizes immediately.'
					>
						<ImposterSyndromeButton
							mood={mood}
							onClick={log('ImposterSyndromeButton')}
						>
							Save
						</ImposterSyndromeButton>
					</Card>

					{/* 10. Identity Crisis */}
					<Card
						title="🎭 Identity Crisis"
						description="Can't decide who it wants to be. Cycles through every design trend since 2007."
					>
						<IdentityCrisisButton
							mood={mood}
							onClick={log('IdentityCrisisButton')}
						>
							Click Me
						</IdentityCrisisButton>
					</Card>
				</div>

				<footer className="mt-16 pb-10 text-center text-gray-500 text-sm">
					<p>
						Built with React, TypeScript, Tailwind CSS & Framer
						Motion.
					</p>
					<p className="mt-1">
						No buttons were harmed in the making of this demo.
						<br />
						<span className="text-gray-600">
							(But a few were emotionally scarred.)
						</span>
					</p>
				</footer>
			</main>
		</div>
	);
}
