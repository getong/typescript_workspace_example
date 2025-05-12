import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import Greeting from "./Greeting";

describe("Greeting", () => {
  it("renders greeting message with provided name", () => {
    render(<Greeting name="John" />);
    const greetingElement = screen.getByText("Hello, John!");
    expect(greetingElement).to.exist;
  });
});
