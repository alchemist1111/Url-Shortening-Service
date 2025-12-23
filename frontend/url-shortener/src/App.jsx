import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ShortenForm from "./pages/ShortenForm";
import ManageShortcode from "./pages/ManageShortcode";
import { Routes, Route, Navigate } from "react-router-dom";

export default function App() {
  return (
    <div className="flex min-h-screen flex-col bg-slate-950 text-slate-100">
      <Navbar />

      <main className="mx-auto w-full max-w-4xl flex-1 px-4 py-10 space-y-10">
        <Routes>
          <Route path="/shorten-form" element={<ShortenForm />} />
          <Route path="/manage-short-code" element={<ManageShortcode />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      <Footer />
    </div>
  );
}
