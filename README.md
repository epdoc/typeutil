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

## Utility Functions   

```ts
import { isBoolean } from '@epdoc/typeutil';

if (isBoolean(value)) {
  doTask();
}
```

## DictUtil

```ts
import { dictUtil as test } from '@epdoc/typeutil';

let obj = { a: { b: 3 } };
test(obj)
  .property('a.b')
  .value(); // returns 3

const objUtil:DictUtil = dictUtil(obj);
const abVal:DictUtil = objUtil.property('a.b');
console.log( `Object value=${abVal.value()} and isInteger=${abVal.isInteger()}`);
```

## Build and Publish

```bash
npm run build
npm test
```

# Publish to @epdoc

```bash
npm run publish
```
