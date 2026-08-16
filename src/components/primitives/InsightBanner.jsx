export default function InsightBanner({ kicker, title, body, meta }) {
  return (
    <aside className="relative overflow-hidden rounded-xl bg-purple-950 px-5 py-4 text-cream-50 shadow-card">
      <div
        className="pointer-events-none absolute inset-0 opacity-30"
        style={{
          background:
            "linear-gradient(135deg, rgba(155,109,212,0.35) 0%, transparent 42%), repeating-linear-gradient(-45deg, rgba(196,163,122,0.12) 0 1px, transparent 1px 14px)",
        }}
        aria-hidden="true"
      />
      <div className="relative flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
        <div className="max-w-3xl">
          {kicker ? (
            <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-sand-300">
              {kicker}
            </p>
          ) : null}
          <h2 className="mt-1 text-base font-semibold md:text-lg">{title}</h2>
          {body ? <p className="mt-1 text-sm leading-6 text-cream-100/90">{body}</p> : null}
        </div>
        {meta ? (
          <p className="shrink-0 text-[11px] text-sand-300 md:text-end">{meta}</p>
        ) : null}
      </div>
    </aside>
  );
}
