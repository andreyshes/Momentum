"use client";
import { motion } from "framer-motion";

export function BackgroundGlow() {
	return (
		<div className="fixed inset-0 pointer-events-none z-0">
			{[...Array(6)].map((_, i) => (
				<motion.div
					key={i}
					className="absolute w-64 h-64 rounded-full bg-purple-500/10 blur-3xl"
					style={{
						top: `${Math.random() * 80}%`,
						left: `${Math.random() * 80}%`,
					}}
					animate={{ y: ["0%", "5%", "0%"], x: ["0%", "5%", "0%"] }}
					transition={{
						duration: 20 + i * 2,
						repeat: Infinity,
						ease: "easeInOut",
					}}
				/>
			))}
		</div>
	);
}
