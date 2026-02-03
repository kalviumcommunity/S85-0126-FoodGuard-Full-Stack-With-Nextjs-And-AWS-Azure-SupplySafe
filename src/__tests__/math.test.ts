import { add } from "../utils/math";

describe("Math Utils", () => {
  test("adds two numbers correctly", () => {
    expect(add(2, 3)).toBe(5);
  });
});
