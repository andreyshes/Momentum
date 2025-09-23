"use client";

import { motion } from "framer-motion";
import { format } from "date-fns";

interface TodayProgressProps {
	currentStreak: number;
	className?: string;
}

export const TodayProgress = ({
	currentStreak,
	className = "",
}: TodayProgressProps) => {
	const today = new Date();
	const dayName = format(today, "EEEE");
	const date = format(today, "MMMM d, yyyy");

	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			className={`bg-[color:var(--background)] text-[color:var(--foreground)] border border-[color:var(--foreground)]/20 rounded-3xl p-8 shadow-lg font-sans ${className}`}
		>
			{/* Header */}
			<div className="flex items-center justify-between mb-6">
				<h3 className="text-xl md:text-2xl font-semibold tracking-tight">
					Today&apos;s Progress
				</h3>
				<motion.div
					animate={{ rotate: [0, 15, -15, 0] }}
					transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
					className="text-3xl md:text-4xl"
				>
					📅
				</motion.div>
			</div>

			{/* Date Display */}
			<div className="text-center mb-6">
				<motion.div
					key={dayName}
					initial={{ y: 10, opacity: 0 }}
					animate={{ y: 0, opacity: 1 }}
					className="text-2xl md:text-3xl font-bold mb-1"
					style={{ color: "var(--foreground)" }}
				>
					{dayName}
				</motion.div>
				<div className="text-sm md:text-base opacity-70">{date}</div>
			</div>

			{/* 7-Day Streak */}
			<div className="border-t border-[color:var(--foreground)]/20 pt-6">
				<div className="text-center mb-4">
					<div className="text-sm opacity-60 mb-1">7-Day Streak</div>
					<motion.div
						key={currentStreak}
						initial={{ scale: 1.1 }}
						animate={{ scale: 1 }}
						transition={{ duration: 0.5, ease: "easeOut" }}
						className={`text-3xl md:text-4xl font-extrabold mb-1 ${
							currentStreak >= 7
								? "text-green-600"
								: currentStreak > 0
								? "text-yellow-500"
								: "opacity-50"
						}`}
					>
						{currentStreak}
					</motion.div>
					<div className="text-xs md:text-sm opacity-70">
						{currentStreak >= 7
							? "🔥 On fire!"
							: currentStreak > 0
							? "Building momentum..."
							: "Start your streak today!"}
					</div>
				</div>

				{/* Streak Pills */}
				<div className="flex justify-center gap-2 mt-4">
					{Array.from({ length: 7 }).map((_, index) => (
						<motion.div
							key={index}
							initial={{ scale: 0, opacity: 0 }}
							animate={{
								scale: index < currentStreak ? 1 : 0.8,
								opacity: index < currentStreak ? 1 : 0.3,
							}}
							transition={{ delay: index * 0.1, duration: 0.4 }}
							className={`w-4 md:w-5 h-2 md:h-2.5 rounded-full transition-all ${
								index < currentStreak
									? "bg-gradient-to-r from-green-400 via-green-500 to-green-600 shadow-md"
									: "bg-[color:var(--foreground)]/20"
							}`}
						/>
					))}
				</div>
			</div>
		</motion.div>
	);
};
