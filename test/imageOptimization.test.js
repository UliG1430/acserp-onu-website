import test from "node:test";
import assert from "node:assert/strict";
import { calculateContainedSize, formatOptimizationSummary } from "../src/utils/imageOptimization.js";

test("large images are proportionally contained within an optimization profile", () => {
  assert.deepEqual(calculateContainedSize(6000, 4000, 1920, 1920), { width: 1920, height: 1280 });
  assert.deepEqual(calculateContainedSize(3000, 6000, 1920, 1920), { width: 960, height: 1920 });
});

test("small images are never enlarged", () => {
  assert.deepEqual(calculateContainedSize(640, 480, 1920, 1920), { width: 640, height: 480 });
});

test("optimization summary reports savings without promising them when absent", () => {
  assert.match(formatOptimizationSummary({ originalSize: 10_000_000, outputSize: 2_000_000, optimized: true }), /80% menos/);
  assert.equal(formatOptimizationSummary({ originalSize: 1000, outputSize: 1000, optimized: false }), "archivo preparado");
});
