"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { format, startOfWeek, addDays } from "date-fns";
import OnboardingTour from "@/app/components/OnboardingTour";
import { BackgroundGlow } from "./components/BackgroundGlow";
import { DarkModeToggle } from "@/app/components/DarkModeToggle";
import { useHabits } from "@/app/hooks/useHabits";
import { useConfetti } from "@/app/hooks/useConfetti";
import { StatsOverview } from "@/app/components/StatsOverview";
import { HeatmapCalendar } from "@/app/components/HeatmapCalendar";
import { SpiralChart } from "@/app/components/SpiralChart";
import { AchievementBadges } from "@/app/components/AchievementBadges";
import { HabitCard } from "@/app/components/HabitCard";
import { HabitLogModal } from "@/app/components/HabitLogModal";
import { HabitDetailsModal } from "@/app/components/HabitDetailsModal";
import { HabitCreationModal } from "@/app/components/HabitCreationModal";
import { Habit } from "@/app/types/habits";
import ProgressBar from "@/app/components/ProgressBar";
import DailyMotivation from "@/app/components/DailyMotivation";
export default function Index() {
	const {
		habits,
		entries,
		loading,
		addHabit,
		addEntry,
		deleteHabit,
		getHabitStats,
	} = useHabits();
	const { celebrateMilestone } = useConfetti();

	const [selectedHabit, setSelectedHabit] = useState<Habit | null>(null);
	const [showLogModal, setShowLogModal] = useState(false);
	const [showDetailsModal, setShowDetailsModal] = useState(false);
	const [showCreationModal, setShowCreationModal] = useState(false);

	// ---------------- Onboarding Tour ----------------
	const [runTour, setRunTour] = useState(false);
	useEffect(() => {
		if (!localStorage.getItem("tourDone")) {
			const t = setTimeout(() => setRunTour(true), 800);
			return () => clearTimeout(t);
		}
	}, []);

	// ---------------- Handlers ----------------
	const handleHabitClick = (habit: Habit) => {
		setSelectedHabit(habit);
		setShowLogModal(true);
	};
	const handleViewDetails = (habit: Habit) => {
		setSelectedHabit(habit);
		setShowDetailsModal(true);
	};
	const handleDeleteHabit = (habitId: string) => {
		deleteHabit(habitId);
		setSelectedHabit(null);
	};
	const handleSaveEntry = (data: { value: number; notes?: string }) => {
		if (!selectedHabit) return;
		const today = new Date().toISOString().split("T")[0];
		addEntry({
			habitId: selectedHabit.id,
			date: today,
			value: data.value,
			completed: data.value >= selectedHabit.target,
			notes: data.notes,
		});
		setShowLogModal(false);
		setSelectedHabit(null);
	};

	// ---------------- Milestone Confetti ----------------
	useEffect(() => {
		habits.forEach((habit) => {
			const stats = getHabitStats(habit.id);
			if (stats.currentStreak === 7) {
				celebrateMilestone(`🔥 7-day streak achieved for ${habit.name}!`);
			} else if (stats.currentStreak === 14) {
				celebrateMilestone(
					`🚀 14-day streak! ${habit.name} is becoming a habit!`
				);
			} else if (stats.currentStreak === 30) {
				celebrateMilestone(`👑 30-day milestone! ${habit.name} habit master!`);
			}
		});
	}, [entries, habits, getHabitStats, celebrateMilestone]);

	// ---------------- Loading Screen ----------------
	if (loading) {
		return (
			<div className="min-h-screen bg-[var(--background)] text-[var(--foreground)] flex flex-col">
				<motion.div
					initial={{ scale: 0.8, opacity: 0 }}
					animate={{ scale: 1, opacity: 1 }}
					className="flex flex-1 flex-col items-center justify-center text-center"
				>
					<motion.div
						animate={{ rotate: 360 }}
						transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
						className="text-6xl mb-4"
					>
						🎯
					</motion.div>
					<h2 className="text-2xl font-bold mb-2">Loading MOMENTUM</h2>
					<p>Preparing your habit tracker…</p>
				</motion.div>
			</div>
		);
	}

	// ---------------- Weekly Progress ----------------
	const today = new Date();
	const weekStart = startOfWeek(today, { weekStartsOn: 1 });
	const weekDays = Array.from({ length: 7 }).map((_, i) =>
		addDays(weekStart, i)
	);
	const todayIndex = weekDays.findIndex(
		(d) =>
			d.getDate() === today.getDate() &&
			d.getMonth() === today.getMonth() &&
			d.getFullYear() === today.getFullYear()
	);

	const goalTotal = 100;

	return (
		<AnimatePresence mode="wait">
			<motion.div
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				exit={{ opacity: 0 }}
				className="min-h-screen bg-[var(--background)] text-[var(--foreground)]"
			>
				<BackgroundGlow />
				{runTour && (
					<OnboardingTour
						onFinish={() => {
							localStorage.setItem("tourDone", "1");
							setRunTour(false);
						}}
					/>
				)}

				<div className="fixed top-4 right-4 z-50" data-tour="dark-mode">
					<DarkModeToggle />
				</div>

				{/* ---------- Hero Section ---------- */}
				<motion.section className="relative min-h-[80vh] flex flex-col items-center justify-center text-center overflow-hidden">
					<motion.div
						animate={{ rotate: 360 }}
						transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
						className="absolute w-96 h-96 rounded-full bg-[var(--foreground)]/10 opacity-30 -top-20 -left-20"
					/>
					<motion.div
						animate={{ rotate: -360 }}
						transition={{ duration: 80, repeat: Infinity, ease: "linear" }}
						className="absolute w-80 h-80 rounded-full bg-[var(--foreground)]/10 opacity-20 -bottom-20 -right-16"
					/>

					<motion.div
						initial={{ y: 30, opacity: 0 }}
						animate={{ y: 0, opacity: 1 }}
						transition={{ duration: 0.8, delay: 0.2 }}
						className="relative z-10 max-w-3xl"
					>
						<h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-6">
							Build Momentum. Track Progress. <br /> Stay Consistent.
						</h1>
						<p className="text-lg md:text-xl mb-8 opacity-80">
							Transform habits into lasting routines with real-time tracking and
							beautiful visualizations.
						</p>
						<motion.button
							whileHover={{ scale: 1.05 }}
							whileTap={{ scale: 0.95 }}
							onClick={() => setShowCreationModal(true)}
							className="relative px-10 py-4 rounded-2xl text-lg font-medium
             text-[var(--background)] gradient-border"
							data-tour="create-habit"
						>
							{habits.length > 0
								? "Create New Habit"
								: "Start Your First Habit"}
						</motion.button>
					</motion.div>

					{/* Weekly Progress Dots */}
					<motion.div className="mt-12 flex items-center justify-center gap-4 z-10">
						{weekDays.map((day, index) => {
							const isToday = index === todayIndex;
							return (
								<motion.div
									key={index}
									initial={{ scale: 0.8, opacity: 0.5 }}
									animate={{
										scale: isToday ? 1.2 : 1,
										opacity: isToday ? 1 : 0.6,
									}}
									transition={{ duration: 0.5, ease: "easeOut" }}
									className="w-10 h-10 flex items-center justify-center rounded-full cursor-pointer border border-[var(--border)] text-sm font-semibold"
									style={{
										background: isToday
											? "linear-gradient(to top right, #22c55e, #16a34a)"
											: "var(--background)",
										color: "var(--foreground)",
									}}
								>
									{format(day, "EEE")[0]}
								</motion.div>
							);
						})}
					</motion.div>
				</motion.section>
				<DailyMotivation />
				{/* ---------- Global Progress Bar ---------- */}
				<div data-tour="track-progress" className="mt-8">
					<ProgressBar
						value={entries.length}
						max={goalTotal}
						label={`Overall Goal: ${goalTotal} entries`}
						className="w-full max-w-md mx-auto"
					/>
				</div>

				{/* ---------- Dashboard Content ---------- */}
				<div
					className="container mx-auto px-6 py-8 space-y-8"
					data-tour="analytics"
				>
					<motion.div
						initial={{ y: 40, opacity: 0 }}
						animate={{ y: 0, opacity: 1 }}
						transition={{ delay: 0.3 }}
					>
						<StatsOverview className="bg-[var(--background)] text-[var(--foreground)] rounded-2xl border border-[var(--border)] shadow-md" />
					</motion.div>

					{habits.length > 0 && (
						<motion.section
							initial={{ y: 40, opacity: 0 }}
							animate={{ y: 0, opacity: 1 }}
							transition={{ delay: 0.4 }}
						>
							<h2 className="text-2xl font-bold mb-6">Your Habits</h2>
							<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
								{habits.map((habit) => (
									<HabitCard
										key={habit.id}
										habit={habit}
										stats={getHabitStats(habit.id)}
										onAddEntry={() => handleHabitClick(habit)}
										onViewDetails={() => handleViewDetails(habit)}
										onDeleteHabit={() => handleDeleteHabit(habit.id)}
									/>
								))}
							</div>
						</motion.section>
					)}

					{habits.length > 0 && (
						<motion.section className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
							<div className="space-y-6">
								<h2 className="text-2xl font-bold">Activity Heatmaps</h2>
								{habits.map((habit) => (
									<div
										key={habit.id}
										className="bg-[var(--background)] text-[var(--foreground)] rounded-2xl border border-[var(--border)] shadow-md p-4"
									>
										<HeatmapCalendar habit={habit} entries={entries} />
									</div>
								))}
							</div>
							<div className="space-y-6">
								<h2 className="text-2xl font-bold">Momentum Spirals</h2>
								{habits.map((habit) => (
									<div
										key={habit.id}
										className="bg-[var(--background)] text-[var(--foreground)] rounded-2xl border border-[var(--border)] shadow-md p-4"
									>
										<SpiralChart habit={habit} entries={entries} />
									</div>
								))}
							</div>
						</motion.section>
					)}

					<div className="bg-[var(--background)] text-[var(--foreground)] rounded-2xl border border-[var(--border)] shadow-md p-4 mt-8">
						<AchievementBadges className="bg-[var(--background)] text-[var(--foreground)] rounded-2xl border border-[var(--border)] shadow-md p-4 mt-8" />
					</div>
				</div>

				{/* ---------- Modals ---------- */}
				<HabitLogModal
					habit={selectedHabit}
					isOpen={showLogModal}
					onClose={() => setShowLogModal(false)}
					onSave={handleSaveEntry}
				/>
				<HabitDetailsModal
					habit={selectedHabit}
					isOpen={showDetailsModal}
					onClose={() => setShowDetailsModal(false)}
					onLogProgress={() => {
						setShowDetailsModal(false);
						setShowLogModal(true);
					}}
				/>
				<HabitCreationModal
					isOpen={showCreationModal}
					onClose={() => setShowCreationModal(false)}
					onSave={addHabit}
				/>

				{/* Floating Add Button */}
				<div className="fixed bottom-8 right-8">
					<motion.button
						whileHover={{ scale: 1.1, rotate: 90 }}
						whileTap={{ scale: 0.9 }}
						onClick={() => setShowCreationModal(true)}
						className="w-14 h-14 rounded-full shadow-md flex items-center justify-center text-2xl bg-[var(--foreground)] text-[var(--background)]"
					>
						+
					</motion.button>
				</div>
			</motion.div>
		</AnimatePresence>
	);
}
