"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Sun, Moon } from "lucide-react";

export const DarkModeToggle = () => {
	const [mounted, setMounted] = useState(false);
	const [isDark, setIsDark] = useState(false);

	// Run only on client
	useEffect(() => {
		setMounted(true);

		const saved = localStorage.getItem("theme");
		if (
			saved === "dark" ||
			(!saved && window.matchMedia("(prefers-color-scheme: dark)").matches)
		) {
			document.documentElement.classList.add("dark");
			setIsDark(true);
		}
	}, []);

	const toggleDarkMode = () => {
		const next = !isDark;
		setIsDark(next);
		document.documentElement.classList.toggle("dark", next);
		localStorage.setItem("theme", next ? "dark" : "light");
	};

	// Don’t render anything until after hydration
	if (!mounted) return null;

	return (
		<div className="flex items-center gap-3">
			<Sun
				className={`w-5 h-5 ${isDark ? "text-gray-400" : "text-yellow-400"}`}
			/>
			<motion.button
				onClick={toggleDarkMode}
				className={`relative w-14 h-7 rounded-full p-1 flex items-center shadow-inner transition-colors
          ${isDark ? "justify-end bg-gray-700" : "justify-start bg-gray-300"}`}
				whileHover={{ scale: 1.05 }}
				whileTap={{ scale: 0.95 }}
			>
				<motion.div
					className="w-5 h-5 rounded-full shadow-md bg-white dark:bg-yellow-400"
					layout
					transition={{ type: "spring", stiffness: 500, damping: 28 }}
				/>
			</motion.button>
			<Moon
				className={`w-5 h-5 ${isDark ? "text-yellow-400" : "text-gray-400"}`}
			/>
		</div>
	);
};
