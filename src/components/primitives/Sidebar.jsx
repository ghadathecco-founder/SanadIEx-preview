import { NavLink } from "react-router-dom";

export const NAV_ITEMS = [
  { to: "/", label: "نظرة عامة", icon: "grid" },
  { to: "/intelligence", label: "الذكاء الرقابي", icon: "pulse" },
  { to: "/institutions", label: "المؤسسات", icon: "nodes" },
  { to: "/users", label: "المستخدمون", icon: "stack" },
  { to: "/tickets", label: "تذاكر الدعم", icon: "ticket" },
  { to: "/alerts", label: "التنبيهات", icon: "alert" },
  { to: "/settings", label: "الإعدادات", icon: "sliders" },
];

export default function Sidebar({ items = NAV_ITEMS }) {
  return (
    <aside className="flex h-full w-64 shrink-0 flex-col bg-purple-950 text-cream-50">
      <div className="flex items-center gap-3 border-b border-white/10 px-5 py-5">
        <Mark />
        <div>
          <p className="text-sm font-semibold tracking-wide">سند إكس</p>
          <p className="text-[10px] text-sand-300">SanadIEx · المشرف العام</p>
        </div>
      </div>
      <nav className="flex-1 space-y-0.5 p-3" aria-label="التنقل الرئيسي">
        {items.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === "/"}
            className={({ isActive }) =>
              [
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors",
                isActive ? "bg-purple-800 text-white" : "text-cream-100/80 hover:bg-white/5 hover:text-white",
              ].join(" ")
            }
          >
            <NavGlyph name={item.icon} />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>
      <div className="border-t border-white/10 px-5 py-4">
        <p className="text-[10px] uppercase tracking-[0.16em] text-sand-300">النطاق الرقابي</p>
        <p className="mt-1 text-xs text-cream-100">ساما · هيئة السوق المالية</p>
      </div>
    </aside>
  );
}

function Mark() {
  return (
    <svg width="28" height="28" viewBox="0 0 28 28" aria-hidden="true">
      <rect width="28" height="28" rx="6" fill="#6B3FA0" />
      <rect x="5" y="16" width="4" height="7" fill="#FBF7F0" />
      <rect x="12" y="10" width="4" height="13" fill="#C4A37A" />
      <rect x="19" y="6" width="4" height="17" fill="#9B6DD4" />
    </svg>
  );
}

function NavGlyph({ name }) {
  const common = { width: 16, height: 16, fill: "none", stroke: "currentColor", strokeWidth: 1.4 };
  if (name === "grid") {
    return (
      <svg {...common} viewBox="0 0 16 16">
        <rect x="1.5" y="1.5" width="5.5" height="5.5" rx="1" />
        <rect x="9" y="1.5" width="5.5" height="5.5" rx="1" />
        <rect x="1.5" y="9" width="5.5" height="5.5" rx="1" />
        <rect x="9" y="9" width="5.5" height="5.5" rx="1" />
      </svg>
    );
  }
  if (name === "pulse") {
    return (
      <svg {...common} viewBox="0 0 16 16">
        <path d="M1 8h3l1.5-4 3 8 2-5.5H15" />
      </svg>
    );
  }
  if (name === "nodes") {
    return (
      <svg {...common} viewBox="0 0 16 16">
        <circle cx="4" cy="4" r="1.6" />
        <circle cx="12" cy="4" r="1.6" />
        <circle cx="8" cy="12" r="1.6" />
        <path d="M5.4 4.8 10.6 4.8M4.6 5.4 7.2 10.6M11.4 5.4 8.8 10.6" />
      </svg>
    );
  }
  if (name === "stack") {
    return (
      <svg {...common} viewBox="0 0 16 16">
        <path d="M2 5.5 8 3l6 2.5L8 8 2 5.5Z" />
        <path d="M2 8.5 8 11l6-2.5" />
        <path d="M2 11.5 8 14l6-2.5" />
      </svg>
    );
  }
  if (name === "ticket") {
    return (
      <svg {...common} viewBox="0 0 16 16">
        <rect x="2" y="3.5" width="12" height="9" rx="1.2" />
        <path d="M2.5 5 8 9l5.5-4" />
      </svg>
    );
  }
  if (name === "alert") {
    return (
      <svg {...common} viewBox="0 0 16 16">
        <path d="M8 2 14.5 13.5h-13L8 2Z" />
        <path d="M8 6.5v3.2" />
        <circle cx="8" cy="11.4" r="0.5" fill="currentColor" />
      </svg>
    );
  }
  return (
    <svg {...common} viewBox="0 0 16 16">
      <path d="M3 5h10M3 8h10M3 11h10" />
    </svg>
  );
}
