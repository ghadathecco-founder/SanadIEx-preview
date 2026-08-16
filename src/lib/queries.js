import {
  supabase,
  TABLES,
  TICKET_SELECT,
  REPLY_SELECT,
  isPlaceholderClient,
} from "./supabase.js";
import { DEMO, DEMO_ACTOR_ID, useDemoData } from "./demoData.js";

export const queryKeys = {
  tenants: ["tenants"],
  users: ["users"],
  regulatoryUpdates: ["regulatory_updates"],
  alerts: ["alerts"],
  notifications: ["notifications"],
  tickets: ["support_tickets"],
  ticketsInbox: ["support_tickets", "inbox"],
  ticket: (id) => ["support_tickets", "detail", id],
  ticketReplies: (id) => ["ticket_replies", id],
  metrics: ["metrics"],
  kpis: ["metrics"],
  obligationTrend: ["obligation_trend"],
};

async function fromTable(table, { order, ascending = false, limit } = {}) {
  let q = supabase.from(table).select("*");
  if (order) q = q.order(order, { ascending });
  if (limit) q = q.limit(limit);
  const { data, error } = await q;
  if (error) throw error;
  return data ?? [];
}

function fallback(table, rows) {
  if (!useDemoData) return rows;
  if (isPlaceholderClient) return DEMO[table] ?? rows;
  if (!rows || rows.length === 0) return DEMO[table] ?? rows;
  return rows;
}

function userRef(id) {
  if (!id) return null;
  const u = (DEMO.users || []).find((x) => x.id === id);
  return u ? { full_name: u.full_name, role: u.role } : null;
}

function hydrateTicket(row) {
  if (!row) return row;
  return {
    ...row,
    opener: row.opener ?? userRef(row.opened_by),
    assignee: row.assignee ?? userRef(row.assigned_to),
  };
}

function hydrateReply(row) {
  if (!row) return row;
  return { ...row, author: row.author ?? userRef(row.author_id) };
}

export async function fetchTenants() {
  try {
    return fallback("tenants", await fromTable(TABLES.tenants, { order: "updated_at" }));
  } catch {
    return fallback("tenants", []);
  }
}

export async function fetchUsers() {
  try {
    return fallback("users", await fromTable(TABLES.users, { order: "last_seen_at" }));
  } catch {
    return fallback("users", []);
  }
}

export async function fetchRegulatoryUpdates() {
  try {
    return fallback(
      "regulatory_updates",
      await fromTable(TABLES.regulatoryUpdates, { order: "published_at", limit: 12 })
    );
  } catch {
    return fallback("regulatory_updates", []);
  }
}

export async function fetchAlerts() {
  try {
    return fallback("alerts", await fromTable(TABLES.alerts, { order: "opened_at" }));
  } catch {
    return fallback("alerts", []);
  }
}

export async function fetchNotifications() {
  try {
    return fallback("notifications", await fromTable(TABLES.notifications, { order: "created_at" }));
  } catch {
    return fallback("notifications", []);
  }
}

export async function fetchTickets({ inbox = false } = {}) {
  const demoRows = () => {
    const rows = (fallback("support_tickets", []) || []).map(hydrateTicket);
    if (!inbox) return rows;
    return rows.filter((t) => t.status === "open" || t.status === "pending");
  };
  try {
    let q = supabase
      .from(TABLES.supportTickets)
      .select(TICKET_SELECT)
      .order("opened_at", { ascending: false });
    if (inbox) q = q.in("status", ["open", "pending"]);
    const { data, error } = await q;
    if (error) throw error;
    const rows = (data ?? []).map(hydrateTicket);
    if (isPlaceholderClient || (useDemoData && rows.length === 0)) return demoRows();
    return rows;
  } catch {
    return demoRows();
  }
}

export async function fetchTicketsInbox() {
  return fetchTickets({ inbox: true });
}

export async function fetchTicketById(id) {
  if (!id) return null;
  const fromDemo = () => {
    const row = (DEMO.support_tickets || []).find((t) => t.id === id);
    return row ? hydrateTicket(row) : null;
  };
  try {
    const { data, error } = await supabase
      .from(TABLES.supportTickets)
      .select(TICKET_SELECT)
      .eq("id", id)
      .maybeSingle();
    if (error) throw error;
    if (isPlaceholderClient || (!data && useDemoData)) return fromDemo();
    return data ? hydrateTicket(data) : null;
  } catch {
    return fromDemo();
  }
}

