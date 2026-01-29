import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { Mail, Lock, User, Eye, EyeOff, CheckCircle2, ArrowRight } from "lucide-react";
import Toast from "../components/Toast";
import Button from "../components/Button";
import Input from "../components/Input";

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [toast, setToast] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const API_URL = import.meta.env.VITE_API_URL;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!formData.name || !formData.email || !formData.password) {
      setError("All fields are required");
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters");
      setLoading(false);
      return;
    }

    try {
      console.log("[REGISTER] API_URL:", API_URL);
      console.log("[REGISTER] Sending request to:", `${API_URL}/api/auth/register`);
      
      const response = await axios.post(
        `${API_URL}/api/auth/register`,
        formData,
        { timeout: 60000 }
      );

      console.log("[REGISTER] Success:", response.data);

      if (response.data.success) {
        localStorage.setItem("pendingEmail", formData.email);
        setToast("✅ Check your email for OTP!");
        setLoading(false);
        setTimeout(() => navigate("/verify-otp", { state: { email: formData.email } }), 2000);
      }
    } catch (err) {
      console.error("[REGISTER] Full Error Details:", {
        message: err.message,
        status: err.response?.status,
        statusText: err.response?.statusText,
        data: err.response?.data,
        url: err.config?.url,
        method: err.config?.method,
        code: err.code
      });
      setLoading(false);
      
      if (!err.response) {
        setError("Backend unreachable. Check your internet connection. Error: " + err.message);
      } else {
        setError(err.response?.data?.error || "Registration failed");
      }
      setToast("❌ " + (err.response?.data?.error || "Error"));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50 flex items-center justify-center px-4 py-12">
      {toast && <Toast message={toast} type={toast.includes("✅") ? "success" : "error"} />}
      
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="mb-4 flex justify-center">
            <div className="bg-gradient-to-r from-secondary-600 to-secondary-700 p-3 rounded-2xl">
              <User size={32} className="text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent mb-2">
            Get Started
          </h1>
          <p className="text-dark-600">Create your FairShare account in seconds</p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-2xl shadow-lg-custom border border-dark-100 p-8 backdrop-blur-sm">
          {error && (
            <div className="mb-6 bg-danger-50 border border-danger-200 text-danger-700 px-4 py-3 rounded-xl text-sm font-medium flex items-center gap-2">
              <span>⚠</span>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Name */}
            <Input
              label="Full Name"
              type="text"
              name="name"
              icon={User}
              placeholder="John Doe"
              value={formData.name}
              onChange={handleChange}
            />

            {/* Email */}
            <Input
              label="Email Address"
              type="email"
              name="email"
              icon={Mail}
              placeholder="you@example.com"
              value={formData.email}
              onChange={handleChange}
            />

            {/* Password */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-dark-900 mb-2.5">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-3.5 text-dark-400 pointer-events-none" size={18} />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full pl-10 pr-10 py-2.5 border-2 border-dark-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary-200 focus:border-secondary-500 transition-all text-sm bg-white hover:border-dark-400"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-3.5 text-dark-400 hover:text-secondary-600 transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              <div className="flex items-center gap-1.5 text-dark-500 text-xs mt-2 font-medium">
                <CheckCircle2 size={14} />
                Minimum 6 characters
              </div>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              variant="primary"
              size="lg"
              disabled={loading}
              loading={loading}
              className="w-full"
            >
              Create Account
              <ArrowRight size={18} />
            </Button>
          </form>

          {/* Divider */}
          <div className="my-6 relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-dark-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-3 bg-white text-dark-500 font-medium">Already have an account?</span>
            </div>
          </div>

          {/* Login Link */}
          <Link to="/login">
            <Button
              type="button"
              variant="outline"
              size="lg"
              className="w-full"
            >
              Sign In
            </Button>
          </Link>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-sm text-dark-600">
          <p>By creating an account, you agree to our Terms of Service and Privacy Policy</p>
        </div>
      </div>
    </div>
  );
};

export default Register;
