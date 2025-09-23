"use client";

import { useState, useEffect, useCallback } from "react";
import { Habit, HabitEntry, HabitStats } from "@/app/types/habits";

const STORAGE_KEY = "momentum-habits";
const ENTRIES_KEY = "momentum-entries";

export const useHabits = () => {
	const [habits, setHabits] = useState<Habit[]>([]);
	const [entries, setEntries] = useState<HabitEntry[]>([]);
	const [loading, setLoading] = useState(true);

	// Load from localStorage on mount
	useEffect(() => {
		if (typeof window === "undefined") return;

		const savedHabits = localStorage.getItem(STORAGE_KEY);
		const savedEntries = localStorage.getItem(ENTRIES_KEY);

		if (savedHabits) setHabits(JSON.parse(savedHabits));
		if (savedEntries) setEntries(JSON.parse(savedEntries));

		setLoading(false);
	}, []);

	// Persist habits
	const saveHabits = (newHabits: Habit[]) => {
		setHabits(newHabits);
		if (typeof window !== "undefined") {
			localStorage.setItem(STORAGE_KEY, JSON.stringify(newHabits));
		}
	};

	// Persist entries
	const saveEntries = (newEntries: HabitEntry[]) => {
		setEntries(newEntries);
		if (typeof window !== "undefined") {
			localStorage.setItem(ENTRIES_KEY, JSON.stringify(newEntries));
		}
	};

	/** Habit functions **/
	const addHabit = (habit: Omit<Habit, "id">) => {
		const newHabit: Habit = {
			...habit,
			id: `habit-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
		};
		saveHabits([...habits, newHabit]);
	};

	const deleteHabit = (habitId: string) => {
		saveHabits(habits.filter((h) => h.id !== habitId));
		// Remove associated entries
		saveEntries(entries.filter((e) => e.habitId !== habitId));
	};

	const clearAllData = () => {
		saveHabits([]);
		saveEntries([]);
		localStorage.removeItem(STORAGE_KEY);
		localStorage.removeItem(ENTRIES_KEY);
	};

	/** Entry functions **/
	const addEntry = (entry: Omit<HabitEntry, "id">) => {
		const newEntry: HabitEntry = {
			...entry,
			id: `${entry.habitId}-${entry.date}-${Date.now()}`,
		};

		// Replace any existing entry for the same habit/date
		const filteredEntries = entries.filter(
			(e) => !(e.habitId === entry.habitId && e.date === entry.date)
		);
		saveEntries([...filteredEntries, newEntry]);
	};

	const updateEntry = (entryId: string, updates: Partial<HabitEntry>) => {
		const newEntries = entries.map((entry) =>
			entry.id === entryId ? { ...entry, ...updates } : entry
		);
		saveEntries(newEntries);
	};

	const deleteEntry = (entryId: string) => {
		saveEntries(entries.filter((entry) => entry.id !== entryId));
	};

	/** Stats calculation **/
	const getHabitStats = useCallback(
		(habitId: string): HabitStats => {
			const habitEntries = entries
				.filter((e) => e.habitId === habitId)
				.sort(
					(a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
				);

			if (habitEntries.length === 0) {
				return {
					currentStreak: 0,
					longestStreak: 0,
					totalDays: 0,
					completionRate: 0,
					averageValue: 0,
				};
			}

			let currentStreak = 0;
			let longestStreak = 0;
			let tempStreak = 0;

			const today = new Date();
			today.setHours(0, 0, 0, 0);

			// Current streak (consecutive completed days)
			for (let i = 0; i < 30; i++) {
				const checkDate = new Date(today);
				checkDate.setDate(checkDate.getDate() - i);
				const dateStr = checkDate.toISOString().split("T")[0];

				const entry = habitEntries.find((e) => e.date === dateStr);
				if (entry?.completed) {
					currentStreak++;
				} else {
					if (i === 0) currentStreak = 0;
					break;
				}
			}

			// Longest streak
			habitEntries.forEach((entry) => {
				if (entry.completed) {
					tempStreak++;
					longestStreak = Math.max(longestStreak, tempStreak);
				} else {
					tempStreak = 0;
				}
			});

			const completedEntries = habitEntries.filter((e) => e.completed);
			const completionRate =
				habitEntries.length > 0
					? (completedEntries.length / habitEntries.length) * 100
					: 0;

			const averageValue =
				habitEntries.length > 0
					? habitEntries.reduce((sum, e) => sum + e.value, 0) /
					  habitEntries.length
					: 0;

			return {
				currentStreak,
				longestStreak,
				totalDays: habitEntries.length,
				completionRate,
				averageValue,
			};
		},
		[entries]
	);

	/** Helper functions **/
	const getEntriesForDate = (date: string) =>
		entries.filter((e) => e.date === date);

	const getEntriesForHabit = (habitId: string) =>
		entries
			.filter((e) => e.habitId === habitId)
			.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

	return {
		habits,
		entries,
		loading,
		addHabit,
		deleteHabit,
		clearAllData,
		addEntry,
		updateEntry,
		deleteEntry,
		getHabitStats,
		getEntriesForDate,
		getEntriesForHabit,
	};
};
