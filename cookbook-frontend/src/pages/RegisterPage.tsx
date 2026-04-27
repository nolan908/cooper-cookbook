import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { register, login } from "../api/client";
import { useAuth } from "../context/AuthContext";

export default function RegisterPage() {
  const [step, setStep] = useState(1);
  const { setToken } = useAuth();
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    displayName: "",
    bio: "",
    profilePictureUrl: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const update = (field: string, value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const nextStep = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.username || !form.email || !form.password) {
      setError("Please fill in all fields.");
      return;
    }
    setError("");
    setStep(2);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await register({
        username: form.username,
        email: form.email,
        password: form.password,
        displayName: form.displayName || form.username,
        bio: form.bio,
        profilePictureUrl: form.profilePictureUrl,
      });

      // Auto-login after successful registration
      const loginRes = await login({ username: form.username, password: form.password });
      setToken(loginRes.token);
      navigate("/");
    } catch {
      setError("Registration failed — username or email may already be taken");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center">
      <div className="w-full max-w-sm">
        <h1 className="text-2xl font-bold text-slate-800 mb-6 text-center">
          {step === 1 ? "Create an Account" : "Tell us about yourself"}
        </h1>

        {error && (
          <div className="bg-red-50 text-red-600 text-sm px-3 py-2 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={step === 1 ? nextStep : handleSubmit} className="bg-white shadow-md rounded-lg p-6 space-y-4">
          {step === 1 ? (
            <>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Username</label>
                <input
                  type="text"
                  value={form.username}
                  onChange={(e) => update("username", e.target.value)}
                  className="w-full border border-slate-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => update("email", e.target.value)}
                  className="w-full border border-slate-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
                <input
                  type="password"
                  value={form.password}
                  onChange={(e) => update("password", e.target.value)}
                  className="w-full border border-slate-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full bg-emerald-500 hover:bg-emerald-600 text-white py-2 rounded font-medium transition"
              >
                Next Step
              </button>
            </>
          ) : (
            <>
              <div className="flex flex-col items-center mb-4">
                <div className="w-24 h-24 rounded-full bg-slate-100 border-2 border-dashed border-slate-300 flex items-center justify-center overflow-hidden mb-2">
                  {form.profilePictureUrl ? (
                    <img src={form.profilePictureUrl} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-slate-400 text-xs text-center px-2">No Image</span>
                  )}
                </div>
                <input
                  type="url"
                  placeholder="Profile Picture URL"
                  value={form.profilePictureUrl}
                  onChange={(e) => update("profilePictureUrl", e.target.value)}
                  className="w-full border border-slate-300 rounded px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Display Name</label>
                <input
                  type="text"
                  value={form.displayName}
                  onChange={(e) => update("displayName", e.target.value)}
                  className="w-full border border-slate-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  placeholder={form.username}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Bio</label>
                <textarea
                  value={form.bio}
                  onChange={(e) => update("bio", e.target.value)}
                  rows={3}
                  className="w-full border border-slate-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  placeholder="Share a bit about your cooking style..."
                />
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-600 py-2 rounded font-medium transition"
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-[2] bg-emerald-500 hover:bg-emerald-600 text-white py-2 rounded font-medium transition disabled:opacity-50"
                >
                  {loading ? "Creating..." : "Complete Registration"}
                </button>
              </div>
            </>
          )}
          
          <p className="text-sm text-center text-slate-500">
            Already have an account?{" "}
            <Link to="/login" className="text-emerald-600 hover:underline">Log in</Link>
          </p>
        </form>
      </div>
    </div>
  );
}
