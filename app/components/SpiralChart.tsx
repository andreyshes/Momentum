"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useAnimation } from "framer-motion";
import * as d3 from "d3";
import { HabitEntry, Habit } from "@/app/types/habits";

interface SpiralChartProps {
	habit: Habit;
	entries: HabitEntry[];
	className?: string;
}

export const SpiralChart = ({
	habit,
	entries,
	className = "",
}: SpiralChartProps) => {
	const svgRef = useRef<SVGSVGElement>(null);
	const [isHovered, setIsHovered] = useState(false);
	const controls = useAnimation();
	const [highlightedEntry, setHighlightedEntry] = useState<string | null>(null);

	// Highlight newest entry
	useEffect(() => {
		const habitEntries = entries.filter((e) => e.habitId === habit.id);
		if (!habitEntries.length) return;
		const latestEntry = habitEntries[habitEntries.length - 1];
		setHighlightedEntry(latestEntry.id);
		const timer = setTimeout(() => setHighlightedEntry(null), 800);
		return () => clearTimeout(timer);
	}, [entries, habit.id]);

	// Draw spiral
	useEffect(() => {
		if (!svgRef.current) return;

		const svg = d3.select(svgRef.current);
		svg.selectAll("*").remove();

		const width = 200;
		const height = 200;
		const centerX = width / 2;
		const centerY = height / 2;

		const days = [];
		const today = new Date();

		for (let i = 29; i >= 0; i--) {
			const date = new Date(today);
			date.setDate(date.getDate() - i);
			const dateStr = date.toISOString().split("T")[0];
			const entry = entries.find(
				(e) => e.date === dateStr && e.habitId === habit.id
			);

			days.push({
				date,
				dateStr,
				value: entry?.value || 0,
				completed: entry?.completed || false,
				dayIndex: 29 - i,
				id: entry?.id || "",
			});
		}

		const maxRadius = 80;
		const turns = 2.5;

		days.forEach((day, index) => {
			const angle = (index / days.length) * turns * 2 * Math.PI;
			const radius = (index / days.length) * maxRadius;
			const x = centerX + radius * Math.cos(angle);
			const y = centerY + radius * Math.sin(angle);

			const dotRadius = day.completed ? 4 + (day.value / habit.target) * 3 : 2;

			// Glow ring for newest entry
			if (highlightedEntry === day.id) {
				svg
					.append("circle")
					.attr("cx", x)
					.attr("cy", y)
					.attr("r", dotRadius + 4)
					.attr("fill", "rgba(128,90,255,0.4)")
					.transition()
					.duration(800)
					.attr("r", dotRadius);
			}

			// Main dot
			svg
				.append("circle")
				.attr("cx", x)
				.attr("cy", y)
				.attr("r", 0)
				.attr(
					"fill",
					day.completed ? habit.color : "hsl(var(--foreground) / 0.3)"
				)
				.attr(
					"stroke",
					day.completed ? "var(--foreground)" : "hsl(var(--foreground) / 0.2)"
				)
				.attr("stroke-width", 1)
				.transition()
				.delay(index * 50)
				.duration(300)
				.attr("r", dotRadius);

			// Connective path
			if (index > 0) {
				const prevAngle = ((index - 1) / days.length) * turns * 2 * Math.PI;
				const prevRadius = ((index - 1) / days.length) * maxRadius;
				const prevX = centerX + prevRadius * Math.cos(prevAngle);
				const prevY = centerY + prevRadius * Math.sin(prevAngle);

				svg
					.append("path")
					.attr("d", `M ${prevX} ${prevY} Q ${centerX} ${centerY} ${x} ${y}`)
					.attr("stroke", "hsl(var(--foreground) / 0.2)")
					.attr("stroke-width", 1)
					.attr("fill", "none")
					.attr("opacity", 0.3)
					.style("stroke-dasharray", "2,2");
			}
		});

		// Center icon
		svg
			.append("text")
			.attr("x", centerX)
			.attr("y", centerY)
			.attr("text-anchor", "middle")
			.attr("dominant-baseline", "middle")
			.attr("font-size", "28")
			.text(habit.icon);
	}, [habit, entries, highlightedEntry]);

	const completedDays = entries.filter(
		(e) => e.habitId === habit.id && e.completed
	).length;

	// Hover animation
	useEffect(() => {
		if (isHovered) {
			controls.start({
				scale: [1, 1.05, 1],
				filter: [
					"drop-shadow(0 0 6px rgba(128,90,255,0.5))",
					"drop-shadow(0 0 16px rgba(128,90,255,0.8))",
					"drop-shadow(0 0 6px rgba(128,90,255,0.5))",
				],
				transition: { duration: 1, repeat: Infinity, ease: "easeInOut" },
			});
		} else {
			controls.start({ scale: 1, filter: "none" });
		}
	}, [isHovered, controls]);

	return (
		<motion.div
			className={`flex flex-col items-center p-4 rounded-2xl bg-[color:var(--background)] text-[color:var(--foreground)] shadow-md ${className}`}
		>
			<div className="text-center mb-3">
				<h3 className="font-semibold">{habit.name} Spiral</h3>
				<p className="text-sm opacity-80">30-day journey</p>
			</div>

			<motion.div
				className="relative"
				onHoverStart={() => setIsHovered(true)}
				onHoverEnd={() => setIsHovered(false)}
				animate={controls}
			>
				<svg
					ref={svgRef}
					width="200"
					height="200"
					viewBox="0 0 200 200"
					className="transition-all duration-300"
				/>
				<motion.div
					className="absolute -bottom-2 left-1/2 transform -translate-x-1/2"
					initial={{ y: 10, opacity: 0 }}
					animate={{ y: 0, opacity: 1 }}
					transition={{ delay: 0.8 }}
				>
					<div className="bg-purple-500 text-white px-3 py-1 rounded-full text-xs font-medium shadow-glow">
						{completedDays} days completed
					</div>
				</motion.div>
			</motion.div>
		</motion.div>
	);
};
