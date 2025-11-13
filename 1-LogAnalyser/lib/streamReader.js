// lib/streamReader.js
import fs from "fs";
import readline from "readline";
import path from "path";
import { promisify } from "util";
import glob from "glob";

const globP = promisify(glob);

/**
 * findInFiles(fileOrGlob, matcher)
 * - fileOrGlob: path or glob pattern (e.g. ./logs/*.log)
 * - matcher: { test(line) => boolean }
 *
 * Returns: { totalLines, matchedCount, samples: [{file, lineNo, text}], errors: [] }
 */
export async function findInFiles(fileOrGlob, matcher) {
  const files = await globP(fileOrGlob, { nodir: true }).catch(() => {
    // if glob fails (like plain filename), use it as single file
    return [fileOrGlob];
  });

  let totalLines = 0;
  let matchedCount = 0;
  const samples = [];
  const errors = [];

  // limit concurrency to process files sequentially to keep memory predictable
  for (const file of files) {
    const resolved = path.resolve(file);
    try {
      const stat = await fs.promises.stat(resolved);
      if (!stat.isFile()) {
        errors.push({ file: resolved, message: "Not a file" });
        continue;
      }
    } catch (err) {
      errors.push({ file: resolved, message: err.message });
      continue;
    }

    const stream = fs.createReadStream(resolved, { encoding: "utf8" });
    const rl = readline.createInterface({ input: stream, crlfDelay: Infinity });

    let lineNo = 0;
    try {
      for await (const line of rl) {
        lineNo += 1;
        totalLines += 1;
        if (matcher.test(line)) {
          matchedCount += 1;
          if (samples.length < 10) {
            samples.push({ file: resolved, lineNo, text: line });
          }
        }
      }
    } catch (err) {
      errors.push({ file: resolved, message: err.message });
    } finally {
      // ensure stream is closed
      stream.destroy();
      rl.close();
    }
  }

  return { totalLines, matchedCount, samples, errors };
}
