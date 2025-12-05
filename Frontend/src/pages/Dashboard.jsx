import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { TrendingUp, TrendingDown, Users, Clock, ArrowRight ,IndianRupee } from "lucide-react";
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

  const StatCard = ({ label, value, icon: Icon, color }) => (
    <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-gray-600 text-sm font-medium">{label}</p>
          <p className={`text-2xl font-semibold mt-2 ${color}`}>{value}</p>
        </div>
        <Icon className={`${color} opacity-60`} size={24} />
      </div>
    </div>
  );

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-semibold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-1">Overview of your expenses and balances</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        <StatCard label="Total Lent" value={`₹${stats.totalLent}`} icon={TrendingUp} color="text-green-600" />
        <StatCard label="Total Borrowed" value={`₹${stats.totalBorrowed}`} icon={TrendingDown} color="text-red-600" />
        <StatCard label="Net Balance" value={`₹${Math.abs(stats.netBalance)}`} icon={IndianRupee} color="text-blue-600" />
        <StatCard label="Pending UPI" value={stats.pendingUpi} icon={Clock} color="text-yellow-600" />
        <StatCard label="Friends" value={stats.friendsCount} icon={Users} color="text-purple-600" />
      </div>

      {/* Recent Transactions */}
      <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Recent Transactions</h2>
          <Link to="/friends" className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center gap-1">
            View All <ArrowRight size={16} />
          </Link>
        </div>

        {recentExpenses.length > 0 ? (
          <div className="space-y-2">
            {recentExpenses.map((exp) => (
              <div key={exp._id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-100">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`inline-block px-2.5 py-1 rounded text-xs font-medium ${
                      exp.type === "lend" 
                        ? "bg-green-100 text-green-700" 
                        : "bg-red-100 text-red-700"
                    }`}>
                      {exp.type === "lend" ? "Lent" : "Borrowed"}
                    </span>
                  </div>
                  <p className="font-medium text-gray-900">{exp.description}</p>
                  <p className="text-sm text-gray-500">{exp.friendId?.name} • {new Date(exp.datetime).toLocaleDateString()}</p>
                </div>
                <p className={`text-lg font-semibold ${exp.type === "lend" ? "text-green-600" : "text-red-600"}`}>
                  ₹{exp.amount}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500 py-8">No transactions yet</p>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
