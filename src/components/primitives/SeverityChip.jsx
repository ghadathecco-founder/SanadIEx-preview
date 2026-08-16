import {
  REGULATOR,
  ROLE,
  SEVERITY,
  TICKET_STATUS,
} from "../../lib/format.js";

export default function SeverityChip({ level }) {
  const s = SEVERITY[level] || SEVERITY.low;
  return <span className={`si-chip ${s.className}`}>{s.label}</span>;
}

export function RegulatorChip({ code }) {
  const r = REGULATOR[code] || { label: code, className: "bg-cream-100 text-ink" };
  return (
    <span className={`si-chip font-latin tracking-wide ${r.className}`}>
      <span dir="ltr">{code}</span>
    </span>
  );
}

export function RoleChip({ role }) {
  const r = ROLE[role] || { label: role, className: "bg-cream-100 text-ink" };
  return <span className={`si-chip ${r.className}`}>{r.label}</span>;
}

export function StatusChip({ status }) {
  const s = TICKET_STATUS[status] || { label: status, className: "bg-cream-100 text-ink" };
  return <span className={`si-chip ${s.className}`}>{s.label}</span>;
}