export async function fetchTicketReplies(ticketId) {
  if (!ticketId) return [];
  const fromDemo = () =>
    (DEMO.ticket_replies || [])
      .filter((r) => r.ticket_id === ticketId)
      .map(hydrateReply)
      .sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
  try {
    const { data, error } = await supabase
      .from(TABLES.ticketReplies)
      .select(REPLY_SELECT)
      .eq("ticket_id", ticketId)
      .order("created_at", { ascending: true });
    if (error) throw error;
    const rows = (data ?? []).map(hydrateReply);
    if (isPlaceholderClient || (useDemoData && rows.length === 0)) return fromDemo();
    return rows;
  } catch {
    return fromDemo();
  }
}

function tapSpark(series, last) {
  if (!series?.length) return last == null ? [] : [last];
  const next = [...series];
  next[next.length - 1] = last ?? next[next.length - 1];
  return next;
}

function deriveDemoMetrics() {
  const users = DEMO.users || [];
  const tickets = DEMO.support_tickets || [];
  const updates = DEMO.regulatory_updates || [];
  const alerts = DEMO.alerts || [];
  const by_role = { super_admin: 0, cco: 0, analyst: 0, viewer: 0 };
  users.forEach((u) => {
    if (by_role[u.role] != null) by_role[u.role] += 1;
  });
  const sla_breached = tickets.filter((t) => {
    if (t.status !== "open" && t.status !== "pending") return false;
    const deadline = new Date(t.opened_at).getTime() + (t.sla_hours ?? 24) * 3600_000;
    return deadline < Date.now();
  }).length;
  return {
    user_counts: {
      total: users.length,
      active: users.filter((u) => u.is_active).length,
      by_role,
    },
    ticket_volumes: {
      open: tickets.filter((t) => t.status === "open").length,
      pending: tickets.filter((t) => t.status === "pending").length,
      resolved: tickets.filter((t) => t.status === "resolved").length,
      closed: tickets.filter((t) => t.status === "closed").length,
      sla_breached,
    },
    m1_activity: {
      open_regulatory_items: updates.filter((u) => u.status === "open").length,
      mapped: updates.filter((u) => u.status === "mapped").length,
      closed: updates.filter((u) => u.status === "closed").length,
      alerts_open: alerts.filter((a) => a.status === "open").length,
      sla_risk: alerts.filter(
        (a) => a.status === "open" && (a.kind === "sla" || a.sla_hours_left < 24)
      ).length,
    },
  };
}

function mapMetrics(raw) {
  const m = raw || {};
  const uc = m.user_counts || {};
  const tv = m.ticket_volumes || {};
  const m1 = m.m1_activity || {};
  const sparkSrc = DEMO.metrics?.spark || {};
  const userTotal = uc.total ?? 0;
  const ticketsOpen = tv.open ?? 0;
  const openItems = m1.open_regulatory_items ?? 0;
  const slaRisk = m1.sla_risk ?? 0;
  return {
    userTotal,
    userActive: uc.active ?? 0,
    byRole: uc.by_role || { super_admin: 0, cco: 0, analyst: 0, viewer: 0 },
    ticketsOpen,
    ticketsPending: tv.pending ?? 0,
    ticketsResolved: tv.resolved ?? 0,
    ticketsClosed: tv.closed ?? 0,
    slaBreached: tv.sla_breached ?? 0,
    openRegulatoryItems: openItems,
    mapped: m1.mapped ?? 0,
    closed: m1.closed ?? 0,
    alertsOpen: m1.alerts_open ?? 0,
    slaRisk,
    spark: {
      users: tapSpark(sparkSrc.users, userTotal),
      tickets: tapSpark(sparkSrc.tickets, ticketsOpen),
      items: tapSpark(sparkSrc.items, openItems),
      sla: tapSpark(sparkSrc.sla, slaRisk),
    },
    raw: m,
  };
}

