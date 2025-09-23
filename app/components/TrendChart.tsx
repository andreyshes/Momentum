"use client";

import { useMemo } from "react";
import {
	LineChart,
	Line,
	XAxis,
	YAxis,
	Tooltip,
	ResponsiveContainer,
	CartesianGrid,
} from "recharts";
import { Habit, HabitEntry } from "@/app/types/habits";

interface TrendChartProps {
	habit: Habit;
	entries: HabitEntry[];
	className?: string;
}

/**
 * Shows a simple line graph of a habit's progress over time.
 */
export default function TrendChart({
	habit,
	entries,
	className = "",
}: TrendChartProps) {
	// Prepare weekly aggregated data
	const data = useMemo(() => {
		// Filter entries for this habit, sort by date ascending
		const filtered = entries
			.filter((e) => e.habitId === habit.id)
			.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

		return filtered.map((e) => ({
			date: e.date,
			value: e.value,
		}));
	}, [entries, habit.id]);

	if (!data.length) {
		return (
			<div className={`p-4 text-center text-muted-foreground ${className}`}>
				No data yet to display a trend.
			</div>
		);
	}

	return (
		<div
			className={`p-4 rounded-2xl border border-[var(--border)] bg-[var(--background)] shadow-md ${className}`}
		>
			<h3 className="text-lg font-semibold mb-4">
				{habit.name} – Trend Over Time
			</h3>
			<ResponsiveContainer width="100%" height={250}>
				<LineChart data={data}>
					<CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
					<XAxis
						dataKey="date"
						tickFormatter={(d) => d.slice(5)} // show MM-DD
						stroke="var(--foreground)"
					/>
					<YAxis stroke="var(--foreground)" />
					<Tooltip
						contentStyle={{
							backgroundColor: "var(--background)",
							border: "1px solid var(--border)",
							borderRadius: "0.5rem",
						}}
					/>
					<Line
						type="monotone"
						dataKey="value"
						stroke="#a855f7"
						strokeWidth={3}
						dot={{ r: 3 }}
						activeDot={{ r: 6 }}
					/>
				</LineChart>
			</ResponsiveContainer>
		</div>
	);
}
