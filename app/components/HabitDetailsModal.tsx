"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Habit } from "@/app/types/habits";
import { Button } from "@/app/components/ui/button";
import TrendChart from "@/app/components/TrendChart";
import {
	Tabs,
	TabsContent,
	TabsList,
	TabsTrigger,
} from "@/app/components/ui/tabs";
import { HabitEntryList } from "@/app/components/HabitEntryList";
import { useHabits } from "@/app/hooks/useHabits";

interface HabitDetailsModalProps {
	habit: Habit | null;
	isOpen: boolean;
	onClose: () => void;
	onLogProgress: () => void;
}

export const HabitDetailsModal = ({
	habit,
	isOpen,
	onClose,
	onLogProgress,
}: HabitDetailsModalProps) => {
	const { entries, updateEntry, deleteEntry, getHabitStats } = useHabits();
	const [activeTab, setActiveTab] = useState("overview");

	if (!habit) return null;

	const stats = getHabitStats(habit.id);

	return (
		<AnimatePresence>
			{isOpen && (
				<motion.div
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					exit={{ opacity: 0 }}
					className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[color:var(--background)]/30 backdrop-blur-lg"
					onClick={onClose}
				>
					<motion.div
						initial={{ scale: 0.8, opacity: 0, y: 20 }}
						animate={{ scale: 1, opacity: 1, y: 0 }}
						exit={{ scale: 0.8, opacity: 0, y: 20 }}
						transition={{ type: "spring", stiffness: 300, damping: 30 }}
						className="w-full max-w-4xl max-h-[90vh] overflow-hidden rounded-2xl shadow-glass
                       bg-[var(--background)] text-[var(--foreground)]
                       border border-[color:var(--foreground)]/20"
						onClick={(e) => e.stopPropagation()}
					>
						{/* ---------- Header ---------- */}
						<div className="flex items-center justify-between p-6 border-b border-[color:var(--foreground)]/20">
							<div className="flex items-center gap-3">
								<motion.span
									className="text-4xl"
									animate={{ rotate: [0, 10, -10, 0] }}
									transition={{ duration: 0.5 }}
								>
									{habit.icon}
								</motion.span>
								<div>
									<h2 className="text-2xl font-bold">{habit.name}</h2>
									<p className="opacity-70">
										Target: {habit.target} {habit.unit} daily
									</p>
								</div>
							</div>
							<div className="flex items-center gap-3">
								<Button
									onClick={onLogProgress}
									className="bg-purple-400 text-white hover:opacity-80"
								>
									<span className="mr-2">➕</span>Log Today
								</Button>
								<Button
									variant="ghost"
									size="sm"
									onClick={onClose}
									className="h-8 w-8 p-0 hover:bg-[color:var(--foreground)]/10"
								>
									<svg
										width="16"
										height="16"
										viewBox="0 0 24 24"
										fill="none"
										stroke="currentColor"
										strokeWidth="2"
									>
										<path d="M18 6L6 18M6 6l12 12" />
									</svg>
								</Button>
							</div>
						</div>

						{/* ---------- Tabs & Content ---------- */}
						<div
							className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]
                            bg-[var(--background)] text-[var(--foreground)]"
						>
							<Tabs
								value={activeTab}
								onValueChange={setActiveTab}
								className="w-full"
							>
								<TabsList className="grid w-full grid-cols-3 bg-[color:var(--foreground)]/10">
									<TabsTrigger
										value="overview"
										className="data-[state=active]:bg-purple-300/30"
									>
										📊 Overview
									</TabsTrigger>
									<TabsTrigger
										value="history"
										className="data-[state=active]:bg-purple-300/30"
									>
										📝 History & Edit
									</TabsTrigger>
									{/* ✅ New Trends tab */}
									<TabsTrigger
										value="trends"
										className="data-[state=active]:bg-purple-300/30"
									>
										📈 Trends
									</TabsTrigger>
								</TabsList>

								{/* ----- Overview Tab ----- */}
								<TabsContent value="overview" className="mt-6">
									<div className="space-y-6">
										{/* Stats cards */}
										<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
											<motion.div
												key={stats.currentStreak}
												initial={{ scale: 1.1 }}
												animate={{ scale: 1 }}
												className="p-4 text-center rounded-xl border border-[color:var(--foreground)]/20 bg-[var(--background)]"
											>
												<motion.div
													className="text-3xl font-bold mb-1 text-red-500"
													key={`current-${stats.currentStreak}`}
													initial={{ scale: 1.2 }}
													animate={{ scale: 1 }}
												>
													{stats.currentStreak}
												</motion.div>
												<div className="text-sm opacity-70">Current Streak</div>
											</motion.div>

											<div className="p-4 text-center rounded-xl border border-[color:var(--foreground)]/20 bg-[var(--background)]">
												<div className="text-3xl font-bold mb-1 text-blue-500">
													{stats.longestStreak}
												</div>
												<div className="text-sm opacity-70">Best Streak</div>
											</div>

											<div className="p-4 text-center rounded-xl border border-[color:var(--foreground)]/20 bg-[var(--background)]">
												<motion.div
													key={stats.completionRate}
													initial={{ scale: 1.1 }}
													animate={{ scale: 1 }}
													className="text-3xl font-bold mb-1 text-green-500"
												>
													{Math.round(stats.completionRate)}%
												</motion.div>
												<div className="text-sm opacity-70">Success Rate</div>
											</div>

											<div className="p-4 text-center rounded-xl border border-[color:var(--foreground)]/20 bg-[var(--background)]">
												<div className="text-3xl font-bold mb-1">
													{stats.totalDays}
												</div>
												<div className="text-sm opacity-70">Total Days</div>
											</div>
										</div>

										{/* Daily Average Bar */}
										<div className="p-6 rounded-xl border border-[color:var(--foreground)]/20 bg-[var(--background)]">
											<h3 className="text-lg font-semibold mb-4">
												Daily Average
											</h3>
											<div className="flex items-center gap-4">
												<div className="flex-1">
													<div className="flex justify-between text-sm mb-2 opacity-80">
														<span>
															Average: {stats.averageValue.toFixed(1)}{" "}
															{habit.unit}
														</span>
														<span>
															Target: {habit.target} {habit.unit}
														</span>
													</div>
													<div className="w-full rounded-full h-4 overflow-hidden bg-[color:var(--foreground)]/10">
														<motion.div
															initial={{ width: 0 }}
															animate={{
																width: `${Math.min(
																	(stats.averageValue / habit.target) * 100,
																	100
																)}%`,
															}}
															transition={{ duration: 1, ease: "easeOut" }}
															className="h-full rounded-full"
															style={{
																background: `linear-gradient(90deg, ${habit.color}, ${habit.color}cc)`,
															}}
														/>
													</div>
												</div>
												<motion.div
													key={stats.averageValue}
													initial={{ scale: 1.2 }}
													animate={{ scale: 1 }}
													className="text-2xl font-bold"
													style={{ color: habit.color }}
												>
													{((stats.averageValue / habit.target) * 100).toFixed(
														0
													)}
													%
												</motion.div>
											</div>
										</div>
									</div>
								</TabsContent>

								{/* ----- History Tab ----- */}
								<TabsContent value="history" className="mt-6">
									<HabitEntryList
										habit={habit}
										entries={entries}
										onUpdateEntry={updateEntry}
										onDeleteEntry={deleteEntry}
									/>
								</TabsContent>

								{/* ----- New Trends Tab ----- */}
								<TabsContent value="trends" className="mt-6">
									<TrendChart habit={habit} entries={entries} />
								</TabsContent>
							</Tabs>
						</div>
					</motion.div>
				</motion.div>
			)}
		</AnimatePresence>
	);
};
