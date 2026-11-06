"use client";

import { useEffect, useState } from "react";
import { Save, KeyRound, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import PageHeader from "@/components/admin/PageHeader";
import { inputClass, labelClass, cardClass, primaryBtn } from "@/components/admin/ui";
import { authService, type AdminUser } from "@/lib/services/auth.service";

export default function ProfilePage() {
  const [admin, setAdmin] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);

  // Profile Form state
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileMsg, setProfileMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Password Form state
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [savingPassword, setSavingPassword] = useState(false);
  const [passwordMsg, setPasswordMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    authService
      .getMe()
      .then((data) => {
        setAdmin(data);
        setName(data.name);
        setEmail(data.email);
      })
      .catch((err) => {
        console.error("Failed to load profile:", err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  async function handleProfileSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSavingProfile(true);
    setProfileMsg(null);

    try {
      const updated = await authService.updateProfile({ name, email });
      setAdmin(updated);
      setProfileMsg({ type: "success", text: "Profile details updated successfully!" });
    } catch (err: any) {
      setProfileMsg({ type: "error", text: err?.message || "Failed to update profile." });
    } finally {
      setSavingProfile(false);
    }
  }

  async function handlePasswordSubmit(e: React.FormEvent) {
    e.preventDefault();
    setPasswordMsg(null);

    if (newPassword !== confirmPassword) {
      setPasswordMsg({ type: "error", text: "New password and confirmation do not match." });
      return;
    }

    setSavingPassword(true);

    try {
      await authService.changePassword({
        currentPassword,
        newPassword,
        confirmPassword,
      });
      setPasswordMsg({ type: "success", text: "Password has been updated successfully!" });
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err: any) {
      setPasswordMsg({ type: "error", text: err?.message || "Failed to update password." });
    } finally {
      setSavingPassword(false);
    }
  }

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="mr-2 h-6 w-6 animate-spin text-gold-600" />
        <span className="text-xs text-charcoal/60">Loading profile...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader eyebrow="Account" title="My Profile" />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Account Details */}
        <section className={`${cardClass} p-6`}>
          <div className="mb-5 flex items-center gap-4 border-b border-gold/15 pb-4">
            <span className="flex h-14 w-14 items-center justify-center rounded-full bg-maroon font-serif text-xl font-bold text-gold">
              {name ? name.charAt(0).toUpperCase() : "A"}
            </span>
            <div>
              <h3 className="font-serif text-base font-bold text-maroon">Account Details</h3>
              <p className="text-xs text-charcoal/50">Update your name and email.</p>
            </div>
          </div>

          {profileMsg && (
            <div
              className={`mb-4 flex items-center gap-2 rounded-lg p-3 text-xs ${
                profileMsg.type === "success"
                  ? "border border-emerald-200 bg-emerald-50 text-emerald-800"
                  : "border border-rose-200 bg-rose-50 text-rose-800"
              }`}
            >
              {profileMsg.type === "success" ? (
                <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
              ) : (
                <AlertCircle className="h-4 w-4 shrink-0 text-rose-600" />
              )}
              <span>{profileMsg.text}</span>
            </div>
          )}

          <form onSubmit={handleProfileSubmit} className="space-y-4">
            <div>
              <label className={labelClass}>Name</label>
              <input
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Role</label>
              <input
                value={admin?.role || "Administrator"}
                disabled
                readOnly
                className={`${inputClass} bg-beige text-charcoal/60`}
              />
            </div>
            <button type="submit" disabled={savingProfile} className={primaryBtn}>
              {savingProfile ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-3.5 w-3.5" />
                  Save Changes
                </>
              )}
            </button>
          </form>
        </section>

        {/* Change Password */}
        <section className={`${cardClass} h-fit p-6`}>
          <div className="mb-5 flex items-center gap-3 border-b border-gold/15 pb-4">
            <div className="rounded-lg bg-gold/20 p-2 text-gold-700">
              <KeyRound className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-serif text-base font-bold text-maroon">Change Password</h3>
              <p className="text-xs text-charcoal/50">Use a strong, unique password.</p>
            </div>
          </div>

          {passwordMsg && (
            <div
              className={`mb-4 flex items-center gap-2 rounded-lg p-3 text-xs ${
                passwordMsg.type === "success"
                  ? "border border-emerald-200 bg-emerald-50 text-emerald-800"
                  : "border border-rose-200 bg-rose-50 text-rose-800"
              }`}
            >
              {passwordMsg.type === "success" ? (
                <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
              ) : (
                <AlertCircle className="h-4 w-4 shrink-0 text-rose-600" />
              )}
              <span>{passwordMsg.text}</span>
            </div>
          )}

          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            <div>
              <label className={labelClass}>Current Password</label>
              <input
                type="password"
                required
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>New Password</label>
              <input
                type="password"
                required
                minLength={6}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Confirm New Password</label>
              <input
                type="password"
                required
                minLength={6}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className={inputClass}
              />
            </div>
            <button type="submit" disabled={savingPassword} className={primaryBtn}>
              {savingPassword ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  Updating...
                </>
              ) : (
                "Update Password"
              )}
            </button>
          </form>
        </section>
      </div>
    </div>
  );
}
