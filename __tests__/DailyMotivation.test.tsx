import { render, screen } from "@testing-library/react";
import type { ReactNode } from "react";
import DailyMotivation from "../app/components/DailyMotivation";

jest.mock("framer-motion", () => ({
	motion: {
		div: ({ children, ...rest }: { children: ReactNode }) => (
			<div {...rest}>{children}</div>
		),
	},
}));

const originalFetch = globalThis.fetch;

describe("DailyMotivation", () => {
	afterEach(() => {
		globalThis.fetch = originalFetch;
		jest.restoreAllMocks();
	});

	test("renders quote from API", async () => {
		const mockQuote = [{ q: "Test quote", a: "Tester" }];
		const fetchMock = jest.fn().mockResolvedValue({
			json: jest.fn().mockResolvedValue(mockQuote),
		});
		globalThis.fetch = fetchMock as unknown as typeof fetch;

		render(<DailyMotivation />);

		expect(screen.getByText(/Loading inspiration/i)).toBeInTheDocument();

		expect(await screen.findByText(/Test quote/i)).toBeInTheDocument();
		expect(screen.getByText(/Tester/)).toBeInTheDocument();
		expect(fetchMock).toHaveBeenCalledWith("/api/quote");
	});

	test("falls back to default message when fetch fails", async () => {
		const fetchMock = jest.fn().mockResolvedValue({
			json: jest.fn().mockResolvedValue([]),
		});
		globalThis.fetch = fetchMock as unknown as typeof fetch;
		const errorSpy = jest.spyOn(console, "error").mockImplementation(() => {});

		render(<DailyMotivation />);

		expect(
			await screen.findByText(
				/Stay consistent\. Tiny daily wins build unstoppable momentum\./i
			)
		).toBeInTheDocument();
		expect(screen.getByText(/Momentum App/)).toBeInTheDocument();
		expect(errorSpy).toHaveBeenCalled();
	});
});
