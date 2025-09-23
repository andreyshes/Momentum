"use client";

import React, { useState } from "react";
import { AnimatePresence } from "framer-motion";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@/app/components/ui/dialog";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/app/components/ui/select";
import { Habit } from "@/app/types/habits";

interface HabitCreationModalProps {
	isOpen: boolean;
	onClose: () => void;
	onSave: (habit: Omit<Habit, "id">) => void;
}

const HABIT_ICONS = [
	"💪",
	"🏃",
	"📚",
	"💧",
	"🧘",
	"🎯",
	"✍️",
	"🌱",
	"🎵",
	"🍎",
];
type HabitCategory = {
	value: "health" | "fitness" | "wellness" | "productivity";
	label: string;
};

export const HABIT_CATEGORIES: HabitCategory[] = [
	{ value: "health", label: "Health" },
	{ value: "fitness", label: "Fitness" },
	{ value: "wellness", label: "Wellness" },
	{ value: "productivity", label: "Productivity" },
];
export type HabitCategoryValue = HabitCategory["value"];

export const HabitCreationModal = ({
	isOpen,
	onClose,
	onSave,
}: HabitCreationModalProps) => {
	const [name, setName] = useState("");
	const [icon, setIcon] = useState("💪");
	const [color, setColor] = useState("hsl(var(--primary))");
	const [unit, setUnit] = useState("times");
	const [target, setTarget] = useState(1);
	const [category, setCategory] = useState<HabitCategoryValue>("health");

	const handleSave = () => {
		if (!name.trim()) return;
		onSave({
			name: name.trim(),
			icon,
			color,
			unit,
			target,
			category,
		});
		handleClose();
	};

	const handleClose = () => {
		setName("");
		setIcon("💪");
		setColor("hsl(var(--primary))");
		setUnit("times");
		setTarget(1);
		setCategory("health");
		onClose();
	};

	return (
		<AnimatePresence>
			{isOpen && (
				<Dialog open={isOpen} onOpenChange={onClose}>
					<DialogContent
						className="
							sm:max-w-md p-6 rounded-3xl shadow-glass backdrop-blur-lg
							bg-[var(--background)] text-[var(--foreground)]
							border border-[color:var(--foreground)]/20
						"
					>
						<DialogHeader>
							<DialogTitle className="text-2xl font-bold tracking-tight">
								Create New Habit
							</DialogTitle>
						</DialogHeader>

						<div className="space-y-6 mt-4">
							{/* Habit Name */}
							<div className="space-y-2">
								<Label htmlFor="habit-name" className="font-medium">
									Habit Name
								</Label>
								<Input
									id="habit-name"
									value={name}
									onChange={(e) => setName(e.target.value)}
									placeholder="e.g., Drink 8 glasses of water"
									className="
										w-full rounded-xl
										bg-[var(--background)] text-[var(--foreground)]
										border border-[color:var(--foreground)]/30
										focus:border-purple-500 focus:ring-purple-200
									"
								/>
							</div>

							{/* Icon Selection */}
							<div className="space-y-2">
								<Label className="font-medium">Choose Icon</Label>
								<div className="grid grid-cols-5 gap-2">
									{HABIT_ICONS.map((habitIcon) => (
										<button
											key={habitIcon}
											onClick={() => setIcon(habitIcon)}
											className={`
												p-3 text-2xl rounded-xl border transition-all
												${
													icon === habitIcon
														? "border-purple-500 bg-purple-100/50 scale-110"
														: "border-[color:var(--foreground)]/30 hover:border-purple-300 hover:bg-[var(--foreground)]/10"
												}
											`}
										>
											{habitIcon}
										</button>
									))}
								</div>
							</div>

							{/* Category */}
							<div className="space-y-2 ">
								<Label className="font-medium">Category</Label>
								<Select
									value={category}
									onValueChange={(value: HabitCategoryValue) =>
										setCategory(value)
									}
								>
									<SelectTrigger
										className="
											rounded-xl
											bg-[var(--background)] text-[var(--foreground)]
											border border-[color:var(--foreground)]/30
											focus:ring-purple-200
										"
									>
										<SelectValue />
									</SelectTrigger>
									<SelectContent className="bg-[var(--background)] text-[var(--foreground)] border border-[color:var(--foreground)]/20">
										{HABIT_CATEGORIES.map((cat) => (
											<SelectItem
												key={cat.value}
												value={cat.value}
												className="hover:bg-[var(--foreground)]/10"
											>
												{cat.label}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							</div>

							{/* Target and Unit */}
							<div className="grid grid-cols-2 gap-4">
								<div className="space-y-2">
									<Label htmlFor="target" className="font-medium">
										Daily Target
									</Label>
									<Input
										id="target"
										type="number"
										value={target}
										onChange={(e) =>
											setTarget(Math.max(1, parseInt(e.target.value) || 1))
										}
										min={1}
										className="
											rounded-xl
											bg-[var(--background)] text-[var(--foreground)]
											border border-[color:var(--foreground)]/30
											focus:ring-purple-200 focus:border-purple-500
										"
									/>
								</div>
								<div className="space-y-2">
									<Label htmlFor="unit" className="font-medium">
										Unit
									</Label>
									<Input
										id="unit"
										value={unit}
										onChange={(e) => setUnit(e.target.value)}
										placeholder="e.g., glasses, minutes"
										className="
											rounded-xl
											bg-[var(--background)] text-[var(--foreground)]
											border border-[color:var(--foreground)]/30
											focus:ring-purple-200 focus:border-purple-500
										"
									/>
								</div>
							</div>

							{/* Preview */}
							<div
								className="
									p-4 rounded-2xl shadow-sm flex items-center gap-3
									bg-[var(--background)] text-[var(--foreground)]
									border border-[color:var(--foreground)]/20
								"
							>
								<div className="text-3xl">{icon}</div>
								<div>
									<h3 className="font-semibold">{name || "Your Habit"}</h3>
									<p className="text-sm opacity-70">
										Target: {target} {unit} daily
									</p>
								</div>
							</div>

							{/* Action Buttons */}
							<div className="flex gap-3 pt-4">
								<Button
									variant="outline"
									onClick={handleClose}
									className="
										flex-1 rounded-xl
										border border-[color:var(--foreground)]/30
										text-[var(--foreground)]
										hover:border-purple-500 hover:bg-[var(--foreground)]/10
									"
								>
									Cancel
								</Button>
								<Button
									onClick={handleSave}
									disabled={!name.trim()}
									className="
										flex-1 rounded-xl shadow-lg
										bg-purple-400 text-white
										hover:opacity-80
									"
								>
									Create Habit
								</Button>
							</div>
						</div>
					</DialogContent>
				</Dialog>
			)}
		</AnimatePresence>
	);
};
