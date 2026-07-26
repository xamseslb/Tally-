/* eslint-disable no-console -- dette er det sanksjonerte console-innpakket. */

/**
 * Nivådelt logger (CLAUDE.md: console.log forbudt utenfor tester).
 * Strukturert logging av synkhendelser og «send diagnostikk» bygges oppå denne
 * i senere faser (spec §4 Observabilitet).
 */
export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

const ORDER: Record<LogLevel, number> = { debug: 10, info: 20, warn: 30, error: 40 };

const minLevel: LogLevel = __DEV__ ? 'debug' : 'info';

function log(level: LogLevel, message: string, context?: Record<string, unknown>): void {
  if (ORDER[level] < ORDER[minLevel]) return;
  const line = context ? `${message} ${JSON.stringify(context)}` : message;
  const sink = level === 'error' ? console.error : level === 'warn' ? console.warn : console.log;
  sink(`[${level}] ${line}`);
}

export const logger = {
  debug: (m: string, c?: Record<string, unknown>) => log('debug', m, c),
  info: (m: string, c?: Record<string, unknown>) => log('info', m, c),
  warn: (m: string, c?: Record<string, unknown>) => log('warn', m, c),
  error: (m: string, c?: Record<string, unknown>) => log('error', m, c),
};
