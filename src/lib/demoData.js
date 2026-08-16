const now = Date.now();
const hoursAgo = (h) => new Date(now - h * 3600_000).toISOString();

export const DEMO = {
  tenants: [
    { id: "t-01", name_ar: "مصرف الإنماء", name_en: "Alinma Bank", license_no: "SAMA-14", regulator: "SAMA", status: "healthy", sla_score: 96, cco_count: 4, updated_at: hoursAgo(2) },
    { id: "t-02", name_ar: "الجزيرة كابيتال", name_en: "AlJazira Capital", license_no: "CMA-07086-30", regulator: "CMA", status: "watch", sla_score: 81, cco_count: 2, updated_at: hoursAgo(5) },
    { id: "t-03", name_ar: "بنك الرياض", name_en: "Riyad Bank", license_no: "SAMA-03", regulator: "SAMA", status: "healthy", sla_score: 93, cco_count: 6, updated_at: hoursAgo(1) },
    { id: "t-04", name_ar: "دراية المالية", name_en: "Derayah Financial", license_no: "CMA-08109-37", regulator: "CMA", status: "risk", sla_score: 64, cco_count: 1, updated_at: hoursAgo(8) },
    { id: "t-05", name_ar: "البلاد المالية", name_en: "Albilad Capital", license_no: "CMA-08116-37", regulator: "CMA", status: "healthy", sla_score: 90, cco_count: 3, updated_at: hoursAgo(12) },
    { id: "t-06", name_ar: "مصرف الراجحي", name_en: "Al Rajhi Bank", license_no: "SAMA-01", regulator: "SAMA", status: "watch", sla_score: 78, cco_count: 7, updated_at: hoursAgo(3) },
  ],
  users: [
    { id: "sa-1", tenant_id: null, full_name: "غادة الحسن", email: "admin@sanadiex.sa", role: "super_admin", is_active: true, last_seen_at: hoursAgo(0.05) },
    { id: "u-1", tenant_id: "t-01", full_name: "نورة العتيبي", email: "noura.otaibi@alinma.sa", role: "cco", is_active: true, last_seen_at: hoursAgo(0.4) },
    { id: "u-2", tenant_id: "t-02", full_name: "فهد الشمري", email: "fahad.shamri@aljazira.sa", role: "cco", is_active: true, last_seen_at: hoursAgo(1.2) },
    { id: "u-3", tenant_id: "t-03", full_name: "ليلى الحربي", email: "layla.harbi@riyadbank.sa", role: "cco", is_active: true, last_seen_at: hoursAgo(0.1) },
    { id: "u-4", tenant_id: "t-04", full_name: "سعد القحطاني", email: "saad.qahtani@derayah.sa", role: "cco", is_active: false, last_seen_at: hoursAgo(40) },
    { id: "u-5", tenant_id: "t-05", full_name: "هند الدوسري", email: "hind.dosari@albilad-capital.sa", role: "cco", is_active: true, last_seen_at: hoursAgo(6) },
    { id: "u-6", tenant_id: "t-06", full_name: "ماجد السبيعي", email: "majed.subaie@alrajhi.sa", role: "cco", is_active: true, last_seen_at: hoursAgo(2) },
    { id: "u-7", tenant_id: "t-03", full_name: "أمل الشهري", email: "amal.shehri@riyadbank.sa", role: "analyst", is_active: true, last_seen_at: hoursAgo(0.2) },
    { id: "u-8", tenant_id: "t-02", full_name: "يوسف المطيري", email: "yousef.mutairi@aljazira.sa", role: "viewer", is_active: true, last_seen_at: hoursAgo(9) },
  ],
  regulatory_updates: [
    { id: "ru-1", regulator: "SAMA", title_ar: "تحديث متطلبات مكافحة غسل الأموال للمؤسسات المالية — الدفعة الثالثة", circular_no: "SAMA/AML/2026/41", published_at: hoursAgo(6), severity: "critical", summary_ar: "توسيع نطاق العناية الواجبة المعززة على علاقات المراسلة ورفع حد الإبلاغ الفوري.", status: "open" },
    { id: "ru-2", regulator: "CMA", title_ar: "تعديل لائحة مؤسسات السوق المالية — الحوكمة والوظائف الرقابية", circular_no: "CMA/CG/2026/18", published_at: hoursAgo(18), severity: "high", summary_ar: "إلزام مؤسسات السوق بفصل وظيفة الالتزام عن المراجعة الداخلية مع مهلة 90 يوماً.", status: "open" },
    { id: "ru-3", regulator: "SAMA", title_ar: "إطار المخاطر التشغيلية للخدمات المصرفية المفتوحة", circular_no: "SAMA/OPS/2026/09", published_at: hoursAgo(36), severity: "medium", summary_ar: "مؤشرات مخاطر جديدة لواجهات البرمجة المفتوحة ومتطلبات اختبار الاختراق السنوي.", status: "mapped" },
    { id: "ru-4", regulator: "CMA", title_ar: "تعميم الإفصاح عن المنتجات الاستثمارية البديلة", circular_no: "CMA/DIS/2026/07", published_at: hoursAgo(52), severity: "low", summary_ar: "نموذج إفصاح موحّد لصناديق الملكية الخاصة والمنتجات المركّبة.", status: "open" },
    { id: "ru-5", regulator: "SAMA", title_ar: "تعليمات حماية العملاء — قنوات الاعتراض الرقمية", circular_no: "SAMA/CP/2026/12", published_at: hoursAgo(70), severity: "high", summary_ar: "مهلة الرد على شكاوى العملاء تُخفَّض إلى خمسة أيام عمل للقنوات الرقمية.", status: "open" },
  ],
  alerts: [
    { id: "a-1", tenant_id: "t-04", kind: "sla", title_ar: "تجاوز مهلة ربط التعميم CMA/CG/2026/18", sla_hours_left: -14, severity: "critical", opened_at: hoursAgo(20), status: "open" },
    { id: "a-2", tenant_id: "t-06", kind: "gap", title_ar: "فجوة سياسات: العناية الواجبة المعززة غير محدّثة", sla_hours_left: 18, severity: "high", opened_at: hoursAgo(9), status: "open" },
    { id: "a-3", tenant_id: "t-02", kind: "filing", title_ar: "إفصاح ربع سنوي — مسودة بانتظار اعتماد مسؤول الالتزام", sla_hours_left: 42, severity: "medium", opened_at: hoursAgo(30), status: "acknowledged" },
    { id: "a-4", tenant_id: "t-01", kind: "exception", title_ar: "استثناء مؤقت على حد الإبلاغ — بانتظار لجنة المخاطر", sla_hours_left: 72, severity: "medium", opened_at: hoursAgo(4), status: "open" },
    { id: "a-5", tenant_id: "t-03", kind: "sla", title_ar: "اختبار الضوابط الرقابية — نافذة الإغلاق خلال يومين", sla_hours_left: 36, severity: "high", opened_at: hoursAgo(11), status: "open" },
  ],
  notifications: [
    { id: "n-1", user_id: "sa-1", title_ar: "تعميم حرج من ساما", body_ar: "SAMA/AML/2026/41 نُشر قبل ست ساعات ولم يُربط بعد لدى مستأجرَين.", read_at: null, created_at: hoursAgo(6), severity: "critical" },
    { id: "n-2", user_id: "sa-1", title_ar: "مخاطر اتفاقية مستوى الخدمة", body_ar: "دراية المالية تجاوزت مهلة الربط للائحة الحوكمة.", read_at: null, created_at: hoursAgo(4), severity: "high" },
    { id: "n-3", user_id: "sa-1", title_ar: "مستأجر جديد بانتظار التفعيل", body_ar: "طلب انضمام — شركة وساطة تحت ترخيص هيئة السوق.", read_at: hoursAgo(10), created_at: hoursAgo(14), severity: "low" },
  ],
  support_tickets: [
    { id: "tk-1", tenant_id: "t-04", opened_by: "u-4", assigned_to: "sa-1", subject_ar: "تعذّر الدخول بعد تحديث الدور", body_ar: "بعد تغيير صلاحية الحساب لم يعد مسؤول الالتزام قادراً على فتح وحدة الربط الرقابي.", status: "open", priority: "critical", category: "access", sla_hours: 24, opened_at: hoursAgo(30), updated_at: hoursAgo(4), resolved_at: null },
    { id: "tk-2", tenant_id: "t-02", opened_by: "u-2", assigned_to: "sa-1", subject_ar: "نقص في تغذية التعميم CMA/CG/2026/18", body_ar: "التعميم ظاهر في الخلاصة لكن حقول الملخص والحدة فارغة لدى مستأجر الجزيرة كابيتال.", status: "open", priority: "high", category: "m1_data", sla_hours: 24, opened_at: hoursAgo(8), updated_at: hoursAgo(1), resolved_at: null },
    { id: "tk-3", tenant_id: "t-01", opened_by: "u-1", assigned_to: "u-7", subject_ar: "استفسار عن دورة الفوترة للربع الحالي", body_ar: "نحتاج تأكيد تاريخ إغلاق الفترة وآلية احتساب المقاعد الإضافية لمسؤولي الالتزام.", status: "pending", priority: "medium", category: "billing", sla_hours: 24, opened_at: hoursAgo(12), updated_at: hoursAgo(3), resolved_at: null },
    { id: "tk-4", tenant_id: "t-06", opened_by: "u-6", assigned_to: null, subject_ar: "طلب توضيح حول تصنيف التنبيه", body_ar: "التنبيه المدرج كفجوة سياسات لا يوضح البند الرقابي المرتبط.", status: "open", priority: "low", category: "other", sla_hours: 48, opened_at: hoursAgo(2), updated_at: hoursAgo(2), resolved_at: null },
    { id: "tk-5", tenant_id: "t-03", opened_by: "u-3", assigned_to: "sa-1", subject_ar: "إعادة تفعيل حساب محلل بعد إجازة", body_ar: "حساب أمل الشهري أُوقف مؤقتاً. تمت إعادة التفعيل والتحقق من الدخول.", status: "resolved", priority: "medium", category: "access", sla_hours: 24, opened_at: hoursAgo(50), updated_at: hoursAgo(6), resolved_at: hoursAgo(6) },
  ],
  ticket_replies: [
    { id: "tr-1", ticket_id: "tk-1", author_id: "u-4", body_ar: "ما زال الدخول يرفض من جهاز المكتب بعد إعادة المحاولة صباح اليوم.", is_internal: false, created_at: hoursAgo(20) },
    { id: "tr-2", ticket_id: "tk-1", author_id: "sa-1", body_ar: "مراجعة سجلات الهوية: الدور على cco لكن is_active كان false — يُعالَج عبر admin-users.", is_internal: true, created_at: hoursAgo(6) },
    { id: "tr-3", ticket_id: "tk-1", author_id: "sa-1", body_ar: "تم رصد التعارض. نعيد تفعيل الحساب ونؤكد الدخول خلال المهلة.", is_internal: false, created_at: hoursAgo(4) },
    { id: "tr-4", ticket_id: "tk-2", author_id: "sa-1", body_ar: "قناة M1 تعيد المحاولة. إذا استمر الفراغ بعد ساعة أبلغونا برقم التعميم فقط.", is_internal: false, created_at: hoursAgo(3) },
    { id: "tr-5", ticket_id: "tk-3", author_id: "u-7", body_ar: "مسودة الرد على الفوترة جاهزة للمراجعة الداخلية قبل إرسالها للمستأجر.", is_internal: true, created_at: hoursAgo(5) },
    { id: "tr-6", ticket_id: "tk-5", author_id: "sa-1", body_ar: "أُعيد التفعيل. الحساب يعمل بصلاحية محلل.", is_internal: false, created_at: hoursAgo(6) },
  ],
  metrics: {
    user_counts: { total: 9, active: 8, by_role: { super_admin: 1, cco: 6, analyst: 1, viewer: 1 } },
    ticket_volumes: { open: 3, pending: 1, resolved: 1, closed: 0, sla_breached: 1 },
    m1_activity: { open_regulatory_items: 4, mapped: 1, closed: 0, alerts_open: 4, sla_risk: 2 },
    spark: { users: [6, 7, 7, 8, 8, 9], tickets: [1, 2, 2, 3, 4, 3], items: [2, 3, 4, 5, 4, 4], sla: [1, 2, 1, 3, 2, 2] },
  },
  obligationTrend: [
    { label: "صفر", sama: 4, cma: 3 },
    { label: "محرّم", sama: 6, cma: 4 },
    { label: "صفر ٢", sama: 5, cma: 7 },
    { label: "ربيع ١", sama: 8, cma: 5 },
    { label: "ربيع ٢", sama: 7, cma: 9 },
    { label: "جمادى ١", sama: 11, cma: 8 },
    { label: "جمادى ٢", sama: 9, cma: 10 },
    { label: "رجب", sama: 13, cma: 9 },
  ],
};

export const DEMO_ACTOR_ID = "sa-1";
export const useDemoData = import.meta.env.VITE_USE_DEMO_DATA === "true";
