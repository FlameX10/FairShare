import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Loader } from "lucide-react";
import { addFriend } from "../api/friends";
import Button from "../components/Button";
import Card from "../components/Card";
import Toast from "../components/Toast";

const AddFriend = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ name: "", upiId: "" });
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!formData.name) {
      setToast("Friend name is required");
      setLoading(false);
      return;
    }

    try {
      await addFriend(formData.name, formData.upiId || null);
      setToast("Friend added successfully!");
      setTimeout(() => navigate("/friends"), 1500);
    } catch (error) {
      setToast("Error: " + (error.response?.data?.message || "Failed to add friend"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      {toast && <Toast message={toast} type={toast.includes("Error") ? "error" : "success"} />}
      <div className="max-w-md mx-auto">
        <Card>
          <h1 className="text-2xl font-bold mb-6 text-gray-800">Add Friend</h1>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Friend Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="John Doe"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all text-base"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                UPI ID <span className="text-gray-500 text-xs">(Optional)</span>
              </label>
              <input
                type="text"
                placeholder="john@upi"
                name="upiId"
                value={formData.upiId}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all text-base"
              />
              <p className="text-xs text-gray-500 mt-2">You can add this later</p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold py-3 rounded-lg hover:shadow-lg hover:shadow-blue-500/50 transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-lg"
            >
              {loading ? (
                <>
                  <Loader className="w-6 h-6 animate-spin" />
                  Adding...
                </>
              ) : (
                <>
                  <Plus size={24} />
                  Add Friend
                </>
              )}
            </button>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default AddFriend;
