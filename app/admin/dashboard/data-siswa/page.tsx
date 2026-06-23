"use client";

import { useEffect, useState } from "react";
import { db, auth } from "@/lib/firebase";
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";
import { signOut } from "firebase/auth";
import { 
  Users, 
  LayoutDashboard, 
  LogOut, 
  Search, 
  CheckCircle2, 
  AlertCircle, 
  GraduationCap, 
} from "lucide-react";
import Sidebar from "@/components/admin/Sidebar"; // <-- Impor di sini

export const dynamic = "force-dynamic";

export default function DataSiswaPage() {
  const [students, setStudents] = useState<any[]>([]);
  const [filteredStudents, setFilteredStudents] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [isChecking, setIsChecking] = useState(true);

  // 1. Proteksi Halaman
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

  // 2. Ambil Data Real-time
  useEffect(() => {
    if (isChecking) return;

    const q = query(collection(db, "pendaftar"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setStudents(data);
      setFilteredStudents(data);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [isChecking]);

  // 3. Fitur Live Search
  useEffect(() => {
    const filtered = students.filter((student) =>
      student.namaLengkap?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.nisn?.includes(searchQuery) ||
      student.asalSekolah?.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredStudents(filtered);
  }, [searchQuery, students]);

  const handleLogout = async () => {
    await signOut(auth);
    document.cookie = "admin_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    window.location.href = "/admin/login";
  };

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
      
      {/* --- SIDEBAR --- */}
      <aside className="w-64 bg-white border-r border-slate-200 p-6 flex flex-col justify-between shrink-0">
        <Sidebar activeMenu="data-siswa" />
      </aside>

      {/* --- MAIN CONTENT --- */}
      <main className="flex-1 p-8 overflow-x-auto max-w-7xl mx-auto w-full">
        
        {/* Header Ringkas */}
        <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">Data Pendaftar & Siswa</h1>
            <p className="text-sm text-slate-500 mt-0.5">Kelola data administrasi pendaftaran siswa baru secara real-time.</p>
          </div>
          <div className="bg-blue-50 text-blue-700 font-semibold text-xs px-3 py-1.5 rounded-full border border-blue-100 self-start md:self-auto">
            Total: {filteredStudents.length} Record
          </div>
        </header>

        {/* Search Bar Modern */}
        <div className="relative mb-6 max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text"
            placeholder="Cari nama, NISN, atau sekolah asal..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-medium outline-none placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-50/50 transition-all text-slate-900"
          />
        </div>

        {/* Konten Utama */}
        {loading ? (
          <div className="text-center py-20">
            <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-sm font-medium text-slate-500">Memuat data...</p>
          </div>
        ) : filteredStudents.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center">
            <p className="text-sm font-medium text-slate-500">Tidak ada data pendaftar yang cocok.</p>
          </div>
        ) : (
          /* --- TABEL MINIMALIS ELEGAN --- */
          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/70 border-b border-slate-200">
                  <th className="p-4 font-semibold text-slate-700 text-xs uppercase tracking-wider">Siswa</th>
                  <th className="p-4 font-semibold text-slate-700 text-xs uppercase tracking-wider">Asal Sekolah & NISN</th>
                  <th className="p-4 font-semibold text-slate-700 text-xs uppercase tracking-wider">Jurusan</th>
                  <th className="p-4 font-semibold text-slate-700 text-xs uppercase tracking-wider">Kontak</th>
                  <th className="p-4 font-semibold text-slate-700 text-xs uppercase tracking-wider">Pembayaran</th>
                  <th className="p-4 font-semibold text-slate-700 text-xs uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredStudents.map((student) => (
                  <tr key={student.id} className="hover:bg-slate-50/50 transition-colors">
                    {/* Kolom Siswa */}
                    <td className="p-4">
                      <p className="font-semibold text-slate-900 text-sm">{student.namaLengkap}</p>
                      <p className="text-xs text-slate-400 mt-0.5">{student.email}</p>
                    </td>

                    {/* Kolom Sekolah */}
                    <td className="p-4">
                      <p className="text-sm font-medium text-slate-800">{student.asalSekolah}</p>
                      <p className="text-xs text-slate-400 mt-0.5">NISN: {student.nisn}</p>
                    </td>

                    {/* Kolom Jurusan */}
                    <td className="p-4">
                      <span className="inline-flex items-center bg-slate-100 text-slate-800 px-2.5 py-0.5 rounded-full text-xs font-medium border border-slate-200">
                        {student.jurusan}
                      </span>
                    </td>

                    {/* Kolom Kontak */}
                    <td className="p-4 text-sm font-medium text-slate-600">
                      {student.whatsapp}
                    </td>

                    {/* Kolom Pembayaran */}
                    <td className="p-4">
                      <div className="flex flex-col gap-1">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold w-fit ${
                          student.tagihan === "Lunas" 
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-100" 
                            : "bg-amber-50 text-amber-700 border border-amber-100"
                        }`}>
                          {student.tagihan === "Lunas" ? <CheckCircle2 size={12} /> : <AlertCircle size={12} />}
                          {student.tagihan || "Belum Bayar"}
                        </span>
                        {student.paymentMethod && (
                          <p className="text-[10px] text-slate-400 font-medium pl-1">
                            {student.paymentMethod}
                          </p>
                        )}
                      </div>
                    </td>

                    {/* Kolom Status Akun */}
                    <td className="p-4">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${
                        student.status === "Siswa" 
                          ? "bg-blue-50 text-blue-700 border border-blue-100" 
                          : "bg-slate-50 text-slate-600 border border-slate-200"
                      }`}>
                        {student.status === "Siswa" && <GraduationCap size={12} />}
                        {student.status || "Pendaftar"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
}