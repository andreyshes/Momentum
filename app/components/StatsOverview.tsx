"use client";

import React, { useMemo } from "react";
import { motion } from "framer-motion";
import { useHabits } from "@/app/hooks/useHabits";
import { TodayProgress } from "@/app/components/TodayProgress";

interface StatsOverviewProps {
	className?: string;
}

export const StatsOverview = ({ className = "" }: StatsOverviewProps) => {
	const { habits, entries, getHabitStats } = useHabits();

	// Calculate stats using useMemo to optimize updates
	const stats = useMemo(() => {
		const totalEntries = entries.length;
		const activeHabits = habits.length;
		const completedEntries = entries.filter((e) => e.completed).length;
		const successRate =
			totalEntries > 0
				? Math.round((completedEntries / totalEntries) * 100)
				: 0;
		const bestCurrentStreak =
			habits.length > 0
				? Math.max(...habits.map((h) => getHabitStats(h.id).currentStreak))
				: 0;

		return {
			totalEntries,
			activeHabits,
			completedEntries,
			successRate,
			bestCurrentStreak,
		};
	}, [habits, entries, getHabitStats]);

	// Show message when no habits exist
	if (habits.length === 0) {
		return (
			<div className={`p-6 ${className}`}>
				<div className="text-center py-12">
					<motion.div
						initial={{ scale: 0.8, opacity: 0 }}
						animate={{ scale: 1, opacity: 1 }}
						className="text-6xl mb-4"
					>
						🎯
					</motion.div>
					<h2 className="text-2xl font-bold text-card-foreground mb-2">
						No Habits Yet
					</h2>
					<p className="text-muted-foreground mb-6">
						Create your first habit to start tracking your progress!
					</p>
				</div>
			</div>
		);
	}

	return (
		<div className={`p-6 ${className}`}>
			<motion.h2
				initial={{ opacity: 0, y: -20 }}
				animate={{ opacity: 1, y: 0 }}
				className="text-2xl font-bold text-black mb-6"
			>
				Your Progress Dashboard
			</motion.h2>

			<div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
				{/* Stats Grid */}
				<div className="lg:col-span-3 grid grid-cols-4 gap-4">
					{/* Total Entries */}
					<motion.div
						key={`total-entries-${stats.totalEntries}`}
						initial={{ scale: stats.totalEntries > 0 ? 1.05 : 1, opacity: 0 }}
						animate={{ scale: 1, opacity: 1 }}
						className="bg-white border border-purple-200 rounded-xl p-4 text-center shadow-card hover:shadow-elevation transition-all"
					>
						<motion.div
							key={`entries-count-${stats.totalEntries}`}
							initial={{ scale: stats.totalEntries > 0 ? 1.2 : 1 }}
							animate={{ scale: 1 }}
							transition={{ duration: 0.3 }}
							className="text-2xl font-bold text-purple-600 mb-1"
						>
							{stats.totalEntries}
						</motion.div>
						<div className="text-xs text-muted-foreground">Total Entries</div>
					</motion.div>

					{/* Active Habits */}
					<motion.div
						key={`active-habits-${stats.activeHabits}`}
						initial={{ scale: stats.activeHabits > 0 ? 1.05 : 1, opacity: 0 }}
						animate={{ scale: 1, opacity: 1 }}
						className="bg-card border border-yellow-300 rounded-xl p-4 text-center shadow-card hover:shadow-elevation transition-all"
					>
						<div className="text-2xl font-bold text-yellow-500 mb-1">
							{stats.activeHabits}
						</div>
						<div className="text-xs text-muted-foreground">Active Habits</div>
					</motion.div>

					{/* Success Rate */}
					<motion.div
						key={`success-rate-${stats.successRate}`}
						initial={{
							scale: stats.completedEntries > 0 ? 1.05 : 1,
							opacity: 0,
						}}
						animate={{ scale: 1, opacity: 1 }}
						className="bg-card border border-green-500 rounded-xl p-4 text-center shadow-card hover:shadow-elevation transition-all"
					>
						<motion.div
							key={`success-count-${stats.successRate}`}
							initial={{ scale: stats.completedEntries > 0 ? 1.2 : 1 }}
							animate={{ scale: 1 }}
							transition={{ duration: 0.3 }}
							className="text-2xl font-bold text-green-500 mb-1"
						>
							{stats.successRate}%
						</motion.div>
						<div className="text-xs text-muted-foreground">Success Rate</div>
					</motion.div>

					{/* Best Streak */}
					<motion.div
						key={`best-streak-${stats.bestCurrentStreak}`}
						initial={{
							scale: stats.bestCurrentStreak > 0 ? 1.05 : 1,
							opacity: 0,
						}}
						animate={{ scale: 1, opacity: 1 }}
						className="bg-card border border-red-500 rounded-xl p-4 text-center shadow-card hover:shadow-elevation transition-all"
					>
						<motion.div
							key={`streak-count-${stats.bestCurrentStreak}`}
							initial={{
								scale: stats.bestCurrentStreak > 0 ? 1.2 : 1,
								filter:
									stats.bestCurrentStreak >= 7
										? "drop-shadow(0 0 8px hsl(var(--success) / 0.6))"
										: "none",
							}}
							animate={{ scale: 1, filter: "none" }}
							transition={{ duration: 0.4 }}
							className="text-2xl font-bold text-red-500 mb-1"
						>
							{stats.bestCurrentStreak}
						</motion.div>
						<div className="text-xs text-muted-foreground">Best Streak</div>
					</motion.div>
				</div>

				{/* Today's Progress */}
				<div className="lg:col-span-2">
					<TodayProgress
						currentStreak={stats.bestCurrentStreak}
						className="h-full"
					/>
				</div>
			</div>
		</div>
	);
};
