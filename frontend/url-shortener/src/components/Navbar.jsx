export default function Navbar() {
    return (
    <nav className="border-b border-slate-800 bg-slate-950/80 backdrop-blur">
      <div className="mx-auto max-w-6xl px-4 py-4 flex items-center justify-between">
        <h1 className="text-lg font-bold tracking-tight text-white">
          URL Shortener
        </h1>
        <span className="text-xs text-slate-400">
          DRF • MySQL • React • Tailwind
        </span>
      </div>
    </nav>
  );
}