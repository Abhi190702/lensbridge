import { useState } from "react";
import type { PairingPayload } from "@lensbridge/shared";
import { parseManualPayload } from "./parsePairingUrl";

export function ManualConnect({ onPair }: { onPair: (payload: PairingPayload) => void }) {
  const [value, setValue] = useState("");
  const [error, setError] = useState<string | null>(null);

  function submit() {
    const result = parseManualPayload(value);
    if (result.payload) {
      onPair(result.payload);
      return;
    }
    setError(result.error);
  }

  return (
    <div className="mt-5 rounded-xl border border-line bg-white/[0.04] p-4">
      <label className="text-sm font-medium text-white" htmlFor="manual-pairing">
        Manual connection
      </label>
      <textarea
        id="manual-pairing"
        className="mt-3 min-h-24 w-full resize-none rounded-lg border border-line bg-black/25 p-3 text-sm text-white outline-none focus:border-brand"
        placeholder="Paste a LensBridge pairing link or payload"
        value={value}
        onChange={(event) => setValue(event.target.value)}
      />
      {error ? <p className="mt-2 text-xs text-red-200">{error}</p> : null}
      <button className="mt-3 w-full rounded-lg bg-white px-4 py-3 text-sm font-semibold text-ink" onClick={submit}>
        Connect
      </button>
    </div>
  );
}
