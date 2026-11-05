import { Save, KeyRound } from "lucide-react";
import PageHeader from "@/components/admin/PageHeader";
import { inputClass, labelClass, cardClass, primaryBtn } from "@/components/admin/ui";

export default function ProfilePage() {
  return (
    <div className="space-y-6">
      <PageHeader eyebrow="Account" title="My Profile" />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <section className={`${cardClass} p-6`}>
          <div className="mb-5 flex items-center gap-4 border-b border-gold/15 pb-4">
            <span className="flex h-14 w-14 items-center justify-center rounded-full bg-maroon font-serif text-xl font-bold text-gold">
              A
            </span>
            <div>
              <h3 className="font-serif text-base font-bold text-maroon">Account Details</h3>
              <p className="text-xs text-charcoal/50">Update your name and email.</p>
            </div>
          </div>
          <div className="space-y-4">
            <div>
              <label className={labelClass}>Name</label>
              <input defaultValue="Admin" className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Email</label>
              <input type="email" defaultValue="admin@charmika.com" className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Role</label>
              <input value="Administrator" disabled readOnly className={`${inputClass} bg-beige text-charcoal/60`} />
            </div>
            <button type="button" className={primaryBtn}>
              <Save className="h-3.5 w-3.5" />
              Save Changes
            </button>
          </div>
        </section>

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
          <div className="space-y-4">
            <div>
              <label className={labelClass}>Current Password</label>
              <input type="password" className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>New Password</label>
              <input type="password" className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Confirm New Password</label>
              <input type="password" className={inputClass} />
            </div>
            <button type="button" className={primaryBtn}>
              Update Password
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}