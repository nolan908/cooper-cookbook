import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getUserById, updateProfile, updateAccount, deleteUser, verifyPassword } from "../api/client";
import { useAuth } from "../context/AuthContext";
import ImagePicker from "../components/ImagePicker";

export default function ProfilePage() {
  const { userId, logOut } = useAuth();
  const navigate = useNavigate();

  const [profileForm, setProfileForm] = useState({
    displayName: "",
    bio: "",
    profilePictureUrl: "",
  });

  const [accountForm, setAccountForm] = useState({
    newPassword: "",
    confirmPassword: "",
  });

  const [isPasswordVerified, setIsPasswordVerified] = useState(false);
  const [verificationInput, setVerificationInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [imgError, setImgError] = useState(false);
  const [cooldown, setCooldown] = useState(0);

  useEffect(() => {
    if (cooldown > 0) {
      const timer = setTimeout(() => setCooldown(cooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [cooldown]);


  useEffect(() => {
    if (userId) {
      getUserById(userId).then((res) => {
        setProfileForm({
          displayName: res.data.displayName || "",
          bio: res.data.bio || "",
          profilePictureUrl: res.data.profilePictureUrl || "",
        });
      });
    }
  }, [userId]);

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId) return;
    setLoading(true);
    setImgError(false);
    const finalForm = {
      ...profileForm,
      profilePictureUrl: profileForm.profilePictureUrl || ""
    };
    try {
      await updateProfile(userId, finalForm);
      setProfileForm(finalForm);
      setMessage({ type: "success", text: "Identity updated!" });
    } catch {
      setMessage({ type: "error", text: "Update failed." });
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyCurrentPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId) return;
    setLoading(true);
    setMessage({ type: "", text: "" });
    try {
      const res = await verifyPassword(userId, verificationInput);
      if (res.data === true) {
        setIsPasswordVerified(true);
      } else {
        setMessage({ type: "error", text: "Invalid password. Please try again." });
      }
    } catch {
      setMessage({ type: "error", text: "Invalid password. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  const handleAccountUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId) return;
    if (accountForm.newPassword && accountForm.newPassword !== accountForm.confirmPassword) {
      return setMessage({ type: "error", text: "Passwords do not match." });
    }

    setLoading(true);
    try {
      await updateAccount(userId, {
        oldPassword: verificationInput,
        newPassword: accountForm.newPassword
      });
      setMessage({ type: "success", text: "Password updated!" });
      setAccountForm({ newPassword: "", confirmPassword: "" });
      setIsPasswordVerified(false);
      setVerificationInput("");
    } catch (err: any) {
      setMessage({ type: "error", text: "Update failed — check your inputs." });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!userId) return;
    if (!window.confirm("Are you SURE you want to delete your account? This cannot be undone.")) return;

    try {
      await deleteUser(userId);
      logOut();
      navigate("/register");
    } catch {
      setMessage({ type: "error", text: "Failed to delete account." });
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-8 text-left">
      <h1 className="text-4xl font-black italic text-fw-navy mb-10 border-b-2 border-fw-navy/10 pb-6" style={{ fontFamily: 'var(--font-funky)' }}>Chef Profile</h1>

      {message.text && (
        <div className={`mb-8 p-5 rounded-2xl font-black text-sm border-2 border-fw-navy shadow-sm animate-in fade-in slide-in-from-top-2 ${message.type === "success" ? "bg-fw-teal text-white" : "bg-fw-salmon text-white"}`}>
          {message.text}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Left Column: Visual Profile */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white rounded-[2.5rem] p-8 border border-fw-navy/10 shadow-lg flex flex-col items-center text-center">
            <div className="w-32 h-32 rounded-full bg-fw-cream border-2 border-fw-navy/10 overflow-hidden mb-6 relative group shadow-inner flex items-center justify-center">
              {profileForm.profilePictureUrl && !imgError ? (
                <img
                  src={profileForm.profilePictureUrl}
                  alt="PFP"
                  className="w-full h-full object-cover transition-transform group-hover:scale-110"
                  onError={() => setImgError(true)}
                />
              ) : (
              <div className="w-full h-full bg-fw-navy/5 flex items-center justify-center text-fw-navy/20">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-16 h-16">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
              </svg>
              </div>
              )}
              </div>            <h2 className="text-3xl font-black italic text-fw-navy leading-none line-clamp-2 break-words w-full" style={{ fontFamily: 'var(--font-funky)' }}>
              {profileForm.displayName || "Unknown Chef"}
            </h2>
            <p className="text-fw-navy/40 font-bold text-[10px] tracking-widest mt-3">Culinary Artist</p>
            <p className="text-fw-navy/60 text-sm mt-6 italic font-serif leading-relaxed px-2 break-words overflow-hidden w-full">
              {profileForm.bio || "No bio yet. Tell us about your kitchen adventures!"}
            </p>
          </div>
        </div>

        {/* Right Column: Forms */}
        <div className="lg:col-span-2 space-y-10">
          {/* Profile Form */}
          <section className="bg-white rounded-[2.5rem] p-10 border border-fw-navy/10 shadow-lg">
            <h3 className="text-2xl font-black italic text-fw-navy mb-10 flex items-center gap-4" style={{ fontFamily: 'var(--font-funky)' }}>
              <span className="w-2 h-8 bg-fw-salmon rounded-full"></span>
              Public Identity
            </h3>
            <form onSubmit={handleProfileUpdate} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <label className="block text-[11px] font-black text-fw-navy/40 tracking-widest mb-3">Display Name</label>
                  <input
                    type="text" value={profileForm.displayName}
                    onChange={e => setProfileForm({ ...profileForm, displayName: e.target.value })}
                    className="w-full border-2 border-fw-navy/10 rounded-2xl px-5 py-4 text-sm bg-fw-cream focus:bg-white focus:border-fw-teal outline-none transition-all font-bold" />
                </div>
                <ImagePicker
                  label="Profile Identity"
                  value={profileForm.profilePictureUrl}
                  onChange={(val) => {
                    setProfileForm({ ...profileForm, profilePictureUrl: val });
                    setImgError(false);
                  }}
                  type="pfp"
                  hidePreview={true}
                />
              </div>
              <div>
                <label className="block text-[11px] font-black text-fw-navy/40 tracking-widest mb-3">Chef Bio</label>
                <textarea
                  value={profileForm.bio}
                  onChange={e => setProfileForm({ ...profileForm, bio: e.target.value })}
                  rows={4}
                  className="w-full border-2 border-fw-navy/10 rounded-2xl px-5 py-4 text-sm bg-fw-cream focus:bg-white focus:border-fw-teal outline-none transition-all font-bold font-serif italic" placeholder="Tell us about your culinary journey..." />
              </div>
              <div className="flex justify-end pt-4">
                <button
                  type="submit" disabled={loading}
                  className="bg-fw-navy text-white px-12 py-4 rounded-full font-black text-[10px] tracking-widest transition hover:scale-105 active:scale-95 disabled:opacity-30 shadow-lg" >
                  Save Identity
                </button>
              </div>
            </form>
          </section>

          {/* Account Form - Multi-Step Logic */}
          <section className="bg-white rounded-[2.5rem] p-10 border border-fw-navy/10 shadow-lg">
            <h3 className="text-2xl font-black italic text-fw-navy mb-10 flex items-center gap-4" style={{ fontFamily: 'var(--font-funky)' }}>
              <span className="w-2 h-8 bg-fw-yellow rounded-full"></span>
              Security Management
            </h3>

            {!isPasswordVerified ? (
              <form onSubmit={handleVerifyCurrentPassword} className="space-y-6">
                <p className="text-sm font-bold text-fw-navy opacity-60 tracking-tight italic">Verify current password to access security tools.</p>
                <div>
                  <label className="block text-[11px] font-black text-fw-navy/40 tracking-widest mb-3">Password</label>
                  <input
                    type="password" value={verificationInput}
                    onChange={e => setVerificationInput(e.target.value)}
                    className="w-full border-2 border-fw-navy/10 rounded-2xl px-5 py-4 text-sm bg-fw-cream focus:bg-white focus:border-fw-yellow outline-none transition-all font-bold" required
                  />
                </div>
                <button
                  type="submit" disabled={loading || !verificationInput}
                  className="w-full bg-fw-yellow text-fw-navy px-12 py-4 rounded-full font-black text-[10px] tracking-widest transition hover:scale-[1.02] active:scale-95 disabled:opacity-30 shadow-md" >
                  Confirm Identity
                </button>
              </form>
            ) : (
              <form onSubmit={handleAccountUpdate} className="space-y-8 animate-in fade-in zoom-in-95 duration-300">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <label className="block text-[11px] font-black text-fw-navy/40 tracking-widest mb-3">New Password</label>
                    <input
                      type="password" value={accountForm.newPassword}
                      onChange={e => setAccountForm({ ...accountForm, newPassword: e.target.value })}
                      className="w-full border-2 border-fw-navy/10 rounded-2xl px-5 py-4 text-sm bg-fw-cream focus:bg-white focus:border-fw-teal outline-none transition-all font-bold" placeholder="Min 6 characters" required
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-black text-fw-navy/40 tracking-widest mb-3">Confirm Password</label>
                    <input
                      type="password" value={accountForm.confirmPassword}
                      onChange={e => setAccountForm({ ...accountForm, confirmPassword: e.target.value })}
                      className="w-full border-2 border-fw-navy/10 rounded-2xl px-5 py-4 text-sm bg-fw-cream focus:bg-white focus:border-fw-teal outline-none transition-all font-bold" required
                    />
                  </div>
                </div>
                <div className="flex flex-col md:flex-row justify-between items-center gap-6 pt-6 border-t border-fw-navy/5">
                  <button
                    type="button" onClick={handleDeleteAccount}
                    className="text-fw-salmon hover:underline font-black text-[10px] tracking-[0.2em] transition order-2 md:order-1" >
                    Terminate Account
                  </button>
                  <button
                    type="submit" disabled={loading || !accountForm.newPassword}
                    className="w-full md:w-auto bg-fw-navy text-white px-12 py-4 rounded-full font-black text-[10px] tracking-widest transition hover:scale-105 active:scale-95 shadow-xl order-1 md:order-2" >
                    Set New Password
                  </button>
                </div>
                <button
                  type="button" onClick={() => {
                    setIsPasswordVerified(false);
                    setVerificationInput("");
                  }}
                  className="w-full text-center text-[9px] font-bold text-fw-navy/30 hover:text-fw-navy transition-colors" >
                  Cancel & Lock
                </button>
              </form>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
