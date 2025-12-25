# myLogger

A tiny, configurable Node logger with log levels, optional prefixing, timestamps and colored console output.

## Features

- Levels: `error`, `warn`, `info`, `debug` (increasing verbosity)
- ISO timestamps on each message
- Optional prefix for easier identification
- Colored output for terminals

## Installation

Use the package locally or publish it to npm. From the repository root:

```bash
cd myLogger
# install dev deps if needed
npm install
```

## Usage

Create a logger and call its methods:

```js
const { createLogger } = require('./index');

const log = createLogger({ level: 'debug', prefix: 'app' });

log.info('Server started on port', 3000);
log.debug('Config', { env: 'development' });
log.warn('Cache miss for key', 'user:1');
log.error('Failed to connect', new Error('db'));
```

Alternatively, import the `MyLogger` class to customize behavior:

```js
const { MyLogger } = require('./index');
const logger = new MyLogger({ level: 'info', prefix: 'svc' });
logger.info('hello');
```

## API

- `createLogger(opts)` — returns a logger instance. `opts` may include:
  - `level` (string): one of `error`, `warn`, `info`, `debug` (default: `info`)
  - `prefix` (string): optional prefix displayed before messages
- Logger methods: `error(...args)`, `warn(...args)`, `info(...args)`, `debug(...args)`.

Messages are printed to the console (stdout) with an ISO timestamp and colored by level.

## Example test

Run the included demo:

```bash
node test.js
```

## Notes

- This logger is intentionally minimal — for advanced features (structured logging, transports, async writes) consider using a more feature-rich library or extending this one.

## License

MIT
