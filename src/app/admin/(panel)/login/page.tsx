"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff, Lock, Mail, Loader2, AlertCircle, ArrowLeft } from "lucide-react";
import { inputClass, labelClass, primaryBtn } from "@/components/admin/ui";
import { authService } from "@/lib/services/auth.service";

export default function AdminLoginPage() {
  const router = useRouter();
  const [show, setShow] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const data = await authService.login({ email, password });
      if (typeof window !== "undefined" && data?.token) {
        localStorage.setItem("charmika_token", data.token);
      }
      router.push("/admin/dashboard");
    } catch (err: any) {
      setError(err?.message || "Invalid email or password. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-maroon-950 via-maroon-900 to-maroon-800 p-4 sm:p-6">
      <div className="w-full max-w-md overflow-hidden rounded-2xl border border-gold/30 bg-white shadow-luxury">
        {/* Brand Header */}
        <div className="bg-gradient-to-r from-maroon-800 to-maroon-900 px-8 py-8 text-center text-white">
          <span className="block font-serif text-2xl font-bold tracking-[0.3em] text-gold sm:text-3xl">
            CHARMIKA
          </span>
          <span className="mt-1 block text-[10px] uppercase tracking-[0.35em] text-white/70">
            By Lekshmi · Fine Jewellery
          </span>
          <span className="mt-3 inline-block rounded-full bg-gold/15 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-gold">
            Administration Portal
          </span>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="space-y-5 p-8">
          <div>
            <h2 className="font-serif text-xl font-bold text-maroon">Sign In</h2>
            <p className="mt-1 text-xs text-charcoal/60">
              Enter your administrator credentials to access the console.
            </p>
          </div>

          {error && (
            <div className="flex items-start gap-2.5 rounded-lg border border-rose-200 bg-rose-50 p-3 text-xs text-rose-700">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-rose-600" />
              <span>{error}</span>
            </div>
          )}

          <div>
            <label className={labelClass}>Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-charcoal/40" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@charmika.com"
                required
                className={`${inputClass} pl-10`}
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between">
              <label className={labelClass}>Password</label>
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-charcoal/40" />
              <input
                type={show ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className={`${inputClass} pl-10 pr-10`}
              />
              <button
                type="button"
                onClick={() => setShow(!show)}
                tabIndex={-1}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-charcoal/40 hover:text-charcoal"
              >
                {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`${primaryBtn} w-full justify-center py-3 text-sm disabled:opacity-60`}
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Signing in...
              </>
            ) : (
              "Sign In to Console"
            )}
          </button>

          <div className="pt-2 text-center">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-xs text-charcoal/60 hover:text-maroon"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Return to Charmika Store
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
