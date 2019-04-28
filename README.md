
<h1 align="center">
  Good Timing
</h1>

<p align="center">
  Powerful promise compositions for all things timing.
</p>
 
<p align="center">
  <a href="https://www.npmjs.com/package/good-timing"><img alt="NPM" src="https://img.shields.io/npm/v/good-timing.svg"></a>
</p>

## Quick Start

<br />

> Install with preferred package manager
```bash
npm install --save good-timing
```
<br />

> Import what you need

```js
import { timeIn, sleep, atleast, defer, within } from "good-timing";
```

<br/>

> Remember to ⭐️ if this helps your project!

<br/>

## TimeDefintion

This package's central gimick. 

While all helpers can accept a number of milliseconds, a better way to define duration is via the `TimeDefintion` interface. It is simply an object containing any combination of the following keys.

<br/>

| ms | second(s) | minute(s) | hour(s) | day(s) | weeks(s) |
|:--:|:---------:|:---------:|:-------:|:------:|:--------:|
|    | sec(s)    | min(s)    | hr(s)   |        | wk(s)    |

<br/>

- `{ hour: 1, min: 5, seconds: 30 }` => `3930000ms`

- `{ sec: 1 }` => `1000ms`
 
- `{ hr: 2, sec: 50 }` => `7250000ms`

- `{ second: 1, ms: 500 }` => `1500ms`

<br/>

# API

Each of the exposed helper functions have overloads which tailor them to your specific use case. 

