import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { arch, cpus, hostname, platform, release, totalmem } from "node:os";

interface BenchmarkScenario {
  id: string;
  resolution: string;
  targetFps: number;
  durationSeconds: number;
  directShowConsumerOpen: boolean;
  obsFallback: boolean;
  experimental?: boolean;
}

interface BenchmarkResult {
  schemaVersion: 1;
  measurementStatus: "template-not-run" | "manual-run" | "automated-run";
  scenario: BenchmarkScenario;
  machine: {
    host: string;
    os: string;
    arch: string;
    cpu: string;
    memoryGb: number;
    node: string;
    rust?: string;
    tauri?: string;
  };
  run: {
    startedAt: string;
    durationSeconds: number;
    actualDeliveredFps: number | null;
    capturedFrames: number | null;
    deliveredFrames: number | null;
    droppedFrames: number | null;
    averageFrameSendMs: number | null;
    p95FrameSendMs: number | null;
    averageRustWriteMs: number | null;
    directShowConsumerOpen: boolean;
    obsFallback: boolean;
    notes: string;
  };
}

const scenarios: BenchmarkScenario[] = [
  scenario("360p24-5m", "640x360", 24, 5 * 60, false, false),
  scenario("540p30-5m", "960x540", 30, 5 * 60, false, false),
  scenario("720p30-10m", "1280x720", 30, 10 * 60, false, false),
  scenario("720p30-10m-consumer-open", "1280x720", 30, 10 * 60, true, false),
  { ...scenario("1080p30-stress", "1920x1080", 30, 5 * 60, true, false), experimental: true }
];

const args = new Set(process.argv.slice(2));
const outputArg = process.argv.find((arg) => arg.startsWith("--out="));
const summarizeArg = process.argv.find((arg) => arg.startsWith("--summarize="));

if (args.has("--print-plan")) {
  console.log(JSON.stringify({ scenarios }, null, 2));
} else if (summarizeArg) {
  summarize(resolve(summarizeArg.slice("--summarize=".length)));
} else {
  const output = resolve(outputArg?.slice("--out=".length) ?? "benchmarks/results/frame-pump-template.local.json");
  writeTemplate(output);
}

function scenario(
  id: string,
  resolution: string,
  targetFps: number,
  durationSeconds: number,
  directShowConsumerOpen: boolean,
  obsFallback: boolean
): BenchmarkScenario {
  return { id, resolution, targetFps, durationSeconds, directShowConsumerOpen, obsFallback };
}

function writeTemplate(output: string) {
  const result: BenchmarkResult[] = scenarios.map((item) => ({
    schemaVersion: 1,
    measurementStatus: "template-not-run",
    scenario: item,
    machine: machineProfile(),
    run: {
      startedAt: new Date().toISOString(),
      durationSeconds: item.durationSeconds,
      actualDeliveredFps: null,
      capturedFrames: null,
      deliveredFrames: null,
      droppedFrames: null,
      averageFrameSendMs: null,
      p95FrameSendMs: null,
      averageRustWriteMs: null,
      directShowConsumerOpen: item.directShowConsumerOpen,
      obsFallback: item.obsFallback,
      notes:
        "Template only. Fill this from the Direct Windows Camera metrics panel after running the scenario for the required duration."
    }
  }));

  mkdirSync(dirname(output), { recursive: true });
  writeFileSync(output, `${JSON.stringify(result, null, 2)}\n`);
  console.log(`Wrote benchmark template: ${output}`);
}

function summarize(path: string) {
  const raw = readFileSync(path, "utf8");
  const results = JSON.parse(raw) as BenchmarkResult[];
  const summary = results.map((result) => ({
    id: result.scenario.id,
    status: result.measurementStatus,
    resolution: result.scenario.resolution,
    targetFps: result.scenario.targetFps,
    actualDeliveredFps: result.run.actualDeliveredFps,
    droppedFrames: result.run.droppedFrames,
    averageFrameSendMs: result.run.averageFrameSendMs,
    p95FrameSendMs: result.run.p95FrameSendMs
  }));
  console.log(JSON.stringify(summary, null, 2));
}

function machineProfile(): BenchmarkResult["machine"] {
  return {
    host: hostname(),
    os: `${platform()} ${release()}`,
    arch: arch(),
    cpu: cpus()[0]?.model ?? "Unknown CPU",
    memoryGb: Math.round((totalmem() / 1024 ** 3) * 10) / 10,
    node: process.version
  };
}
