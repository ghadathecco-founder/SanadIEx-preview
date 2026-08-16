import { useMemo, useState } from "react";
import { formatDate } from "../../lib/format.js";
import SeverityChip from "./SeverityChip.jsx";

export default function NotificationBell({ items = [], live = false }) {
  const [open, setOpen] = useState(false);
  const unread = useMemo(() => (items || []).filter((n) => !n.read_at), [items]);
  return (
    <div className="relative">
      <button type="button" onClick={() => setOpen((v) => !v)} className="relative flex h-9 w-9 items-center justify-center rounded-lg border border-sand-300/70 bg-white text-ink hover:border-purple-400" aria-label="التنبيهات" aria-expanded={open}>
        <BellIcon />
        {unread.length > 0 ? (
          <span className="absolute -top-1 -start-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-purple-600 px-1 font-latin text-[10px] font-semibold text-white">
            <span dir="ltr">{unread.length}</span>
          </span>
        ) : null}
      </button>
      {open ? (
        <>
          <button type="button" className="fixed inset-0 z-30 cursor-default" aria-label="إغلاق" onClick={() => setOpen(false)} />
          <div className="absolute top-11 z-40 w-80 origin-top overflow-hidden rounded-xl border border-sand-300 bg-white shadow-card end-0">
            <div className="flex items-center justify-between border-b border-cream-100 px-3 py-2">
              <p className="text-xs font-semibold text-ink">مركز التنبيهات</p>
              <span className="flex items-center gap-1 text-[10px] text-muted">
                {live ? <i className="si-live-dot" /> : null}
                {unread.length ? `${unread.length} غير مقروء` : "لا غير مقروء"}
              </span>
            </div>
            <ul className="max-h-80 overflow-y-auto">
              {(items || []).length === 0 ? (
                <li className="px-3 py-6 text-center text-xs text-muted">لا إشعارات. تصل التحديثات فور نشرها.</li>
              ) : (
                items.map((n) => (
                  <li key={n.id} className={`border-b border-cream-100 px-3 py-2.5 last:border-0 ${n.read_at ? "bg-white" : "bg-cream-50"}`}>
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-xs font-medium text-ink">{n.title_ar}</p>
                      <SeverityChip level={n.severity} />
                    </div>
                    <p className="mt-1 text-[11px] leading-5 text-muted">{n.body_ar}</p>
                    <p className="mt-1 ltr-num text-[10px] text-muted">{formatDate(n.created_at)}</p>
                  </li>
                ))
              )}
            </ul>
          </div>
        </>
      ) : null}
    </div>
  );
}

function BellIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M8 1.75A3.75 3.75 0 0 0 4.25 5.5v1.7c0 .5-.17.98-.48 1.37L3 9.75h10l-.77-1.18a2.2 2.2 0 0 1-.48-1.37V5.5A3.75 3.75 0 0 0 8 1.75Z" stroke="#1A1228" strokeWidth="1.3" />
      <path d="M6.2 12.1a1.8 1.8 0 0 0 3.6 0" stroke="#1A1228" strokeWidth="1.3" />
    </svg>
  );
}
