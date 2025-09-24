import { render, screen } from "@testing-library/react";
import ProgressBar from "../app/components/ProgressBar";

describe("ProgressBar", () => {
	test("renders label and percent for partial progress", () => {
		render(<ProgressBar value={30} max={60} label="Weekly Goal" />);
		expect(screen.getByText("Weekly Goal")).toBeInTheDocument();
		expect(screen.getByText("50%")).toBeInTheDocument();
	});

	test("caps displayed progress at 100%", () => {
		render(<ProgressBar value={150} max={100} />);
		expect(screen.getByText("100%")).toBeInTheDocument();
	});
});
