import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getFriends } from "../api/friends";
import { getExpenses, deleteExpense } from "../api/expenses";
import { generatePDF } from "../api/pdf";
import Button from "../components/Button";
import Card from "../components/Card";
import Loader from "../components/Loader";
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

  const handleDeleteExpense = async (expenseId) => {
    if (!window.confirm("Are you sure you want to delete this expense?")) {
      return;
    }

    setDeletingId(expenseId);
    try {
      await deleteExpense(expenseId);
      setFriendExpenses(friendExpenses.filter((exp) => exp._id !== expenseId));
      setToast("Expense deleted successfully!");
    } catch (error) {
      console.error("Error deleting expense:", error);
      setToast("Error: " + (error.response?.data?.message || "Failed to delete expense"));
    } finally {
      setDeletingId(null);
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

  const handleGenerateReport = async () => {
    if (!selectedFriend || friendExpenses.length === 0) {
      setToast("No expenses to generate report for this friend");
      return;
    }

    setGeneratingReport(true);
    try {
      const response = await generatePDF(friendExpenses);
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `${selectedFriend.name}-expenses.pdf`);
      document.body.appendChild(link);
      link.click();
      link.parentElement.removeChild(link);
      setToast("Report downloaded successfully!");
    } catch (error) {
      console.error("Error generating report:", error);
      setToast("Error: " + (error.message || "Failed to generate report"));
    } finally {
      setGeneratingReport(false);
    }
  };

  if (loading) return <Loader />;

  const selectedBalance = selectedFriend ? calculateBalance(friendExpenses) : null;
  const balanceInfo = selectedBalance ? getBalanceText(selectedBalance.balance) : null;

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      {toast && <Toast message={toast} type={toast.includes("Error") ? "error" : "success"} />}
      
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Friends</h1>
          <Link to="/friends/add">
            <Button>➕ Add Friend</Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Friends List */}
          <div className="lg:col-span-1">
            <Card className="h-fit">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Your Friends</h2>
              <div className="space-y-3">
                {friends.length > 0 ? (
                  friends.map((friend) => (
                    <button
                      key={friend._id}
                      onClick={() => handleSelectFriend(friend)}
                      className={`w-full text-left px-4 py-3 rounded-lg transition-all ${
                        selectedFriend?._id === friend._id
                          ? "bg-blue-600 text-white shadow-md"
                          : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                      }`}
                    >
                      <p className="font-semibold">{friend.name}</p>
                      <p className="text-xs opacity-75">{friend.upiId}</p>
                    </button>
                  ))
                ) : (
                  <p className="text-gray-500 text-center py-8">No friends added yet</p>
                )}
              </div>
            </Card>
          </div>

          {/* Friend Details & Expenses */}
          <div className="lg:col-span-2">
            {selectedFriend ? (
              <div className="space-y-6">
                {/* Friend Info Card */}
                <Card className="bg-gradient-to-br from-blue-50 to-indigo-50">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h2 className="text-2xl font-bold text-gray-800 mb-2">{selectedFriend.name}</h2>
                      <p className="text-gray-600">
                        UPI:{" "}
                        <span className="font-semibold">{selectedFriend.upiId}</span>
                      </p>
                    </div>
                    <Link to={`/expenses/add?friendId=${selectedFriend._id}`}>
                      <Button>➕ Add Expense</Button>
                    </Link>
                  </div>

                  {/* Balance Info */}
                  <div className="border-t pt-4 mt-4">
                    <p className={`text-lg font-bold ${balanceInfo.color}`}>
                      {balanceInfo.text}
                    </p>
                  </div>
                </Card>

                {/* Friend Expenses */}
                <Card>
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-bold text-gray-800">Transactions with {selectedFriend.name}</h3>
                    <button
                      onClick={handleGenerateReport}
                      disabled={generatingReport || friendExpenses.length === 0}
                      className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg font-semibold text-sm disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2"
                    >
                      {generatingReport ? (
                        <>
                          <svg className="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                          </svg>
                          Generating...
                        </>
                      ) : (
                        <>
                          📄 Generate Report
                        </>
                      )}
                    </button>
                  </div>
                  
                  {friendExpenses.length > 0 ? (
                    <div className="space-y-3">
                      {friendExpenses.map((expense) => (
                        <div key={expense._id} className="flex justify-between items-center p-4 bg-gray-50 rounded-lg border border-gray-200 group hover:shadow-md transition-all">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                expense.type === "lend" 
                                  ? "bg-green-100 text-green-700" 
                                  : "bg-red-100 text-red-700"
                              }`}>
                                {expense.type === "lend" ? "💰 You lent" : "💳 You borrowed"}
                              </span>
                            </div>
                            <p className="font-semibold text-gray-800">{expense.description}</p>
                            <p className="text-sm text-gray-500">{new Date(expense.datetime).toLocaleDateString()}</p>
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="text-right">
                              <p className={`text-lg font-bold ${
                                expense.type === "lend" ? "text-green-600" : "text-red-600"
                              }`}>
                                ₹{expense.amount}
                              </p>
                            </div>
                            <button
                              onClick={() => handleDeleteExpense(expense._id)}
                              disabled={deletingId === expense._id}
                              className="px-3 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-all opacity-0 group-hover:opacity-100"
                            >
                              {deletingId === expense._id ? "Deleting..." : "Delete"}
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 text-center py-8">No transactions yet. Add one to get started!</p>
                  )}
                </Card>
              </div>
            ) : (
              <Card className="flex items-center justify-center h-96">
                <p className="text-gray-500 text-center">Select a friend to view details</p>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Friends;
