import { createClient } from "@supabase/supabase-js";

const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL || "https://exxbwpswkokeizixkglt.supabase.co";
const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  "sb_publishable_WqtGwIzYScJo95NwSiW5MQ_xlPxFgxM";

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});

/**
 * Verify whether an authenticated Supabase user belongs to the authorized admin allowlist
 */
export async function checkIsAdmin(user) {
  if (!user || !user.id) return false;
  try {
    const { data, error } = await supabase
      .from("admin_users")
      .select("role, is_active")
      .eq("id", user.id)
      .maybeSingle();

    if (error || !data) return false;
    return Boolean(
      data.is_active && (data.role === "admin" || data.role === "super_admin")
    );
  } catch (_) {
    return false;
  }
}

/**
 * Helper to get the verified active admin session
 */
export async function getActiveAdminSession() {
  const {
    data: { session },
    error,
  } = await supabase.auth.getSession();

  if (error || !session?.user) return null;

  const isVerifiedAdmin = await checkIsAdmin(session.user);
  if (!isVerifiedAdmin) {
    return null;
  }

  return session.user;
}
