'use client';

import { useEffect } from "react";
import { useAuthStore } from "@/store/auth-store";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const initializeAuth = useAuthStore((state) => state.initializeAuth);

  useEffect(() => {
    initializeAuth(); // ✅ Load from cookies
  }, []);

  return <>{children}</>;
}
