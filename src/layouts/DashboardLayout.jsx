import { useMemo } from "react";
import { Outlet, useLocation } from "react-router-dom";
import AppShell from "../components/primitives/AppShell.jsx";
import Sidebar, { NAV_ITEMS } from "../components/primitives/Sidebar.jsx";
import Topbar from "../components/primitives/Topbar.jsx";
import { useRealtimeQuery } from "../hooks/useRealtimeQuery.js";
import { fetchNotifications, queryKeys } from "../lib/queries.js";
import { TABLES } from "../lib/supabase.js";

const TITLES = {
  "/": { title: "نظرة عامة", subtitle: "لوحة المشرف العام — تغذية حيّة من ساما وهيئة السوق المالية" },
  "/intelligence": { title: "الذكاء الرقابي", subtitle: "تعاميم، قرارات، والتزامات جديدة تُربط تلقائياً على سياسات المستأجرين" },
  "/institutions": { title: "المؤسسات", subtitle: "سجل المستأجرين والتراخيص وحالة اتفاقية الخدمة" },
  "/users": { title: "المستخدمون", subtitle: "الأدوار والحالة عبر المستأجرين — دون دعوة مباشرة (فجوة خلفية)" },
  "/tickets": { title: "تذاكر الدعم", subtitle: "صندوق الوارد — المفتوح وقيد المعالجة، تحديث تلقائي" },
  "/alerts": { title: "التنبيهات", subtitle: "الاستثناءات ومخاطر المهلة — دون تحديث يدوي" },
  "/settings": { title: "الإعدادات", subtitle: "القنوات الرقابية، الاحتفاظ، وتكامل الهوية" },
};

function chromeFor(pathname) {
  if (TITLES[pathname]) return TITLES[pathname];
  if (pathname.startsWith("/tickets/")) {
    return { title: "تفاصيل التذكرة", subtitle: "التعيين والحالة والردود — بما فيها الملاحظات الداخلية" };
  }
  return TITLES["/"];
}

export default function DashboardLayout() {
  const { pathname } = useLocation();
  const chrome = chromeFor(pathname);
  const notifications = useRealtimeQuery({
    queryKey: queryKeys.notifications,
    queryFn: fetchNotifications,
    table: TABLES.notifications,
  });
  const nav = useMemo(() => NAV_ITEMS, []);
  return (
    <AppShell
      sidebar={<Sidebar items={nav} />}
      topbar={
        <Topbar
          title={chrome.title}
          subtitle={chrome.subtitle}
          notifications={notifications.data}
          notificationsLive={notifications.live}
        />
      }
    >
      <Outlet />
    </AppShell>
  );
}
