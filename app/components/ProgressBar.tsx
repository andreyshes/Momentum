"use client";

import { motion } from "framer-motion";

interface ProgressBarProps {
	value: number;
	max: number;
	label?: string;
	className?: string;
}

export default function ProgressBar({
	value,
	max,
	label,
	className = "",
}: ProgressBarProps) {
	const percent = Math.min((value / max) * 100, 100);
	const percentText = Math.round(percent);

	return (
		<div className={`space-y-2 ${className}`}>
			{label && (
				<div className="flex justify-between text-sm font-medium text-[color:var(--foreground)]/80">
					<span>{label}</span>
				</div>
			)}

			<div
				className="relative w-full h-5 rounded-full overflow-hidden
                      bg-[color:var(--foreground)]/10 backdrop-blur-md
                      border border-[color:var(--foreground)]/15 shadow-inner"
			>
				<motion.div
					initial={{ width: 0 }}
					animate={{ width: `${percent}%` }}
					transition={{ duration: 1.2, ease: "easeOut" }}
					className="absolute left-0 top-0 h-full rounded-full
                     bg-gradient-to-r from-purple-500 via-pink-500 to-orange-400
                     animate-gradientShift shadow-[0_0_12px_rgba(0,0,0,0.2)]
                     dark:shadow-[0_0_12px_rgba(255,255,255,0.15)]"
				/>

				<motion.div
					initial={{ opacity: 0, y: 8 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.3 }}
					className="absolute right-2 top-1/2 -translate-y-1/2 px-2 py-0.5
                     text-xs font-semibold rounded-full
                     bg-[var(--background)] text-[var(--foreground)]
                     shadow-md border border-[color:var(--foreground)]/10"
				>
					{percentText}%
				</motion.div>
			</div>
		</div>
	);
}
