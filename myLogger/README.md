# mylogger

A small, opinionated logger for Node.js services.

This README explains how to install and use `mylogger` in your service. The package exposes a single configuration entrypoint and a `logger` object you can use like `console`.

---

## Key points (short)

- Exports: `{ init, logger }`
- Call `init()` once at service startup to configure runtime behavior.
- In development (default) logs go to `console`; in production logs are forwarded to a pluggable transport.
- Logging methods accept multiple arguments and preserve values (objects, Errors, strings).

---

## Install

Install locally for development (recommended when working in the same repo):

```bash
# from your service folder (e.g. userService)
npm install ../myLogger
```

If the package is published, install from npm:

```bash
npm install mylogger
```

---

## Important: call `init()` once at startup

`init()` configures whether the logger runs in development or production mode and (in production) initializes the remote transport using an `apiKey`.

Call it as early as possible in your main entrypoint:

```js
// index.js or server.js
const { init, logger } = require('mylogger');

init({
  isProd: process.env.NODE_ENV === 'production',
  apiKey: process.env.MYLOGGER_API_KEY // required if isProd is true
});

// now safe to use logger throughout the app
logger.info('Service started');
```

If you omit `init()`, `mylogger` will warn and fall back to `console` (non-fatal). However, in production `init()` enforces the presence of `apiKey` and will throw if `isProd=true` but no `apiKey` is provided.

---

## Usage

```js
const { init, logger } = require('mylogger');

// configure once at startup
init({ isProd: false }); // dev mode example

// use like console — multi-arg support
logger.info('Server listening on', 3000);
logger.warn('Cache miss for', { key: 'user:1' });
logger.error('Failed to load', new Error('db'));
```

### API

- `init(options)`
  - `options.isProd` (boolean) — when `true`, logs are forwarded to the production transport.
  - `options.apiKey` (string) — required when `isProd` is `true`.
- `logger` object with methods: `log`, `info`, `warn`, `error` — all accept `(...args)`.

---

## Production notes

- When configured with `isProd: true` and a valid `apiKey`, `mylogger` initializes the adapter at `src/loggerService.js` and forwards logs there.
- If the remote transport fails at runtime, `mylogger` logs a warning about the failure and falls back to `console[level](...args)` so the original message is still emitted instead of crashing the host process.
- The provided `src/loggerService.js` is a small stub. Replace or extend it to integrate with your real logging backend (HTTP, gRPC, etc.). Prefer non-blocking async transports and handle failures internally.

---

## Development tips

- To install the package into a local consumer while developing:

```bash
# from the consumer folder
npm install ../myLogger
# or use npm link for a symlink workflow
cd ../myLogger && npm link && cd ../your-consumer && npm link mylogger
```
---