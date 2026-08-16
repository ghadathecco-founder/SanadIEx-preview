import { useNavigate } from "react-router-dom";
import NotificationBell from "./NotificationBell.jsx";
import { useAuth } from "../../lib/auth.jsx";

export default function Topbar({
  title = "نظرة عامة",
  subtitle = "منصة الالتزام الرقابي للمؤسسات المالية",
  notifications = [],
  notificationsLive = false,
}) {
  const { signOut, user } = useAuth();
  const navigate = useNavigate();
  const initial = (user?.email || "غ").slice(0, 1).toUpperCase();

  async function onSignOut() {
    await signOut();
    navigate("/login", { replace: true });
  }

  return (
    <header className="flex h-16 items-center justify-between gap-4 border-b border-sand-300/60 bg-cream-50/90 px-6 backdrop-blur">
      <div className="min-w-0">
        <p className="truncate text-sm font-semibold text-ink">{title}</p>
        <p className="truncate text-[11px] text-muted">{subtitle}</p>
      </div>
      <div className="flex items-center gap-3">
        <div className="hidden items-center gap-2 rounded-lg border border-sand-300/70 bg-white px-3 py-1.5 md:flex">
          <span className="text-[10px] text-muted">المعرّف</span>
          <span className="ltr-num text-xs font-medium text-ink" dir="ltr">
            {user?.email || "SA-CCO-ROOT"}
          </span>
        </div>
        <NotificationBell items={notifications} live={notificationsLive} />
        <button type="button" onClick={onSignOut} className="rounded-lg border border-sand-300/70 bg-white px-2.5 py-1.5 text-[11px] text-ink">
          خروج
        </button>
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-purple-800 font-latin text-xs font-semibold text-cream-50">
          {initial === "G" || initial === "g" ? "غه" : initial}
        </div>
      </div>
    </header>
  );
}
