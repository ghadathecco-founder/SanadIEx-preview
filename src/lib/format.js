const ar = new Intl.NumberFormat("ar-SA");
const arDate = new Intl.DateTimeFormat("ar-SA", {
  day: "2-digit",
  month: "short",
  hour: "2-digit",
  minute: "2-digit",
});

export function formatNumber(n) {
  if (n == null || Number.isNaN(n)) return "—";
  return ar.format(n);
}

export function formatDate(iso) {
  if (!iso) return "—";
  try {
    return arDate.format(new Date(iso));
  } catch {
    return iso;
  }
}

export function relativeHours(iso) {
  if (!iso) return "";
  const h = Math.round((Date.now() - new Date(iso).getTime()) / 3600_000);
  if (h < 1) return "الآن";
  if (h < 24) return `قبل ${ar.format(h)} س`;
  const d = Math.round(h / 24);
  return `قبل ${ar.format(d)} ي`;
}

export function slaRemainingHours(ticket) {
  if (!ticket?.opened_at) return null;
  const windowH = ticket.sla_hours ?? 24;
  const deadline = new Date(ticket.opened_at).getTime() + windowH * 3600_000;
  return Math.round((deadline - Date.now()) / 3600_000);
}

export const SEVERITY = {
  critical: { label: "حرج", className: "bg-purple-950 text-cream-50" },
  high: { label: "مرتفع", className: "bg-purple-800 text-cream-50" },
  medium: { label: "متوسط", className: "bg-purple-400 text-white" },
  low: { label: "منخفض", className: "bg-sand-300 text-ink" },
};

export const REGULATOR = {
  SAMA: { label: "ساما", className: "bg-purple-950 text-cream-50" },
  CMA: { label: "هيئة السوق", className: "bg-purple-600 text-white" },
};

export const HEALTH = {
  healthy: { label: "مستقر", tone: "text-purple-800" },
  watch: { label: "رصد", tone: "text-sand-500" },
  risk: { label: "مخاطر", tone: "text-purple-950" },
};

export const ROLE = {
  super_admin: { label: "مشرف عام", className: "bg-purple-950 text-cream-50" },
  cco: { label: "مسؤول الالتزام", className: "bg-purple-800 text-cream-50" },
  analyst: { label: "محلل", className: "bg-purple-400 text-white" },
  viewer: { label: "مشاهد", className: "bg-sand-300 text-ink" },
};

export const TICKET_STATUS = {
  open: { label: "مفتوح", className: "bg-purple-800 text-cream-50" },
  pending: { label: "قيد المعالجة", className: "bg-purple-400 text-white" },
  resolved: { label: "محلول", className: "bg-sand-500 text-ink" },
  closed: { label: "مغلق", className: "bg-sand-300 text-ink" },
};

export const TICKET_PRIORITY = SEVERITY;

export const TICKET_CATEGORY = {
  access: { label: "صلاحيات" },
  billing: { label: "فوترة" },
  m1_data: { label: "بيانات M1" },
  other: { label: "أخرى" },
};

export const ROLE_OPTIONS = ["super_admin", "cco", "analyst", "viewer"];
export const STATUS_OPTIONS = ["open", "pending", "resolved", "closed"];
