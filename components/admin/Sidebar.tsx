"use client";

import { auth } from "@/lib/firebase";
import { signOut } from "firebase/auth";
import { Users, LayoutDashboard, LogOut } from "lucide-react";

interface SidebarProps {
  activeMenu: "dashboard" | "data-siswa";
}

export default function Sidebar({ activeMenu }: SidebarProps) {
  
  const handleLogout = async () => {
    await signOut(auth);
    document.cookie = "admin_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    window.location.href = "/admin/login";
  };

  return (
    <aside className="w-64 bg-white border-r border-slate-200 p-6 flex flex-col justify-between shrink-0 h-screen sticky top-0 font-sans">
      <div>
        {/* Logo / Brand */}
        <div className="flex items-center gap-2 px-2 mb-8">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-black text-sm">
            KW
          </div>
          <span className="text-xl font-bold tracking-tight text-slate-900">SMA Kawis</span>
        </div>
        
        {/* Navigasi Menu */}
        <nav className="space-y-1">
          <a 
            href="/admin/dashboard" 
            className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm transition-colors ${
              activeMenu === "dashboard"
                ? "bg-blue-50 text-blue-700 font-semibold"
                : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
            }`}
          >
            <LayoutDashboard size={18} />
            Dashboard
          </a>
          <a 
            href="/admin/dashboard/data-siswa" 
            className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm transition-colors ${
              activeMenu === "data-siswa"
                ? "bg-blue-50 text-blue-700 font-semibold"
                : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
            }`}
          >
            <Users size={18} />
            Data Siswa
          </a>
        </nav>
      </div>

      {/* Tombol Keluar */}
      <button 
        onClick={handleLogout} 
        className="flex items-center gap-3 px-4 py-3 w-full rounded-xl font-medium text-sm text-red-600 hover:bg-red-50 transition-colors"
      >
        <LogOut size={18} />
        Keluar
      </button>
    </aside>
  );
}