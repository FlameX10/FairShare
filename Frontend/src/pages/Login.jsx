import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff, ArrowRight } from "lucide-react";
import useAuth from "../hooks/useAuth";
import Toast from "../components/Toast";
import Button from "../components/Button";
import Input from "../components/Input";

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
      setTimeout(() => navigate("/dashboard"), 1500);
    } catch (err) {
      setError(err.message || "Login failed");
      setToast("Error: " + (err.message || "Login failed"));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50 flex items-center justify-center px-4 py-12">
      {toast && <Toast message={toast} type={toast.includes("Error") ? "error" : "success"} />}
      
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="mb-4 flex justify-center">
            <div className="bg-gradient-to-r from-primary-600 to-primary-700 p-3 rounded-2xl">
              <Mail size={32} className="text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent mb-2">
            Welcome Back
          </h1>
          <p className="text-dark-600">Sign in to FairShare and manage your expenses</p>
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
                  className="w-full pl-10 pr-10 py-2.5 border-2 border-dark-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-500 transition-all text-sm bg-white hover:border-dark-400"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-3.5 text-dark-400 hover:text-primary-600 transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
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
              Sign In
              <ArrowRight size={18} />
            </Button>
          </form>

          {/* Divider */}
          <div className="my-6 relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-dark-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-3 bg-white text-dark-500 font-medium">Don't have an account?</span>
            </div>
          </div>

          {/* Register Link */}
          <Link to="/register">
            <Button
              type="button"
              variant="outline"
              size="lg"
              className="w-full"
            >
              Create Account
            </Button>
          </Link>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-sm text-dark-600">
          <p>By signing in, you agree to our Terms of Service and Privacy Policy</p>
        </div>
      </div>
    </div>
  );
};

export default Login;
