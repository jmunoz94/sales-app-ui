import { render, screen } from "@testing-library/react";
import App from "./App";

test("renders Products link", () => {
  render(<App />);
  const linkElement = screen.getByText(/Products/i);
  expect(linkElement).toBeInTheDocument();
});
