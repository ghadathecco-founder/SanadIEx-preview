import { useRealtimeQuery } from "../../hooks/useRealtimeQuery.js";
import { fetchTenants, queryKeys } from "../../lib/queries.js";
import { TABLES } from "../../lib/supabase.js";
import { HEALTH } from "../../lib/format.js";
import EmptyState from "../primitives/EmptyState.jsx";

export default function TenantHealth() {
  const { data, isEmpty, live } = useRealtimeQuery({
    queryKey: queryKeys.tenants,
    queryFn: fetchTenants,
    table: TABLES.tenants,
  });

  return (
    <section className="si-card">
      <header className="flex items-center justify-between border-b border-sand-300/50 px-4 py-3">
        <div>
          <h3 className="text-sm font-semibold text-ink">صحة المستأجرين</h3>
          <p className="text-[11px] text-muted">مؤشر اتفاقية الخدمة وعدد مسؤولي الالتزام</p>
        </div>
        <span className="flex items-center gap-1.5 text-[11px] text-muted">
          {live ? <i className="si-live-dot" /> : null}
          حيّ
        </span>
      </header>
      {isEmpty ? (
        <EmptyState
          title="لا مستأجرين مسجّلين"
          hint="صفوف جدول tenants تُعرض هنا مع شريط الصحة فور توفرها."
        />
      ) : (
        <ul className="divide-y divide-cream-100">
          {(data || []).map((t) => {
            const h = HEALTH[t.status] || HEALTH.watch;
            return (
              <li key={t.id} className="flex items-center gap-4 px-4 py-3">
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-ink">{t.name_ar}</p>
                  <p className="ltr-num truncate text-[11px] text-muted" dir="ltr">
                    {t.license_no} · {t.regulator}
                  </p>
                </div>
                <span className={`w-14 text-xs font-medium ${h.tone}`}>{h.label}</span>
                <HealthBar score={t.sla_score} />
                <span className="ltr-num w-10 text-end text-xs text-ink" dir="ltr">
                  {t.sla_score}
                </span>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}

function HealthBar({ score = 0 }) {
  const w = Math.max(0, Math.min(100, score));
  const color = w >= 90 ? "#4C2A7A" : w >= 75 ? "#6B3FA0" : "#C4A37A";
  return (
    <div className="hidden h-1.5 w-28 overflow-hidden rounded-sm bg-cream-100 sm:block" aria-hidden="true">
      <span className="block h-full rounded-sm" style={{ width: `${w}%`, background: color }} />
    </div>
  );
}
