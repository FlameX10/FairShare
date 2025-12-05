import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { sendUpiRequest } from "../api/upi";
import { getFriends, updateFriendUpiId } from "../api/friends";
import Button from "../components/Button";
import Card from "../components/Card";
import Toast from "../components/Toast";

const SendUPI = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ friendId: "", amount: "", note: "" });
  const [friends, setFriends] = useState([]);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState("");
  const [addingUpi, setAddingUpi] = useState(false);
  const [upiModal, setUpiModal] = useState({ show: false, friendId: null, friendName: "", upiId: "" });

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
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Check if selected friend has UPI ID
    const selectedFriend = friends.find(f => f._id === formData.friendId);
    
    if (!selectedFriend?.upiId) {
      setUpiModal({
        show: true,
        friendId: formData.friendId,
        friendName: selectedFriend?.name,
        upiId: "",
      });
      return;
    }

    setLoading(true);

    try {
      await sendUpiRequest(formData.friendId, formData.amount, formData.note);
      setToast("UPI request sent!");
      setTimeout(() => navigate("/upi"), 1500);
    } catch (error) {
      setToast("Error: " + (error.response?.data?.message || "Failed to send UPI"));
    } finally {
      setLoading(false);
    }
  };

  const handleAddUpi = async () => {
    if (!upiModal.upiId) {
      setToast("Please enter UPI ID");
      return;
    }

    setAddingUpi(true);
    try {
      await updateFriendUpiId(upiModal.friendId, upiModal.upiId);
      
      // Update friends list
      const updatedFriends = friends.map(f =>
        f._id === upiModal.friendId ? { ...f, upiId: upiModal.upiId } : f
      );
      setFriends(updatedFriends);

      setToast("UPI ID added successfully!");
      setUpiModal({ show: false, friendId: null, friendName: "", upiId: "" });

      // Continue with sending UPI request
      setTimeout(() => {
        setFormData({ ...formData });
      }, 500);
    } catch (error) {
      setToast("Error: " + (error.response?.data?.message || "Failed to add UPI ID"));
    } finally {
      setAddingUpi(false);
    }
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      {toast && <Toast message={toast} type={toast.includes("Error") ? "error" : "success"} />}
      
      <div className="max-w-md mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Send UPI Request</h1>

        {/* UPI Modal */}
        {upiModal.show && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <Card className="w-full max-w-md">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Add UPI ID</h2>
              <p className="text-gray-600 mb-6">
                {upiModal.friendName} doesn't have a UPI ID yet. Please add it to send UPI request.
              </p>

              <input
                type="text"
                placeholder="john@upi"
                value={upiModal.upiId}
                onChange={(e) => setUpiModal({ ...upiModal, upiId: e.target.value })}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all text-base mb-6"
              />

              <div className="flex gap-3">
                <button
                  onClick={() => setUpiModal({ show: false, friendId: null, friendName: "", upiId: "" })}
                  className="flex-1 px-4 py-2 border-2 border-gray-300 text-gray-800 rounded-lg font-semibold hover:bg-gray-100 transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddUpi}
                  disabled={addingUpi || !upiModal.upiId}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  {addingUpi ? "Adding..." : "Add UPI ID"}
                </button>
              </div>
            </Card>
          </div>
        )}

        <Card>
          <form onSubmit={handleSubmit} className="space-y-6">
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
                    {friend.name}
                    {friend.upiId ? ` (${friend.upiId})` : " (No UPI ID)"}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Amount (₹) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="amount"
                placeholder="500"
                value={formData.amount}
                onChange={handleChange}
                step="0.01"
                min="0"
                required
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all text-base"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Note
              </label>
              <input
                type="text"
                name="note"
                placeholder="Payment for dinner"
                value={formData.note}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all text-base"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold py-3 rounded-lg hover:shadow-lg hover:shadow-blue-500/50 transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-lg"
            >
              {loading ? (
                <>
                  <svg className="w-6 h-6 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Sending...
                </>
              ) : (
                <>
                  <span>Send UPI Request</span>
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
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

export default SendUPI;
