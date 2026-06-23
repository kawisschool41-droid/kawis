"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "@/lib/firebase";
import { doc, setDoc } from "firebase/firestore";

export default function AdminRegister() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      // 1. Buat akun baru di Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // 2. Simpan data admin ke Firestore koleksi 'users' dengan role 'admin'
      await setDoc(doc(db, "users", user.uid), {
        namaLengkap: name,
        email: email,
        role: "admin", // Mengunci hak akses sebagai admin
        createdAt: new Date().toISOString(),
      });

      setSuccess("AKUN ADMIN BERHASIL DIBUAT! MENGALIHKAN KE LOGIN...");
      
      // Alihkan ke halaman login setelah 2 detik
      setTimeout(() => {
        router.push("/admin/login");
      }, 2000);

    } catch (err: any) {
      if (err.code === "auth/email-already-in-use") {
        setError("EMAIL SUDAH TERDAFTAR. GUNAKAN EMAIL LAIN.");
      } else if (err.code === "auth/weak-password") {
        setError("PASSWORD TERLALU LEMAH. MINIMAL 6 KARAKTER.");
      } else {
        setError("GAGAL DAFTAR: " + err.message.toUpperCase());
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
      <div className="w-full max-w-md bg-white border-[3px] border-black p-8 rounded-[32px] shadow-[10px_10px_0px_0px_rgba(0,0,0,1)]">
        
        <h2 className="text-4xl font-black uppercase text-center italic text-blue-700 tracking-tight mb-2">
          Daftar Admin
        </h2>
        <p className="text-center font-black text-xs text-slate-900 uppercase tracking-widest mb-8">
          Membuat Akun Otoritas Baru
        </p>
        
        {/* Notifikasi Error */}
        {error && (
          <div className="bg-red-50 text-red-700 border-2 border-red-600 p-4 rounded-xl text-xs font-black uppercase tracking-wide mb-6">
            {error}
          </div>
        )}

        {/* Notifikasi Sukses */}
        {success && (
          <div className="bg-green-50 text-green-700 border-2 border-green-600 p-4 rounded-xl text-xs font-black uppercase tracking-wide mb-6">
            {success}
          </div>
        )}
        
        <form onSubmit={handleRegister} className="space-y-5">
          <div>
            <label className="block text-xs font-black uppercase tracking-wider text-slate-950 mb-2">
              Nama Lengkap
            </label>
            <input 
              type="text" 
              value={name} 
              onChange={(e) => setName(e.target.value)} 
              required 
              className="w-full border-[3px] border-black p-4 rounded-xl font-bold text-slate-900 outline-none bg-white focus:bg-blue-50/50 transition-colors" 
              placeholder="Nama Admin"
            />
          </div>

          <div>
            <label className="block text-xs font-black uppercase tracking-wider text-slate-950 mb-2">
              Email Resmi
            </label>
            <input 
              type="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required 
              className="w-full border-[3px] border-black p-4 rounded-xl font-bold text-slate-900 outline-none bg-white focus:bg-blue-50/50 transition-colors" 
              placeholder="admin@smakawis.sch.id"
            />
          </div>

          <div>
            <label className="block text-xs font-black uppercase tracking-wider text-slate-950 mb-2">
              Password (Min. 6 Karakter)
            </label>
            <input 
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required 
              className="w-full border-[3px] border-black p-4 rounded-xl font-bold text-slate-900 outline-none bg-white focus:bg-blue-50/50 transition-colors" 
              placeholder="••••••••"
            />
          </div>

          <button 
            type="submit" 
            disabled={loading} 
            className="w-full bg-slate-950 text-white py-4 rounded-xl font-black text-sm uppercase tracking-widest border-[3px] border-black shadow-[4px_4px_0px_0px_rgba(37,99,235,1)] hover:bg-slate-900 active:translate-y-1 active:shadow-none transition-all disabled:bg-slate-200 disabled:text-slate-500"
          >
            {loading ? "MENDAFTARKAN..." : "BUAT AKUN ADMIN"}
          </button>
        </form>

        <div className="text-center mt-6">
          <p className="text-xs font-black text-slate-950 uppercase">
            Sudah punya akun?{" "}
            <a href="/admin/login" className="text-blue-700 underline hover:text-blue-800">
              Login di sini
            </a>
          </p>
        </div>

      </div>
    </div>
  );
}