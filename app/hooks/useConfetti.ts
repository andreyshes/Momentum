import { useCallback } from "react";
import confetti, { Options } from "canvas-confetti";

export const useConfetti = () => {
	const celebrate = useCallback(() => {
		const count = 200;
		const defaults: Options = {
			origin: { y: 0.7 },
			zIndex: 9999,
		};

		function fire(particleRatio: number, opts: Options) {
			confetti({
				...defaults,
				...opts,
				particleCount: Math.floor(count * particleRatio),
			});
		}

		// Multiple bursts with different colors and directions
		fire(0.25, {
			spread: 26,
			startVelocity: 55,
			colors: [
				"hsl(var(--primary))",
				"hsl(var(--secondary))",
				"hsl(var(--accent))",
			],
		});

		fire(0.2, {
			spread: 60,
			colors: ["hsl(var(--success))", "hsl(var(--warning))"],
		});

		fire(0.35, {
			spread: 100,
			decay: 0.91,
			scalar: 0.8,
			colors: ["hsl(var(--primary-glow))", "hsl(var(--secondary-glow))"],
		});

		fire(0.1, {
			spread: 120,
			startVelocity: 25,
			decay: 0.92,
			scalar: 1.2,
			colors: ["hsl(var(--accent-glow))"],
		});

		fire(0.1, {
			spread: 120,
			startVelocity: 45,
			colors: ["hsl(var(--success))", "hsl(var(--primary))"],
		});
	}, []);

	const celebrateMilestone = useCallback(
		(milestone: string) => {
			celebrate();

			if ("Notification" in window && Notification.permission === "granted") {
				new Notification("🎉 Milestone Achieved!", {
					body: milestone,
					icon: "/favicon.ico",
				});
			}
		},
		[celebrate]
	);

	return { celebrate, celebrateMilestone };
};