export const EMPTY_KPIS = mapMetrics({
  user_counts: { total: 0, active: 0, by_role: { super_admin: 0, cco: 0, analyst: 0, viewer: 0 } },
  ticket_volumes: { open: 0, pending: 0, resolved: 0, closed: 0, sla_breached: 0 },
  m1_activity: { open_regulatory_items: 0, mapped: 0, closed: 0, alerts_open: 0, sla_risk: 0 },
});

export async function fetchKpis() {
  if (isPlaceholderClient) {
    return mapMetrics(useDemoData ? deriveDemoMetrics() : DEMO.metrics);
  }
  try {
    const { data, error } = await supabase.rpc("admin_dashboard_metrics");
    if (error) throw error;
    if (!data) throw new Error("empty metrics");
    return mapMetrics(data);
  } catch {
    if (useDemoData) return mapMetrics(deriveDemoMetrics());
    return EMPTY_KPIS;
  }
}

export async function fetchObligationTrend() {
  try {
    const rows = await fetchRegulatoryUpdates();
    if (!useDemoData && rows.length) {
      const byReg = rows.reduce(
        (acc, r) => {
          acc[r.regulator] = (acc[r.regulator] || 0) + 1;
          return acc;
        },
        { SAMA: 0, CMA: 0 }
      );
      return DEMO.obligationTrend.map((m, i) => ({
        ...m,
        sama: i === DEMO.obligationTrend.length - 1 ? byReg.SAMA : m.sama,
        cma: i === DEMO.obligationTrend.length - 1 ? byReg.CMA : m.cma,
      }));
    }
  } catch {
    /* fall through */
  }
  return DEMO.obligationTrend;
}

export function tenantNameById(tenants, id) {
  const t = (tenants || []).find((x) => x.id === id);
  return t?.name_ar ?? "—";
}

function applyDemoUserAction(body) {
  const u = (DEMO.users || []).find((x) => x.id === body.user_id);
  if (!u) return { ok: true, demo: true };
  if (body.action === "set_role") u.role = body.role;
  if (body.action === "set_active") u.is_active = !!body.is_active;
  return { ok: true, demo: true };
}

function applyDemoTicketAction(body) {
  const stamp = new Date().toISOString();
  if (body.action === "create") {
    const row = {
      id: `tk-${Date.now()}`,
      tenant_id: body.tenant_id ?? null,
      opened_by: DEMO_ACTOR_ID,
      assigned_to: null,
      subject_ar: body.subject_ar,
      body_ar: body.body_ar,
      status: "open",
      priority: body.priority || "medium",
      category: body.category || "other",
      sla_hours: 24,
      opened_at: stamp,
      updated_at: stamp,
      resolved_at: null,
    };
    DEMO.support_tickets.unshift(row);
    return { ok: true, demo: true, ticket: row };
  }
  const t = (DEMO.support_tickets || []).find((x) => x.id === body.ticket_id);
  if (!t) return { ok: true, demo: true };
  if (body.action === "assign") {
    t.assigned_to = body.assigned_to;
    t.updated_at = stamp;
  }
  if (body.action === "update_status") {
    t.status = body.status;
    t.updated_at = stamp;
    if (body.status === "resolved" || body.status === "closed") {
      t.resolved_at = t.resolved_at || stamp;
    } else {
      t.resolved_at = null;
    }
  }
  if (body.action === "reply") {
    const reply = {
      id: `tr-${Date.now()}`,
      ticket_id: body.ticket_id,
      author_id: DEMO_ACTOR_ID,
      body_ar: body.body_ar,
      is_internal: !!body.is_internal,
      created_at: stamp,
    };
    DEMO.ticket_replies.push(reply);
    t.updated_at = stamp;
    return { ok: true, demo: true, reply };
  }
  return { ok: true, demo: true, ticket: t };
}

export async function invokeAdminUsers(body) {
  if (isPlaceholderClient) return applyDemoUserAction(body);
  const { data, error } = await supabase.functions.invoke("admin-users", { body });
  if (error) throw error;
  return data;
}

export async function invokeAdminTickets(body) {
  if (isPlaceholderClient) return applyDemoTicketAction(body);
  const { data, error } = await supabase.functions.invoke("admin-tickets", { body });
  if (error) throw error;
  return data;
}
