
<h1 align="center">
  Good Timing
</h1>

<p align="center">
  Powerful promise compositions for all things timing.
</p>
 
<p align="center">
  <a href="https://www.npmjs.com/package/good-timing"><img alt="NPM" src="https://img.shields.io/npm/v/good-timing.svg"></a>
  <a href=""><img alt="Build" src="https://badges.frapsoft.com/typescript/version/typescript-next.svg?v=101"></a>
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
import { TimeIn, Sleep, Atleast, Defer, Within, Timer } from "good-timing";
```

<br/>

# API

Each of the exposed helper functions have overloads which tailor them to your specific use case. 

<br/>

##  TimeDefintion

While all helpers can accept a number of milliseconds, a better way to define duration is via the `TimeDefintion` interface. It is simply an object containing any combination of the following keys.

<br/>

| ms | seconds | minutes | hours |  days | weeks |
|:--:|:-------:|:-------:|:-----:|:-----:|:-----:|
|    | second  | minute  | hour  | day   | week  |
|    | secs    | mins    | hrs   |       |       |
|    | sec     | min     | hr    |       | wk    |

<br/>

- `{ hour: 1, min: 5, seconds: 30 }` => `3930000ms`

- `{ sec: 1 }` => `1000ms`
 
- `{ hr: 2, sec: 50 }` => `7250000ms`

<br/>

>For sake of documentation `Amount` represents either a `TimeDefiniton` or `number` of milliseconds where interchangeable.

<br/>

## TimeIn

<br/>

<code>&nbsp;<b>TimeIn</b>(time: <b><i>TimeDefintion</i></b>): <b><i>number</i></b>&nbsp;</code>

Converts `TimeDefintion` to `number` of seconds. Easy!

```js
const milliseconds = TimeIn({ 15: minutes });
// 900000
```
<br/>

## Sleep
More or less equivalent to `setTimeout`!

<br/>

<code>&nbsp;<b>Sleep</b>(time: <b><i>Amount</i></b>): <b><i>Promise\<number\></i></b>&nbsp;</code>

*Return a promise which waits specified time. Resolves to number of milliseconds elapsed.*

```js
const howLongWasThat = await Sleep({ seconds: 12 });
// Twelve suspense filled seconds later...

howLongWasThat === 12000
// true
```

<br/>

<code>&nbsp;<b>Sleep</b>(time: <b><i>Amount</i></b>, callback: <b>Function</b>): <b>void;</b>;&nbsp;</code>

*Run a callback after specified time.*

```js
Sleep({ minute: 1 }, () => { 
    alert("Hello to the future!") 
});

// One minute later...
// A hello from the not to distant past! o_o Truly amazing.
```

<br/>

## Atleast


*Return a promise which waits specified time. Resolves to number of milliseconds elapsed.*</br>
Useful where you want to ensure whatever you're waiting for takes a minimum amount of time.

</br>

<code>&nbsp;<b>Atleast</b>(by: <b><i>Amount</i></b>, promise: <b><i>Promise\<T\></i></b>): <b><i>Promise\<T\></i></b>&nbsp;</code>

*Resolve a promise only after specified time.*
*Will resolve as original promise does or timeout elapses, whichever is later.*

```js
const { log } = console;
const justASec = Sleep({ sec: 1 });
const justAMinute = Sleep({ min: 1 })

log(await Defer({ seconds: 30 }, justASec))
// 1000 (after 30 seconds, deferral was longer.)

log(await Defer({ seconds: 30 }, justAMinute))
// 60000 (after 1 minute, original was longer.)
```

<br/>

<code>&nbsp;<b>Atleast</b>(time: <b><i>Amount</i></b>, executor: <b>(resolve, reject) => void</b>): <b><i>Promise\<Value\></i></b>&nbsp;</code>

*Run function and return Promise resolving the called result. Will not resolve until after `time` has elapsed.* <br/> *More or less equivalent to `new Promise()` but deferred.*

```js
await foo = Defer({ minute: 1 }, (resolve, reject) => { 
    setTimeout(() => resolve("bar"), 500)
});

// One minute later...
// foo === "bar"
```

<br/>

## 🚧 More Documentation on the way! 🏗

<br/>

License
-------

MIT license.