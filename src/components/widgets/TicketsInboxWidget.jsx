import { Link } from "react-router-dom";
import EmptyState from "../primitives/EmptyState.jsx";
import SeverityChip, { StatusChip } from "../primitives/SeverityChip.jsx";
import { useRealtimeQuery } from "../../hooks/useRealtimeQuery.js";
import { fetchTickets, queryKeys } from "../../lib/queries.js";
import { TABLES } from "../../lib/supabase.js";
import { formatNumber, slaRemainingHours } from "../../lib/format.js";

export default function TicketsInboxWidget() {
  const { data, isEmpty, live } = useRealtimeQuery({
    queryKey: queryKeys.ticketsInbox,
    queryFn: () => fetchTickets({ inbox: true }),
    table: TABLES.supportTickets,
  });
  const rows = (data || []).slice(0, 6);
  return (
    <section className="si-card">
      <header className="flex items-center justify-between border-b border-sand-300/50 px-4 py-3">
        <div>
          <h3 className="text-sm font-semibold text-ink">صندوق التذاكر</h3>
          <p className="text-[11px] text-muted">مفتوح وقيد المعالجة</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5 text-[11px] text-muted">{live ? <i className="si-live-dot" /> : null}{live ? "حيّ" : "مزامنة"}</span>
          <Link to="/tickets" className="text-[11px] font-medium text-purple-800 hover:text-purple-600">عرض الكل</Link>
        </div>
      </header>
      {isEmpty ? (
        <EmptyState title="لا تذاكر في الصندوق" hint="أي تذكرة open أو pending تُدرج هنا وتربط إلى صفحة التفاصيل." />
      ) : (
        <ul className="divide-y divide-cream-100">
          {rows.map((t) => {
            const left = slaRemainingHours(t);
            const overdue = left != null && left < 0;
            return (
              <li key={t.id}>
                <Link to={`/tickets/${t.id}`} className="flex items-start gap-3 px-4 py-3 transition-colors hover:bg-cream-50">
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-ink">{t.subject_ar}</p>
                    <p className="mt-0.5 text-[11px] text-muted">{t.opener?.full_name || "—"}{t.assignee?.full_name ? ` · ${t.assignee.full_name}` : " · غير معيّن"}</p>
                  </div>
                  <div className="flex shrink-0 flex-col items-end gap-1">
                    <div className="flex gap-1"><SeverityChip level={t.priority} /><StatusChip status={t.status} /></div>
                    {left != null ? <span dir="ltr" className={`ltr-num text-[10px] ${overdue ? "text-purple-950" : "text-muted"}`}>{overdue ? `+${formatNumber(Math.abs(left))} س` : `${formatNumber(left)} س`}</span> : null}
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
