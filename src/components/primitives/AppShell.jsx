export default function AppShell({ sidebar, topbar, children }) {
  return (
    <div className="flex min-h-screen bg-cream-50" dir="rtl" lang="ar">
      {sidebar}
      <div className="flex min-w-0 flex-1 flex-col">
        {topbar}
        <main className="flex-1 overflow-y-auto px-6 py-6">{children}</main>
      </div>
    </div>
  );
}
