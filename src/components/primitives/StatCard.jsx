import { formatNumber } from "../../lib/format.js";
import Sparkline from "./Sparkline.jsx";

export default function StatCard({
  label,
  value,
  hint,
  spark = [],
  tone = "purple",
  live = false,
}) {
  const stroke = tone === "sand" ? "#C4A37A" : "#6B3FA0";
  const fill = tone === "sand" ? "rgba(196, 163, 122, 0.16)" : "rgba(107, 63, 160, 0.12)";

  return (
    <article className="si-card relative overflow-hidden p-4">
      <div className="pointer-events-none absolute inset-0 si-grid-bg opacity-60" />
      <div className="relative flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-medium text-muted">{label}</p>
          <p className="mt-1 font-latin text-2xl font-semibold tracking-tight text-ink">
            <span dir="ltr" className="ltr-num">
              {formatNumber(value)}
            </span>
          </p>
          {hint ? <p className="mt-1 text-[11px] text-muted">{hint}</p> : null}
        </div>
        <div className="flex flex-col items-end gap-2">
          {live ? (
            <span className="flex items-center gap-1 text-[10px] text-purple-600">
              <i className="si-live-dot" /> مباشر
            </span>
          ) : (
            <span className="text-[10px] text-muted">مزامنة</span>
          )}
          <Sparkline values={spark} color={stroke} fill={fill} />
        </div>
      </div>
    </article>
  );
}
