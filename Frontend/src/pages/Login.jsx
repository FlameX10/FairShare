import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import Toast from "../components/Toast";

const Login = () => {
  const navigate = useNavigate();
  const { login, loading } = useAuth();

  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [toast, setToast] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!formData.email || !formData.password) {
      setError("All fields are required");
      return;
    }

    try {
      await login(formData.email, formData.password);
      setToast("Login successful!");
      setTimeout(() => navigate("/dashboard"), 1200);
    } catch (err) {
      setError(err.message || "Login failed");
      setToast("Error: " + (err.message || "Login failed"));
    }
  };

  return (
    <div className="min-h-screen w-full bg-white/95 flex items-center justify-center">
      {/* small component-scoped styles for float animation + slow rotate */}
      <style>{`
        @keyframes floatY {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-18px); }
          100% { transform: translateY(0px); }
        }
        @keyframes slowRotate {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>

      {/* Container - two columns */}
      <div className="w-full max-w-6xl mx-auto px-6 py-12 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">

        {/* Left: Illustration + soft gradient blobs */}
        <div className="relative lg:col-span-7 flex items-center justify-center">
          {/* soft background radial blobs */}
          <div
            aria-hidden
            className="absolute -left-24 -top-12 w-72 h-72 rounded-full"
            style={{
              background:
                "radial-gradient(circle at 30% 30%, rgba(255,200,100,0.08), transparent 25%), radial-gradient(circle at 70% 70%, rgba(99,102,241,0.12), transparent 35%)",
              filter: "blur(48px)",
              transform: "translateZ(0)",
            }}
          />

          <div
            aria-hidden
            className="absolute -right-16 bottom-8 w-60 h-60 rounded-full"
            style={{
              background:
                "radial-gradient(circle at 60% 40%, rgba(99,102,241,0.10), transparent 25%)",
              filter: "blur(60px)",
              transform: "translateZ(0)",
              animation: "slowRotate 40s linear infinite",
            }}
          />

          {/* Illustration wrapper: float effect */}
          <div
            className="relative w-full max-w-md md:max-w-lg"
            style={{ animation: "floatY 6s ease-in-out infinite" }}
          >
            {/* Prefer to place a real hero image in public/assets/hero.png
                If not present, the inline svg below will show as fallback */}
            <img
              src="/assets/hero.png"
              alt="Hero illustration"
              onError={(e) => {
                // if hero.png missing, show inline svg fallback
                e.currentTarget.style.display = "none";
                const sb = document.getElementById("fallback-hero");
                if (sb) sb.style.display = "block";
              }}
              className="w-full h-auto select-none pointer-events-none"
            />

            {/* Inline SVG fallback (initially hidden) */}
            <div id="fallback-hero" style={{ display: "none" }}>
              <svg viewBox="0 0 600 400" className="w-full h-auto">
                <defs>
                  <linearGradient id="g1" x1="0" x2="1">
                    <stop offset="0" stopColor="#7c3aed" />
                    <stop offset="1" stopColor="#06b6d4" />
                  </linearGradient>
                </defs>
                <rect width="100%" height="100%" fill="transparent" />
                {/* stylized person illustration (simple, modern) */}
                <g transform="translate(120,40)">
                  <ellipse cx="180" cy="300" rx="160" ry="40" fill="#f3f4f6" opacity="0.6" />
                  <g transform="translate(80,0)">
                    <circle cx="120" cy="80" r="48" fill="#ffe8d6" />
                    <path d="M80 140 q80 100 160 0" fill="#111827" opacity="0.06" />
                    <rect x="60" y="120" rx="40" ry="40" width="160" height="120" fill="#2563eb" opacity="0.12" />
                    <circle cx="220" cy="60" r="12" fill="#111827" opacity="0.15" />
                    <g transform="translate(0,0)" fill="#111827" opacity="0.9">
                      <path d="M120 130 q-30 -40 -60 -40 q30 -10 60 20 q30 -30 60 -20 q-30 0 -60 40z" fill="#1f2937" opacity="0.08" />
                    </g>
                  </g>
                </g>
              </svg>
            </div>
          </div>
        </div>

        {/* Right: Card */}
        <div className="lg:col-span-5 flex items-center justify-center">
          <div
            className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8 relative transform transition-transform duration-300 hover:-translate-y-1"
            style={{
              boxShadow: "0 12px 40px rgba(16,24,40,0.15), inset 0 1px 0 rgba(255,255,255,0.6)",
              border: "1px solid rgba(16,24,40,0.04)",
              background: "linear-gradient(180deg, rgba(255,255,255,0.9), rgba(245,247,250,0.96))",
            }}
          >
            {/* subtle top glow */}
            <div
              aria-hidden
              className="absolute -top-8 -left-8 w-32 h-32 rounded-full"
              style={{
                background: "radial-gradient(circle at 40% 40%, rgba(99,102,241,0.12), transparent 35%)",
                filter: "blur(30px)",
              }}
            />

            {/* Header */}
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-lg bg-gradient-to-br from-indigo-500 to-cyan-400 shadow-md mb-3">
                <svg className="w-7 h-7 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2" />
                </svg>
              </div>

              <h2 className="text-2xl font-semibold text-slate-800">Welcome Back</h2>
              <p className="text-sm text-slate-500 mt-1">Sign in to continue</p>
            </div>

            {/* Toast */}
            {toast && <Toast message={toast} onClose={() => setToast("")} />}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* email */}
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-2">Enter Email</label>
                <div className="relative">
                  <input
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="you@example.com"
                    aria-label="email"
                    className="w-full h-12 px-4 pr-12 rounded-xl border border-slate-200 bg-white text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-300 transition"
                  />
                  <button type="button" className="absolute right-3 top-3 text-slate-400 text-sm" aria-hidden>
                    ✕
                  </button>
                </div>
              </div>

              {/* password */}
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-2">Password</label>
                <div className="relative">
                  <input
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    aria-label="password"
                    className="w-full h-12 px-4 pr-12 rounded-xl border border-slate-200 bg-white text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-300 transition"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-slate-500 hover:text-slate-700 transition"
                    aria-label={showPassword ? "hide password" : "show password"}
                  >
                    {showPassword ? "🙈" : "👁️"}
                  </button>
                </div>
                <div className="text-right mt-2">
                  <a href="#" className="text-xs text-slate-400 hover:text-slate-600">Recover Password?</a>
                </div>
              </div>

              {/* error */}
              {error && <div className="text-sm text-red-600">{error}</div>}

              {/* sign in */}
              <button
                type="submit"
                disabled={loading}
                className="w-full h-12 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-500 text-white font-medium shadow-md hover:shadow-lg transform active:scale-[0.995] transition"
              >
                {loading ? "Signing..." : "Sign In"}
              </button>
            </form>

            {/* Divider */}
            <div className="flex items-center mt-6 mb-4">
              <div className="flex-1 h-px bg-slate-200" />
              <div className="px-3 text-xs text-slate-400">Or continue with</div>
              <div className="flex-1 h-px bg-slate-200" />
            </div>

            {/* social */}
            <div className="flex items-center justify-between gap-4">
              <button
                className="flex-1 h-10 rounded-lg border border-slate-200 bg-white text-sm shadow-sm hover:shadow transition flex items-center justify-center gap-3"
                aria-label="continue with google"
                type="button"
              >
                <img src="data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='18' height='18'><rect width='18' height='18' fill='none'/><text x='0' y='14' font-size='12'>G</text></svg>" alt="" className="w-4 h-4" />
                Google
              </button>

              <button
                className="flex-1 h-10 rounded-lg border border-slate-200 bg-white text-sm shadow-sm hover:shadow transition flex items-center justify-center gap-3"
                aria-label="continue with apple"
                type="button"
              >
                <svg className="w-4 h-4 text-slate-600" viewBox="0 0 24 24" fill="currentColor"><path d="M16.365 1.43c-.77.93-1.7 1.62-2.88 1.62-1.15 0-2.04-.65-2.9-.65-1.09 0-2.28.68-3.27 1.4-1.9 1.5-3.66 4.09-3.66 7.85 0 5.18 3.66 8.96 6.95 8.96 1.12 0 1.94-.38 2.9-.38.84 0 1.6.38 2.88.38 1.32 0 3.44-1.22 5.36-3.88-1.6-1.05-2.5-2.47-2.5-4.05 0-2.14 1.2-3.5 2.6-4.57-1.96-.66-3.17-3.07-3.69-4.96z"/></svg>
                Apple
              </button>

              <button
                className="flex-1 h-10 rounded-lg border border-slate-200 bg-white text-sm shadow-sm hover:shadow transition flex items-center justify-center gap-3"
                aria-label="continue with facebook"
                type="button"
              >
                <svg className="w-4 h-4 text-slate-600" viewBox="0 0 24 24" fill="currentColor"><path d="M22 12.07C22 6.49 17.52 2 11.95 2S2 6.49 2 12.07C2 17.05 5.66 21.13 10.44 21.93v-6.93H8.07v-2.9h2.37V9.69c0-2.35 1.4-3.65 3.54-3.65 1.02 0 2.08.18 2.08.18v2.29h-1.17c-1.16 0-1.52.72-1.52 1.46v1.76h2.6l-.42 2.9h-2.18v6.93C18.34 21.13 22 17.05 22 12.07z"/></svg>
                Facebook
              </button>
            </div>

            {/* small footer */}
            <p className="text-center text-xs text-slate-400 mt-4">
              New here? <Link to="/register" className="text-indigo-600 font-medium">Create account</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
