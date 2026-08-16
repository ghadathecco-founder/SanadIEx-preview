import { useMemo } from "react";
import { useRealtimeQuery } from "../../hooks/useRealtimeQuery.js";
import { fetchAlerts, fetchTenants, queryKeys, tenantNameById } from "../../lib/queries.js";
import { TABLES } from "../../lib/supabase.js";
import { formatNumber } from "../../lib/format.js";
import AutoTable from "../primitives/AutoTable.jsx";
import SeverityChip from "../primitives/SeverityChip.jsx";

const KIND = { sla: "اتفاقية خدمة", exception: "استثناء", filing: "إفصاح", gap: "فجوة" };

export default function AlertsTable() {
  const alerts = useRealtimeQuery({ queryKey: queryKeys.alerts, queryFn: fetchAlerts, table: TABLES.alerts });
  const tenants = useRealtimeQuery({ queryKey: queryKeys.tenants, queryFn: fetchTenants, table: TABLES.tenants });
  const columns = useMemo(() => [
    { key: "title", header: "البند", render: (row) => (<div><p className="font-medium text-ink">{row.title_ar}</p><p className="text-[11px] text-muted">{KIND[row.kind] || row.kind}</p></div>) },
    { key: "tenant", header: "المؤسسة", render: (row) => tenantNameById(tenants.data, row.tenant_id) },
    { key: "severity", header: "الحدة", render: (row) => <SeverityChip level={row.severity} /> },
    { key: "sla", header: "المهلة المتبقية", className: "font-latin", render: (row) => {
      const h = row.sla_hours_left; const overdue = h < 0;
      return <span dir="ltr" className={`ltr-num text-xs font-medium ${overdue ? "text-purple-950" : "text-ink"}`}>{overdue ? `+${formatNumber(Math.abs(h))} س تجاوز` : `${formatNumber(h)} س`}</span>;
    } },
    { key: "status", header: "الحالة", render: (row) => <span className="text-xs text-muted">{row.status === "open" ? "مفتوح" : row.status === "acknowledged" ? "مُقرّ" : "مغلق"}</span> },
  ], [tenants.data]);
  return (
    <AutoTable caption="الاستثناءات والتنبيهات — تحديث تلقائي" columns={columns} rows={alerts.data} isEmpty={alerts.isEmpty} live={alerts.live} emptyTitle="لا استثناءات مفتوحة" emptyHint="أي صف جديد في جدول alerts يُدرج في هذه القائمة فور وصول حدث postgres_changes." />
  );
}
