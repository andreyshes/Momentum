import { renderHook, act, waitFor } from "@testing-library/react";
import { useHabits } from "../app/hooks/useHabits";

const HABIT_INPUT = {
	name: "Morning Run",
	icon: "🏃",
	color: "#ff5722",
	unit: "km",
	target: 5,
	category: "fitness" as const,
};

describe("useHabits", () => {
	beforeEach(() => {
		localStorage.clear();
	});

	afterEach(() => {
		jest.useRealTimers();
		jest.restoreAllMocks();
	});

	test("persists habits and entries to localStorage", async () => {
		jest.useFakeTimers();
		jest.setSystemTime(new Date("2024-05-10T07:00:00Z"));

		const { result, unmount } = renderHook(() => useHabits());
		await waitFor(() => expect(result.current.loading).toBe(false));

		act(() => {
			result.current.addHabit(HABIT_INPUT);
		});
		await waitFor(() => expect(result.current.habits).toHaveLength(1));

		const habitId = result.current.habits[0].id;

		act(() => {
			result.current.addEntry({
				habitId,
				date: "2024-05-10",
				value: 6,
				completed: true,
				notes: "Morning session",
			});
		});
		await waitFor(() => expect(result.current.entries).toHaveLength(1));

		const storedHabits = JSON.parse(localStorage.getItem("momentum-habits") ?? "[]");
		const storedEntries = JSON.parse(localStorage.getItem("momentum-entries") ?? "[]");

		expect(storedHabits[0]).toMatchObject({ name: "Morning Run", unit: "km" });
		expect(storedEntries[0]).toMatchObject({ habitId, value: 6 });

		unmount();

		const { result: persisted } = renderHook(() => useHabits());
		await waitFor(() => expect(persisted.current.loading).toBe(false));

		expect(persisted.current.habits).toHaveLength(1);
		expect(persisted.current.entries).toHaveLength(1);
		expect(persisted.current.habits[0].id).toBe(persisted.current.entries[0].habitId);
	});

	test("computes streak and completion statistics", async () => {
		jest.useFakeTimers();
		jest.setSystemTime(new Date("2024-05-10T07:00:00Z"));

		const { result } = renderHook(() => useHabits());
		await waitFor(() => expect(result.current.loading).toBe(false));

		act(() => {
			result.current.addHabit(HABIT_INPUT);
		});
		await waitFor(() => expect(result.current.habits).toHaveLength(1));

		const habitId = result.current.habits[0].id;

		const entries = [
			{ date: "2024-05-10", value: 5, completed: true },
			{ date: "2024-05-09", value: 5, completed: true },
			{ date: "2024-05-08", value: 3, completed: false },
			{ date: "2024-05-06", value: 5, completed: true },
			{ date: "2024-05-05", value: 5, completed: true },
			{ date: "2024-05-04", value: 5, completed: true },
		];

		for (const entry of entries) {
			act(() => {
				result.current.addEntry({
					habitId,
					date: entry.date,
					value: entry.value,
					completed: entry.completed,
				});
			});
		}

		await waitFor(() => expect(result.current.entries).toHaveLength(entries.length));

		const stats = result.current.getHabitStats(habitId);

		expect(stats.currentStreak).toBe(2);
		expect(stats.longestStreak).toBe(3);
		expect(stats.totalDays).toBe(entries.length);
		expect(stats.completionRate).toBeCloseTo((5 / entries.length) * 100, 5);
		expect(stats.averageValue).toBeCloseTo(28 / entries.length, 5);
	});
});
