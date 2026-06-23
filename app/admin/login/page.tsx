"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      const userDoc = await getDoc(doc(db, "users", user.uid));
      
      if (userDoc.exists() && userDoc.data().role === "admin") {
        const token = await user.getIdToken();
        document.cookie = `admin_token=${token}; path=/; max-age=86400; SameSite=Strict; Secure`;
        
        router.push("/admin/dashboard");
      } else {
        setError("AKSES DITOLAK: AKUN ANDA BUKAN ADMIN.");
      }
    } catch (err: any) {
      setError("EMAIL ATAU PASSWORD YANG ANDA MASUKKAN SALAH.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
      <div className="w-full max-w-md bg-white border-[3px] border-black p-8 rounded-[32px] shadow-[10px_10px_0px_0px_rgba(0,0,0,1)]">
        
        <h2 className="text-4xl font-black uppercase text-center italic text-blue-700 tracking-tight mb-8">
          Admin Login
        </h2>
        
        {error && (
          <div className="bg-red-50 text-red-700 border-2 border-red-600 p-4 rounded-xl text-xs font-black uppercase tracking-wide mb-6">
            {error}
          </div>
        )}
        
        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-xs font-black uppercase tracking-wider text-slate-950 mb-2">
              Email Admin
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
              Password
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
            className="w-full bg-slate-950 text-white py-4 rounded-xl font-black text-sm uppercase tracking-widest border-[3px] border-black shadow-[4px_4px_0px_0px_rgba(37,99,235,1)] hover:bg-slate-900 active:translate-y-1 active:shadow-none transition-all disabled:bg-slate-200 disabled:text-slate-500 disabled:border-slate-300 disabled:shadow-none"
          >
            {loading ? "MEMVERIFIKASI..." : "MASUK DASHBOARD"}
          </button>
        </form>

        {/* --- LINK NAVIGASI KE REGISTER --- */}
        <div className="text-center mt-6">
          <p className="text-xs font-black text-slate-950 uppercase">
            Belum punya akun?{" "}
            <a href="/admin/register" className="text-blue-700 underline hover:text-blue-800 transition-colors">
              Register di sini
            </a>
          </p>
        </div>

      </div>
    </div>
  );
}