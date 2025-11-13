#!/usr/bin/env node
// bin/finder.js
import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import { findInFiles } from "../lib/streamReader.js";
import { createMatcher } from "../lib/matcher.js";
import { aggregateResultsToStdout } from "../lib/aggregator.js";

const argv = yargs(hideBin(process.argv))
 //hideBin(process.argv) removes the node and script path entries so yargs sees only user args. 

//  Options:
// --file required (file path or glob)
// --pattern required (string or regex-like)
// -i (--ignoreCase) optional
// --json optional to produce machine-readable output
  .usage("Usage: $0 --file <path> --pattern <string|regex> [options]")
  .option("file", { type: "string", describe: "Path to file or glob", demandOption: true })
  .option("pattern", { type: "string", describe: "Search string or regex", demandOption: true })
  .option("i", { alias: "ignoreCase", type: "boolean", describe: "Case-insensitive search", default: false })
  .option("json", { type: "boolean", describe: "Output JSON", default: false })
  .help()
  .parse();
  //Configures CLI: usage, options, help. demandOption: true forces required args.

async function main() {
  try {
    // build matcher
    const matcher = createMatcher(argv.pattern, { ignoreCase: argv.ignoreCase });
    // find and stream lines
    const results = await findInFiles(argv.file, matcher);
    // aggregate and print
    aggregateResultsToStdout(results, { json: argv.json });
    process.exitCode = 0;
  } catch (err) {
    console.error("Error:", err.message);
    process.exitCode = 1;
  }
}

await main();
