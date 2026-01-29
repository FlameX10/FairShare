import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, User, Smartphone } from "lucide-react";
import { addFriend } from "../api/friends";
import Button from "../components/Button";
import Card from "../components/Card";
import Input from "../components/Input";
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
    <div className="p-8 bg-gradient-to-br from-dark-50 via-white to-secondary-50 min-h-screen">
      {toast && <Toast message={toast} type={toast.includes("Error") ? "error" : "success"} />}
      <div className="max-w-lg mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="mb-4 flex justify-center">
            <div className="bg-gradient-to-r from-secondary-600 to-secondary-700 p-3 rounded-2xl">
              <User size={32} className="text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent mb-2">
            Add Friend
          </h1>
          <p className="text-dark-600">Create a profile to start sharing expenses</p>
        </div>

        <Card variant="elevated">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Friend Name */}
            <Input
              label="Friend Name"
              type="text"
              name="name"
              placeholder="John Doe"
              value={formData.name}
              onChange={handleChange}
              icon={User}
              required
            />

            {/* UPI ID */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-dark-900 mb-2.5">
                UPI ID <span className="text-dark-500 text-xs font-normal">(Optional)</span>
              </label>
              <div className="relative">
                <Smartphone className="absolute left-3.5 top-3.5 text-dark-400 pointer-events-none" size={18} />
                <input
                  type="text"
                  placeholder="john@upi"
                  name="upiId"
                  value={formData.upiId}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-2.5 border-2 border-dark-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary-200 focus:border-secondary-500 transition-all text-sm bg-white hover:border-dark-400"
                />
              </div>
              <p className="text-xs text-dark-500 mt-2">You can add or update this later</p>
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
              <Plus size={20} />
              Add Friend
            </Button>
          </form>
        </Card>

        {/* Footer Info */}
        <div className="mt-8 text-center text-sm text-dark-600">
          <p>You'll be able to track shared expenses with this friend</p>
        </div>
      </div>
    </div>
  );
};

export default AddFriend;
