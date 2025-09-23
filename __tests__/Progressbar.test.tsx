import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import ProgressBar from "../app/components/ProgressBar";

test("renders label", () => {
	render(<ProgressBar value={50} max={100} label="Goal" />);
	expect(screen.getByText(/Goal/i)).toBeInTheDocument();
});

test("streak calculation", () => {
  
})