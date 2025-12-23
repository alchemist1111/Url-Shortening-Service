import { useUrl } from "../context/AppContext";

export default function ResultCard({ data }) {
    const { actions } = useUrl();
  const shortUrl = actions.redirectUrl(data.shortCode);

  async function copy(text) {
    await navigator.clipboard.writeText(text);
  }

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-950/40 p-4">
      <div className="space-y-2">
        <div>
          <p className="text-xs text-slate-400">Original URL</p>
          <p className="break-all text-sm">{data.url}</p>
        </div>

        <div>
          <p className="text-xs text-slate-400">Short URL</p>
          <a
            href={shortUrl}
            target="_blank"
            rel="noreferrer"
            className="break-all text-sm font-semibold text-indigo-300 hover:text-indigo-200"
          >
            {shortUrl}
          </a>
        </div>

        <div className="flex gap-2 pt-2">
          <button
            onClick={() => copy(shortUrl)}
            className="rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-xs hover:bg-slate-800"
          >
            Copy link
          </button>
          <button
            onClick={() => copy(data.shortCode)}
            className="rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-xs hover:bg-slate-800"
          >
            Copy code
          </button>
        </div>
      </div>
    </div>
  );
}