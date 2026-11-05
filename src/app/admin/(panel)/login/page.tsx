"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Lock, Mail } from "lucide-react";
import { inputClass, labelClass, primaryBtn } from "@/components/admin/ui";

export default function AdminLoginPage() {
  const router = useRouter();
  const [show, setShow] = useState(false);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-maroon-950 via-maroon-900 to-maroon-800 p-4">
      <div className="w-full max-w-md overflow-hidden rounded-2xl border border-gold/30 bg-white shadow-luxury">
        <div className="bg-gradient-to-r from-maroon-800 to-maroon-900 px-8 py-8 text-center">
          <span className="block font-serif text-2xl font-bold tracking-[0.3em] text-gold">CHARMIKA</span>
          <span className="mt-1 block text-[10px] uppercase tracking-[0.35em] text-white/60">By Lekshmi</span>
          <div className="mx-auto mt-4 h-px w-16 bg-gold/50" />
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            router.push("/admin/dashboard");
          }}
          className="space-y-5 p-8"
        >
          <div>
            <span className="mb-1 block text-xs font-bold uppercase tracking-[0.2em] text-gold-600">
              Admin Access
            </span>
            <h1 className="font-serif text-2xl font-bold text-maroon">Welcome back</h1>
          </div>

          <div>
            <label className={labelClass}>Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-charcoal/40" />
              <input type="email" placeholder="admin@charmika.com" className={`${inputClass} pl-10`} />
            </div>
          </div>

          <div>
            <label className={labelClass}>Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-charcoal/40" />
              <input
                type={show ? "text" : "password"}
                placeholder="••••••••"
                className={`${inputClass} px-10`}
              />
              <button
                type="button"
                onClick={() => setShow((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-charcoal/40 hover:text-maroon"
                aria-label="Toggle password visibility"
              >
                {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <button type="submit" className={`${primaryBtn} w-full py-3`}>
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
}