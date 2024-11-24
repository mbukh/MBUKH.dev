/* eslint-disable @typescript-eslint/no-empty-object-type */
import { TestingLibraryMatchers } from '@testing-library/jest-dom/matchers';
import 'bun:test';

declare module 'bun:test' {
  interface Matchers<T> extends TestingLibraryMatchers<typeof expect.stringContaining, T> {}
  interface AsymmetricMatchers extends TestingLibraryMatchers {}
}
