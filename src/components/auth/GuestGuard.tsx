"use client";

import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";

/**
 * Reverse of AuthGuard — for public auth pages (signin / signup).
 *
 * If a token already exists, the user is logged in and shouldn't see the
 * auth pages, so we send them on to the dashboard (or the `redirect` target
 * that AuthGuard captured). Otherwise we render the auth page.
 */
export default function GuestGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      const redirect = searchParams.get("redirect");
      router.replace(redirect || "/");
    } else {
      setChecked(true);
    }
  }, [router, searchParams]);

  if (!checked) {
    return null;
  }

  return <>{children}</>;
}
