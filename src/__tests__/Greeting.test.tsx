import { render, screen } from "@testing-library/react";
import Greeting from "@/components/Greeting";

describe("Greeting Component", () => {
  it("renders the correct name", () => {
    render(<Greeting name="Gemini" />);
    const message = screen.getByText(/hello, gemini/i);
    expect(message).toBeInTheDocument();
  });
});
