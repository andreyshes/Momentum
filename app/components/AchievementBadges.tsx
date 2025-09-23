"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useHabits } from "@/app/hooks/useHabits";
import { useConfetti } from "@/app/hooks/useConfetti";

interface Habit {
	id: string;
	name: string;
}
interface Entry {
	id: string;
	habitId: string;
	completed: boolean;
	date: string;
}

interface AchievementBadgeType {
	id: string;
	name: string;
	description: string;
	icon: string;
	requirement: string;
	checkUnlocked: (
		habits: Habit[],
		entries: Entry[],
		getHabitStats: (habitId: string) => { currentStreak: number }
	) => boolean;
}

const ACHIEVEMENT_BADGES: AchievementBadgeType[] = [
	{
		id: "first-entry",
		name: "First Steps",
		description: "Log your first habit entry",
		icon: "🌱",
		requirement: "Complete 1 entry",
		checkUnlocked: (_habits, entries) => entries.length > 0,
	},
	{
		id: "first-week",
		name: "Week Warrior",
		description: "Maintain a 7-day streak",
		icon: "🔥",
		requirement: "7-day streak",
		checkUnlocked: (habits, _entries, getHabitStats) =>
			habits.some((h) => getHabitStats(h.id).currentStreak >= 7),
	},
	{
		id: "consistency-master",
		name: "Consistency Master",
		description: "Achieve a 21-day streak",
		icon: "👑",
		requirement: "21-day streak",
		checkUnlocked: (habits, _entries, getHabitStats) =>
			habits.some((h) => getHabitStats(h.id).currentStreak >= 21),
	},
	{
		id: "habit-collector",
		name: "Habit Collector",
		description: "Complete 50 total entries",
		icon: "🏆",
		requirement: "50 total entries",
		checkUnlocked: (_habits, entries) => entries.length >= 50,
	},
	{
		id: "perfectionist",
		name: "Perfectionist",
		description: "Achieve 90% success rate with 20+ entries",
		icon: "💎",
		requirement: "90% success rate",
		checkUnlocked: (_habits, entries) => {
			const completed = entries.filter((e) => e.completed).length;
			return entries.length >= 20 && completed / entries.length >= 0.9;
		},
	},
	{
		id: "month-champion",
		name: "Month Champion",
		description: "Maintain a 30-day streak",
		icon: "⚡",
		requirement: "30-day streak",
		checkUnlocked: (habits, _entries, getHabitStats) =>
			habits.some((h) => getHabitStats(h.id).currentStreak >= 30),
	},
];

interface AchievementBadgesProps {
	className?: string;
}

export const AchievementBadges = ({
	className = "",
}: AchievementBadgesProps) => {
	const { habits, entries, getHabitStats } = useHabits();
	const { celebrateMilestone } = useConfetti();
	const [unlockedIds, setUnlockedIds] = useState<string[]>([]);

	useEffect(() => {
		const newlyUnlocked = ACHIEVEMENT_BADGES.filter(
			(badge) =>
				badge.checkUnlocked(habits, entries, getHabitStats) &&
				!unlockedIds.includes(badge.id)
		);

		if (newlyUnlocked.length > 0) {
			newlyUnlocked.forEach((badge) =>
				celebrateMilestone(`🏆 Achievement unlocked: ${badge.name}!`)
			);
			setUnlockedIds((prev) => [...prev, ...newlyUnlocked.map((b) => b.id)]);
		}
	}, [habits, entries, getHabitStats, unlockedIds, celebrateMilestone]);

	return (
		<div
			className={`p-6 bg-[var(--background)] text-[var(--foreground)] ${className}`}
		>
			<motion.h2
				initial={{ opacity: 0, y: -20 }}
				animate={{ opacity: 1, y: 0 }}
				className="text-2xl font-bold mb-6"
			>
				Achievement Badges
			</motion.h2>

			<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
				{ACHIEVEMENT_BADGES.map((badge, index) => {
					const isUnlocked = badge.checkUnlocked(
						habits,
						entries,
						getHabitStats
					);
					return (
						<motion.div
							key={badge.id}
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ delay: index * 0.1 }}
							className={`relative p-4 rounded-xl border text-center transition-all duration-300 ${
								isUnlocked
									? "bg-gradient-to-br from-green-400 via-green-500 to-green-600 border-green-300 shadow-lg text-white"
									: "bg-[var(--background)] border-[var(--border)] opacity-60"
							}`}
						>
							{isUnlocked && (
								<motion.div
									initial={{ scale: 0 }}
									animate={{ scale: 1 }}
									transition={{ delay: 0.2, type: "spring", stiffness: 300 }}
									className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center text-xs text-white"
								>
									✓
								</motion.div>
							)}
							<div className={`text-3xl mb-2 ${isUnlocked ? "" : "grayscale"}`}>
								{badge.icon}
							</div>
							<h3
								className={`font-semibold text-sm mb-1 ${
									isUnlocked ? "text-white" : "text-[var(--foreground)]/70"
								}`}
							>
								{badge.name}
							</h3>
							<p
								className={`text-xs mb-2 ${
									isUnlocked ? "text-white/80" : "text-[var(--foreground)]/60"
								}`}
							>
								{badge.description}
							</p>
							<div
								className={`text-xs font-medium ${
									isUnlocked ? "text-white/70" : "text-[var(--foreground)]/60"
								}`}
							>
								{badge.requirement}
							</div>
							{!isUnlocked && (
								<motion.div
									initial={{ opacity: 0 }}
									animate={{ opacity: 1 }}
									className="mt-2 text-xs text-[var(--foreground)]/50"
								>
									🔒 Locked
								</motion.div>
							)}
						</motion.div>
					);
				})}
			</div>

			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ delay: 0.5 }}
				className="mt-6 text-center"
			>
				<div className="text-sm text-[var(--foreground)]/80">
					<span className="font-medium">
						{
							ACHIEVEMENT_BADGES.filter((badge) =>
								badge.checkUnlocked(habits, entries, getHabitStats)
							).length
						}
					</span>
					{" / "}
					{ACHIEVEMENT_BADGES.length} badges unlocked
				</div>
				{(!entries || entries.length === 0) && (
					<motion.p
						animate={{ opacity: [0.5, 1, 0.5] }}
						transition={{ duration: 2, repeat: Infinity }}
						className="text-xs text-[var(--foreground)]/60 mt-2"
					>
						Start logging habits to unlock your first badge! 🚀
					</motion.p>
				)}
			</motion.div>
		</div>
	);
};
