"use client";

import { motion } from "framer-motion";
import { Habit, HabitStats } from "@/app/types/habits";

interface HabitCardProps {
	habit: Habit;
	stats: HabitStats;
	onAddEntry: () => void;
	onViewDetails: () => void;
	onDeleteHabit: () => void;
	className?: string;
}

export const HabitCard = ({
	habit,
	stats,
	onAddEntry,
	onViewDetails,
	onDeleteHabit,
	className = "",
}: HabitCardProps) => {
	const completionColor =
		stats.completionRate >= 80
			? "text-green-500"
			: stats.completionRate >= 60
			? "text-yellow-500"
			: "text-red-500";

	return (
		<motion.div
			initial={{ y: 20, opacity: 0 }}
			animate={{ y: 0, opacity: 1 }}
			whileHover={{
				scale: 1.02,
				y: -2,
				boxShadow: "0 12px 25px -5px hsl(var(--shadow) / 0.25)",
				filter:
					stats.currentStreak >= 7
						? "drop-shadow(0 0 15px hsl(var(--success) / 0.5))"
						: "none",
				transition: { duration: 0.2 },
			}}
			className={`
				bg-[var(--background)] text-[var(--foreground)] p-6 rounded-2xl
				border border-[color:var(--foreground)]/20
				shadow-card hover:shadow-glow backdrop-blur-sm
				transition-all duration-300 cursor-pointer group
				${className}
			`}
			onClick={onViewDetails}
		>
			{/* Header */}
			<div className="flex items-start justify-between mb-4">
				<div className="flex items-center gap-3">
					<motion.div
						className="text-3xl"
						whileHover={{
							scale: 1.2,
							rotate: 10,
							transition: { duration: 0.2 },
						}}
					>
						{habit.icon}
					</motion.div>
					<div>
						<h3 className="font-semibold text-lg">{habit.name}</h3>
						<p className="text-sm opacity-70">
							Target: {habit.target} {habit.unit}
						</p>
					</div>
				</div>

				{/* Action Buttons */}
				<div className="flex gap-2">
					<motion.button
						whileHover={{ scale: 1.1 }}
						whileTap={{ scale: 0.95 }}
						onClick={(e) => {
							e.stopPropagation();
							onAddEntry();
						}}
						className="p-2 rounded-lg bg-[var(--foreground)]/10 text-[var(--foreground)] hover:bg-[var(--foreground)]/20 transition-colors"
						title="Quick log for today"
					>
						<svg
							width="16"
							height="16"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							strokeWidth="2"
						>
							<path d="M12 5v14M5 12h14" />
						</svg>
					</motion.button>

					<motion.button
						whileHover={{ scale: 1.1 }}
						whileTap={{ scale: 0.95 }}
						onClick={(e) => {
							e.stopPropagation();
							onDeleteHabit();
						}}
						className="p-2 rounded-lg bg-red-200/20 text-red-500 hover:bg-red-200/40 transition-colors"
						title="Delete habit"
					>
						<svg
							width="16"
							height="16"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							strokeWidth="2"
						>
							<path d="M3 6h18M8 6v12a2 2 0 0 0 2 2h4a2 2 0 0 0 2-2V6M10 11v6M14 11v6" />
						</svg>
					</motion.button>
				</div>
			</div>

			{/* Stats */}
			<div className="grid grid-cols-3 gap-4 mb-4">
				<div className="text-center">
					<motion.div
						className="text-2xl font-bold"
						key={stats.currentStreak}
						initial={{
							scale: 1.3,
							filter:
								stats.currentStreak > 0
									? "drop-shadow(0 0 12px hsl(var(--success) / 0.8))"
									: "none",
						}}
						animate={{ scale: 1, filter: "none" }}
						transition={{ duration: 0.4, ease: "easeOut" }}
					>
						{stats.currentStreak}
					</motion.div>
					<p className="text-xs opacity-70">Current Streak</p>
				</div>

				<div className="text-center">
					<div className="text-2xl font-bold">{stats.longestStreak}</div>
					<p className="text-xs opacity-70">Best Streak</p>
				</div>

				<div className="text-center">
					<div className={`text-2xl font-bold ${completionColor}`}>
						{Math.round(stats.completionRate)}%
					</div>
					<p className="text-xs opacity-70">Success Rate</p>
				</div>
			</div>

			{/* Progress Bar */}
			<div className="mb-4">
				<div className="flex justify-between text-sm mb-2">
					<span className="opacity-70">Progress</span>
					<span className="font-medium">
						{stats.averageValue.toFixed(1)} {habit.unit} avg
					</span>
				</div>
				<div className="w-full bg-[var(--foreground)]/10 rounded-full h-2 overflow-hidden">
					<motion.div
						initial={{ width: 0 }}
						animate={{ width: `${Math.min(stats.completionRate, 100)}%` }}
						transition={{ duration: 1, ease: "easeOut" }}
						className="h-full rounded-full"
						style={{
							background: `linear-gradient(90deg, ${habit.color}, ${habit.color}dd)`,
						}}
					/>
				</div>
			</div>

			<motion.div
				initial={{ opacity: 0 }}
				whileHover={{ opacity: 1 }}
				className="text-center text-xs group-hover:text-[var(--foreground)] transition-colors opacity-70"
			>
				Click to view details and manage entries
			</motion.div>
		</motion.div>
	);
};
