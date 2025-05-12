import { expect, afterEach } from "vitest";
import { cleanup } from "@testing-library/react";
import matchers from "@testing-library/jest-dom/matchers";

// Only extend if both expect and matchers are defined
if (expect && matchers) {
  expect.extend(matchers);
}

// Clean up after each test
afterEach(() => {
  cleanup();
});
