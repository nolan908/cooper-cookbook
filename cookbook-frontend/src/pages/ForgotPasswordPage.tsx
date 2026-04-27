import { useState } from "react";
import { Link } from "react-router-dom";
import { forgotPassword } from "../api/client";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState({ type: "", text: "" });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: "", text: "" });
    try {
      const res = await forgotPassword(email);
      setMessage({ type: "success", text: res.data });
    } catch (err: any) {
      setMessage({ type: "error", text: err.response?.data || "Failed to send reset link." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center">
      <div className="w-full max-w-sm">
        <h1 className="text-2xl font-bold text-slate-800 mb-6 text-center">
          Reset Password
        </h1>
        <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg p-6 space-y-4">
          <p className="text-sm text-slate-500">
            Enter your email address and we'll send you a link to reset your password.
          </p>
          
          {message.text && (
            <div className={`text-sm px-3 py-2 rounded ${message.type === "success" ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-600"}`}>
              {message.text}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-slate-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              required
              placeholder="nolan@example.com"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-emerald-500 hover:bg-emerald-600 text-white py-2 rounded font-medium transition disabled:opacity-50"
          >
            {loading ? "Sending..." : "Send Reset Link"}
          </button>

          <p className="text-sm text-center text-slate-500">
            Remember your password?{" "}
            <Link to="/login" className="text-emerald-600 hover:underline">Log in</Link>
          </p>
        </form>
      </div>
    </div>
  );
}
