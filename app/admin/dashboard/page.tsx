"use client";

import { useEffect, useState } from "react";
import Sidebar from "@/components/admin/Sidebar"; // <-- Impor di sini
import { db } from "@/lib/firebase";
import { collection, onSnapshot } from "firebase/firestore";
import { Users, AlertCircle, CheckCircle2 } from "lucide-react";

export const dynamic = "force-dynamic";

export default function AdminDashboard() {
  const [isChecking, setIsChecking] = useState(true);
  const [stats, setStats] = useState({ total: 0, belumBayar: 0, lunas: 0 });

  useEffect(() => {
    const getCookie = (name: string) => {
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);
      if (parts.length === 2) return parts.pop()?.split(";").shift();
      return null;
    };

    const token = getCookie("admin_token");

    if (!token || token === "undefined" || token === "") {
      window.location.href = "/admin/login";
    } else {
      setIsChecking(false);
    }
  }, []);

  // Mengambil real data kalkulasi statistik langsung dari Firestore pendaftar
  useEffect(() => {
    if (isChecking) return;

    const unsubscribe = onSnapshot(collection(db, "pendaftar"), (snapshot) => {
      let total = snapshot.size;
      let belumBayar = 0;
      let lunas = 0;

      snapshot.docs.forEach((doc) => {
        if (doc.data().tagihan === "Lunas") {
          lunas++;
        } else {
          belumBayar++;
        }
      });

      setStats({ total, belumBayar, lunas });
    });

    return () => unsubscribe();
  }, [isChecking]);

  if (isChecking) {
    return (
      <div className="min-h-screen bg-slate-50/50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="font-semibold text-xs text-slate-900 tracking-wider uppercase">Memverifikasi Akses...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] flex text-slate-900 font-sans">
      
      {/* PANGGIL COMPONENT SIDEBAR */}
      <Sidebar activeMenu="dashboard" />

      {/* --- MAIN CONTENT AREA --- */}
      <main className="flex-1 p-8 max-w-7xl mx-auto w-full">
        <header className="mb-8">
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Dashboard Ringkasan</h1>
          <p className="text-sm text-slate-500 mt-0.5">Pantau ringkasan data kuota siswa dan status keuangan terkini.</p>
        </header>

        {/* --- STATS GRID MODERN --- */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Card 1: Total Pendaftar */}
          <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase text-slate-400 tracking-wider">Total Pendaftar</p>
              <h3 className="text-3xl font-bold mt-1 text-slate-900">{stats.total}</h3>
            </div>
            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
              <Users size={24} />
            </div>
          </div>
          
          {/* Card 2: Belum Bayar */}
          <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase text-slate-400 tracking-wider">Belum Bayar</p>
              <h3 className="text-3xl font-bold mt-1 text-amber-600">{stats.belumBayar}</h3>
            </div>
            <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center">
              <AlertCircle size={24} />
            </div>
          </div>
          
          {/* Card 3: Lunas */}
          <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase text-slate-400 tracking-wider">Lunas (Siswa)</p>
              <h3 className="text-3xl font-bold mt-1 text-emerald-600">{stats.lunas}</h3>
            </div>
            <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center">
              <CheckCircle2 size={24} />
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}