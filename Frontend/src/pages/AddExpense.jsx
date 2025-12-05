import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { addExpense } from "../api/expenses";
import { getFriends } from "../api/friends";
import Button from "../components/Button";
import Card from "../components/Card";
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
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="max-w-2xl mx-auto">
        {toast && <Toast message={toast} type={toast.includes("Error") ? "error" : "success"} />}

        <h1 className="text-3xl font-bold text-gray-800 mb-2">Add Transaction</h1>
        {selectedFriendName && (
          <p className="text-gray-600 mb-8">Transaction with <span className="font-semibold">{selectedFriendName}</span></p>
        )}

        <Card>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Friend Selection */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Friend <span className="text-red-500">*</span>
              </label>
              <select
                name="friendId"
                value={formData.friendId}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all text-base"
              >
                <option value="">Select a friend</option>
                {friends.map((friend) => (
                  <option key={friend._id} value={friend._id}>
                    {friend.name} ({friend.upiId})
                  </option>
                ))}
              </select>
            </div>

            {/* Transaction Type */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Transaction Type <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, type: "lend" })}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    formData.type === "lend"
                      ? "border-green-500 bg-green-50"
                      : "border-gray-300 bg-gray-50 hover:border-green-300"
                  }`}
                >
                  <p className="text-2xl mb-2">💰</p>
                  <p className="font-semibold text-gray-800">You Lent</p>
                  <p className="text-xs text-gray-600">Friend owes you</p>
                </button>

                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, type: "borrow" })}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    formData.type === "borrow"
                      ? "border-red-500 bg-red-50"
                      : "border-gray-300 bg-gray-50 hover:border-red-300"
                  }`}
                >
                  <p className="text-2xl mb-2">💳</p>
                  <p className="font-semibold text-gray-800">You Borrowed</p>
                  <p className="text-xs text-gray-600">You owe friend</p>
                </button>
              </div>
            </div>

            {/* Amount */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Amount (₹) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="amount"
                placeholder="100"
                value={formData.amount}
                onChange={handleChange}
                step="0.01"
                min="0"
                required
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all text-base"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Description <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="description"
                placeholder="Dinner, Movie, Groceries, etc"
                value={formData.description}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all text-base"
              />
            </div>

            {/* Date */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Date
              </label>
              <input
                type="date"
                name="datetime"
                value={formData.datetime}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all text-base"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold py-3 rounded-lg hover:shadow-lg hover:shadow-blue-500/50 transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-lg mt-8"
            >
              {loading ? (
                <>
                  <svg className="w-6 h-6 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Adding...
                </>
              ) : (
                <>
                  <span>Add Transaction</span>
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                </>
              )}
            </button>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default AddExpense;