Signatures are in typescript, everything in **`Bold`** is a type, of which package-specific ones are referenced above, as well as in the [Types Section](#Types).

<br/>

## timeIn

<br/>

<code>&nbsp;<b>timeIn</b>(time: <b><i>TimeDefintion</i></b>): <b><i>number</i></b>&nbsp;</code>

Converts `TimeDefintion` to `number` of seconds. Easy!

```js
const milliseconds = timeIn({ minutes: 15 });
// 900000
```

> Note: *This (or a sourced variable) can be used in place of any `Amount`, as it just returns a number of milliseconds.*

<br/>

## sleep
More or less equivalent to `setTimeout`

<br/>

<code>&nbsp;<b>sleep</b>(time: <b><i>Amount</i></b>): <b><i>Promise\<number\></i></b>&nbsp;</code>

*Return a promise which waits specified time. Resolves to number of milliseconds elapsed.*

```js
const howLongWasThat = await sleep({ seconds: 12 });
// Twelve suspense filled seconds later...

howLongWasThat;
// 12000
```

<br/>

<code>&nbsp;<b>sleep</b>(time: <b><i>Amount</i></b>, callback: <b><i>Function</i></b>): <b><i>void</i></b>&nbsp;</code>

*Run a callback after specified time.*

```js
sleep({ minute: 1 }, () => { 
    console.log("Hello to the future!") 
});

// One minute later...
// A hello from the not too distant past! Truly amazing.
```

<br/>

## atleast

Useful where you want to ensure whatever you're waiting for takes a minimum amount of time.

> Useful in situations where an operation may sometimes finish "too fast". If showing an animation while loading, for instance, it may be less-than-ideal for that animation to terminate before completing its first cycle. <br/><br/> `atleast()` would give you the ability to set for how long that loading state should remain on screen, making time-of-flight feel more consistent.

</br>

<code>&nbsp;<b>atleast</b>(time: <b><i>Amount</i></b>, promise: <b><i>Promise\<T\></i></b>): <b><i>Promise\<T\></i></b>&nbsp;</code>

*Resolve a promise only after specified time.*
*Will resolve as original promise does or after `time` elapses, whichever is later.*

```js
const { log } = console;
const justASec = sleep({ sec: 1 })
const justAMinute = sleep({ min: 1 })

log(await atleast({ seconds: 30 }, justASec))
// 30 seconds later... (deferral was longer)
// > 1000 

log(await atleast({ seconds: 30 }, justAMinute))
// 1 minute later... (original was longer)
// > 60000
```

<br/>

<code>&nbsp;<b>atleast</b>(time: <b><i>Amount</i></b>, executor: <b>(resolve, reject) => void</b>): <b><i>Promise\<Value\></i></b>&nbsp;</code>

*Run function and return Promise resolving the async result. Will only resolve after `time` has elapsed.* <br/> *More or less equivalent to `new Promise()` but deferred.*

```js
await foo = atleast({ minute: 1 }, (resolve, reject) => { 
    setTimeout(() => resolve("bar"), 500)
});

// One minute later...
// foo === "bar"
```

<br/>

## defer

Delays the resolution of a promise by set time.

</br>

<code>&nbsp;<b>defer</b>(time: <b><i>Amount</i></b>): <b>(value: T) => Promise\<T\></b></b>&nbsp;</code>

*This function **will add** the amount of time specified, on top of existing time taken.* 

> *This is intended for use in `.then()` chains, as a passthrough. <br/>It can be added anywhere within to introduce some slowdown.*

```js
async function HelloLater(to: string){
    await sleep({ sec: 5 });
    return `Hello, ${to}!`
}

HelloLater("World")
    .then(defer({ sec: 5 }))
    .then(salutation => {
        console.log(salutation)
    });

// 10 seconds later...
// > Hello!
```

<br/>

## within

Returns a `Promise` which only resolves if timeout is not reached, will reject instead if timeout is reached.

> Useful to enforce a timeout on `Promisable` asyncronous operation.

</br>

<code>&nbsp;<b>within</b>(timeout: <b><i>Amount</i></b>, awaiting: <b><i>Promisable\<<i>T</i>\></i></b>): <b>Promise\<<i>T</i>\></b></b>&nbsp;</code>

*This function takes `awaiting` and resovlves as normal, so long `timeout` is not reached.* 

> If timeout elapses, output Promise will reject with the message `"Timeout: {number}ms"`;

```js
async function HelloLater(to: string){
    await sleep({ sec: 30 });
    return `Hello, ${to}!`
}

await within({ sec: 29 }, HelloLater)
    .catch(e => console.error(e))

// 29 seconds later...
// > "Timeout: 29000ms"

await within({ sec: 31 }, HelloLater)
    .then(e => console.log(e))

// 30 seconds later...
// > 30000
```

</br>

<code>&nbsp;<b>within</b>(defer: <b><i>Amount</i></b>, timeout: <b><i>Amount</i></b>, awaiting: <b><i>Promisable\<<i>T</i>\></i></b>): <b>Promise\<<i>T</i>\></b></b>&nbsp;</code>

*Resolves `awaiting` only after `defer` has elapsed, but only if `timeout` has not.* 

> Behaves exactly as `atleast(defer, within(timeout, awaiting))`

```js
async function littleOverAMinute(){
    await sleep({ sec: 61 });
    return "foobar"
}

await within({ sec: 35 }, { sec: 60 }, littleOverAMinute)
    .catch(e => console.error(e))

// 60 seconds later...
// > "Timeout: 60000ms"

await within({ sec: 31 })
    .catch(e => console.log(e))

// 35 seconds later...
// > 35000
```

<br/>
<br/>

# Other Types

More data types encontered in API.

<br/>

###  PromiseExecutor

A function containing asyncronous operation. 
> Equivalent to that consumed by `new Promise()`

<code>&nbsp;(resolve: <b><i>(value) => void</i></b>), reject: <b><i>(reason) => void)</i></b>: <b><i>void</i></b>&nbsp;</code>

<br/>

###  Amount
Refers to anywhere `TimeDefinition` or `number` of milliseconds where interchangeable.

<br/>

###  Promisable

Refers to anywhere `Promise` or `PromiseExecutor` are interchangeable.

<br/>
<br/>

# License

MIT license.
