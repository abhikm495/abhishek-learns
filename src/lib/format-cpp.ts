/**
 * Lightweight C++ formatter (brace-based re-indentation).
 * Not a full clang-format replacement, but handles the common cases for
 * competitive / interview style C++ solutions: consistent 4-space indents,
 * dedented access specifiers and case labels, and collapsed blank lines.
 *
 * Brace counting ignores braces inside string/char literals and line comments.
 */

const INDENT = "    ";

function countBraces(line: string): { opens: number; closes: number } {
  let opens = 0;
  let closes = 0;
  let inStr = false;
  let inChar = false;

  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    const prev = line[i - 1];

    if (inStr) {
      if (ch === '"' && prev !== "\\") inStr = false;
      continue;
    }
    if (inChar) {
      if (ch === "'" && prev !== "\\") inChar = false;
      continue;
    }
    if (ch === '"') {
      inStr = true;
      continue;
    }
    if (ch === "'") {
      inChar = true;
      continue;
    }
    if (ch === "/" && line[i + 1] === "/") break;
    if (ch === "{") opens++;
    else if (ch === "}") closes++;
  }

  return { opens, closes };
}

function isLabelLine(line: string): boolean {
  return (
    /^(public|private|protected)\s*:/.test(line) ||
    /^case\b.*:/.test(line) ||
    /^default\s*:/.test(line)
  );
}

export function formatCpp(input: string): string {
  if (!input.trim()) return "";

  const lines = input.replace(/\r\n/g, "\n").replace(/\t/g, "    ").split("\n");
  const out: string[] = [];
  let depth = 0;
  let blankRun = 0;

  for (const raw of lines) {
    const line = raw.trim();

    if (line === "") {
      blankRun++;
      if (blankRun > 1) continue;
      out.push("");
      continue;
    }
    blankRun = 0;

    const startsWithClose = line[0] === "}" || line[0] === ")";
    let indentDepth = startsWithClose ? Math.max(0, depth - 1) : depth;

    if (isLabelLine(line) && indentDepth > 0) {
      indentDepth -= 1;
    }

    out.push(INDENT.repeat(Math.max(0, indentDepth)) + line);

    const { opens, closes } = countBraces(line);
    depth += opens - closes;
    if (depth < 0) depth = 0;
  }

  return out.join("\n").replace(/\n{3,}/g, "\n\n").trim();
}
