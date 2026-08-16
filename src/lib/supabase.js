import { createClient } from "@supabase/supabase-js";

const url = import.meta.env.VITE_SUPABASE_URL || "https://placeholder.supabase.co";
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || "placeholder-anon-key";

export const isPlaceholderClient =
  url.includes("placeholder") || anonKey.includes("placeholder");

export const supabase = createClient(url, anonKey, {
  auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true },
  realtime: { params: { eventsPerSecond: 8 } },
});

export const TABLES = {
  tenants: "tenants",
  users: "users",
  regulatoryUpdates: "regulatory_updates",
  alerts: "alerts",
  notifications: "notifications",
  supportTickets: "support_tickets",
  ticketReplies: "ticket_replies",
};

export const TICKET_SELECT =
  "*, opener:users!opened_by(full_name,role), assignee:users!assigned_to(full_name,role)";

export const REPLY_SELECT = "*, author:users!author_id(full_name,role)";

export const ROLES = ["super_admin", "cco", "analyst", "viewer"];
export const TICKET_STATUS = ["open", "pending", "resolved", "closed"];
export const TICKET_PRIORITY = ["low", "medium", "high", "critical"];
export const TICKET_CATEGORY = ["access", "billing", "m1_data", "other"];
