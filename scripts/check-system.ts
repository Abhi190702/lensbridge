const checks = [
  ["node", process.version],
  ["platform", process.platform],
  ["arch", process.arch]
];

for (const [label, value] of checks) {
  console.log(`${label}: ${value}`);
}

console.log("Run `pnpm check:rust` to verify the Rust/Tauri toolchain.");
