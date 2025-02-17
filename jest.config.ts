import { JestConfigWithTsJest, pathsToModuleNameMapper } from "ts-jest";
import { compilerOptions } from "./tsconfig.json";

const config: JestConfigWithTsJest = {
  preset: "@shelf/jest-mongodb",
  testEnvironment: "node",
  testRegex: "(tests/.*|(\\.|/)(test|spec))\\.(tsx?)$",
  transform: {
    "^.+\\.tsx?$": "ts-jest"
  },
  clearMocks: true,
  collectCoverage: true,
  collectCoverageFrom: ["src/**/*.ts", "!src/**/*.d.ts"],
  coverageDirectory: "coverage",
  coverageProvider: "v8",
  errorOnDeprecated: true,
  // The maximum amount of workers used to run your tests. Can be specified as % or a number. E.g. maxWorkers: 10% will use 10% of your CPU amount + 1 as the maximum worker number. maxWorkers: 2 will use a maximum of 2 workers.
  maxWorkers: "50%",
  // moduleDirectories: ['node_modules', '<rootDir>'],
  testPathIgnorePatterns: ["\\\\node_modules\\\\"],
  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, {
    prefix: "<rootDir>/"
  }),
  verbose: true
};

export default config;
