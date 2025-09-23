"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { HabitEntry, Habit } from "@/app/types/habits";
import { useConfetti } from "@/app/hooks/useConfetti";

interface HeatmapCalendarProps {
	habit: Habit;
	entries: HabitEntry[];
	className?: string;
}

export const HeatmapCalendar = ({
	habit,
	entries,
	className = "",
}: HeatmapCalendarProps) => {
	const { celebrateMilestone } = useConfetti();
	const [highlightedEntry, setHighlightedEntry] = useState<string | null>(null);

	// Highlight newest entry
	useEffect(() => {
		const habitEntries = entries.filter((e) => e.habitId === habit.id);
		if (!habitEntries.length) return;
		const latestEntry = habitEntries[habitEntries.length - 1];
		setHighlightedEntry(latestEntry.id);
		const timer = setTimeout(() => setHighlightedEntry(null), 800);
		return () => clearTimeout(timer);
	}, [entries, habit.id]);

	const completedDays = entries.filter(
		(e) => e.habitId === habit.id && e.completed
	).length;

	// Confetti milestones
	useEffect(() => {
		if (completedDays === 7) celebrateMilestone("7-day streak achieved! 🔥");
		else if (completedDays === 14) celebrateMilestone("14-day streak! 🚀");
		else if (completedDays === 30) celebrateMilestone("30-day milestone! 👑");
	}, [completedDays, celebrateMilestone]);

	// Last 30 days array
	const days: Date[] = [];
	const today = new Date();
	for (let i = 29; i >= 0; i--) {
		const d = new Date(today);
		d.setDate(d.getDate() - i);
		days.push(d);
	}

	// Determine completion intensity
	const getIntensity = (date: Date) => {
		const dateStr = date.toISOString().split("T")[0];
		const entry = entries.find(
			(e) => e.date === dateStr && e.habitId === habit.id
		);
		if (!entry || entry.value === 0) return 0;
		const pct = entry.value / habit.target;
		if (pct >= 1) return 4;
		if (pct >= 0.8) return 3;
		if (pct >= 0.5) return 2;
		return 1;
	};

	// Use CSS variables and fallback color accents for intensity
	const getIntensityColor = (intensity: number) => {
		// Base background respects :root and .dark --background
		const base = "bg-[color:var(--background)]";
		switch (intensity) {
			case 1:
				return `${base} bg-yellow-300`;
			case 2:
				return `${base} bg-blue-400`;
			case 3:
				return `${base} bg-purple-500`;
			case 4:
				return `${base} bg-green-600`;
			default:
				return `${base}`;
		}
	};

	return (
		<div className={`p-4 text-[color:var(--foreground)] ${className}`}>
			{/* Header */}
			<div className="flex items-center gap-3 mb-4">
				<span className="text-2xl">{habit.icon}</span>
				<div>
					<h3 className="font-semibold">{habit.name}</h3>
					<p className="text-sm opacity-70">Last 30 days</p>
				</div>
			</div>

			{/* Calendar grid */}
			<div className="grid grid-cols-10 gap-1">
				{days.map((date, index) => {
					const intensity = getIntensity(date);
					const dateStr = date.toISOString().split("T")[0];
					const entry = entries.find(
						(e) => e.date === dateStr && e.habitId === habit.id
					);
					const isNew = highlightedEntry === entry?.id;

					return (
						<motion.div
							key={dateStr}
							initial={{ scale: 0, opacity: 0 }}
							animate={{
								scale: 1,
								opacity: 1,
								boxShadow: isNew
									? "0 0 10px 4px rgba(128,90,255,0.6)"
									: "0 0 0 rgba(0,0,0,0)",
							}}
							transition={{
								delay: index * 0.02,
								duration: 0.3,
								ease: "easeOut",
							}}
							whileHover={{
								scale: 1.25,
								zIndex: 10,
								transition: { duration: 0.2 },
							}}
							className={`
								aspect-square rounded-md cursor-pointer border
								border-[color:var(--foreground)]/20
								${getIntensityColor(intensity)}
								hover:ring-2 hover:ring-green-500
								transition-all duration-200
							`}
							title={`${date.toLocaleDateString()}: ${entry?.value || 0} ${
								habit.unit
							}`}
						>
							<div className="w-full h-full flex items-center justify-center">
								{intensity > 0 && (
									<motion.div
										initial={{ scale: 0 }}
										animate={{ scale: 1 }}
										transition={{ delay: index * 0.02 + 0.1 }}
										className="w-1 h-1 rounded-full bg-[color:var(--foreground)]/40"
									/>
								)}
							</div>
						</motion.div>
					);
				})}
			</div>

			{/* Legend */}
			<div className="flex items-center justify-between mt-3 text-xs opacity-70">
				<span>Less</span>
				<div className="flex gap-1">
					{[0, 1, 2, 3, 4].map((level) => (
						<div
							key={level}
							className={`w-2 h-2 rounded-sm ${getIntensityColor(level)}`}
						/>
					))}
				</div>
				<span>More</span>
			</div>
		</div>
	);
};
