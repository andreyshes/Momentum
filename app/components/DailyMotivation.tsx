"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

// Simple type for the API response
interface Quote {
	q: string; // quote text
	a: string; // author
}

export default function DailyMotivation() {
	const [quote, setQuote] = useState<Quote | null>(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		async function loadQuote() {
			try {
				const res = await fetch("/api/quote");
				const data: Quote[] = await res.json();
				if (!data || !data.length) throw new Error("No quote data");
				console.log(data);
				setLoading(false);
				setQuote(data[0]);
			} catch (err) {
				console.error("Quote fetch failed", err);
				setQuote({
					q: "Stay consistent. Tiny daily wins build unstoppable momentum.",
					a: "Momentum App",
				});
				setLoading(false);
			}
		}
		loadQuote();
	}, []);

	if (loading) {
		return (
			<motion.div
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				className="flex justify-center text-sm text-muted-foreground"
			>
				Loading inspiration…
			</motion.div>
		);
	}

	if (!quote) return null;

	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.6, ease: "easeOut" }}
			className="mx-auto max-w-xl rounded-2xl border border-[var(--border)] 
                 bg-[var(--background)]/70 backdrop-blur-md p-6 shadow-md
                 text-center"
		>
			<p className="text-lg md:text-xl font-medium italic mb-3 text-[var(--foreground)]">
				“{quote.q}”
			</p>
			<p className="text-sm font-semibold text-[var(--foreground)]/70">
				— {quote.a}
			</p>
		</motion.div>
	);
}
