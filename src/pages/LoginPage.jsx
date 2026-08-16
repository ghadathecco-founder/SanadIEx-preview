import { useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../lib/auth.jsx";

const BG = "#000000";
const INK = "#FFFFFF";
const PURPLE = "#A78BFA";
const BLUE = "#93C5FD";
const INDIGO = "#818CF8";
const CTA = "linear-gradient(to left, #2563EB, #7C3AED)";
const HIGHLIGHT = "linear-gradient(to left, #93C5FD, #A78BFA)";

function mapAuthError(message) {
  const m = (message || "").toLowerCase();
  if (m.includes("invalid login")) return "بيانات الدخول غير صحيحة.";
  if (m.includes("email not confirmed")) return "البريد الإلكتروني غير مؤكد.";
  if (m.includes("rate limit")) return "محاولات كثيرة. انتظر قليلاً ثم أعد المحاولة.";
  if (m.includes("invalid email")) return "صيغة البريد الإلكتروني غير صالحة.";
  return "تعذّر تسجيل الدخول. تحقق من البيانات وأعد المحاولة.";
}

function StructuralPanel() {
  return (
    <svg viewBox="0 0 480 560" className="h-full w-full" role="img" aria-label="مخطط هيكلي للالتزام الرقابي">
      <defs>
        <linearGradient id="hi" x1="1" y1="0" x2="0" y2="0">
          <stop offset="0%" stopColor="#93C5FD" />
          <stop offset="100%" stopColor="#A78BFA" />
        </linearGradient>
        <linearGradient id="cta" x1="1" y1="0" x2="0" y2="0">
          <stop offset="0%" stopColor="#2563EB" />
          <stop offset="100%" stopColor="#7C3AED" />
        </linearGradient>
      </defs>
      {Array.from({ length: 12 }, (_, i) => (
        <line key={`v${i}`} x1={40 + i * 36} y1={40} x2={40 + i * 36} y2={520} stroke={INDIGO} strokeOpacity="0.18" />
      ))}
      {Array.from({ length: 14 }, (_, i) => (
        <line key={`h${i}`} x1={40} y1={40 + i * 36} x2={440} y2={40 + i * 36} stroke={INDIGO} strokeOpacity="0.14" />
      ))}
      <polyline fill="none" stroke="url(#hi)" strokeWidth="2.5" points="56,360 96,320 136,332 176,260 216,280 256,190 296,210 336,140 376,168 416,96" />
      <polyline fill="none" stroke="url(#cta)" strokeWidth="2" strokeOpacity="0.85" points="56,420 96,400 136,408 176,370 216,384 256,330 296,348 336,300 376,318 416,250" />
      <circle cx="416" cy="96" r="4" fill={PURPLE} />
      <circle cx="416" cy="250" r="4" fill={BLUE} />
      <text x="40" y="28" fill={BLUE} fontSize="11" fontFamily="IBM Plex Sans Arabic, sans-serif">ساما / هيئة السوق</text>
      <text x="300" y="544" fill={INDIGO} fontSize="11" fontFamily="IBM Plex Sans, sans-serif">M1 · Regulatory Intelligence</text>
    </svg>
  );
}

export default function LoginPage() {
  const { session, ready, signIn, resetPassword } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");

  if (ready && session) return <Navigate to="/" replace />;

  async function onSubmit(e) {
    e.preventDefault();
    setError("");
    setInfo("");
    if (!email.trim() || !password) {
      setError("أدخل البريد الإلكتروني وكلمة المرور.");
      return;
    }
    setBusy(true);
    const { error: err } = await signIn(email, password);
    setBusy(false);
    if (err) setError(mapAuthError(err.message));
  }

  async function onForgot() {
    setError("");
    setInfo("");
    if (!email.trim()) {
      setError("أدخل بريدك أولاً لإرسال رابط الاستعادة.");
      return;
    }
    setBusy(true);
    const { error: err } = await resetPassword(email);
    setBusy(false);
    if (err) setError(mapAuthError(err.message));
    else setInfo("أُرسل رابط استعادة كلمة المرور إلى بريدك.");
  }

  return (
    <div lang="ar" dir="rtl" className="min-h-screen" style={{ background: BG, color: INK }}>
      <div className="mx-auto grid min-h-screen max-w-6xl grid-cols-1 lg:grid-cols-2">
        <section className="flex flex-col justify-center px-8 py-12 sm:px-14">
          <p className="mb-3 text-xs font-medium tracking-wide" style={{ color: BLUE }}>SanadIEx · Module 1</p>
          <h1 className="text-3xl font-semibold sm:text-4xl">سند إكس</h1>
          <div className="mt-3 h-1 w-24 rounded-full" style={{ backgroundImage: HIGHLIGHT }} />
          <p className="mt-4 max-w-md text-sm" style={{ color: "#E5E7EB" }}>
            منصة الذكاء الرقابي لمسؤولي الالتزام في المؤسسات المالية الخاضعة لساما وهيئة السوق المالية.
          </p>
          <form onSubmit={onSubmit} className="mt-10 max-w-md space-y-4">
            <label className="block">
              <span className="mb-1.5 block text-xs" style={{ color: PURPLE }}>البريد الإلكتروني</span>
              <input type="email" autoComplete="username" dir="ltr" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full rounded-lg border bg-black px-3 py-2.5 text-sm outline-none" style={{ borderColor: INDIGO, color: INK, textAlign: "left" }} />
            </label>
            <label className="block">
              <span className="mb-1.5 block text-xs" style={{ color: PURPLE }}>كلمة المرور</span>
              <input type="password" autoComplete="current-password" dir="ltr" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full rounded-lg border bg-black px-3 py-2.5 text-sm outline-none" style={{ borderColor: INDIGO, color: INK, textAlign: "left" }} />
            </label>
            {error ? <p className="text-sm" style={{ color: "#93C5FD" }} role="alert">{error}</p> : null}
            {info ? <p className="text-sm" style={{ color: PURPLE }} role="status">{info}</p> : null}
            <button type="submit" disabled={busy} className="w-full rounded-lg py-2.5 text-sm font-semibold text-white disabled:opacity-60" style={{ backgroundImage: CTA }}>
              {busy ? "جاري التحقق…" : "دخول"}
            </button>
            <button type="button" onClick={onForgot} disabled={busy} className="w-full text-xs disabled:opacity-60" style={{ color: BLUE }}>
              نسيت كلمة المرور؟
            </button>
          </form>
        </section>
        <aside className="hidden px-8 py-12 lg:block">
          <div className="h-full rounded-2xl border p-6" style={{ borderColor: "rgba(129,140,248,0.35)" }}>
            <StructuralPanel />
          </div>
        </aside>
      </div>
    </div>
  );
}
