
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

> Remember to ⭐️if this helps!

<br/>
<br/>

## Types

Common data types encontered in API.


<br/>

###  TimeDefintion

While all helpers can accept a number of milliseconds, a better way to define duration is via the `TimeDefintion` interface. It is simply an object containing any combination of the following keys.

<br/>

| ms | second(s) | minute(s) | hour(s) | day(s) | weeks(s) |
|:--:|:---------:|:---------:|:-------:|:------:|:--------:|
|    | sec(s)    | min(s)    | hr(s)   |        | wk(s)    |

<br/>

- `{ hour: 1, min: 5, seconds: 30 }` => `3930000ms`

- `{ sec: 1 }` => `1000ms`
 
- `{ hr: 2, sec: 50 }` => `7250000ms`

<br/>

###  Amount
Refers to anywhere `TimeDefinition` or `number` of milliseconds where interchangeable.

<br/>

###  PromiseExecutor

A function containing asyncronous operation. 
> Equivalent to that consumed by `new Promise()`


<code>&nbsp;(resolve: <b><i>(value) => void</i></b>), reject: <b><i>(reason) => void)</i></b>: <b><i>void</i></b>&nbsp;</code>

<br/>

###  Promisable

Refers to anywhere `PromiseExecutor` or `Promise` are interchangeable.

<br/>
<br/>

# API

Each of the exposed helper functions have overloads which tailor them to your specific use case. 

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
More or less equivalent to `setTimeout`

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

<code>&nbsp;<b>Sleep</b>(time: <b><i>Amount</i></b>, callback: <b><i>Function</i></b>): <b><i>void</i></b>&nbsp;</code>

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

Useful where you want to ensure whatever you're waiting for takes a minimum amount of time.

> Useful in situations where an operation may sometimes finish "too fast". If showing an animation while loading, for instance, it may be less-than-ideal for that animation to terminate before completing first cycle. <br/><br/> `Atleast()` gives you the ability to set the minimum time such a loading state should remain on screen, making time-of-flight feel more consistent.

</br>

<code>&nbsp;<b>Atleast</b>(time: <b><i>Amount</i></b>, promise: <b><i>Promise\<T\></i></b>): <b><i>Promise\<T\></i></b>&nbsp;</code>

*Resolve a promise only after specified time.*
*Will resolve as original promise does or timeout elapses, whichever is later.*

```js
const justASec = Sleep({ sec: 1 });
const justAMinute = Sleep({ min: 1 })

alert(await Atleast({ seconds: 30 }, justASec))
// 1000 (after 30 seconds, deferral was longer.)

alert(await Atleast({ seconds: 30 }, justAMinute))
// 60000 (after 1 minute, original was longer.)
```

<br/>

<code>&nbsp;<b>Atleast</b>(time: <b><i>Amount</i></b>, executor: <b>(resolve, reject) => void</b>): <b><i>Promise\<Value\></i></b>&nbsp;</code>

*Run function and return Promise resolving the async result. Will only resolve after `time` has elapsed.* <br/> *More or less equivalent to `new Promise()` but deferred.*

```js
await foo = Atleast({ minute: 1 }, (resolve, reject) => { 
    setTimeout(() => resolve("bar"), 500)
});

// One minute later...
// foo === "bar"
```

<br/>

## Defer

Delays the resolution of a promise by set time.

</br>

<code>&nbsp;<b>Defer</b>(time: <b><i>Amount</i></b>): <b>(value: T) => Promise\<T\></b></b>&nbsp;</code>

*This function **will add** the amount of time specified, on top of existing time taken.* 

> *This is intended for use in `.then()` chains, as a passthrough. <br/>It can be added anywhere within to introduce some slowdown.*

```js
async function HelloLater(to: string){
    await Sleep({ sec: 5 });
    return `Hello, ${to}!`
}

HelloLater("World")
    .then(Defer({ sec: 5 }))
    .then(salutation => {
        alert(salutation)
    });

// 10 seconds later...
// Hello!
```

<br/>
<br/>

# License

MIT license.