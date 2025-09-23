"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Habit } from "@/app/types/habits";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import { Textarea } from "@/app/components/ui/textarea";

interface HabitLogModalProps {
	habit: Habit | null;
	isOpen: boolean;
	onClose: () => void;
	onSave: (data: { value: number; notes?: string }) => void;
}

export const HabitLogModal = ({
	habit,
	isOpen,
	onClose,
	onSave,
}: HabitLogModalProps) => {
	const [value, setValue] = useState("");
	const [notes, setNotes] = useState("");

	const handleSave = () => {
		if (!value || !habit) return;

		const numValue = parseFloat(value);
		if (isNaN(numValue)) return;

		onSave({
			value: numValue,
			notes: notes.trim() || undefined,
		});

		setValue("");
		setNotes("");
		onClose();
	};

	const handleClose = () => {
		setValue("");
		setNotes("");
		onClose();
	};

	if (!habit) return null;

	const progressPercent = value
		? Math.min((parseFloat(value) / habit.target) * 100, 100)
		: 0;

	return (
		<AnimatePresence>
			{isOpen && (
				<motion.div
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					exit={{ opacity: 0 }}
					className="
						fixed inset-0 z-50 flex items-center justify-center p-4
						bg-[color:var(--background)]/80 backdrop-blur-sm
					"
					onClick={handleClose}
				>
					<motion.div
						initial={{ scale: 0.8, opacity: 0, y: 20 }}
						animate={{ scale: 1, opacity: 1, y: 0 }}
						exit={{ scale: 0.8, opacity: 0, y: 20 }}
						transition={{ type: "spring", stiffness: 300, damping: 30 }}
						className="
							w-full max-w-md rounded-2xl border p-6 shadow-lg
							bg-[var(--background)] text-[var(--foreground)]
							border-[color:var(--foreground)]/20
						"
						onClick={(e) => e.stopPropagation()}
					>
						{/* Header */}
						<div className="flex items-center justify-between mb-6">
							<div className="flex items-center gap-3">
								<motion.span
									className="text-3xl"
									animate={{ rotate: [0, 10, -10, 0] }}
									transition={{ duration: 0.5 }}
								>
									{habit.icon}
								</motion.span>
								<div>
									<h2 className="text-xl font-semibold">Log {habit.name}</h2>
									<p className="text-sm opacity-70">
										Target: {habit.target} {habit.unit}
									</p>
								</div>
							</div>
							<Button
								variant="ghost"
								size="sm"
								onClick={handleClose}
								className="
									h-8 w-8 p-0
									hover:bg-[color:var(--foreground)]/10
								"
								aria-label="Close"
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

						{/* Form */}
						<div className="space-y-4">
							<div>
								<Label htmlFor="value" className="text-sm font-medium">
									Amount ({habit.unit})
								</Label>
								<Input
									id="value"
									type="number"
									step="0.1"
									placeholder={`Enter ${habit.unit}...`}
									value={value}
									onChange={(e) => setValue(e.target.value)}
									className="
										mt-1 bg-[var(--background)]
										border border-[color:var(--foreground)]/30
										text-[var(--foreground)]
									"
									autoFocus
								/>
								<div className="flex justify-between mt-2 text-xs opacity-70">
									<span>Today's Progress</span>
									<span
										className={`font-medium ${
											progressPercent >= 100
												? "text-green-500"
												: progressPercent >= 80
												? "text-yellow-500"
												: ""
										}`}
									>
										{progressPercent.toFixed(0)}% of target
									</span>
								</div>
							</div>

							<div>
								<Label htmlFor="notes" className="text-sm font-medium">
									Notes (optional)
								</Label>
								<Textarea
									id="notes"
									placeholder="How are you feeling? Any observations..."
									value={notes}
									onChange={(e) => setNotes(e.target.value)}
									className="
										mt-1 bg-[var(--background)]
										border border-[color:var(--foreground)]/30
										text-[var(--foreground)]
										min-h-[80px]
									"
								/>
							</div>

							{/* Quick Actions */}
							<div className="grid grid-cols-3 gap-2">
								<Button
									variant="outline"
									size="sm"
									onClick={() => setValue((habit.target * 0.5).toString())}
									className="
										text-xs border border-[color:var(--foreground)]/30
										text-[var(--foreground)]
										hover:bg-[color:var(--foreground)]/10
									"
								>
									50% Target
								</Button>
								<Button
									variant="outline"
									size="sm"
									onClick={() => setValue(habit.target.toString())}
									className="
										text-xs border border-[color:var(--foreground)]/30
										text-[var(--foreground)]
										hover:bg-[color:var(--foreground)]/10
									"
								>
									Hit Target
								</Button>
								<Button
									variant="outline"
									size="sm"
									onClick={() => setValue((habit.target * 1.2).toString())}
									className="
										text-xs border border-[color:var(--foreground)]/30
										text-[var(--foreground)]
										hover:bg-[color:var(--foreground)]/10
									"
								>
									Exceeded!
								</Button>
							</div>
						</div>

						{/* Actions */}
						<div className="flex gap-3 mt-6">
							<Button
								variant="outline"
								onClick={handleClose}
								className="
									flex-1 border border-[color:var(--foreground)]/30
									text-[var(--foreground)]
									hover:bg-[color:var(--foreground)]/10
								"
							>
								Cancel
							</Button>
							<motion.div
								className="flex-1"
								whileHover={{ scale: 1.02 }}
								whileTap={{ scale: 0.98 }}
							>
								<Button
									onClick={handleSave}
									disabled={!value}
									className="
										w-full bg-purple-500 text-white
										hover:bg-purple-600
									"
								>
									Log Progress
								</Button>
							</motion.div>
						</div>
					</motion.div>
				</motion.div>
			)}
		</AnimatePresence>
	);
};
