import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Plus, FileText, Trash2, Loader } from "lucide-react";
import { getFriends } from "../api/friends";
import { getExpenses, deleteExpense } from "../api/expenses";
import { generatePDF } from "../api/pdf";
import Button from "../components/Button";
import Card from "../components/Card";
import Loader2 from "../components/Loader";
import Toast from "../components/Toast";

const Friends = () => {
  const [friends, setFriends] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedFriend, setSelectedFriend] = useState(null);
  const [friendExpenses, setFriendExpenses] = useState([]);
  const [generatingReport, setGeneratingReport] = useState(false);
  const [toast, setToast] = useState("");
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    const fetchFriends = async () => {
      try {
        const response = await getFriends();
        setFriends(response.data);
      } catch (error) {
        console.error("Error fetching friends:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFriends();
  }, []);

  const handleSelectFriend = async (friend) => {
    setSelectedFriend(friend);
    try {
      const response = await getExpenses();
      const expenses = response.data.filter((exp) => exp.friendId._id === friend._id);
      setFriendExpenses(expenses);
    } catch (error) {
      console.error("Error fetching expenses:", error);
    }
  };

  const calculateBalance = (expenses) => {
    let lent = 0;
    let borrowed = 0;

    expenses.forEach((exp) => {
      if (exp.type === "lend") {
        lent += exp.amount;
      } else if (exp.type === "borrow") {
        borrowed += exp.amount;
      }
    });

    return {
      lent,
      borrowed,
      balance: lent - borrowed,
    };
  };

  const getBalanceText = (balance) => {
    if (balance > 0) {
      return { text: `${selectedFriend?.name} owes you ₹${balance}`, color: "text-green-600" };
    } else if (balance < 0) {
      return { text: `You owe ${selectedFriend?.name} ₹${Math.abs(balance)}`, color: "text-red-600" };
    } else {
      return { text: "Settled up", color: "text-gray-600" };
    }
  };

  const handleDeleteExpense = async (expenseId) => {
    if (!window.confirm("Delete this expense?")) {
      return;
    }

    setDeletingId(expenseId);
    try {
      await deleteExpense(expenseId);
      setFriendExpenses(friendExpenses.filter((exp) => exp._id !== expenseId));
      setToast("Expense deleted");
    } catch (error) {
      setToast("Error deleting expense");
    } finally {
      setDeletingId(null);
    }
  };

  const handleGenerateReport = async () => {
    if (!selectedFriend || friendExpenses.length === 0) {
      setToast("No expenses to generate report");
      return;
    }

    setGeneratingReport(true);
    try {
      const response = await generatePDF(friendExpenses);
      
      const html = response.data.html;
      const element = document.createElement("div");
      element.innerHTML = html;
      document.body.appendChild(element);

      const opt = {
        margin: 10,
        filename: `${selectedFriend.name}-expenses.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { orientation: 'portrait', unit: 'mm', format: 'a4' }
      };

      if (window.html2pdf) {
        window.html2pdf().set(opt).from(element).save();
        setToast("Report downloaded!");
        document.body.removeChild(element);
      }
    } catch (error) {
      setToast("Error generating report");
    } finally {
      setGeneratingReport(false);
    }
  };

  if (loading) return <Loader2 />;

  const selectedBalance = selectedFriend ? calculateBalance(friendExpenses) : null;
  const balanceInfo = selectedBalance ? getBalanceText(selectedBalance.balance) : null;

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      {toast && <Toast message={toast} type={toast.includes("Error") ? "error" : "success"} />}
      
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-semibold text-gray-900">Friends</h1>
            <p className="text-gray-600 mt-1">Manage your friend relationships and expenses</p>
          </div>
          <Link to="/friends/add">
            <button className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-4 rounded-lg flex items-center gap-2">
              <Plus size={20} /> Add Friend
            </button>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Friends List */}
          <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm h-fit">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Your Friends</h2>
            <div className="space-y-2">
              {friends.length > 0 ? (
                friends.map((friend) => (
                  <button
                    key={friend._id}
                    onClick={() => handleSelectFriend(friend)}
                    className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                      selectedFriend?._id === friend._id
                        ? "bg-blue-600 text-white"
                        : "bg-gray-50 text-gray-900 hover:bg-gray-100"
                    }`}
                  >
                    <p className="font-medium">{friend.name}</p>
                    <p className={`text-xs ${selectedFriend?._id === friend._id ? "text-blue-100" : "text-gray-600"}`}>
                      {friend.upiId || "No UPI"}
                    </p>
                  </button>
                ))
              ) : (
                <p className="text-center text-gray-500 py-8">No friends yet</p>
              )}
            </div>
          </div>

          {/* Friend Details & Expenses */}
          <div className="lg:col-span-2 space-y-6">
            {selectedFriend ? (
              <>
                {/* Friend Info */}
                <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h2 className="text-2xl font-semibold text-gray-900">{selectedFriend.name}</h2>
                      <p className="text-gray-600 text-sm mt-1">UPI: {selectedFriend.upiId || "Not added"}</p>
                    </div>
                    <Link to={`/expenses/add?friendId=${selectedFriend._id}`}>
                      <button className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg flex items-center gap-2 text-sm">
                        <Plus size={16} /> Add Expense
                      </button>
                    </Link>
                  </div>
                  <div className="border-t pt-4 mt-4">
                    <p className={`text-lg font-semibold ${balanceInfo.color}`}>
                      {balanceInfo.text}
                    </p>
                  </div>
                </div>

                {/* Transactions */}
                <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">Transactions</h3>
                    <button
                      onClick={handleGenerateReport}
                      disabled={generatingReport || friendExpenses.length === 0}
                      className="bg-orange-600 hover:bg-orange-700 text-white font-medium py-2 px-4 rounded-lg flex items-center gap-2 text-sm disabled:opacity-50"
                    >
                      {generatingReport ? (
                        <>
                          <Loader size={16} className="animate-spin" />
                        </>
                      ) : (
                        <>
                          <FileText size={16} /> Report
                        </>
                      )}
                    </button>
                  </div>
                  
                  {friendExpenses.length > 0 ? (
                    <div className="space-y-2">
                      {friendExpenses.map((expense) => (
                        <div key={expense._id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-100 group hover:border-gray-200">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${
                                expense.type === "lend" 
                                  ? "bg-green-100 text-green-700" 
                                  : "bg-red-100 text-red-700"
                              }`}>
                                {expense.type === "lend" ? "Lent" : "Borrowed"}
                              </span>
                            </div>
                            <p className="font-medium text-gray-900 text-sm">{expense.description}</p>
                            <p className="text-xs text-gray-500">{new Date(expense.datetime).toLocaleDateString()}</p>
                          </div>
                          <div className="flex items-center gap-3">
                            <p className={`font-semibold text-sm ${
                              expense.type === "lend" ? "text-green-600" : "text-red-600"
                            }`}>
                              ₹{expense.amount}
                            </p>
                            <button
                              onClick={() => handleDeleteExpense(expense._id)}
                              disabled={deletingId === expense._id}
                              className="p-2 hover:bg-red-50 text-red-600 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              {deletingId === expense._id ? (
                                <Loader size={16} className="animate-spin" />
                              ) : (
                                <Trash2 size={16} />
                              )}
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-center text-gray-500 py-8 text-sm">No transactions yet</p>
                  )}
                </div>
              </>
            ) : (
              <div className="bg-white border border-gray-200 rounded-lg p-12 shadow-sm flex items-center justify-center">
                <p className="text-gray-500">Select a friend to view details</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Friends;
