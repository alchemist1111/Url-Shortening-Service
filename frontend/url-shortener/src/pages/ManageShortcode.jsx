import { useState } from "react";
import { useUrl } from "../context/AppContext";
import ResultCard from "./ResultCard";
import StatsCard from "./StatsCard";

export default function ManageShortcode() {
    const { state, actions } = useUrl();
  const [code, setCode] = useState("");
  const [newUrl, setNewUrl] = useState("");

  async function getUrl() {
    actions.clearError();
    const record = await actions.getShortUrl(code.trim());
    if (record) setNewUrl(record.url);
  }

  async function getStats() {
    actions.clearError();
    await actions.getStats(code.trim());
  }

  async function updateUrl() {
    actions.clearError();
    const record = await actions.updateShortUrl(code.trim(), newUrl.trim());
    if (record) setNewUrl(record.url);
  }

  async function deleteUrl() {
    actions.clearError();
    await actions.deleteShortUrl(code.trim());
  }

  return (
    <section className="rounded-2xl bg-slate-900/60 p-6 shadow">
      <h2 className="text-xl font-semibold">Manage a short code</h2>
      <p className="mt-1 text-sm text-slate-300">
        Retrieve, update, delete, or view statistics.
      </p>

      <div className="mt-4 flex flex-col gap-3 sm:flex-row">
        <input
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="Enter short code (e.g. abc123)"
          className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm outline-none focus:border-slate-500"
        />
        <button
          onClick={getUrl}
          disabled={state.loading}
          className="rounded-xl bg-slate-200 px-5 py-3 text-sm font-semibold text-slate-900 hover:bg-white disabled:opacity-60"
        >
          Get
        </button>
        <button
          onClick={getStats}
          disabled={state.loading}
          className="rounded-xl border border-slate-700 bg-slate-900 px-5 py-3 text-sm font-semibold hover:bg-slate-800 disabled:opacity-60"
        >
          Stats
        </button>
      </div>

      {state.error && (
        <p className="mt-3 rounded-xl border border-red-800 bg-red-950/40 p-3 text-sm text-red-200">
          {state.error}
        </p>
      )}

      {state.active && (
        <div className="mt-4 space-y-4">
          <ResultCard data={state.active} />

          <div className="rounded-2xl border border-slate-800 bg-slate-950/40 p-4">
            <p className="text-sm font-semibold">Update URL</p>
            <div className="mt-3 flex flex-col gap-3 sm:flex-row">
              <input
                value={newUrl}
                onChange={(e) => setNewUrl(e.target.value)}
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm outline-none focus:border-slate-500"
              />
              <button
                onClick={updateUrl}
                disabled={state.loading}
                className="rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold hover:bg-indigo-500 disabled:opacity-60"
              >
                Update
              </button>
              <button
                onClick={deleteUrl}
                disabled={state.loading}
                className="rounded-xl border border-red-800 bg-red-950/40 px-5 py-3 text-sm font-semibold text-red-200 hover:bg-red-950 disabled:opacity-60"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {state.stats && (
        <div className="mt-4">
          <StatsCard data={state.stats} />
        </div>
      )}
    </section>
  );
}