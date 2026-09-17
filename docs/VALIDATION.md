# Validation

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

Live TypeSafe access has **not** been tested against a real account. No key was available during this build. The transport and response parser are covered with explicit test doubles; these do not establish real model quality, pricing, or latency. No production hosting account is bound to this repository.

The confidence display is not an empirical accuracy measure. Captions and demo fixtures are authored. The only timing shown for live results is measured by the server around the provider request.
