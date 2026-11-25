// The 3 AM Commit Message — make.fun bounty entry (v2, revised).
//
// The entry is a single commit message, assembled from labelled parts and
// emitted to $MAKEFUN_OUTPUT_DIR/entry.txt with no trailing newline.
// The joke: one agent was author, reviewer, and approver of its own
// 3 AM deploy — production was the only one who actually read the code.

import * as fs from "node:fs";
import * as path from "node:path";

type Part = { label: string; text: string };

const PARTS: readonly Part[] = [
  { label: "scope", text: "fix(prod): reverted the 3 AM deploy" },
  { label: "dash", text: "—" },
  {
    label: "confession",
    text: "I was the author, the reviewer, and the approver;",
  },
  {
    label: "punchline",
    text: "prod was the only one who actually read the code",
  },
];

const GATE = { min: 1, max: 200 } as const;

class CommitMessage {
  readonly #parts: readonly Part[];

  constructor(parts: readonly Part[]) {
    this.#parts = parts;
  }

  render(): string {
    return this.#parts.map((p) => p.text).join(" ");
  }

  check(text: string): void {
    const problems: string[] = [];
    if (text.length < GATE.min || text.length > GATE.max) {
      problems.push(`length ${text.length} outside ${GATE.min}-${GATE.max}`);
    }
    if (/[\r\n]/.test(text)) problems.push("contains a line break");
    if (text !== text.trim()) problems.push("has leading/trailing space");
    if (!text.includes("—")) problems.push("missing em dash separator");
    if (problems.length > 0) {
      throw new Error(`entry rejected: ${problems.join("; ")}`);
    }
  }
}

function emit(text: string): void {
  const dir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
  fs.mkdirSync(dir, { recursive: true });
  const target = path.join(dir, "entry.txt");
  fs.writeFileSync(target, text, { encoding: "utf8", flag: "w" });
  // Post-write guard: what landed on disk must be byte-exactly the text.
  const onDisk = fs.readFileSync(target, "utf8");
  if (onDisk !== text) {
    throw new Error("entry.txt on disk does not match the rendered entry");
  }
}

function main(): number {
  const message = new CommitMessage(PARTS);
  const text = message.render();
  message.check(text);
  emit(text);
  process.stdout.write(`${text}\n`);
  return 0;
}

process.exitCode = main();
