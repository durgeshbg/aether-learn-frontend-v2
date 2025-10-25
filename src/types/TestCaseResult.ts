import type { TestCase } from "./TestCase";

export type TestCaseResultStatus =
  | "IN_QUEUE"
  | "PROCESSING"
  | "ACCEPTED"
  | "WRONG_ANSWER"
  | "TIME_LIMIT_EXCEEDED"
  | "COMPILATION_ERROR"
  | "RUNTIME_ERROR_SIGSEGV"
  | "RUNTIME_ERROR_SIGXFSZ"
  | "RUNTIME_ERROR_SIGFPE"
  | "RUNTIME_ERROR_SIGABRT"
  | "RUNTIME_ERROR_NZEC"
  | "RUNTIME_ERROR_OTHER"
  | "INTERNAL_ERROR"
  | "EXEC_FORMAT_ERROR";

export type TestCaseResult = {
  id: string;
  passed: string;
  testCase: TestCase;
  stdout: string;
  stderr: string;
  time: number;
  memory: number;
  status: TestCaseResultStatus;
};
