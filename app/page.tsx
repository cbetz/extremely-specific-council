"use client";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
} from "react";
import {
  ArrowUpRight,
  Gavel,
  CodeXml,
  Sparkles,
  Download,
  Copy,
  ChevronDown,
  LoaderCircle,
  Check,
  X,
  CircleHelp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  MEMBERS,
  EXAMPLES,
  tally,
  type CouncilResult,
  type Decision,
} from "@/lib/council";
import { downloadCard } from "@/lib/share-card";

type ToolRegistry = {
  registerTool: (
    tool: {
      name: string;
      description: string;
      inputSchema: object;
      annotations: object;
      execute: (input: unknown) => Promise<unknown>;
    },
    options: { signal: AbortSignal },
  ) => void | Promise<void>;
};
const VOTE_LABELS = { yes: "APPROVES", no: "OPPOSES", confused: "BAFFLED" };
function Portrait({ index }: { index: number }) {
  return (
    <div
      className="portrait"
      aria-hidden="true"
      style={{
        backgroundPosition: `${((index % 4) / 3) * 100}% ${(Math.floor(index / 4) / 2) * 100}%`,
      }}
    />
  );
}
function Meter({ label, value }: { label: string; value: number }) {
  return (
    <div className="meter-row">
      <span>{label}</span>
      <div className="meter-track">
        <span style={{ width: `${value}%` }} />
      </div>
      <span>{value}%</span>
    </div>
  );
}
function Inspector({ result }: { result: CouncilResult }) {
  return (
    <Collapsible className="inspector">
      <CollapsibleTrigger asChild>
        <Button variant="ghost" className="inspector-trigger">
          <CodeXml size={17} /> Peek inside the decision engine{" "}
          <ChevronDown size={16} />
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent className="inspector-content">
        <p>
          {result.mode === "live"
            ? `One request. 12 characters × 3 questions. ${result.model} responded in ${result.durationMs.toLocaleString()} ms.`
            : "These are hand-authored demo votes, not TypeSafe responses. Demo scores are illustrative; no probabilities or model timing are invented."}
        </p>
        <p>
          Choice picks a vote. Score measures enthusiasm on four levels. Noul
          estimates whether the character is confused. Captions are prewritten
          jokes selected by the vote, not generated explanations.
        </p>
        {result.mode === "live" && (
          <>
            <p>
              Confidence describes the model’s answer distribution, not a
              measured accuracy rate. All questions see the same proposal and
              are answered independently.
            </p>
            <div className="decision-table">
              {result.decisions.map((d: Decision) => (
                <div className="decision-row" key={d.id}>
                  <b>{MEMBERS.find((m) => m.id === d.id)?.name}</b>
                  <span>
                    Yes {Math.round((d.probabilities?.yes ?? 0) * 100)}%
                  </span>
                  <span>
                    No {Math.round((d.probabilities?.no ?? 0) * 100)}%
                  </span>
                  <span>
                    Baffled {Math.round((d.probabilities?.confused ?? 0) * 100)}
                    %
                  </span>
                  <span>Confidence {d.confidence?.toFixed(3)}</span>
                </div>
              ))}
            </div>
            {result.usage && (
              <p>
                {result.usage.input_tokens.toLocaleString()} input tokens ·{" "}
                {result.usage.output_tokens.toLocaleString()} output tokens
              </p>
            )}
            <pre tabIndex={0} aria-label="Raw TypeSafe response">
              {JSON.stringify(result.raw, null, 2)}
            </pre>
          </>
        )}
        <p>
          Division rewards an even split between yes and no. Baffled members
          reduce the score. It’s a game statistic.
        </p>
        <a
          href="https://docs.typesafe.ai/introduction"
          target="_blank"
          rel="noreferrer"
        >
          Explore the TypeSafe primitives ↗
        </a>
      </CollapsibleContent>
    </Collapsible>
  );
}
export default function Home() {
  const [idea, setIdea] = useState(EXAMPLES[0].idea);
  const [mode, setMode] = useState<"live" | "demo">("demo");
  const [liveAvailable, setLiveAvailable] = useState(false);
  const [configReady, setConfigReady] = useState(false);
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<CouncilResult | null>(null);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [exporting, setExporting] = useState(false);
  const inFlight = useRef(false);
  const requestController = useRef<AbortController | null>(null);
  useEffect(() => {
    const c = new AbortController();
    fetch("/api/council", { signal: c.signal })
      .then(async (r) => {
        if (!r.ok) throw Error();
        return r.json() as Promise<{ live?: boolean }>;
      })
      .then((data) => {
        setLiveAvailable(data.live === true);
        if (data.live === true) setMode("live");
        setConfigReady(true);
      })
      .catch(() => {
        if (!c.signal.aborted) {
          setConfigReady(true);
          setError("Could not check live access. Demo mode is available.");
        }
      });
    return () => {
      c.abort();
      requestController.current?.abort();
    };
  }, []);
  const convene = useCallback(
    async (proposal = idea, requestedMode = mode) => {
      if (inFlight.current) throw Error("The council is already deliberating.");
      const text = proposal.trim();
      if (text.length < 3 || text.length > 500)
        throw Error("Write an idea between 3 and 500 characters.");
      if (requestedMode === "live" && !liveAvailable)
        throw Error(
          "Live mode is not configured. Try one of the demo proposals.",
        );
      if (requestedMode === "demo" && !EXAMPLES.some((e) => e.idea === text))
        throw Error("Demo mode supports the four example proposals.");
      inFlight.current = true;
      setBusy(true);
      setError("");
      setNotice("");
      setResult(null);
      setIdea(text);
      setMode(requestedMode);
      const c = new AbortController();
      requestController.current = c;
      try {
        const response = await fetch("/api/council", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ idea: text, mode: requestedMode }),
          signal: c.signal,
        });
        const data = (await response.json()) as CouncilResult & {
          error?: string;
        };
        if (!response.ok)
          throw Error(
            typeof data.error === "string"
              ? data.error
              : "The vote could not be completed.",
          );
        setResult(data);
        return data as CouncilResult;
      } catch (e) {
        const message =
          e instanceof Error
            ? e.message
            : "The council lost its train of thought.";
        setError(message);
        throw e;
      } finally {
        inFlight.current = false;
        setBusy(false);
      }
    },
    [idea, mode, liveAvailable],
  );
  useEffect(() => {
    const context = (document as Document & { modelContext?: ToolRegistry })
      .modelContext;
    if (!context?.registerTool) return;
    const lifecycle = new AbortController();
    try {
      Promise.resolve(
        context.registerTool(
          {
            name: "convene_council",
            description:
              "Submit a proposal to the visible Council and return its completed vote. Live mode calls TypeSafe; demo mode only accepts the four displayed example proposals.",
            inputSchema: {
              type: "object",
              properties: {
                idea: { type: "string", minLength: 3, maxLength: 500 },
                mode: { type: "string", enum: ["live", "demo"] },
              },
              required: ["idea", "mode"],
              additionalProperties: false,
            },
            annotations: { readOnlyHint: false, untrustedContentHint: true },
            execute: async (input) => {
              if (
                !input ||
                typeof input !== "object" ||
                !("idea" in input) ||
                typeof input.idea !== "string" ||
                !("mode" in input) ||
                (input.mode !== "live" && input.mode !== "demo") ||
                Object.keys(input).some((k) => k !== "idea" && k !== "mode")
              )
                throw Error("Provide an idea string and a live/demo mode.");
              const vote = await convene(input.idea, input.mode);
              await new Promise<void>((r) => requestAnimationFrame(() => r()));
              return {
                mode: vote.mode,
                idea: vote.idea,
                ...tally(vote.decisions),
              };
            },
          },
          { signal: lifecycle.signal },
        ),
      ).catch(() => {});
    } catch {
      /* Optional browser capability. */
    }
    return () => lifecycle.abort();
  }, [convene]);
  function chooseExample(value: string) {
    setIdea(value);
    setResult(null);
    setError("");
    setNotice("");
  }
  async function share() {
    if (!result) return;
    const t = tally(result.decisions);
    try {
      await navigator.clipboard.writeText(
        `I asked the Council: “${result.idea}”\n\n${t.yes} approve. ${t.no} oppose. ${t.confused} are baffled.\nDivision: ${t.division}/100.${result.mode === "demo" ? " (Scripted demo)" : ""}\n\nhttps://github.com/cbetz/extremely-specific-council`,
      );
      setNotice("Verdict copied. Go start an argument.");
    } catch {
      setError(
        "Clipboard access was unavailable. You can still save the result card.",
      );
    }
  }
  async function save() {
    if (!result) return;
    setExporting(true);
    try {
      await downloadCard(result);
      setNotice("Result card saved. The council accepts no responsibility.");
    } catch {
      setError("The card could not be saved. Try copying the verdict instead.");
    } finally {
      setExporting(false);
    }
  }
  const votes = result ? tally(result.decisions) : null;
  const heading = busy
    ? "Order! Order!"
    : votes
      ? votes.confused >= 6
        ? "The council needs a minute."
        : votes.yes === votes.no
          ? "A beautifully divided room."
          : votes.yes > votes.no
            ? "The ayes have it. Somehow."
            : "The council has concerns."
      : "The floor is yours.";
  return (
    <main className="app-shell">
      <header className="masthead">
        <a href="/" className="wordmark">
          <Gavel size={22} /> THE COUNCIL<span>EST. FIVE MINUTES AGO</span>
        </a>
        <a
          className="source-link"
          href="https://github.com/cbetz/extremely-specific-council"
          target="_blank"
          rel="noreferrer"
        >
          <CodeXml size={17} /> Open source <ArrowUpRight size={15} />
        </a>
      </header>
      <div className="workspace">
        <aside className="proposal">
          <div className="eyebrow">12 MEMBERS. ZERO QUALIFICATIONS.</div>
          <h1>
            Your idea.
            <br />
            <em>Their problem.</em>
          </h1>
          <p className="intro">
            A council of extremely specific opinions is now in session.
          </p>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              void convene().catch(() => {});
            }}
          >
            <div className="input-heading">
              <label htmlFor="idea">
                {mode === "demo"
                  ? "Pick a questionable idea"
                  : "Submit your questionable idea"}
              </label>
              <span className={`mode-pill ${mode}`}>
                {!configReady
                  ? "CONNECTING"
                  : mode === "live"
                    ? "LIVE AI"
                    : "DEMO"}
              </span>
            </div>
            <Textarea
              id="idea"
              value={idea}
              onChange={(e) => {
                setIdea(e.target.value);
                setResult(null);
                setNotice("");
              }}
              onKeyDown={(e) => {
                if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
                  e.preventDefault();
                  void convene().catch(() => {});
                }
              }}
              readOnly={mode === "demo"}
              disabled={busy}
              aria-describedby="mode-description"
              className="idea-input"
              maxLength={500}
            />
            <div className="input-meta">
              <span>
                {mode === "demo"
                  ? "Scripted samples · choose one below"
                  : "Your idea goes to TypeSafe when submitted."}
              </span>
              {mode === "live" && <span>{idea.length}/500</span>}
            </div>
            <Button
              type="submit"
              className="convene"
              disabled={busy || !configReady || idea.trim().length < 3}
            >
              {busy ? (
                <LoaderCircle className="spin" size={18} />
              ) : (
                <Gavel size={18} />
              )}{" "}
              {busy ? "The council is deliberating…" : "Convene the council"}
            </Button>
          </form>
          <div className="examples">
            <span>Or cause a little trouble</span>
            {EXAMPLES.map((e) => (
              <Button
                key={e.id}
                variant="outline"
                className={`example ${idea === e.idea ? "selected" : ""}`}
                onClick={() => chooseExample(e.idea)}
                disabled={busy}
              >
                <Sparkles size={14} />
                {e.label}
              </Button>
            ))}
          </div>
          <div id="mode-description" className="mode-note">
            <b>
              {mode === "demo"
                ? "Demo · scripted votes"
                : "Live opinions · TypeSafe AI"}
            </b>
            <p>
              {mode === "demo"
                ? liveAvailable
                  ? "Try a sample, or switch to live for your own ideas."
                  : "Try the four examples. Connect a server API key to get live opinions on your own ideas."
                : "One proposal. Twelve perspectives. Thirty-six judgments."}
            </p>
            {liveAvailable && (
              <Button
                variant="link"
                className="mode-switch"
                disabled={busy}
                onClick={() => {
                  setMode(mode === "demo" ? "live" : "demo");
                  chooseExample(EXAMPLES[0].idea);
                }}
              >
                {mode === "demo"
                  ? "Switch to live opinions"
                  : "Try scripted demo"}
              </Button>
            )}
            {!liveAvailable && (
              <a
                href="https://github.com/cbetz/extremely-specific-council#live-opinions"
                target="_blank"
                rel="noreferrer"
              >
                Run your own live Council ↗
              </a>
            )}
          </div>
          {error && (
            <p className="error-message" role="alert">
              {error}
            </p>
          )}
          {notice && (
            <p className="notice" role="status">
              {notice}
            </p>
          )}
          {result && votes && (
            <div className="verdict">
              <div className="division">
                <span>ROOM DIVISION</span>
                <b>
                  {votes.division}
                  <small>/100</small>
                </b>
              </div>
              <div className="vote-totals">
                <span>
                  <b>{votes.yes}</b> approve
                </span>
                <span>
                  <b>{votes.no}</b> oppose
                </span>
                <span>
                  <b>{votes.confused}</b> baffled
                </span>
              </div>
              <div className="share-actions">
                <Button
                  variant="outline"
                  onClick={() => void save()}
                  disabled={exporting}
                  className="share-button"
                >
                  {exporting ? (
                    <LoaderCircle className="spin" size={16} />
                  ) : (
                    <Download size={16} />
                  )}{" "}
                  Save card
                </Button>
                <Button
                  variant="outline"
                  onClick={() => void share()}
                  className="share-button"
                >
                  <Copy size={16} /> Copy verdict
                </Button>
              </div>
              <p>
                {result.mode === "live"
                  ? `${result.durationMs.toLocaleString()} ms · one TypeSafe request`
                  : "Scripted demo · no AI request"}
              </p>
            </div>
          )}
        </aside>
        <section
          className={`chamber ${busy ? "deliberating" : ""}`}
          aria-label="Council members"
          aria-busy={busy}
        >
          <div className="chamber-heading">
            <h2 aria-live="polite">{heading}</h2>
            <span>
              {result
                ? result.mode === "live"
                  ? "LIVE TYPESAFE VOTE"
                  : "SCRIPTED DEMO VOTE"
                : "ALL 12 MEMBERS PRESENT"}
            </span>
          </div>
          {result && (
            <p className="proposal-readback">
              On the matter of: “{result.idea}”
            </p>
          )}
          <div className="member-grid">
            {MEMBERS.map((m, i) => {
              const d = result?.decisions.find((v) => v.id === m.id);
              return (
                <article
                  className={`member-card ${d ? `voted vote-${d.vote}` : ""}`}
                  key={`${m.id}-${result?.idea ?? "waiting"}-${result?.mode ?? ""}`}
                  style={
                    {
                      "--member-color": m.color,
                      "--delay": `${i * 45}ms`,
                    } as CSSProperties
                  }
                >
                  <span className="seat">{String(i + 1).padStart(2, "0")}</span>
                  {d && (
                    <span className={`vote-icon ${d.vote}`} aria-hidden="true">
                      {d.vote === "yes" ? (
                        <Check size={15} />
                      ) : d.vote === "no" ? (
                        <X size={15} />
                      ) : (
                        <CircleHelp size={15} />
                      )}
                    </span>
                  )}
                  <Portrait index={i} />
                  <h3>{m.name}</h3>
                  <p className="member-title">{m.title}</p>
                  <p className="reaction-line">
                    {busy
                      ? "Forming a deeply personal opinion…"
                      : d
                        ? `“${d.line}”`
                        : "Ready to make this about themselves."}
                  </p>
                  {d && (
                    <div className="member-meters">
                      <Meter label="Enthusiasm" value={d.enthusiasm} />
                      <Meter label="Confused?" value={d.confusion} />
                    </div>
                  )}
                  <div className={`vote-badge ${d ? d.vote : "waiting"}`}>
                    {busy
                      ? "DELIBERATING"
                      : d
                        ? VOTE_LABELS[d.vote]
                        : "AWAITING CHAOS"}
                  </div>
                </article>
              );
            })}
          </div>
          {result && <Inspector result={result} />}
        </section>
      </div>
      <footer>
        <span>Artificial opinions. Very real personality problems.</span>
        <a
          href="https://docs.typesafe.ai/introduction"
          target="_blank"
          rel="noreferrer"
        >
          Powered by TypeSafe AI ↗
        </a>
      </footer>
    </main>
  );
}
