"use client";

import { usePathname, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

/**
 * Client-side route guard.
 *
 * The bearer token is stored in localStorage (see SignInForm), which is only
 * available in the browser — so protection has to run on the client. This
 * component blocks rendering of its children until it confirms a token exists,
 * otherwise it redirects to /signin. That prevents protected content from
 * flashing before the redirect happens.
 */
export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      setAuthorized(false);
      // Remember where the user was headed so we can return after login.
      const redirect =
        pathname && pathname !== "/"
          ? `?redirect=${encodeURIComponent(pathname)}`
          : "";
      router.replace(`/signin${redirect}`);
    } else {
      setAuthorized(true);
    }
  }, [pathname, router]);

  if (!authorized) {
    return null;
  }

  return <>{children}</>;
}
