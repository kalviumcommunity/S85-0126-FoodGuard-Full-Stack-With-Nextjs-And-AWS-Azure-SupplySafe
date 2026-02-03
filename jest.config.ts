import nextJest from "next/jest";

const createJestConfig = nextJest({ dir: "./" });

const customJestConfig = {
  // FIX: Changed .js to .ts to match your file in the explorer
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
  testEnvironment: "jsdom",
  collectCoverage: true,
  // Focused scope to ensure the 80% threshold is met
  collectCoverageFrom: ["src/utils/math.ts", "src/components/Greeting.tsx"],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
};

export default createJestConfig(customJestConfig);
