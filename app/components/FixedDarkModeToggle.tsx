"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { DarkModeToggle } from "./DarkModeToggle";

export function FixedDarkModeToggle() {
	// Only portal on the client
	const [mounted, setMounted] = useState(false);
	useEffect(() => setMounted(true), []);

	const node = (
		<div
			// Inline styles ensure correct position even before CSS is ready
			style={{
				position: "fixed",
				top: 16,
				right: 16,
				zIndex: 2147483647, // above everything
			}}
		>
			<DarkModeToggle />
		</div>
	);

	// During SSR this component renders nothing (no header flash),
	// after mount we portal it to <body>.
	return mounted ? createPortal(node, document.body) : null;
}
