/**
 * Grouped structural column chart (SAMA vs CMA obligation trend).
 */
export default function TrendChart({ title, series = [], maxHint }) {
  const max = Math.max(
    1,
    maxHint || 0,
    ...series.flatMap((m) => [m.sama || 0, m.cma || 0])
  );

  return (
    <div className="si-card flex h-full flex-col p-5">
      <header className="mb-1 flex items-baseline justify-between">
        <h3 className="text-sm font-semibold text-ink">{title}</h3>
        <div className="flex items-center gap-3 text-[11px] text-muted">
          <span className="flex items-center gap-1">
            <i className="h-2 w-2 rounded-sm bg-purple-800" /> ساما
          </span>
          <span className="flex items-center gap-1">
            <i className="h-2 w-2 rounded-sm bg-sand-500" /> هيئة السوق
          </span>
        </div>
      </header>
      <div className="mt-4 flex min-h-[160px] items-end gap-2">
        {series.map((m) => (
          <div key={m.label} className="flex flex-1 flex-col items-center gap-2">
            <div className="flex h-36 w-full items-end justify-center gap-0.5">
              <span className="w-[42%] rounded-sm bg-purple-800" style={{ height: `${(m.sama / max) * 100}%` }} title={`ساما ${m.sama}`} />
              <span className="w-[42%] rounded-sm bg-sand-500" style={{ height: `${(m.cma / max) * 100}%` }} title={`هيئة السوق ${m.cma}`} />
            </div>
            <span className="text-[10px] text-muted">{m.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
