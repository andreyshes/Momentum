"use client";

import { useState } from "react";
import Joyride, { CallBackProps, STATUS, Step } from "react-joyride";

interface OnboardingTourProps {
	onFinish?: () => void;
}

export default function OnboardingTour({ onFinish }: OnboardingTourProps) {
	const [runTour, setRunTour] = useState(true);

	const steps: Step[] = [
		{
			target: '[data-tour="create-habit"]',
			content: "✨ Create your first habit to get started!",
			placement: "bottom",
		},
		{
			target: '[data-tour="track-progress"]',
			content: "📅 Track your daily progress and view streaks here.",
			placement: "top",
		},
		{
			target: '[data-tour="analytics"]',
			content: "📊 Dive into analytics to stay motivated!",
			placement: "top",
		},
		{
			target: '[data-tour="dark-mode"]',
			content: "🌗 Toggle dark mode for a comfortable experience.",
			placement: "bottom",
		},
	];

	const handleCallback = (data: CallBackProps) => {
		if (data.status === STATUS.FINISHED || data.status === STATUS.SKIPPED) {
			setRunTour(false);
			localStorage.setItem("tourDone", "1"); // optional persistence
			onFinish?.();
		}
	};

	return (
		<Joyride
			steps={steps}
			run={runTour}
			continuous
			showSkipButton
			disableScrolling
			callback={handleCallback}
			styles={{
				options: {
					zIndex: 10000,
					primaryColor: "#a855f7",
					textColor: "var(--foreground)",
					backgroundColor: "var(--background)",
				},
			}}
		/>
	);
}
