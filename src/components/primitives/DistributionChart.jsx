/**
 * Structural stacked bar + legend. Geometric only.
 */
export default function DistributionChart({
  title,
  segments = [],
  totalLabel,
}) {
  const total = segments.reduce((s, x) => s + x.value, 0) || 1;
  return (
    <div className="si-card flex h-full flex-col p-5">
      <header className="mb-4 flex items-baseline justify-between gap-3">
        <h3 className="text-sm font-semibold text-ink">{title}</h3>
        {totalLabel ? <span className="ltr-num text-xs text-muted">{totalLabel}</span> : null}
      </header>
      <div className="flex h-3 w-full overflow-hidden rounded-sm bg-cream-100" role="img" aria-label={title}>
        {segments.map((seg) => (
          <span key={seg.key} className="h-full" style={{ width: `${(seg.value / total) * 100}%`, background: seg.color }} title={`${seg.label}: ${seg.value}`} />
        ))}
      </div>
      <ul className="mt-4 grid grid-cols-2 gap-x-4 gap-y-2">
        {segments.map((seg) => (
          <li key={seg.key} className="flex items-center justify-between gap-2 text-xs">
            <span className="flex items-center gap-2 text-muted">
              <i className="h-2 w-2 rounded-sm" style={{ background: seg.color }} aria-hidden />
              {seg.label}
            </span>
            <span className="ltr-num font-medium text-ink">{seg.value}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
