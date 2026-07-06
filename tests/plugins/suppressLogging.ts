import { createLogger, type Logger, type Plugin } from 'vite';

/** Vite plugin wrapper so console patching runs when the e2e dev server starts. */
export function suppressLogging(): Plugin {
  return {
    name: 'suppress-logging-plugin',
    configureServer() {
      suppressKnownConsoleNoise();
    },
  };
}

const SUPPRESSED_PATTERNS = [
  /client component dependency is inconsistently optimized/,
  /Failed to load source map/,
  /\[BABEL\] Note:/,
  /Failed to resolve dependency:/,
  /Invalid hook call\. Hooks can only be called inside/,
  /Switched to client rendering because the server rendering errored/,
  /Cannot read properties of null \(reading 'use'\)/,
  /Cannot read properties of null \(reading 'useContext'\)/,
  /\[Unhandled error\].*Switched to client rendering/s,
];

function isSuppressed(msg: string): boolean {
  return SUPPRESSED_PATTERNS.some((pattern) => pattern.test(msg));
}

function filterLoggerMethod(logger: Logger, level: 'info' | 'warn' | 'error') {
  return (msg: string, options?: Parameters<Logger['info']>[1]) => {
    if (isSuppressed(msg)) return;
    logger[level](msg, options);
  };
}

/** Quiets known dev-server warnings that are harmless during Playwright runs. */
export function createE2ELogger(): Logger {
  const logger = createLogger('error', { allowClearScreen: false });

  return {
    ...logger,
    info: filterLoggerMethod(logger, 'info'),
    warn: filterLoggerMethod(logger, 'warn'),
    error: filterLoggerMethod(logger, 'error'),
  };
}

/** Patches console methods for SSR/React noise that bypasses Vite's logger. */
export function suppressKnownConsoleNoise() {
  const originalError = console.error;
  const originalLog = console.log;
  const originalWarn = console.warn;

  function shouldSuppress(args: unknown[]): boolean {
    const msg = args.map(String).join(' ');
    return isSuppressed(msg);
  }

  console.error = (...args: unknown[]) => {
    if (shouldSuppress(args)) return;
    originalError.apply(console, args);
  };

  console.log = (...args: unknown[]) => {
    if (shouldSuppress(args)) return;
    originalLog.apply(console, args);
  };

  console.warn = (...args: unknown[]) => {
    if (shouldSuppress(args)) return;
    originalWarn.apply(console, args);
  };
}
