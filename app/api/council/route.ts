import { REQUEST_SCHEMA, demoResult, evaluate } from "../../../lib/engine.ts";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 30;

const headers = {
  "Cache-Control": "no-store",
  "X-Content-Type-Options": "nosniff",
};
function config() {
  return {
    key: process.env.TYPESAFE_API_KEY,
    model: process.env.TYPESAFE_MODEL ?? "jev-latest",
  };
}
export function GET() {
  return Response.json({ live: !!config().key, demo: true }, { headers });
}
// Small, process-local burst guard; this is not a global quota.
const calls = new Map<string, { count: number; until: number }>();
function permit(id: string) {
  const now = Date.now();
  for (const [key, value] of calls) if (value.until <= now) calls.delete(key);
  const bucket = calls.get(id) ?? { count: 0, until: now + 60000 };
  if (bucket.count >= 8 || calls.size >= 5000) return false;
  bucket.count++;
  calls.set(id, bucket);
  return true;
}
export async function POST(request: Request) {
  const origin = request.headers.get("origin");
  if (origin && origin !== new URL(request.url).origin)
    return Response.json(
      { error: "This request must come from the Council app." },
      { status: 403, headers },
    );
  if (!request.headers.get("content-type")?.includes("application/json"))
    return Response.json({ error: "Send JSON." }, { status: 415, headers });
  try {
    // Bound streamed bodies too; Content-Length may be missing or inaccurate.
    const reader = request.body?.getReader();
    if (!reader)
      return Response.json(
        { error: "Missing proposal." },
        { status: 400, headers },
      );
    let total = 0;
    const chunks: Uint8Array[] = [];
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      total += value.byteLength;
      if (total > 4096) {
        await reader.cancel();
        return Response.json(
          { error: "Proposal is too large." },
          { status: 413, headers },
        );
      }
      chunks.push(value);
    }
    const bytes = new Uint8Array(total);
    let offset = 0;
    for (const chunk of chunks) {
      bytes.set(chunk, offset);
      offset += chunk.byteLength;
    }
    let body: unknown;
    try {
      body = JSON.parse(new TextDecoder().decode(bytes));
    } catch {
      return Response.json(
        { error: "Invalid JSON." },
        { status: 400, headers },
      );
    }
    const parsed = REQUEST_SCHEMA.safeParse(body);
    if (!parsed.success)
      return Response.json(
        {
          error:
            "Write an idea between 3 and 500 characters and select a valid mode.",
        },
        { status: 400, headers },
      );
    const { idea, mode } = parsed.data;
    if (mode === "demo") {
      try {
        return Response.json(demoResult(idea), { headers });
      } catch {
        return Response.json(
          {
            error:
              "Choose one of the four demo proposals. Live mode lets you write your own.",
          },
          { status: 400, headers },
        );
      }
    }
    const { key, model } = config();
    if (!key)
      return Response.json(
        {
          error:
            "Live voting needs a TypeSafe API key on the server. Try a demo proposal for now.",
        },
        { status: 503, headers },
      );
    // Vercel overwrites this header with the connecting IP. Do not trust it
    // on arbitrary self-hosted servers without a known proxy configuration.
    const clientId = process.env.VERCEL === "1"
      ? request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown"
      : "local";
    if (!permit(clientId))
      return Response.json(
        { error: "The council needs a breather. Try again in a minute." },
        { status: 429, headers: { ...headers, "Retry-After": "60" } },
      );
    return Response.json(await evaluate(idea, key, model), { headers });
  } catch (error) {
    const timeout =
      error instanceof Error &&
      (error.name === "TimeoutError" || error.name === "AbortError");
    return Response.json(
      {
        error: timeout
          ? "The council took too long to vote. Please try again."
          : "The vote could not be completed. No opinions were invented. Please try again.",
      },
      { status: 502, headers },
    );
  }
}
