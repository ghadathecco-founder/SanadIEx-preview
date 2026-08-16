import { useRealtimeQuery } from "../../hooks/useRealtimeQuery.js";
import { fetchRegulatoryUpdates, queryKeys } from "../../lib/queries.js";
import { TABLES } from "../../lib/supabase.js";
import { relativeHours } from "../../lib/format.js";
import EmptyState from "../primitives/EmptyState.jsx";
import SeverityChip, { RegulatorChip } from "../primitives/SeverityChip.jsx";

export default function RegulatoryFeed() {
  const { data, isEmpty, live } = useRealtimeQuery({
    queryKey: queryKeys.regulatoryUpdates,
    queryFn: fetchRegulatoryUpdates,
    table: TABLES.regulatoryUpdates,
  });

  return (
    <section className="si-card flex h-full flex-col">
      <header className="flex items-center justify-between border-b border-sand-300/50 px-4 py-3">
        <div>
          <h3 className="text-sm font-semibold text-ink">الذكاء الرقابي · M1</h3>
          <p className="text-[11px] text-muted">آخر التعاميم من ساما وهيئة السوق المالية</p>
        </div>
        <span className="flex items-center gap-1.5 text-[11px] text-muted">
          {live ? <i className="si-live-dot" /> : null}
          تغذية حية
        </span>
      </header>
      {isEmpty ? (
        <EmptyState
          title="لا تعاميم في النافذة الحالية"
          hint="أي منشور جديد على جدول regulatory_updates يظهر هنا دون تحديث يدوي."
        />
      ) : (
        <ul className="divide-y divide-cream-100">
          {(data || []).map((item) => (
            <li key={item.id} className="px-4 py-3">
              <div className="flex flex-wrap items-center gap-2">
                <RegulatorChip code={item.regulator} />
                <SeverityChip level={item.severity} />
                <span className="ltr-num text-[11px] text-muted" dir="ltr">
                  {item.circular_no}
                </span>
                <span className="ms-auto text-[11px] text-muted">
                  {relativeHours(item.published_at)}
                </span>
              </div>
              <p className="mt-1.5 text-sm font-medium text-ink">{item.title_ar}</p>
              <p className="mt-0.5 text-[12px] leading-5 text-muted">{item.summary_ar}</p>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
