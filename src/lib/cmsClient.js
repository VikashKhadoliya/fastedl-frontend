import { supabase } from "./supabaseClient";

export async function getCmsPage(slug) {
  try {
    const { data, error } = await supabase
      .from("pages")
      .select("*")
      .eq("slug", slug)
      .eq("status", "published")
      .maybeSingle();

    if (!error && data) {
      return data;
    }
  } catch (err) {
    // Graceful fallback to static page if Supabase is unreachable
  }
  return null;
}
