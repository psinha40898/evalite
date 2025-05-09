import { createDatabase, getEvals, getMostRecentRun } from "evalite/db";
import { runVitest } from "evalite/runner";
import { assert, expect, it } from "vitest";
import { captureStdout, loadFixture } from "./test-utils.js";

it("Should handle objects as inputs and outputs", async () => {
  using fixture = loadFixture("objects");

  const captured = captureStdout();

  await runVitest({
    cwd: fixture.dir,
    path: undefined,
    testOutputWritable: captured.writable,
    mode: "run-once-and-exit",
  });

  const db = createDatabase(fixture.dbLocation);

  const run = getMostRecentRun(db, "full");

  assert(run, "Run not found");

  const evals = getEvals(db, [run.id], ["fail", "success", "running"]);

  expect(evals).toMatchObject([{}]); // TODO
});
