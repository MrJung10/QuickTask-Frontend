// app/page.tsx
import { redirect } from 'next/navigation';
import { clearAuthCookies } from '@/lib/utils/cookies';
import Cookies from "js-cookie";

export default function Home() {
  const accessToken = Cookies.get("accessToken");

  if (accessToken) {
    redirect("/dashboard");
  } else {
    clearAuthCookies();
    redirect("/login");
  }
}
