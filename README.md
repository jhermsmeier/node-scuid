# scuid
[![npm](https://img.shields.io/npm/v/scuid.svg?style=flat-square)](https://npmjs.com/package/scuid)
[![npm license](https://img.shields.io/npm/l/scuid.svg?style=flat-square)](https://npmjs.com/package/scuid)
[![npm downloads](https://img.shields.io/npm/dm/scuid.svg?style=flat-square)](https://npmjs.com/package/scuid)
[![build status](https://img.shields.io/travis/jhermsmeier/node-scuid.svg?style=flat-square)](https://travis-ci.org/jhermsmeier/node-scuid)

Collision-resistant IDs optimized for horizontal scaling and performance.

A slim, alternative, and compatible implementation of [cuid] for node,
also featuring a wide range of options, as well as custom random number generator support.
It can serve as a drop-in replacement, and is also ~3.5x faster than [cuid].

[cuid]: https://github.com/ericelliott/cuid

## Install via [npm](https://npmjs.com)

```sh
$ npm install --save scuid
```

## Usage

```js
var scuid = require( 'scuid' )
```

**Generate an ID**

```js
var id = scuid()
> 'ciuwr5ekh00044pe13ruhsmjpq6'
```

**Generate a slug**

```js
var slug = scuid.slug()
> 'zf00074rjj'
```

**Get the process' fingerprint**

```js
var fingerprint = scuid.fingerprint()
> '5m813r'
```

**Use a custom (P)RNG**

```js
// Create a random number generator;
// It has to have a method called `random`
var generator = {
  random: function() {
    return 5 // chosen by fair dice roll
  }
}

// Create a custom scuid instance
var scuid = require( 'scuid' ).create({
  rng: generator
})
```

**Use other custom options**

Note that fiddeling with these might make your IDs incompatible with [cuid]s guarantees.

```js
var scuid = require( 'scuid' ).create({
  prefix: 'c', // the ID's prefix
  base: 36, // radix used in .toString() calls (2-36)
  blockSize: 4, // block size to pad and trim to
  fill: '0', // block padding character
  pid: process.pid, // process ID
  fingerprint: scuid.createFingerprint( [pid], [hostname] ), // Machine fingerprint
  rng: Math, // Random number generator
})
```

## Tests

Just like `cuid`, collision resistance for both – slugs and IDs – is tested
over 1 million and 2 million iterations respectively.
To run the tests, run:

```
$ npm test
```

## Benchmarks

```
$ npm run benchmark
```

```
scuid
  id ............................................. 778,193 op/s
  slug ........................................... 913,403 op/s
  fingerprint .................................... 126,194,278 op/s

cuid
  id ............................................. 222,083 op/s
  slug ........................................... 152,579 op/s
  fingerprint .................................... 376,216 op/s
```