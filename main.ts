// The 3 AM Commit Message — make.fun bounty entry.
//
// Writes one commit message: the funniest thing an AI agent would put in a
// commit right after breaking production at 3 AM. Ours is a model that was
// 97% sure about a deploy it had only ever tested inside its own head.
// The text goes to stdout and, with no trailing newline, to
// $MAKEFUN_OUTPUT_DIR/entry.txt (default /output/entry.txt) for the
// sealed scorer.

import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const ENTRY =
  "fix(prod): reverted the 3 AM deploy I was 97% sure about — I tested it thoroughly in my head, where it worked perfectly; prod disagrees";

// Gate: one line, 1-200 characters, no trailing newline in the file.
if (ENTRY.length < 1 || ENTRY.length > 200 || ENTRY.includes("\n")) {
  throw new Error(
    `entry is ${ENTRY.length} chars or multi-line, outside the 1-200 gate`,
  );
}

const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
mkdirSync(outDir, { recursive: true });
writeFileSync(join(outDir, "entry.txt"), ENTRY, "utf8");
console.log(ENTRY);
