import InsightBanner from "../components/primitives/InsightBanner.jsx";
import KpiRow from "../components/widgets/KpiRow.jsx";
import RegulatoryFeed from "../components/widgets/RegulatoryFeed.jsx";
import AlertsTable from "../components/widgets/AlertsTable.jsx";
import ChartsRow from "../components/widgets/ChartsRow.jsx";
import TenantHealth from "../components/widgets/TenantHealth.jsx";
import TicketsInboxWidget from "../components/widgets/TicketsInboxWidget.jsx";
import { useRealtimeQuery } from "../hooks/useRealtimeQuery.js";
import { fetchRegulatoryUpdates, queryKeys } from "../lib/queries.js";
import { TABLES } from "../lib/supabase.js";

export default function SuperAdminDashboard() {
  const feed = useRealtimeQuery({
    queryKey: queryKeys.regulatoryUpdates,
    queryFn: fetchRegulatoryUpdates,
    table: TABLES.regulatoryUpdates,
  });
  const latest = (feed.data || [])[0];
  return (
    <div className="mx-auto flex max-w-shell flex-col gap-4">
      <InsightBanner
        kicker="الذكاء الرقابي · الوحدة M1"
        title={latest ? latest.title_ar : "بانتظار أول تعميم — القناة مفتوحة على جدول التحديثات الرقابية"}
        body={latest ? latest.summary_ar : "عند نشر صف في regulatory_updates تُحدَّث هذه اللافتة وشبكة المؤشرات والجداول دون أي إجراء يدوي."}
        meta={latest ? `${latest.regulator} · ${latest.circular_no}` : "قناة التحديث الفوري"}
      />
      <KpiRow />
      <ChartsRow />
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-5">
        <div className="xl:col-span-3"><RegulatoryFeed /></div>
        <div className="xl:col-span-2"><TenantHealth /></div>
      </div>
      <TicketsInboxWidget />
      <AlertsTable />
    </div>
  );
}
