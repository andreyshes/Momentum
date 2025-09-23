"use client";

import { useState, useEffect } from "react";

const MOBILE_BREAKPOINT = 768;

export function useIsMobile(): boolean {
	const [isMobile, setIsMobile] = useState<boolean>(false);

	useEffect(() => {
		// Guard against SSR
		if (typeof window === "undefined") return;

		const checkMobile = () => {
			setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
		};

		checkMobile(); // Initial check

		const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);
		mql.addEventListener("change", checkMobile);

		return () => {
			mql.removeEventListener("change", checkMobile);
		};
	}, []);

	return isMobile;
}
