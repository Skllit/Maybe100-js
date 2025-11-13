// tests/cli.test.js (CommonJS version for Jest)
const { exec } = require("child_process");
const { promisify } = require("util");
const run = promisify(exec);

test("find ERROR in sample.log", async () => {
  const { stdout } = await run('node ./bin/finder.js --file ./sample_logs/sample.log --pattern ERROR --json');
  const obj = JSON.parse(stdout);
  expect(obj.totalLines).toBe(12);
  expect(obj.matchedCount).toBe(5);
  expect(obj.samples.length).toBeGreaterThanOrEqual(2);
}, 10000);
