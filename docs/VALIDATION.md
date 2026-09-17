# Validation

## Native Next.js migration — September 17, 2026

- Replaced the Vinext/Cloudflare build with native Next.js 16.3.4 and the Node.js runtime for Vercel's Next.js preset. Removed the unused platform build integration and pinned the Node major to 22.
- All eleven unit tests pass on Node 22.18.0. New route tests cover runtime key detection, same-origin submissions, and separate Vercel client-IP rate-limit buckets.
- TypeScript passes, and `next build` generates `.next/routes-manifest.json` and `.next/BUILD_ID`. CI now checks for both artifacts after the build.
- The built Next.js production server serves the page and configuration route. Demo and real TypeSafe requests both returned all twelve member decisions; the live call used `jev-1.13.0` and took 610 ms in this smoke check.
- The production page was inspected in a browser with all twelve portraits and controls present and no reported runtime errors. The local credential is now loaded from ignored `.env.local`; a scan found no credential in the client build assets.

The checks below document the original version before this migration.

## Initial build

Local checks on September 16, 2026 (America/New_York), on macOS:

- Eight unit tests pass: batched question construction, explicit demo provenance, upstream response validation, invalid requests, fixed provider endpoint/key handling, upstream failure handling, and division scoring.
- TypeScript check passes.
- Production Vinext/Vite build passes for the page, API route, and Cloudflare Worker. Vinext reports that its static route classifier cannot classify the client page; compilation succeeds.
- Built Worker preview: the home page, configuration endpoint, and a twelve-vote demo request all succeeded through Wrangler’s local production preview.
- Browser verification at desktop width and 390 × 844 mobile viewport: all twelve characters, submission, sample selection, vote totals, and the expandable inspector work. Mobile document width matches the viewport; no horizontal overflow was observed.
- PNG result-card download completed and the image was visually inspected. Its scripted-demo label, proposal, twelve votes, and totals agree with the app.
- No browser runtime errors were reported during the checked flow.
- HTTP integration checks: supported demo 200, unsupported demo 400, blank input 400, absent live key 503, cross-origin request 403, oversized streamed body 413. The development framework rejects the cross-origin request before the route handler.
- WebMCP tool registration and schema were inspected. A valid demo invocation updated the visible proposal and returned 9 approvals, 1 objection, and 2 baffled votes; visible state agreed. Invalid input failed and left the completed result unchanged.

Live verification on September 17, 2026 (America/New_York):

- Configured a server-only key in the ignored local `.dev.vars` file; the configuration endpoint enabled live mode without returning credentials.
- Two real requests completed against TypeSafe model `jev-1.13.0`, each returning all 36 answers for twelve members. The existing response parser accepted the real responses without changes.
- A mandatory-trampoline proposal returned 2 approvals and 10 objections in 412 ms, measured by the server around the provider request.
- A custom proposal entered through the browser, replacing office printers with golden retriever couriers, returned 1 approval, 10 objections, and 1 baffled vote in 409 ms. The visible totals, individual votes, inspector distributions, model ID, and token counts agreed.
- The live browser flow reported no runtime errors. The API response was checked for absence of the configured secret.
- A live PNG card downloaded successfully and was visually inspected: its live label, proposal, twelve votes, totals, and division score matched the browser result.

These are two smoke checks, not a benchmark or evidence of model accuracy.

The confidence display is not an empirical accuracy measure. Captions and demo fixtures are authored. The only timing shown for live results is measured by the server around the provider request.
