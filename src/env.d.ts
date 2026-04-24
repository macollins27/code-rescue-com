/* eslint-disable @typescript-eslint/triple-slash-reference */
/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />
/* eslint-enable @typescript-eslint/triple-slash-reference */

interface ImportMetaEnv {
  readonly PUBLIC_GIT_SHA?: string;
  readonly PUBLIC_BUILD_DATE?: string;
  /** Base URL for booking backend (empty = same-origin /api/*). */
  readonly PUBLIC_API_BASE?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
