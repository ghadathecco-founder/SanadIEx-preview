export default function EmptyState({
  title = "لا توجد بيانات بعد",
  hint = "ستظهر السجلات تلقائياً عند وصول التغذية من القاعدة.",
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 px-6 py-10 text-center">
      <div className="grid grid-cols-5 gap-1" aria-hidden="true">
        {Array.from({ length: 15 }).map((_, i) => (
          <span
            key={i}
            className="h-2 w-5 rounded-sm"
            style={{
              background:
                i % 4 === 0 ? "var(--purple-400)" : i % 3 === 0 ? "var(--sand-300)" : "var(--cream-100)",
              opacity: 0.9,
            }}
          />
        ))}
      </div>
      <p className="text-sm font-medium text-ink">{title}</p>
      <p className="max-w-sm text-xs text-muted">{hint}</p>
    </div>
  );
}
