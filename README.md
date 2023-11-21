# @epdoc/typeutil

Includes:

 * TypeScript-capable type-checking, type-guard and casting utilities
   * e.g. `isString()`, `isPosInteger()`, `asInteger()`
   * A `Util` object to encapslate type checking and reach into an Object's properties
 * Type declarations
   * `Integer`, `Dict`
 * Other common utilities, for example
   * `delayPromise` is `setTimeout` as a Promise
   * `camelToDash`, `underscoreCapitalize` string conversion
   * `deepCopy`, `deepEquals`
   * `pad` a string

## Usage   

```ts
import { isBoolean } from '@epdoc/typeutil';

if (isBoolean(value)) {
  doTask();
}
```

Using the `Util` class.

```ts
import { util as test } from '@epdoc/typeutil';

let obj = { a: { b: 3 } };
test(obj)
  .property('a.b')
  .value(); // returns 3

u.path('a.c').setValue({}, 4); // results in { a: { c: 4 }}

test(obj)
  .property('a.b')
  .isInteger(); // returns true
```

## Build and Publish

```bash
npm run clean
npm run build
npm run test
```

# Publish to @epdoc

```bash
npm run publish
```
