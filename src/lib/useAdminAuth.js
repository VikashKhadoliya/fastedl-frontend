"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase, checkIsAdmin } from "./supabaseClient";

export function useAdminAuth() {
  const router = useRouter();
  const [adminUser, setAdminUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function verifyAuth() {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (!session?.user) {
          if (isMounted) {
            router.push("/admin/login");
          }
          return;
        }

        const isAdmin = await checkIsAdmin(session.user);
        if (!isAdmin) {
          await supabase.auth.signOut();
          if (isMounted) {
            router.push("/admin/login");
          }
          return;
        }

        if (isMounted) {
          setAdminUser(session.user);
          setLoading(false);
        }
      } catch (err) {
        if (isMounted) {
          router.push("/admin/login");
        }
      }
    }

    verifyAuth();

    // Listen for auth state changes (e.g. sign out)
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === "SIGNED_OUT" || !session?.user) {
        if (isMounted) {
          router.push("/admin/login");
        }
      }
    });

    return () => {
      isMounted = false;
      subscription?.unsubscribe();
    };
  }, [router]);

  return { adminUser, loading };
}
