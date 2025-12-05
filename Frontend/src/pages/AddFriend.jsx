import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { addFriend } from "../api/friends";
import Input from "../components/Input";
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

    try {
      await addFriend(formData.name, formData.upiId);
      setToast("Friend added successfully!");
      setTimeout(() => navigate("/friends"), 1500);
    } catch (error) {
      setToast("Error: " + (error.response?.data?.message || "Failed to add friend"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {toast && <Toast message={toast} type={toast.includes("Error") ? "error" : "success"} />}
      <div className="max-w-md mx-auto">
        <Card>
          <h1 className="text-2xl font-bold mb-6">Add Friend</h1>
          <form onSubmit={handleSubmit}>
            <Input
              label="Friend Name"
              placeholder="John Doe"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
            <Input
              label="UPI ID"
              placeholder="john@upi"
              name="upiId"
              value={formData.upiId}
              onChange={handleChange}
              required
            />
            <Button type="submit" loading={loading} className="w-full">
              Add Friend
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default AddFriend;
