import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import Button from "./Button";

describe("Button", () => {
  it("renders the Button component", () => {
    render(<Button label="Click Me" />);
    const buttonElement = screen.getByText(/click me/i);
    expect(buttonElement).to.exist;
  });
});
