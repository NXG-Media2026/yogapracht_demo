/// <reference types="astro/client" />

interface ImportMetaEnv {
  // ─── Public (available in frontend) ───────────────────────────
  readonly PUBLIC_GA_MEASUREMENT_ID: string;
  readonly PUBLIC_GSC_VERIFICATION_ID: string;
  readonly PUBLIC_META_PIXEL_ID: string;
  readonly PUBLIC_CALENDLY_URL: string;
  readonly PUBLIC_SKOOL_URL: string;
  readonly PUBLIC_WEBINAR_URL: string;
  readonly PUBLIC_EMAIL_PROVIDER: string;

  // ─── Server-only (NOT exposed in frontend) ────────────────────
  // These are listed for documentation only — they are read by
  // serverless functions / Cloudflare Workers, never in site.ts.
  //
  // readonly MAILERLITE_API_KEY: string;
  // readonly MAILERLITE_GROUP_ID: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
