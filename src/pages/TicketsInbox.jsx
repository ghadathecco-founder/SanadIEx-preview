import { useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import AutoTable from "../components/primitives/AutoTable.jsx";
import SeverityChip, { StatusChip } from "../components/primitives/SeverityChip.jsx";
import { useRealtimeQuery } from "../hooks/useRealtimeQuery.js";
import { fetchTickets, queryKeys } from "../lib/queries.js";
import { TABLES } from "../lib/supabase.js";
import { TICKET_CATEGORY, formatNumber, slaRemainingHours } from "../lib/format.js";

export default function TicketsInbox() {
  const navigate = useNavigate();
  const tickets = useRealtimeQuery({
    queryKey: queryKeys.ticketsInbox,
    queryFn: () => fetchTickets({ inbox: true }),
    table: TABLES.supportTickets,
  });
  const columns = useMemo(() => [
    { key: "subject_ar", header: "الموضوع", render: (row) => (
      <Link to={`/tickets/${row.id}`} className="font-medium text-purple-800 hover:text-purple-600" onClick={(e) => e.stopPropagation()}>{row.subject_ar}</Link>
    ) },
    { key: "opener", header: "مفتوح بواسطة", render: (row) => <span className="text-sm text-ink">{row.opener?.full_name || "—"}</span> },
    { key: "assignee", header: "المعيَّن", render: (row) => <span className="text-sm text-ink">{row.assignee?.full_name || "غير معيّن"}</span> },
    { key: "priority", header: "الأولوية", render: (row) => <SeverityChip level={row.priority} /> },
    { key: "category", header: "التصنيف", render: (row) => <span className="text-xs text-muted">{TICKET_CATEGORY[row.category]?.label || row.category}</span> },
    { key: "sla", header: "المهلة", render: (row) => {
      const left = slaRemainingHours(row);
      const overdue = left != null && left < 0;
      return (
        <div>
          <span dir="ltr" className="ltr-num text-xs text-ink">{formatNumber(row.sla_hours ?? 24)} س</span>
          {left != null ? <p className={`text-[11px] ${overdue ? "text-purple-950" : "text-muted"}`}>{overdue ? `تجاوز ${formatNumber(Math.abs(left))} س` : `متبقّي ${formatNumber(left)} س`}</p> : null}
        </div>
      );
    } },
    { key: "status", header: "الحالة", render: (row) => <StatusChip status={row.status} /> },
  ], []);
  return (
    <div className="mx-auto flex max-w-shell flex-col gap-4">
      <AutoTable caption="صندوق الوارد — مفتوح وقيد المعالجة" columns={columns} rows={tickets.data} isEmpty={tickets.isEmpty} live={tickets.live} emptyTitle="لا تذاكر مفتوحة" emptyHint="التذاكر ذات الحالة open أو pending تظهر هنا فور إدراجها في support_tickets." onRowClick={(row) => navigate(`/tickets/${row.id}`)} />
    </div>
  );
}
