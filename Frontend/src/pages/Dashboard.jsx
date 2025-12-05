import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getExpenses, getExpenseSummary } from "../api/expenses";
import { getUpiRequests } from "../api/upi";
import { getFriends } from "../api/friends";
import Card from "../components/Card";
import ExpenseCard from "../components/ExpenseCard";
import Loader from "../components/Loader";

const Dashboard = () => {
  const [stats, setStats] = useState({ totalSpent: 0, pendingUpi: 0, friendsCount: 0 });
  const [recentExpenses, setRecentExpenses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [expenseSummary, upiList, friendsList, expensesList] = await Promise.all([
          getExpenseSummary(),
          getUpiRequests(),
          getFriends(),
          getExpenses(),
        ]);

        setStats({
          totalSpent: expenseSummary.data.totalSpent || 0,
          pendingUpi: upiList.data.filter((r) => r.status === "Pending").length,
          friendsCount: friendsList.data.length,
        });

        setRecentExpenses(expensesList.data.slice(0, 5));
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <Loader />;

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">Dashboard</h1>
        <p className="text-gray-600">Welcome back! Here's your expense overview</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm font-medium">Total Spent</p>
              <p className="text-4xl font-bold mt-2">₹{stats.totalSpent}</p>
            </div>
            <div className="text-6xl opacity-20">💸</div>
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-100 text-sm font-medium">Pending UPI</p>
              <p className="text-4xl font-bold mt-2">{stats.pendingUpi}</p>
            </div>
            <div className="text-6xl opacity-20">💳</div>
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm font-medium">Friends</p>
              <p className="text-4xl font-bold mt-2">{stats.friendsCount}</p>
            </div>
            <div className="text-6xl opacity-20">👥</div>
          </div>
        </Card>
      </div>

      {/* Recent Expenses & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Expenses */}
        <div className="lg:col-span-2">
          <Card>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Recent Expenses</h2>
              <Link to="/expenses">
                <button className="text-blue-600 hover:text-blue-700 font-semibold text-sm">
                  View All →
                </button>
              </Link>
            </div>
            <div className="space-y-3">
              {recentExpenses.length > 0 ? (
                recentExpenses.map((exp) => (
                  <ExpenseCard
                    key={exp._id}
                    friendName={exp.friendId?.name || "Unknown"}
                    amount={exp.amount}
                    description={exp.description}
                    date={exp.createdAt}
                  />
                ))
              ) : (
                <p className="text-gray-500 text-center py-8">No expenses yet. Add one to get started!</p>
              )}
            </div>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="space-y-4">
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <Link to="/expenses/add">
                <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-all flex items-center justify-center gap-2">
                  <span>➕</span>
                  Add Expense
                </button>
              </Link>
              <Link to="/friends/add">
                <button className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-lg transition-all flex items-center justify-center gap-2">
                  <span>👥</span>
                  Add Friend
                </button>
              </Link>
              <Link to="/upi/send">
                <button className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 rounded-lg transition-all flex items-center justify-center gap-2">
                  <span>💳</span>
                  Send UPI
                </button>
              </Link>
              <Link to="/expenses/summary">
                <button className="w-full bg-orange-600 hover:bg-orange-700 text-white font-semibold py-3 rounded-lg transition-all flex items-center justify-center gap-2">
                  <span>📊</span>
                  View Summary
                </button>
              </Link>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
