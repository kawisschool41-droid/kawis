import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const adminToken = request.cookies.get("admin_token")?.value;
  const isTargetingAdminDashboard = request.nextUrl.pathname.startsWith("/admin/dashboard");

  // Periksa secara ketat: jika token tidak ada, kosong, atau bertuliskan "undefined"
  const isNotAuthenticated = !adminToken || adminToken === "" || adminToken === "undefined";

  if (isTargetingAdminDashboard && isNotAuthenticated) {
    // Paksa pindah ke halaman login admin
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/dashboard/:path*"],
};