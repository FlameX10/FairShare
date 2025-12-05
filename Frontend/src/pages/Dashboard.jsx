import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { TrendingUp, TrendingDown, BarChart3, Clock, Users } from "lucide-react";
import { getExpenses, getExpenseSummary } from "../api/expenses";
import { getUpiRequests } from "../api/upi";
import { getFriends } from "../api/friends";
import Card from "../components/Card";
import Loader from "../components/Loader";

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalLent: 0,
    totalBorrowed: 0,
    netBalance: 0,
    pendingUpi: 0,
    friendsCount: 0,
  });
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
          totalLent: expenseSummary.data.totalLent || 0,
          totalBorrowed: expenseSummary.data.totalBorrowed || 0,
          netBalance: expenseSummary.data.netBalance || 0,
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
        <p className="text-gray-600">Your expense overview at a glance</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        {/* Total Lent */}
        <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-green-100 text-sm font-medium">Total Lent</p>
              <p className="text-3xl font-bold mt-2">₹{stats.totalLent}</p>
              <p className="text-green-200 text-xs mt-2">Money you gave</p>
            </div>
            <TrendingUp size={32} className="opacity-20" />
          </div>
        </Card>

        {/* Total Borrowed */}
        <Card className="bg-gradient-to-br from-red-500 to-red-600 text-white">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-red-100 text-sm font-medium">Total Borrowed</p>
              <p className="text-3xl font-bold mt-2">₹{stats.totalBorrowed}</p>
              <p className="text-red-200 text-xs mt-2">Money you owe</p>
            </div>
            <TrendingDown size={32} className="opacity-20" />
          </div>
        </Card>

        {/* Net Balance */}
        <Card className={`bg-gradient-to-br ${
          stats.netBalance >= 0 
            ? "from-blue-500 to-blue-600" 
            : "from-orange-500 to-orange-600"
        } text-white`}>
          <div className="flex items-start justify-between">
            <div>
              <p className="text-blue-100 text-sm font-medium">Net Balance</p>
              <p className="text-3xl font-bold mt-2">₹{Math.abs(stats.netBalance)}</p>
              <p className="text-blue-200 text-xs mt-2">
                {stats.netBalance > 0 ? "Others owe you" : stats.netBalance < 0 ? "You owe others" : "Settled"}
              </p>
            </div>
            <BarChart3 size={32} className="opacity-20" />
          </div>
        </Card>

        {/* Pending UPI */}
        <Card className="bg-gradient-to-br from-yellow-500 to-yellow-600 text-white">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-yellow-100 text-sm font-medium">Pending UPI</p>
              <p className="text-3xl font-bold mt-2">{stats.pendingUpi}</p>
              <p className="text-yellow-200 text-xs mt-2">Requests</p>
            </div>
            <Clock size={32} className="opacity-20" />
          </div>
        </Card>

        {/* Friends */}
        <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-purple-100 text-sm font-medium">Friends</p>
              <p className="text-3xl font-bold mt-2">{stats.friendsCount}</p>
              <p className="text-purple-200 text-xs mt-2">Total</p>
            </div>
            <Users size={32} className="opacity-20" />
          </div>
        </Card>
      </div>

      {/* Recent Transactions */}
      <div>
        <Card>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Recent Transactions</h2>
            <Link to="/expenses">
              <button className="text-blue-600 hover:text-blue-700 font-semibold text-sm">
                View All →
              </button>
            </Link>
          </div>
          <div className="space-y-3">
            {recentExpenses.length > 0 ? (
              recentExpenses.map((exp) => (
                <div key={exp._id} className="flex justify-between items-center p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        exp.type === "lend" 
                          ? "bg-green-100 text-green-700" 
                          : "bg-red-100 text-red-700"
                      }`}>
                        {exp.type === "lend" ? "Lent" : "Borrowed"}
                      </span>
                    </div>
                    <p className="font-semibold text-gray-800">{exp.description}</p>
                    <p className="text-sm text-gray-500">{exp.friendId?.name || "Unknown"} • {new Date(exp.datetime).toLocaleDateString()}</p>
                  </div>
                  <div className="text-right">
                    <p className={`text-lg font-bold ${
                      exp.type === "lend" ? "text-green-600" : "text-red-600"
                    }`}>
                      ₹{exp.amount}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-8">No transactions yet. Start by adding friends and expenses!</p>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
