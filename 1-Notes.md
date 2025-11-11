🧠 Overview
Node.js Streams
Backpressure
Async Iterators (for await)
File System (fs) & Promises
Command-Line Arguments (process.argv)
Regex & Safe Pattern Matching
Graceful Error Handling
Exit Codes
Node Modules & Imports

### Node.js Streams

Streams let you read or write data in chunks.

Avoids reading large files entirely into memory.

Used in file I/O, HTTP requests/responses, sockets, etc.

import fs from "fs";

const stream=fs.createReadStream("path",{encoding:"utf8"});

stream.on("data",(chunk)=>{
    console.log("Received chunk:", chunk.length, "bytes")
})

stream.on("end", ()=>{
    console.log(file reading complete)
})

stream.on("error", (err) => {
  console.error("Error reading file:", err.message);
});

### fs.createReadStream() → returns a readable stream that emits 'data' events with chunks 
on("data") → triggered each time a chunk is read.
on("end") → triggered once after all chunks are read.
on("error") → triggered if file missing or unreadable.

## fs.readFile() Loads the entire file into memory → huge memory footprint for large logs

### Backpressure — “When your consumer can’t keep up. 

Backpressure = the signal from a slow consumer to a fast producer to pause sending more data until the consumer is ready.

import fs from "fs";
import { Transform } from "stream";

const slowTransform = new Transform({
  transform(chunk, encoding, callback) {
    setTimeout(() => {
      console.log("Processed:", chunk.length, "bytes");
      callback(null, chunk);
    }, 100); // Simulates slow processing
  }
});

fs.createReadStream("./sample.txt")
  .pipe(slowTransform)
  .pipe(fs.createWriteStream("./copy.txt"))
  .on("finish", () => console.log("Copy done."));


The Transform stream introduces artificial slowness.

.pipe() ensures automatic backpressure handling — it pauses reading when the transform’s buffer is full.

## Async Iterators & for await ... of

Instead of event callbacks, you can read streams using for await ... of, which makes the code cleaner and linear.

import fs from "fs";

const stream = fs.createReadStream("./sample.txt", { encoding: "utf8" });

for await (const chunk of stream) {
  console.log("Chunk length:", chunk.length);
}
console.log("Done reading file.");


Streams are async iterables.

for await loops until 'end' event.

This approach integrates easily with async/await flow.



## File System (fs.promises)
Use fs.promises API for async file ops that return Promises (not callbacks).

import fs from "fs/promises";

try {
  const stats = await fs.stat("./sample.txt");
  console.log("File size:", stats.size);
} catch (err) {
  console.error("File not found:", err.message);
}


fs.stat checks metadata (size, modified date, etc.).

Using await simplifies async code.


### Command-Line Arguments (process.argv)

const [, , name = "Developer", age = "unknown"] = process.argv;
console.log(`Hello, ${name}! You are ${age} years old.`);

process.argv = array: [nodePath, scriptPath, arg1, arg2, ...].
Using destructuring makes it cleaner.
Default values (= "Developer") ensure no crash if arg missing.

### Regex & Safe Pattern Matching

We’ll let users search for patterns like /error/i.
But naive regex use → ReDoS risk (Regex Denial of Service).

function safeRegexTest(pattern, text) {
    const regex = new RegExp(pattern, "i");
    return regex.test(text);

}

console.log(safeRegexTest("error", "Error: something failed"));
console.log(safeRegexTest("invalid(", "Error: something failed")));


### Graceful Error Handling & Exit Codes
try {
  throw new Error("Something went wrong");
} catch (err) {
  console.error("Caught error:", err.message);
  process.exitCode = 1;
}
console.log("Program ended with exit code:", process.exitCode);

process.exitCode = 1 means script failed but allows remaining code cleanup.

process.exit(1) terminates immediately — unsafe if you still have pending async work.


### Node Modules & Imports — ESM vs CommonJS

CommonJS: const fs = require("fs")

ESM (modern): import fs from "fs"


