import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { useRealtimeQuery } from "../../hooks/useRealtimeQuery.js";
import { fetchObligationTrend, fetchTenants, queryKeys } from "../../lib/queries.js";
import { TABLES } from "../../lib/supabase.js";
import DistributionChart from "../primitives/DistributionChart.jsx";
import TrendChart from "../primitives/TrendChart.jsx";

export default function ChartsRow() {
  const tenants = useRealtimeQuery({ queryKey: queryKeys.tenants, queryFn: fetchTenants, table: TABLES.tenants });
  const trend = useQuery({ queryKey: queryKeys.obligationTrend, queryFn: fetchObligationTrend, placeholderData: [] });
  const dist = useMemo(() => {
    const rows = tenants.data || [];
    return {
      sama: rows.filter((t) => t.regulator === "SAMA").length,
      cma: rows.filter((t) => t.regulator === "CMA").length,
      healthy: rows.filter((t) => t.status === "healthy").length,
      watch: rows.filter((t) => t.status === "watch").length,
      risk: rows.filter((t) => t.status === "risk").length,
      total: rows.length,
    };
  }, [tenants.data]);
  return (
    <section className="grid grid-cols-1 gap-3 lg:grid-cols-5">
      <div className="lg:col-span-2">
        <DistributionChart
          title="توزيع المؤسسات حسب الجهة الرقابية والحالة"
          totalLabel={`${dist.total} مؤسسة`}
          segments={[
            { key: "sama", label: "ساما", value: dist.sama, color: "#2D1B4E" },
            { key: "cma", label: "هيئة السوق", value: dist.cma, color: "#6B3FA0" },
            { key: "healthy", label: "مستقر", value: dist.healthy, color: "#9B6DD4" },
            { key: "watch", label: "رصد", value: dist.watch, color: "#C4A37A" },
            { key: "risk", label: "مخاطر", value: dist.risk, color: "#D4C4A8" },
          ]}
        />
      </div>
      <div className="lg:col-span-3">
        <TrendChart title="اتجاه الالتزامات الجديدة" series={trend.data || []} />
      </div>
    </section>
  );
}
