type PromiseExecutor<T> = (
    resolve: (value: T | PromiseLike<T> | undefined) => void, 
    reject?: (reason: any) => void
) => never;

type Amount = number | TimeDefinition;

/**
 * Accumulated amount of time.
 */
interface TimeDefinition {
    [unit: string]: number | undefined;

    ms?: number;

    sec?: number;
    second?: number;
    seconds?: number;

    min?: number;
    minute?: number;
    minutes?: number;

    hr?: number;
    hour?: number;
    hours?: number;

    day?: number;
    days?: number;

    wk?: number;
    week?: number;
    weeks?: number;
}

/**
 * Caluclate milliseconds in given amount of time.
 * 
 * @param time [TimeDefinition] containing various units of time. 
 * 
 * e.g. `{ hour: 2, min: 15, sec: 30 }`
 * 
 * @returns milliseconds. Corresponds to amount represented by `time`.
 * 
 */
declare function TimeIn(time: TimeDefinition): number;

/**
 * Sleep for given amount of time.
 * 
 * @param time [TimeDefinition] or [number] of milliseconds
 * 
 * e.g. `60000` -or- `{ seconds: 60 }`
 * 
 * @returns Promise, resolving after elapsed time. Resolves number of milliseconds timeout waited for.
 * 
 */
declare function Sleep(
    duration: Amount
): Promise<number>;

/**
 * Run callback after given amount of time.
 * 
 * @param time [TimeDefinition] or [number] of milliseconds
 * @param callback Function to run after elapsed.
 * @param args... all arguments after callback are passed to callback
 */
declare function Sleep<CallbackArguments extends any[]>(
    duration: Amount, 
    callback: (...args: CallbackArguments) => any, 
    ...args: CallbackArguments
): void;

/**
 * Defer (inline) promise's resolution by specified time.
 * 
 * EXAMPLE: `Promise.then(Defer(time))` 
 * 
 * Will return a function which captures resolved value of previous promise and re-resolves it after set interval.
 * 
 * @param time [TimeDefinition] or [number] of milliseconds.
 * 
 * @returns `Promise.then()` handler. 
 * 
 */
declare function Defer(by: Amount): ThenDeferHandler

/**
 * Defer promise's resolution by specified time.
 * 
 * Resolve `promise` only after `time` has elapsed, whichever is longer.
 * 
 * @param time [TimeDefinition] or [number] of milliseconds.
 * @param promise
 * 
 * @returns Promise resolving same value as `promise`.
 * 
 */
declare function Atleast<T>(by: Amount, promise: Promise<T>) : Promise<T>

/**
 * New promise resolving callback only after specified time.
 * 
 * Create a promise resolving from callback only after `time` has elapsed, whichever is longer.
 * 
 * @param time [TimeDefinition] or [number] of milliseconds.
 * @param exec Function, same as what would be passed to `new Promise()`.
 * 
 * @returns Promise resolving to value resolved by `callback`, only after `time` elapsed.
 * 
 */
declare function Atleast<T>(by: Amount, exec: PromiseExecutor<T>) : Promise<T>

declare function Within(timeout: Amount): AttemptHandler;
declare function Within(defer: Amount, timeout: Amount): AttemptHandler;
declare function Within<T>(timeout: Amount, promise?: Promise<T>): Promise<T>
declare function Within<T>(timeout: Amount, exec?: PromiseExecutor<T>): Promise<T>
declare function Within<T>(defer: Amount, timeout?: Amount, promise?: Promise<T>): Promise<T>
declare function Within<T>(defer: Amount, timeout?: Amount, exec?: PromiseExecutor<T>): Promise<T>

declare class Timer extends Promise<void> {
    cancel: () => number;
    duration?: number;
    readonly elapsed: string;

    constructor(time: number, throwOnCancel?: boolean);
    toString(didCancel?: true): string;
}

export {
    TimeIn,
    Sleep,
    Defer,
    Within,
    Timer
}