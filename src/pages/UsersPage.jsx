import { useMemo, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import AutoTable from "../components/primitives/AutoTable.jsx";
import { RoleChip } from "../components/primitives/SeverityChip.jsx";
import { useRealtimeQuery } from "../hooks/useRealtimeQuery.js";
import { fetchUsers, invokeAdminUsers, queryKeys } from "../lib/queries.js";
import { TABLES } from "../lib/supabase.js";
import { ROLE, ROLE_OPTIONS, formatDate } from "../lib/format.js";

export default function UsersPage() {
  const queryClient = useQueryClient();
  const [errorMsg, setErrorMsg] = useState("");
  const users = useRealtimeQuery({ queryKey: queryKeys.users, queryFn: fetchUsers, table: TABLES.users });
  const mutation = useMutation({
    mutationFn: invokeAdminUsers,
    onMutate: async (body) => {
      setErrorMsg("");
      await queryClient.cancelQueries({ queryKey: queryKeys.users });
      const prev = queryClient.getQueryData(queryKeys.users);
      queryClient.setQueryData(queryKeys.users, (old = []) => old.map((u) => {
        if (u.id !== body.user_id) return u;
        if (body.action === "set_role") return { ...u, role: body.role };
        if (body.action === "set_active") return { ...u, is_active: body.is_active };
        return u;
      }));
      return { prev };
    },
    onError: (err, _body, ctx) => {
      if (ctx?.prev) queryClient.setQueryData(queryKeys.users, ctx.prev);
      setErrorMsg(err?.message || "تعذّر حفظ التغيير عبر دالة المستخدمين.");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.users });
      queryClient.invalidateQueries({ queryKey: queryKeys.metrics });
    },
  });
  const columns = useMemo(() => [
    { key: "full_name", header: "الاسم", render: (row) => (<div><p className="font-medium text-ink">{row.full_name}</p><p className="ltr-num text-[11px] text-muted" dir="ltr">{row.id}</p></div>) },
    { key: "email", header: "البريد", className: "font-latin", render: (row) => <span dir="ltr" className="ltr-num text-xs text-ink">{row.email || "—"}</span> },
    { key: "role", header: "الدور", render: (row) => (
      <div className="flex flex-col items-start gap-1.5" onClick={(e) => e.stopPropagation()}>
        <RoleChip role={row.role} />
        <select dir="rtl" value={row.role} disabled={mutation.isPending} onChange={(e) => mutation.mutate({ action: "set_role", user_id: row.id, role: e.target.value })} className="rounded-md border border-sand-300 bg-cream-50 px-2 py-1 text-[11px] text-ink" aria-label={`دور ${row.full_name}`}>
          {ROLE_OPTIONS.map((r) => <option key={r} value={r}>{ROLE[r].label}</option>)}
        </select>
      </div>
    ) },
    { key: "is_active", header: "الحالة", render: (row) => (
      <div className="flex items-center gap-2">
        <button type="button" role="switch" aria-checked={row.is_active} disabled={mutation.isPending} onClick={(e) => { e.stopPropagation(); mutation.mutate({ action: "set_active", user_id: row.id, is_active: !row.is_active }); }} className={`relative h-5 w-9 rounded-full transition-colors ${row.is_active ? "bg-purple-600" : "bg-sand-300"}`}>
          <span className={`absolute top-0.5 h-4 w-4 rounded-full bg-white transition-[inset-inline-start] ${row.is_active ? "start-4" : "start-0.5"}`} />
        </button>
        <span className="text-[11px] text-muted">{row.is_active ? "نشط" : "موقوف"}</span>
      </div>
    ) },
    { key: "last_seen_at", header: "آخر ظهور", render: (row) => <span className="text-xs text-muted">{formatDate(row.last_seen_at)}</span> },
  ], [mutation]);
  return (
    <div className="mx-auto flex max-w-shell flex-col gap-4">
      {errorMsg ? <p className="si-card px-4 py-3 text-sm text-purple-950">{errorMsg}</p> : null}
      <AutoTable caption="المستخدمون — الدور والحالة عبر admin-users" columns={columns} rows={users.data} isEmpty={users.isEmpty} live={users.live} emptyTitle="لا مستخدمين في السجل" emptyHint="صفوف جدول users تظهر هنا فور وصول التغذية. لا توجد دعوة — الإجراء غير معتمد في العقد بعد." />
    </div>
  );
}
