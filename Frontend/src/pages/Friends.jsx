import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Plus, FileText, Trash2, Users, MoreHorizontal } from "lucide-react";
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
      return { 
        text: `${selectedFriend?.name} owes you ₹${balance}`, 
        color: "text-success-600",
        bg: "bg-success-50",
        label: "You're owed"
      };
    } else if (balance < 0) {
      return { 
        text: `You owe ${selectedFriend?.name} ₹${Math.abs(balance)}`, 
        color: "text-danger-600",
        bg: "bg-danger-50",
        label: "You owe"
      };
    } else {
      return { 
        text: "All settled up!", 
        color: "text-dark-600",
        bg: "bg-dark-50",
        label: "Balance"
      };
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
      setToast("Expense deleted successfully");
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
        setToast("Report downloaded successfully!");
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
    <div className="p-4 sm:p-6 lg:p-8 bg-dark-50 min-h-screen">
      {toast && <Toast message={toast} type={toast.includes("Error") ? "error" : "success"} />}
      
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-primary-600 flex items-center gap-3">
              <Users size={32} />
              Friends
            </h1>
            <p className="text-dark-600 mt-2">Manage your friend relationships and track shared expenses</p>
          </div>
          <Link to="/friends/add">
            <Button variant="primary" size="lg">
              <Plus size={20} />
              Add Friend
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
          {/* Friends List */}
          <Card variant="elevated" className="h-fit">
            <h2 className="text-xl font-bold text-dark-900 mb-4 flex items-center gap-2">
              <Users size={22} />
              Your Friends
            </h2>
            <div className="space-y-2">
              {friends.length > 0 ? (
                friends.map((friend) => (
                  <button
                    key={friend._id}
                    onClick={() => handleSelectFriend(friend)}
                    className={`w-full text-left px-4 py-3 rounded-xl transition-all duration-200 ${
                      selectedFriend?._id === friend._id
                        ? "bg-primary-600 text-white shadow-md"
                        : "bg-dark-50 text-dark-900 hover:bg-dark-100 border border-dark-200"
                    }`}
                  >
                    <p className="font-semibold text-sm">{friend.name}</p>
                    <p className={`text-xs mt-1 ${selectedFriend?._id === friend._id ? "text-primary-100" : "text-dark-600"}`}>
                      {friend.upiId || "No UPI added"}
                    </p>
                  </button>
                ))
              ) : (
                <div className="text-center py-8">
                  <Users size={32} className="mx-auto text-dark-400 mb-2 opacity-50" />
                  <p className="text-dark-600 text-sm font-medium">No friends yet</p>
                  <p className="text-dark-500 text-xs mt-1">Add your first friend to get started</p>
                </div>
              )}
            </div>
          </Card>

          {/* Friend Details & Expenses */}
          <div className="col-span-1 lg:col-span-2 space-y-4 sm:space-y-6">
            {selectedFriend ? (
              <>
                {/* Friend Info Card */}
                <Card variant="elevated" className="bg-white">
                  <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-6">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-12 h-12 rounded-full bg-primary-600 flex items-center justify-center">
                          <span className="text-white font-bold text-lg">{selectedFriend.name.charAt(0)}</span>
                        </div>
                        <div>
                          <h2 className="text-2xl font-bold text-dark-900">{selectedFriend.name}</h2>
                          <p className="text-dark-600 text-sm flex items-center gap-1">
                            📱 {selectedFriend.upiId || "No UPI added"}
                          </p>
                        </div>
                      </div>
                    </div>
                    <Link to={`/expenses/add?friendId=${selectedFriend._id}`}>
                      <Button variant="primary" size="md">
                        <Plus size={16} />
                        Add Expense
                      </Button>
                    </Link>
                  </div>

                  {/* Balance Section */}
                  <div className={`${balanceInfo.bg} border border-current border-opacity-20 rounded-xl p-4 mt-6`}>
                    <p className={`text-xs font-semibold ${balanceInfo.color} uppercase tracking-wider mb-1`}>
                      {balanceInfo.label}
                    </p>
                    <p className={`text-2xl font-bold ${balanceInfo.color}`}>
                      {balanceInfo.text}
                    </p>
                  </div>
                </Card>

                {/* Transactions Card */}
                <Card variant="elevated">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold text-dark-900">Transactions</h3>
                    <button
                      onClick={handleGenerateReport}
                      disabled={generatingReport || friendExpenses.length === 0}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                        generatingReport || friendExpenses.length === 0
                          ? "bg-dark-100 text-dark-400 cursor-not-allowed"
                          : "bg-warning-100 text-warning-700 hover:bg-warning-200"
                      }`}
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
                          <FileText size={16} />
                          Generate PDF
                        </>
                      )}
                    </button>
                  </div>
                  
                  {friendExpenses.length > 0 ? (
                    <div className="space-y-3">
                      {friendExpenses.map((expense) => (
                        <div 
                          key={expense._id} 
                          className="flex items-center justify-between p-4 bg-dark-50 rounded-xl border border-dark-200 hover:border-primary-300 transition-all duration-300 group"
                        >
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${
                                expense.type === "lend" 
                                  ? "bg-success-100 text-success-700" 
                                  : "bg-danger-100 text-danger-700"
                              }`}>
                                {expense.type === "lend" ? "Lent" : "Borrowed"}
                              </span>
                            </div>
                            <p className="font-semibold text-dark-900 text-sm">{expense.description}</p>
                            <p className="text-xs text-dark-500 mt-1">
                              {new Date(expense.datetime).toLocaleDateString('en-IN', { 
                                year: 'numeric', 
                                month: 'short', 
                                day: 'numeric' 
                              })}
                            </p>
                          </div>
                          <div className="flex items-center gap-3 ml-4">
                            <p className={`font-bold text-sm whitespace-nowrap ${
                              expense.type === "lend" ? "text-success-600" : "text-danger-600"
                            }`}>
                              ₹{expense.amount}
                            </p>
                            <button
                              onClick={() => handleDeleteExpense(expense._id)}
                              disabled={deletingId === expense._id}
                              className="p-2 hover:bg-danger-50 text-danger-600 rounded-lg opacity-0 group-hover:opacity-100 transition-all"
                            >
                              {deletingId === expense._id ? (
                                <svg className="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                </svg>
                              ) : (
                                <Trash2 size={16} />
                              )}
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <FileText size={32} className="mx-auto text-dark-400 mb-3 opacity-50" />
                      <p className="text-dark-600 font-medium">No transactions yet</p>
                      <p className="text-dark-500 text-sm mt-1">Start by adding an expense</p>
                    </div>
                  )}
                </Card>
              </>
            ) : (
              <Card variant="elevated" className="lg:col-span-1 flex items-center justify-center py-16">
                <div className="text-center">
                  <Users size={40} className="mx-auto text-dark-400 mb-4 opacity-50" />
                  <p className="text-dark-600 font-medium">Select a friend to view details</p>
                  <p className="text-dark-500 text-sm mt-2">Choose from your friends list on the left</p>
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Friends;
