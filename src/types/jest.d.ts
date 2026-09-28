declare function describe(name: string, fn: () => void): void;
declare function it(name: string, fn: () => void | Promise<void>): void;
declare function test(name: string, fn: () => void | Promise<void>): void;
declare function beforeEach(fn: () => void | Promise<void>): void;
declare function afterEach(fn: () => void | Promise<void>): void;

interface Expect {
  (actual: any): {
    toBeDefined(): void;
    toBeNull(): void;
    toBe(expected: any): void;
    toEqual(expected: any): void;
    toBeTruthy(): void;
    toBeFalsy(): void;
    toContain(item: any): void;
    toThrow(message?: string | RegExp): void;
  };
}

declare const expect: Expect;
