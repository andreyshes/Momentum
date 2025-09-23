"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HabitEntry, Habit } from "@/app/types/habits";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Textarea } from "@/app/components/ui/textarea";
import { format } from "date-fns";

interface HabitEntryListProps {
	habit: Habit;
	entries: HabitEntry[];
	onUpdateEntry: (entryId: string, updates: Partial<HabitEntry>) => void;
	onDeleteEntry: (entryId: string) => void;
}

export const HabitEntryList = ({
	habit,
	entries,
	onUpdateEntry,
	onDeleteEntry,
}: HabitEntryListProps) => {
	const [editingId, setEditingId] = useState<string | null>(null);
	const [editValue, setEditValue] = useState("");
	const [editNotes, setEditNotes] = useState("");

	const habitEntries = entries
		.filter((entry) => entry.habitId === habit.id)
		.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
		.slice(0, 10);

	const startEdit = (entry: HabitEntry) => {
		setEditingId(entry.id);
		setEditValue(entry.value.toString());
		setEditNotes(entry.notes || "");
	};

	const cancelEdit = () => {
		setEditingId(null);
		setEditValue("");
		setEditNotes("");
	};

	const saveEdit = () => {
		if (!editingId) return;
		const value = parseFloat(editValue);
		if (isNaN(value)) return;

		onUpdateEntry(editingId, {
			value,
			completed: value >= habit.target,
			notes: editNotes.trim() || undefined,
		});

		cancelEdit();
	};

	return (
		<div className="space-y-4 text-[var(--foreground)]">
			{habitEntries.length === 0 && (
				<div className="text-center py-8">
					<div className="text-4xl mb-2">📝</div>
					<p className="opacity-70">No entries yet for {habit.name}</p>
					<p className="text-sm opacity-50">
						Start logging to see your progress!
					</p>
				</div>
			)}

			<h3 className="text-lg font-semibold flex items-center gap-2">
				{habit.icon} {habit.name} History
			</h3>

			<div className="space-y-3">
				<AnimatePresence>
					{habitEntries.map((entry, index) => (
						<motion.div
							key={entry.id}
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							exit={{ opacity: 0, scale: 0.9 }}
							transition={{ delay: index * 0.05 }}
							className="
								rounded-xl p-4 border
								bg-[var(--background)] border-[color:var(--foreground)]/20
								hover:shadow-md transition-all duration-200
							"
						>
							<div className="flex items-start justify-between">
								<div className="flex-1 space-y-2">
									{/* Date + Status */}
									<div className="flex items-center gap-3 mb-2">
										<motion.div
											animate={{
												color: entry.completed
													? "hsl(var(--success))"
													: "var(--foreground)",
												scale: entry.completed ? 1.1 : 1,
											}}
											className={`text-sm font-medium ${
												entry.completed ? "" : "opacity-70"
											}`}
										>
											{format(new Date(entry.date), "MMM dd, yyyy")}
											{entry.completed && <span className="ml-2">✅</span>}
										</motion.div>
										<div
											className={`
												px-2 py-1 rounded-full text-xs font-medium
												${
													entry.completed
														? "bg-[color:var(--foreground)]/10 text-[var(--foreground)]"
														: "bg-[color:var(--foreground)]/10 opacity-70"
												}
											`}
										>
											{entry.completed ? "Target Hit" : "In Progress"}
										</div>
									</div>

									{/* Editing Form */}
									{editingId === entry.id ? (
										<div className="space-y-3">
											<div>
												<label className="text-sm opacity-70">
													Value ({habit.unit})
												</label>
												<Input
													type="number"
													step="0.1"
													value={editValue}
													onChange={(e) => setEditValue(e.target.value)}
													className="mt-1 bg-[var(--background)] border border-[color:var(--foreground)]/30"
													autoFocus
												/>
											</div>
											<div>
												<label className="text-sm opacity-70">Notes</label>
												<Textarea
													value={editNotes}
													onChange={(e) => setEditNotes(e.target.value)}
													className="
														mt-1 bg-[var(--background)]
														border border-[color:var(--foreground)]/30
														min-h-[60px]
													"
													placeholder="Optional notes..."
												/>
											</div>
											<div className="flex gap-2">
												<Button
													size="sm"
													onClick={saveEdit}
													className="bg-green-500 text-white hover:bg-green-600"
												>
													Save
												</Button>
												<Button
													size="sm"
													variant="outline"
													onClick={cancelEdit}
													className="border border-[color:var(--foreground)]/40 text-[var(--foreground)]"
												>
													Cancel
												</Button>
											</div>
										</div>
									) : (
										// Display Entry
										<div className="space-y-2">
											<motion.div
												key={entry.value}
												initial={{ scale: 1.1 }}
												animate={{ scale: 1 }}
												className="text-2xl font-bold"
												style={{ color: habit.color }}
											>
												{entry.value} {habit.unit}{" "}
												<span className="text-sm font-normal ml-2 opacity-70">
													/ {habit.target} target
												</span>
											</motion.div>
											{entry.notes && (
												<div
													className="
														text-sm opacity-80 bg-[color:var(--foreground)]/10
														rounded-lg p-3 border border-[color:var(--foreground)]/20
													"
												>
													<span className="font-medium">Notes: </span>
													{entry.notes}
												</div>
											)}
											<div className="text-xs opacity-70">
												Progress:{" "}
												{((entry.value / habit.target) * 100).toFixed(1)}%
											</div>
										</div>
									)}
								</div>

								{/* Actions */}
								{editingId !== entry.id && (
									<div className="flex gap-2 ml-4">
										<motion.button
											whileHover={{ scale: 1.1 }}
											whileTap={{ scale: 0.9 }}
											onClick={() => startEdit(entry)}
											className="
												p-2 rounded-lg border border-[color:var(--foreground)]/30
												text-[var(--foreground)] hover:bg-[color:var(--foreground)]/10
											"
											aria-label="Edit entry"
										>
											<svg
												width="14"
												height="14"
												viewBox="0 0 24 24"
												fill="none"
												stroke="currentColor"
												strokeWidth="2"
											>
												<path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
												<path d="m18.5 2.5 a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
											</svg>
										</motion.button>
										<motion.button
											whileHover={{ scale: 1.1 }}
											whileTap={{ scale: 0.9 }}
											onClick={() => onDeleteEntry(entry.id)}
											className="
												p-2 rounded-lg border border-[color:var(--foreground)]/30
												text-red-500 hover:bg-red-500/10
											"
											aria-label="Delete entry"
										>
											<svg
												width="14"
												height="14"
												viewBox="0 0 24 24"
												fill="none"
												stroke="currentColor"
												strokeWidth="2"
											>
												<polyline points="3,6 5,6 21,6" />
												<path d="m19,6v14a2,2 0 0,1 -2,2H7a2,2 0 0,1 -2,-2V6m3,0V4a2,2 0 0,1 2,-2h4a2,2 0 0,1 2,2v2" />
											</svg>
										</motion.button>
									</div>
								)}
							</div>
						</motion.div>
					))}
				</AnimatePresence>
			</div>

			{habitEntries.length >= 10 && (
				<p className="text-center text-sm opacity-70">
					Showing last 10 entries •{" "}
					{entries.filter((e) => e.habitId === habit.id).length} total
				</p>
			)}
		</div>
	);
};
