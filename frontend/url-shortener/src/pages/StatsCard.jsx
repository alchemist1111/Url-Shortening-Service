import { useUrl } from "../context/AppContext";

export default function StatsCard({ data }) {
    const { actions } = useUrl();
  const shortUrl = actions.redirectUrl(data.shortCode);

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-950/40 p-4">
      <h3 className="text-sm font-semibold">Statistics</h3>

      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        <div>
          <p className="text-xs text-slate-400">Short Code</p>
          <p className="text-sm">{data.shortCode}</p>
        </div>
        <div>
          <p className="text-xs text-slate-400">Access Count</p>
          <p className="text-sm font-bold">{data.accessCount}</p>
        </div>
      </div>

      <div className="mt-3">
        <p className="text-xs text-slate-400">Redirect Link</p>
        <a
          href={shortUrl}
          target="_blank"
          rel="noreferrer"
          className="break-all text-sm font-semibold text-indigo-300 hover:text-indigo-200"
        >
          {shortUrl}
        </a>
      </div>
    </div>
  );
}