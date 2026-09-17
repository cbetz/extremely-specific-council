import test, { type TestContext } from "node:test";
import assert from "node:assert/strict";
import { GET, POST } from "../app/api/council/route.ts";
import { EXAMPLES } from "../lib/council.ts";

function setEnv(t: TestContext, key: string, value: string) {
  const previous = process.env[key];
  process.env[key] = value;
  t.after(() => {
    if (previous === undefined) delete process.env[key];
    else process.env[key] = previous;
  });
}

function request(mode: "demo" | "live", headers: Record<string, string> = {}) {
  return new Request("https://council.example/api/council", {
    method: "POST",
    headers: { "Content-Type": "application/json", ...headers },
    body: JSON.stringify({ idea: EXAMPLES[0].idea, mode }),
  });
}

test("Node route reads runtime configuration without exposing the key", async (t) => {
  setEnv(t, "TYPESAFE_API_KEY", "");
  assert.deepEqual(await GET().json(), { live: false, demo: true });
  assert.equal((await POST(request("live"))).status, 503);
  process.env.TYPESAFE_API_KEY = "route-test-secret";
  const response = GET();
  assert.deepEqual(await response.json(), { live: true, demo: true });
  assert.equal(response.headers.get("Cache-Control"), "no-store");
});

test("Node route accepts same-origin demos and rejects cross-origin submissions", async () => {
  const response = await POST(request("demo", { origin: "https://council.example" }));
  assert.equal(response.status, 200);
  const data = await response.json();
  assert.equal(data.mode, "demo");
  assert.equal(data.decisions.length, 12);
  assert.equal((await POST(request("demo", { origin: "https://other.example" }))).status, 403);
});

test("Vercel rate limit separates visitors using its forwarded IP", async (t) => {
  setEnv(t, "TYPESAFE_API_KEY", "route-test-secret");
  setEnv(t, "VERCEL", "1");
  let calls = 0;
  t.mock.method(globalThis, "fetch", async () => {
    calls++;
    return new Response("provider failure", { status: 503 });
  });
  for (let i = 0; i < 8; i++) {
    assert.equal((await POST(request("live", { "x-forwarded-for": "192.0.2.1" }))).status, 502);
  }
  const limited = await POST(request("live", { "x-forwarded-for": "192.0.2.1" }));
  assert.equal(limited.status, 429);
  assert.equal(limited.headers.get("Retry-After"), "60");
  assert.equal((await POST(request("live", { "x-forwarded-for": "192.0.2.2" }))).status, 502);
  assert.equal(calls, 9);
});
