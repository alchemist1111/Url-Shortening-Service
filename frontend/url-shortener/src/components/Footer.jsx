export default function Footer() {
    return (
    <footer className="border-t border-slate-800 bg-slate-950/80">
      <div className="mx-auto max-w-6xl px-4 py-6 text-center">
        <p className="text-xs text-slate-500">
          © {new Date().getFullYear()} URL Shortener Service - Built with ❤️
        </p>
      </div>
    </footer>
  );
}