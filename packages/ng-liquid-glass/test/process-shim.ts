// jest-dom's dependencies read `process.env` for terminal colours; tests run in a real browser.
(globalThis as unknown as { process: unknown }).process ??= { env: {}, argv: [], platform: 'browser' };
