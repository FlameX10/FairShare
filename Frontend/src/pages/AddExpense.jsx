import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { addExpense } from "../api/expenses";
import { getFriends } from "../api/friends";
import Input from "../components/Input";
import Button from "../components/Button";
import Card from "../components/Card";
import Toast from "../components/Toast";

const AddExpense = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ friendId: "", amount: "", description: "" });
  const [friends, setFriends] = useState([]);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState("");

  useEffect(() => {
    const fetchFriends = async () => {
      try {
        const response = await getFriends();
        setFriends(response.data);
      } catch (error) {
        console.error("Error fetching friends:", error);
      }
    };

    fetchFriends();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await addExpense(formData.friendId, formData.amount, formData.description);
      setToast("Expense added successfully!");
      setTimeout(() => navigate("/expenses"), 1500);
    } catch (error) {
      setToast("Error: " + (error.response?.data?.message || "Failed to add expense"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {toast && <Toast message={toast} type={toast.includes("Error") ? "error" : "success"} />}
      <div className="max-w-md mx-auto">
        <Card>
          <h1 className="text-2xl font-bold mb-6">Add Expense</h1>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Friend</label>
              <select
                name="friendId"
                value={formData.friendId}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select a friend</option>
                {friends.map((friend) => (
                  <option key={friend._id} value={friend._id}>
                    {friend.name}
                  </option>
                ))}
              </select>
            </div>

            <Input
              label="Amount (₹)"
              type="number"
              placeholder="100"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              required
            />
            <Input
              label="Description"
              placeholder="Dinner, Coffee, etc"
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
            />
            <Button type="submit" loading={loading} className="w-full">
              Add Expense
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default AddExpense;
