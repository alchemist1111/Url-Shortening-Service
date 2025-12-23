import { useState } from "react";
import { useUrl } from "../context/AppContext";
import ResultCard from "./ResultCard";


export default function ShortenForm() {
    const { state, actions } = useUrl();
  const [url, setUrl] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    actions.clearError();

    if (!url.trim()) return;

    const record = await actions.createShortUrl(url.trim());
    if (record) setUrl("");
  }

  return (
    <section className="rounded-2xl bg-slate-900/60 p-6 shadow">
      <h2 className="text-xl font-semibold">Create a short URL</h2>
      <p className="mt-1 text-sm text-slate-300">
        Paste a long URL and generate a short code.
      </p>

      <form onSubmit={handleSubmit} className="mt-4 flex flex-col gap-3 sm:flex-row">
        <input
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://example.com/very/long/url"
          className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm outline-none focus:border-slate-500"
        />
        <button
          type="submit"
          disabled={state.loading}
          className="rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold hover:bg-indigo-500 disabled:opacity-60"
        >
          {state.loading ? "Shortening..." : "Shorten"}
        </button>
      </form>

      {state.error && (
        <p className="mt-3 rounded-xl border border-red-800 bg-red-950/40 p-3 text-sm text-red-200">
          {state.error}
        </p>
      )}

      {state.active && (
        <div className="mt-4">
          <ResultCard data={state.active} />
        </div>
      )}
    </section>
  );
}