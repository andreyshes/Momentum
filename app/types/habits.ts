export interface HabitEntry {
	id: string;
	habitId: string;
	date: string; // ISO date string
	value: number; // 0-100 intensity or specific values
	completed: boolean;
	notes?: string;
}

export interface Habit {
	id: string;
	name: string;
	icon: string;
	color: string;
	unit: string;
	target: number;
	category: "health" | "fitness" | "wellness" | "productivity";
}

export interface HabitStats {
	currentStreak: number;
	longestStreak: number;
	totalDays: number;
	completionRate: number;
	averageValue: number;
}

export interface Badge {
	id: string;
	name: string;
	description: string;
	icon: string;
	unlocked: boolean;
	requirement: string;
}
