import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Plus, Wallet, Tag, Calendar, TrendingUp, TrendingDown } from "lucide-react";
import { addExpense } from "../api/expenses";
import { getFriends } from "../api/friends";
import Button from "../components/Button";
import Card from "../components/Card";
import Input from "../components/Input";
import Toast from "../components/Toast";

const AddExpense = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const friendIdFromUrl = searchParams.get("friendId");

  const [formData, setFormData] = useState({
    friendId: friendIdFromUrl || "",
    amount: "",
    description: "",
    type: "lend",
    datetime: new Date().toISOString().split("T")[0],
  });
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
        setToast("Error loading friends");
      }
    };

    fetchFriends();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!formData.friendId || !formData.amount || !formData.description || !formData.type) {
      setToast("Please fill all required fields");
      setLoading(false);
      return;
    }

    if (isNaN(parseFloat(formData.amount)) || parseFloat(formData.amount) <= 0) {
      setToast("Please enter a valid amount");
      setLoading(false);
      return;
    }

    try {
      await addExpense(
        formData.friendId,
        parseFloat(formData.amount),
        formData.description,
        formData.type,
        formData.datetime
      );
      setToast("Transaction added successfully!");
      setTimeout(() => navigate("/friends"), 1500);
    } catch (error) {
      console.error("Error adding expense:", error);
      setToast("Error: " + (error.response?.data?.message || "Failed to add transaction"));
    } finally {
      setLoading(false);
    }
  };

  const selectedFriendName = friends.find(f => f._id === formData.friendId)?.name;

  return (
    <div className="p-8 bg-gradient-to-br from-dark-50 via-white to-primary-50 min-h-screen">
      <div className="max-w-2xl mx-auto">
        {toast && <Toast message={toast} type={toast.includes("Error") ? "error" : "success"} />}

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent mb-2 flex items-center gap-3">
            <Wallet size={36} />
            Add Transaction
          </h1>
          {selectedFriendName && (
            <p className="text-dark-600 mt-3">Transaction with <span className="font-bold text-primary-600">{selectedFriendName}</span></p>
          )}
        </div>

        <Card variant="elevated">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Friend Selection */}
            <div>
              <label className="block text-sm font-semibold text-dark-900 mb-2.5">
                Select Friend <span className="text-danger-600">*</span>
              </label>
              <select
                name="friendId"
                value={formData.friendId}
                onChange={handleChange}
                required
                className="w-full px-4 py-2.5 border-2 border-dark-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-500 transition-all text-sm bg-white hover:border-dark-400"
              >
                <option value="">Choose a friend...</option>
                {friends.map((friend) => (
                  <option key={friend._id} value={friend._id}>
                    {friend.name} {friend.upiId && `(${friend.upiId})`}
                  </option>
                ))}
              </select>
            </div>

            {/* Transaction Type */}
            <div>
              <label className="block text-sm font-semibold text-dark-900 mb-3">
                Transaction Type <span className="text-danger-600">*</span>
              </label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, type: "lend" })}
                  className={`p-5 rounded-xl border-2 transition-all duration-300 flex flex-col items-center gap-2 ${
                    formData.type === "lend"
                      ? "border-success-500 bg-success-50 shadow-md"
                      : "border-dark-200 bg-dark-50 hover:border-success-300"
                  }`}
                >
                  <TrendingUp className={formData.type === "lend" ? "text-success-600" : "text-dark-600"} size={24} />
                  <p className="font-bold text-dark-900 text-sm">You Lent</p>
                  <p className="text-xs text-dark-600">Friend owes you</p>
                </button>

                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, type: "borrow" })}
                  className={`p-5 rounded-xl border-2 transition-all duration-300 flex flex-col items-center gap-2 ${
                    formData.type === "borrow"
                      ? "border-danger-500 bg-danger-50 shadow-md"
                      : "border-dark-200 bg-dark-50 hover:border-danger-300"
                  }`}
                >
                  <TrendingDown className={formData.type === "borrow" ? "text-danger-600" : "text-dark-600"} size={24} />
                  <p className="font-bold text-dark-900 text-sm">You Borrowed</p>
                  <p className="text-xs text-dark-600">You owe friend</p>
                </button>
              </div>
            </div>

            {/* Amount */}
            <div>
              <label className="block text-sm font-semibold text-dark-900 mb-2.5">
                Amount (₹) <span className="text-danger-600">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-3 text-dark-400 font-semibold text-sm">₹</span>
                <input
                  type="number"
                  name="amount"
                  placeholder="100"
                  value={formData.amount}
                  onChange={handleChange}
                  step="0.01"
                  min="0"
                  required
                  className="w-full pl-8 pr-4 py-2.5 border-2 border-dark-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-500 transition-all text-sm bg-white hover:border-dark-400"
                />
              </div>
            </div>

            {/* Description */}
            <Input
              label="Description"
              type="text"
              name="description"
              placeholder="Dinner, Movie, Groceries, etc"
              value={formData.description}
              onChange={handleChange}
              icon={Tag}
              required
            />

            {/* Date */}
            <div>
              <label className="block text-sm font-semibold text-dark-900 mb-2.5">
                Date
              </label>
              <div className="relative">
                <Calendar className="absolute left-3.5 top-3.5 text-dark-400 pointer-events-none" size={18} />
                <input
                  type="date"
                  name="datetime"
                  value={formData.datetime}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-2.5 border-2 border-dark-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-500 transition-all text-sm bg-white hover:border-dark-400"
                />
              </div>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              variant="primary"
              size="lg"
              disabled={loading}
              loading={loading}
              className="w-full mt-8"
            >
              <Plus size={20} />
              Add Transaction
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default AddExpense;
