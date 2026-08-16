import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import QueryProvider from "./providers/QueryProvider.jsx";
import DashboardLayout from "./layouts/DashboardLayout.jsx";
import SuperAdminDashboard from "./pages/SuperAdminDashboard.jsx";
import PlaceholderPage from "./pages/PlaceholderPage.jsx";
import UsersPage from "./pages/UsersPage.jsx";
import TicketsInbox from "./pages/TicketsInbox.jsx";
import TicketDetail from "./pages/TicketDetail.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import { AuthProvider, RequireAuth } from "./lib/auth.jsx";

export default function App() {
  return (
    <AuthProvider>
      <QueryProvider>
        <BrowserRouter basename={(import.meta.env.BASE_URL || "/").replace(/\/$/, "") || "/"}>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route element={<RequireAuth />}>
              <Route element={<DashboardLayout />}>
                <Route index element={<SuperAdminDashboard />} />
                <Route
                  path="intelligence"
                  element={
                    <PlaceholderPage
                      title="الذكاء الرقابي"
                      subtitle="تغذية التعميمات والتحديثات الصادرة عن ساما وهيئة السوق المالية."
                    />
                  }
                />
                <Route
                  path="institutions"
                  element={
                    <PlaceholderPage
                      title="المؤسسات"
                      subtitle="سجل المستأجرين والمؤسسات المالية الخاضعة للرقابة."
                    />
                  }
                />
                <Route path="users" element={<UsersPage />} />
                <Route path="tickets" element={<TicketsInbox />} />
                <Route path="tickets/:id" element={<TicketDetail />} />
                <Route
                  path="alerts"
                  element={
                    <PlaceholderPage
                      title="التنبيهات"
                      subtitle="الاستثناءات ومخاطر اتفاقية مستوى الخدمة."
                    />
                  }
                />
                <Route
                  path="settings"
                  element={
                    <PlaceholderPage
                      title="الإعدادات"
                      subtitle="تهيئة المنصة، القنوات الرقابية، وسياسات الاحتفاظ."
                    />
                  }
                />
              </Route>
            </Route>
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </QueryProvider>
    </AuthProvider>
  );
}
