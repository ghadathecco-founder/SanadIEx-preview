import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import EmptyState from "../components/primitives/EmptyState.jsx";
import SeverityChip, { RoleChip, StatusChip } from "../components/primitives/SeverityChip.jsx";
import { useRealtimeQuery } from "../hooks/useRealtimeQuery.js";
import { fetchTicketById, fetchTicketReplies, fetchUsers, invokeAdminTickets, queryKeys } from "../lib/queries.js";
import { TABLES } from "../lib/supabase.js";
import { STATUS_OPTIONS, TICKET_CATEGORY, TICKET_STATUS, formatDate, formatNumber, slaRemainingHours } from "../lib/format.js";

export default function TicketDetail() {
  const { id } = useParams();
  const queryClient = useQueryClient();
  const [bodyAr, setBodyAr] = useState("");
  const [isInternal, setIsInternal] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const ticketQ = useRealtimeQuery({ queryKey: queryKeys.ticket(id), queryFn: () => fetchTicketById(id), table: TABLES.supportTickets, filter: `id=eq.${id}`, placeholderData: null, enabled: !!id });
  const repliesQ = useRealtimeQuery({ queryKey: queryKeys.ticketReplies(id), queryFn: () => fetchTicketReplies(id), table: TABLES.ticketReplies, filter: `ticket_id=eq.${id}`, enabled: !!id });
  const usersQ = useRealtimeQuery({ queryKey: queryKeys.users, queryFn: fetchUsers, table: TABLES.users });
  const invalidateTicket = () => {
    queryClient.invalidateQueries({ queryKey: queryKeys.tickets });
    queryClient.invalidateQueries({ queryKey: queryKeys.ticket(id) });
    queryClient.invalidateQueries({ queryKey: queryKeys.ticketReplies(id) });
    queryClient.invalidateQueries({ queryKey: queryKeys.metrics });
  };
  const mutation = useMutation({
    mutationFn: invokeAdminTickets,
    onError: (err) => setErrorMsg(err?.message || "تعذّر تنفيذ الإجراء عبر دالة التذاكر."),
    onSuccess: () => { setErrorMsg(""); invalidateTicket(); },
  });
  const ticket = ticketQ.data;
  const replies = Array.isArray(repliesQ.data) ? repliesQ.data : [];
  const users = Array.isArray(usersQ.data) ? usersQ.data : [];
  if (!ticket) {
    return (
      <div className="mx-auto flex max-w-shell flex-col gap-4">
        <Link to="/tickets" className="text-sm text-purple-800 hover:text-purple-600">صندوق الوارد</Link>
        <div className="si-card"><EmptyState title={ticketQ.isFetching ? "جاري المزامنة" : "التذكرة غير موجودة"} hint={ticketQ.isFetching ? "بانتظار صف support_tickets." : "تحقق من المعرّف أو عد إلى صندوق الوارد."} /></div>
      </div>
    );
  }
  const left = slaRemainingHours(ticket);
  const overdue = left != null && left < 0;
  const busy = mutation.isPending;
  return (
    <div className="mx-auto flex max-w-shell flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link to="/tickets" className="text-sm text-purple-800 hover:text-purple-600">صندوق الوارد</Link>
        <span className="flex items-center gap-1.5 text-[11px] text-muted">{ticketQ.live || repliesQ.live ? <i className="si-live-dot" /> : null}{ticketQ.live || repliesQ.live ? "تحديث تلقائي" : "بانتظار القناة"}</span>
      </div>
      {errorMsg ? <p className="si-card px-4 py-3 text-sm text-purple-950">{errorMsg}</p> : null}
      <article className="si-card p-5">
        <div className="flex flex-wrap items-center gap-2">
          <StatusChip status={ticket.status} />
          <SeverityChip level={ticket.priority} />
          <span className="si-chip bg-cream-100 text-ink">{TICKET_CATEGORY[ticket.category]?.label || ticket.category}</span>
          <span className="ltr-num ms-auto text-[11px] text-muted" dir="ltr">{ticket.id}</span>
        </div>
        <h2 className="mt-3 text-lg font-semibold text-ink">{ticket.subject_ar}</h2>
        <p className="mt-2 text-sm leading-7 text-ink">{ticket.body_ar}</p>
        <dl className="mt-4 grid grid-cols-2 gap-3 text-xs sm:grid-cols-4">
          <div><dt className="text-muted">مفتوح بواسطة</dt><dd className="mt-0.5 font-medium text-ink">{ticket.opener?.full_name || "—"}</dd></div>
          <div><dt className="text-muted">المعيَّن</dt><dd className="mt-0.5 font-medium text-ink">{ticket.assignee?.full_name || "غير معيّن"}</dd></div>
          <div><dt className="text-muted">فُتحت</dt><dd className="mt-0.5 text-ink">{formatDate(ticket.opened_at)}</dd></div>
          <div><dt className="text-muted">المهلة</dt><dd className={`mt-0.5 ${overdue ? "text-purple-950" : "text-ink"}`}><span dir="ltr" className="ltr-num">{formatNumber(ticket.sla_hours ?? 24)} س</span>{left != null ? (overdue ? ` · تجاوز ${formatNumber(Math.abs(left))} س` : ` · متبقّي ${formatNumber(left)} س`) : null}</dd></div>
        </dl>
      </article>
      <section className="si-card grid grid-cols-1 gap-4 p-4 sm:grid-cols-2">
        <label className="flex flex-col gap-1.5 text-sm">
          <span className="text-xs font-medium text-muted">تعيين</span>
          <select dir="rtl" disabled={busy} value={ticket.assigned_to || ""} onChange={(e) => mutation.mutate({ action: "assign", ticket_id: ticket.id, assigned_to: e.target.value || null })} className="rounded-lg border border-sand-300 bg-cream-50 px-3 py-2 text-sm text-ink">
            <option value="">غير معيّن</option>
            {users.map((u) => <option key={u.id} value={u.id}>{u.full_name}</option>)}
          </select>
        </label>
        <label className="flex flex-col gap-1.5 text-sm">
          <span className="text-xs font-medium text-muted">تحديث الحالة</span>
          <select dir="rtl" disabled={busy} value={ticket.status} onChange={(e) => mutation.mutate({ action: "update_status", ticket_id: ticket.id, status: e.target.value })} className="rounded-lg border border-sand-300 bg-cream-50 px-3 py-2 text-sm text-ink">
            {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{TICKET_STATUS[s].label}</option>)}
          </select>
        </label>
      </section>
      <section className="si-card overflow-hidden">
        <header className="flex items-center justify-between border-b border-sand-300/50 px-4 py-3">
          <h3 className="text-sm font-semibold text-ink">الردود</h3>
          <span className="ltr-num text-[11px] text-muted" dir="ltr">{formatNumber(replies.length)}</span>
        </header>
        {replies.length === 0 ? <EmptyState title="لا ردود بعد" hint="أول رد عبر admin-tickets يظهر في هذا الخيط." /> : (
          <ul className="divide-y divide-cream-100">
            {replies.map((r) => (
              <li key={r.id} className={`px-4 py-3 ${r.is_internal ? "bg-cream-100/80" : "bg-white"}`}>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-sm font-medium text-ink">{r.author?.full_name || "—"}</span>
                  {r.author?.role ? <RoleChip role={r.author.role} /> : null}
                  {r.is_internal ? <span className="si-chip bg-purple-950 text-cream-50">داخلي</span> : null}
                  <span className="ms-auto text-[11px] text-muted">{formatDate(r.created_at)}</span>
                </div>
                <p className="mt-1.5 text-sm leading-6 text-ink">{r.body_ar}</p>
              </li>
            ))}
          </ul>
        )}
      </section>
      <form className="si-card flex flex-col gap-3 p-4" onSubmit={(e) => { e.preventDefault(); const text = bodyAr.trim(); if (!text) return; mutation.mutate({ action: "reply", ticket_id: ticket.id, body_ar: text, is_internal: isInternal }, { onSuccess: () => { setBodyAr(""); setIsInternal(false); } }); }}>
        <label className="text-xs font-medium text-muted" htmlFor="reply-body">رد جديد</label>
        <textarea id="reply-body" dir="rtl" rows={4} value={bodyAr} onChange={(e) => setBodyAr(e.target.value)} placeholder="اكتب الرد بالعربية…" className="rounded-lg border border-sand-300 bg-cream-50 px-3 py-2 text-sm text-ink placeholder:text-muted/70" />
        <div className="flex flex-wrap items-center justify-between gap-3">
          <label className="flex items-center gap-2 text-xs text-ink"><input type="checkbox" checked={isInternal} onChange={(e) => setIsInternal(e.target.checked)} className="accent-purple-600" />ملاحظة داخلية</label>
          <button type="submit" disabled={busy || !bodyAr.trim()} className="rounded-lg bg-purple-800 px-4 py-2 text-sm font-medium text-cream-50 disabled:opacity-50">إرسال الرد</button>
        </div>
      </form>
    </div>
  );
}
