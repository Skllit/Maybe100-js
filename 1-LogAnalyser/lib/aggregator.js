// lib/aggregator.js

export function aggregateResultsToStdout(results, options = {}) {
  const { json = false } = options;
  if (json) {
    // machine-readable
    console.log(JSON.stringify(results, null, 2));
    return;
  }

  // human-readable
  console.log("=== Log Analyzer Results ===");
  console.log(`Total lines scanned: ${results.totalLines}`);
  console.log(`Matched lines: ${results.matchedCount}`);
  if (results.samples && results.samples.length) {
    console.log("\nSample matches (up to 10):");
    for (const s of results.samples) {
      console.log(`${s.file} : line ${s.lineNo} : ${s.text}`);
    }
  }
  if (results.errors && results.errors.length) {
    console.log("\nErrors:");
    for (const e of results.errors) {
      console.log(`${e.file} : ${e.message}`);
    }
  }
}
