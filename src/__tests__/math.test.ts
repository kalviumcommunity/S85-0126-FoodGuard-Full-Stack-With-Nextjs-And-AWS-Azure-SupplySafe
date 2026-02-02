import { add } from "@/utils/math";

describe("Math Logic", () => {
  it("correctly adds two numbers", () => {
    expect(add(2, 3)).toBe(5);
  });
});
