declare function describe(name: string, fn: () => void): void;
declare function it(name: string, fn: () => void | Promise<void>): void;
declare function test(name: string, fn: () => void | Promise<void>): void;
declare function beforeEach(fn: () => void | Promise<void>): void;
declare function afterEach(fn: () => void | Promise<void>): void;

interface JestMatchers {
  toBeDefined(): void;
  toBeUndefined(): void;
  toBeNull(): void;
  toBe(expected: any): void;
  toEqual(expected: any): void;
  toBeTruthy(): void;
  toBeFalsy(): void;
  toContain(item: any): void;
  toThrow(message?: string | RegExp): void;
  toBeInstanceOf(expected: any): void;
  toHaveBeenCalled(): void;
  toHaveBeenCalledTimes(count: number): void;
  toHaveBeenCalledWith(...args: any[]): void;
  toHaveLength(length: number): void;
  toBeCloseTo(expected: number, numDigits?: number): void;
  toBeGreaterThan(expected: number): void;
  toBeLessThan(expected: number): void;
  toBeGreaterThanOrEqual(expected: number): void;
  toBeLessThanOrEqual(expected: number): void;
  not: JestMatchers;
}

interface Expect {
  (actual: any): JestMatchers;
  objectContaining(expected: any): any;
}

declare const expect: Expect;
