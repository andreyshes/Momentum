"use client";

import { ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface PageTransitionProps {
	children: ReactNode;
	className?: string;
}

const pageVariants = {
	initial: { opacity: 0, y: 20, scale: 0.98 },
	animate: { opacity: 1, y: 0, scale: 1 },
	exit: { opacity: 0, y: -20, scale: 1.02 },
};

export const PageTransition = ({
	children,
	className = "",
}: PageTransitionProps) => {
	return (
		<AnimatePresence mode="wait">
			<motion.div
				initial="initial"
				animate="animate"
				exit="exit"
				variants={pageVariants}
				transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
				className={`bg-[color:var(--background)] text-[color:var(--foreground)] ${className}`}
			>
				{children}
			</motion.div>
		</AnimatePresence>
	);
};
