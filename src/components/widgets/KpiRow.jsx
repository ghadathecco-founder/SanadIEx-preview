import { Link } from "react-router-dom";
import StatCard from "../primitives/StatCard.jsx";
import { useRealtimeKpis } from "../../hooks/useRealtimeQuery.js";
import { fetchKpis } from "../../lib/queries.js";
import { formatNumber } from "../../lib/format.js";

export default function KpiRow() {
  const { data, live } = useRealtimeKpis(fetchKpis);
  const k = data || {};

  return (
    <section className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
      <StatCard
        label="المستخدمون"
        value={k.userTotal}
        hint={`${formatNumber(k.userActive)} نشط على المنصة`}
        spark={k.spark?.users}
        live={live}
      />
      <Link to="/tickets" className="block rounded-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-600">
        <StatCard
          label="تذاكر مفتوحة"
          value={k.ticketsOpen}
          hint={`${formatNumber(k.slaBreached)} تجاوزت المهلة`}
          spark={k.spark?.tickets}
          tone={k.slaBreached > 0 ? "sand" : "purple"}
          live={live}
        />
      </Link>
      <StatCard
        label="بنود رقابية مفتوحة"
        value={k.openRegulatoryItems}
        hint="تعاميم بانتظار الربط على السياسات"
        spark={k.spark?.items}
        live={live}
      />
      <StatCard
        label="مخاطر اتفاقية الخدمة"
        value={k.slaRisk}
        hint="نشاط M1 — بنود واستثناءات ضمن المهلة الحرجة"
        spark={k.spark?.sla}
        tone="sand"
        live={live}
      />
    </section>
  );
}
