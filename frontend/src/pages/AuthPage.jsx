import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash, FaExclamationCircle } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";

const AuthPage = ({ mode }) => {
  const isSignup = mode === "signup";
  const { login, signup } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      if (isSignup) await signup(form.name, form.email, form.password);
      else await login(form.email, form.password);
      navigate("/");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-800 outline-none focus:border-brand-green focus:ring-2 focus:ring-brand-green/15 transition";

  return (
    <section className="bg-brand-green/10 min-h-[calc(100vh-72px)] flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-4xl grid md:grid-cols-2 bg-white rounded-3xl shadow-lg overflow-hidden border border-gray-100">
        {/* Left brand panel (desktop only) */}
        <div className="hidden md:flex flex-col justify-between bg-brand-green text-white p-10">
          <div>
            <span className="inline-block text-xs font-medium tracking-wide uppercase bg-white/10 px-4 py-1.5 rounded-full mb-6">
              Samadhaan Setu
            </span>
            <h2 className="text-3xl font-bold leading-tight mb-3">
              Your voice, delivered to the administration.
            </h2>
            <p className="text-white/70 text-sm leading-relaxed">
              Report potholes, garbage, water leaks and more. Track every
              complaint until it is resolved.
            </p>
          </div>
          <p className="text-xs text-white/50">आपकी आवाज़, प्रशासन तक</p>
        </div>

        {/* Form */}
        <div className="p-6 sm:p-10">
          <h1 className="text-2xl font-bold text-gray-900 mb-1">
            {isSignup ? "Create your account" : "Welcome back"}
          </h1>
          <p className="text-sm text-gray-500 mb-6">
            {isSignup
              ? "Sign up to report and track civic issues."
              : "Log in to track your complaints."}
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {isSignup && (
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                  Full name
                </label>
                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  required
                  autoComplete="name"
                  placeholder="Your name"
                  className={inputClass}
                />
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                required
                autoComplete="email"
                placeholder="you@email.com"
                className={inputClass}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  required
                  minLength={isSignup ? 8 : undefined}
                  autoComplete={isSignup ? "new-password" : "current-password"}
                  placeholder={isSignup ? "At least 8 characters" : "Your password"}
                  className={`${inputClass} pr-11`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-brand-green"
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>

            {error && (
              <div className="flex items-start gap-2 px-3 py-2.5 rounded-xl bg-red-50 border border-red-100 text-red-600 text-xs sm:text-sm">
                <FaExclamationCircle className="mt-0.5 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full min-h-[48px] bg-brand-green text-white font-semibold text-sm rounded-xl hover:bg-brand-green/90 active:scale-[0.98] transition disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading
                ? "Please wait..."
                : isSignup
                ? "Create account"
                : "Log in"}
            </button>
          </form>

          <p className="text-sm text-gray-500 text-center mt-6">
            {isSignup ? "Already have an account?" : "New to Samadhaan Setu?"}{" "}
            <Link
              to={isSignup ? "/login" : "/signup"}
              className="text-brand-green font-semibold hover:underline"
            >
              {isSignup ? "Log in" : "Sign up"}
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
};

export default AuthPage;