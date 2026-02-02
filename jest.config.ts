import type { Config } from "jest";
import nextJest from "next/jest";

const createJestConfig = nextJest({
  // Path to your Next.js app to load next.config.js and .env files
  dir: "./",
});

const config: Config = {
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
  testEnvironment: "jest-environment-jsdom",
  collectCoverage: true,
  collectCoverageFrom: [
    "src/**/*.{js,jsx,ts,tsx}",
    "!src/**/*.d.ts",
    "!src/**/_app.tsx",
    "!src/**/_document.tsx",
  ],
  // Mandatory: 80% coverage threshold for the assignment
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
  moduleNameMapper: {
    // Handle path aliases (if you use @/ in your imports)
    "^@/(.*)$": "<rootDir>/src/$1",
  },
};

export default createJestConfig(config);
