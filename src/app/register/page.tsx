"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Send, Eye, EyeOff, ArrowRight } from "lucide-react";
import { useAuthStore } from "@/lib/store/authStore";
import { toast } from "sonner";

export default function RegisterPage() {
  const router = useRouter();
  const { register } = useAuthStore();
  const [form, setForm] = useState({ name: "", email: "", password: "", confirm: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs: Record<string, string> = {};
    if (!form.name.trim()) errs.name = "Required";
    if (!form.email.trim()) errs.email = "Required";
    if (!form.password) errs.password = "Required";
    else if (form.password.length < 6) errs.password = "Minimum 6 characters";
    if (form.password !== form.confirm) errs.confirm = "Passwords don't match";
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }
    setErrors({});
    setLoading(true);
    const result = await register(form.name, form.email, form.password);
    setLoading(false);
    if (result.ok) {
      toast.success("Account created! Welcome to Complanion.");
      router.push("/dashboard");
    } else {
      setErrors({ form: result.error || "Registration failed" });
    }
  };

  const inputClass =
    "w-full px-3.5 py-2.5 rounded-xl border border-border bg-card text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-brand-500/40 focus:border-brand-400 transition-all";

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md"
      >
        <div className="flex items-center gap-2.5 justify-center mb-8">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center shadow-glow-sm">
            <Send className="w-4 h-4 text-white" />
          </div>
          <span className="text-xl font-bold font-display text-gradient">Complanion</span>
        </div>

        <div className="card-base p-8">
          <h1 className="text-xl font-bold font-display text-foreground mb-1">Create your account</h1>
          <p className="text-sm text-muted-foreground mb-6">Start planning your first event in minutes</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {errors.form && (
              <div className="px-3 py-2.5 rounded-xl bg-rose-50 border border-rose-100 text-sm text-rose-600 dark:bg-rose-900/20 dark:border-rose-800/40 dark:text-rose-400">
                {errors.form}
              </div>
            )}

            <div>
              <label className="block text-xs font-medium text-foreground mb-1.5">Full name</label>
              <input
                type="text"
                placeholder="Jane Smith"
                value={form.name}
                autoComplete="name"
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                className={inputClass}
              />
              {errors.name && <p className="text-[10px] text-rose-500 mt-1">{errors.name}</p>}
            </div>

            <div>
              <label className="block text-xs font-medium text-foreground mb-1.5">Email</label>
              <input
                type="email"
                placeholder="you@example.com"
                value={form.email}
                autoComplete="email"
                onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                className={inputClass}
              />
              {errors.email && <p className="text-[10px] text-rose-500 mt-1">{errors.email}</p>}
            </div>

            <div>
              <label className="block text-xs font-medium text-foreground mb-1.5">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="At least 6 characters"
                  value={form.password}
                  autoComplete="new-password"
                  onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
                  className={inputClass + " pr-10"}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && <p className="text-[10px] text-rose-500 mt-1">{errors.password}</p>}
            </div>

            <div>
              <label className="block text-xs font-medium text-foreground mb-1.5">Confirm password</label>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Repeat password"
                value={form.confirm}
                autoComplete="new-password"
                onChange={(e) => setForm((f) => ({ ...f, confirm: e.target.value }))}
                className={inputClass}
              />
              {errors.confirm && <p className="text-[10px] text-rose-500 mt-1">{errors.confirm}</p>}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full justify-center py-2.5 mt-2"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  Create Account <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <p className="text-center text-sm text-muted-foreground mt-6">
            Already have an account?{" "}
            <Link href="/login" className="text-brand-600 hover:text-brand-700 font-medium">
              Sign in →
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
