import { useNavigate } from "react-router-dom";
import EmptyState from "./EmptyState.jsx";

export default function AutoTable({
  columns, rows, isEmpty, emptyTitle, emptyHint, live, caption,
  rowKey = "id", onRowClick, rowTo,
}) {
  const navigate = useNavigate();
  const go = (row) => {
    if (typeof rowTo === "function") navigate(rowTo(row));
    else if (onRowClick) onRowClick(row);
  };
  const clickable = Boolean(rowTo || onRowClick);
  return (
    <div className="si-card overflow-hidden">
      <div className="flex items-center justify-between border-b border-sand-300/50 px-4 py-3">
        <p className="text-sm font-semibold text-ink">{caption}</p>
        <span className="flex items-center gap-1.5 text-[11px] text-muted">
          {live ? <i className="si-live-dot" /> : null}
          {live ? "تحديث تلقائي" : "بانتظار القناة"}
        </span>
      </div>
      {isEmpty ? (
        <EmptyState title={emptyTitle} hint={emptyHint} />
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-right text-sm">
            <thead className="bg-cream-100 text-[11px] font-medium text-muted">
              <tr>
                {columns.map((c) => (
                  <th key={c.key} className={`px-4 py-2.5 font-medium ${c.thClassName || ""}`}>{c.header}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {(rows || []).map((row, i) => (
                <tr key={row[rowKey] ?? i} onClick={clickable ? () => go(row) : undefined} className={["border-t border-cream-100 transition-colors hover:bg-cream-50", clickable ? "cursor-pointer" : ""].join(" ")}>
                  {columns.map((c) => (
                    <td key={c.key} className={`px-4 py-3 align-middle ${c.className || ""}`}>
                      {c.render ? c.render(row) : row[c.key]}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
