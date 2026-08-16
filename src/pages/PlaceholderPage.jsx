import InsightBanner from "../components/primitives/InsightBanner.jsx";

export default function PlaceholderPage({ title, subtitle }) {
  return (
    <div className="mx-auto flex max-w-shell flex-col gap-4">
      <InsightBanner kicker="سند إكس" title={title} body={subtitle} meta="البيانات تُجلب تلقائياً من Supabase" />
      <div className="si-card si-grid-bg px-6 py-16 text-center">
        <div className="mx-auto mb-4 flex h-12 w-24 items-end justify-center gap-1" aria-hidden="true">
          <span className="h-6 w-4 rounded-sm bg-purple-950" />
          <span className="h-9 w-4 rounded-sm bg-purple-600" />
          <span className="h-4 w-4 rounded-sm bg-sand-500" />
          <span className="h-12 w-4 rounded-sm bg-purple-400" />
        </div>
        <p className="text-sm font-medium text-ink">{title}</p>
        <p className="mx-auto mt-1 max-w-md text-xs leading-5 text-muted">
          هذا المسار مربوط بالهيكل. الجداول تُملأ من نفس طبقة useRealtimeQuery المستخدمة في نظرة
          عامة — دون تحديث يدوي ودون حالات تحميل مغلقة.
        </p>
      </div>
    </div>
  );
}
