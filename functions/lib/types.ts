/**
 * Cloudflare Pages Functions bindings + env secrets.
 *
 * D1 is bound via wrangler.toml; secrets come from `.dev.vars` locally and
 * `wrangler pages secret put` in production.
 */

// Minimal D1 surface used by the booking backend. Mirrors the shape of
// `D1Database` from `@cloudflare/workers-types` without pulling in the full
// package — the repo is an Astro static site, not a Workers project, so we
// keep the type footprint surgical.
export interface D1PreparedStatement {
  bind(...values: unknown[]): D1PreparedStatement;
  run(): Promise<{ success: boolean; meta?: unknown }>;
  all<T = unknown>(): Promise<{ results: T[]; success: boolean; meta?: unknown }>;
  first<T = unknown>(column?: string): Promise<T | null>;
}

export interface D1Database {
  prepare(query: string): D1PreparedStatement;
  exec(query: string): Promise<unknown>;
}

export interface Env {
  DB: D1Database;
  GOOGLE_OAUTH_CLIENT_ID: string;
  GOOGLE_OAUTH_CLIENT_SECRET: string;
  GOOGLE_OAUTH_REFRESH_TOKEN: string;
  GOOGLE_CALENDAR_ID: string;
  RESEND_API_KEY: string;
  NOTIFICATION_EMAIL: string;
  FROM_EMAIL: string;
}

/**
 * Cloudflare Pages Functions handler context. Narrowed to what we actually
 * use (request, env, waitUntil).
 */
export interface PagesFunctionContext<E = Env> {
  request: Request;
  env: E;
  waitUntil(promise: Promise<unknown>): void;
}

export type PagesFunction<E = Env> = (
  context: PagesFunctionContext<E>
) => Response | Promise<Response>;
