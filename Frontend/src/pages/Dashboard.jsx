import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { TrendingUp, TrendingDown, Users, Clock, ArrowRight, IndianRupee, Zap } from "lucide-react";
import { getExpenses, getExpenseSummary } from "../api/expenses";
import { getUpiRequests } from "../api/upi";
import { getFriends } from "../api/friends";
import Card from "../components/Card";
import Loader from "../components/Loader";
import Button from "../components/Button";

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

  const StatCard = ({ label, value, icon: Icon, color, bgColor }) => (
    <Card variant="elevated" className="group">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-dark-600 text-sm font-semibold mb-1">{label}</p>
          <p className={`text-2xl font-bold ${color}`}>{value}</p>
        </div>
        <div className={`${bgColor} p-3 rounded-xl group-hover:scale-110 transition-transform duration-300`}>
          <Icon className="text-white" size={24} />
        </div>
      </div>
    </Card>
  );

  return (
    <div className="p-4 lg:p-8 bg-dark-50 min-h-screen">
      {/* Header */}
      <div className="mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl lg:text-4xl font-bold text-primary-600">
            Dashboard
          </h1>
          <p className="text-dark-600 mt-2">Welcome back! Here's your financial overview</p>
        </div>
        <Link to="/expenses/add">
          <Button variant="primary" size="lg" className="w-full sm:w-auto">
            <Zap size={18} />
            <span className="hidden sm:inline">Add Expense</span>
            <span className="sm:hidden">Add</span>
          </Button>
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        <StatCard 
          label="Total Lent" 
          value={`₹${stats.totalLent}`} 
          icon={TrendingUp} 
          color="text-success-600" 
          bgColor="bg-success-500"
        />
        <StatCard 
          label="Total Borrowed" 
          value={`₹${stats.totalBorrowed}`} 
          icon={TrendingDown} 
          color="text-danger-600" 
          bgColor="bg-danger-500"
        />
        <StatCard 
          label="Net Balance" 
          value={`₹${Math.abs(stats.netBalance)}`} 
          icon={IndianRupee} 
          color="text-primary-600" 
          bgColor="bg-primary-500"
        />
        <StatCard 
          label="Pending UPI" 
          value={stats.pendingUpi} 
          icon={Clock} 
          color="text-warning-600" 
          bgColor="bg-warning-500"
        />
        <StatCard 
          label="Friends" 
          value={stats.friendsCount} 
          icon={Users} 
          color="text-secondary-600" 
          bgColor="bg-secondary-500"
        />
      </div>

      {/* Recent Transactions */}
      <Card variant="elevated">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold text-dark-900">Recent Transactions</h2>
            <p className="text-dark-600 text-sm mt-1">Your latest expense activities</p>
          </div>
          <Link to="/expenses">
            <Button variant="ghost" size="md">
              View All <ArrowRight size={16} />
            </Button>
          </Link>
        </div>

        {recentExpenses.length > 0 ? (
          <div className="space-y-3">
            {recentExpenses.map((exp) => (
              <div 
                key={exp._id} 
                className="flex items-center justify-between p-4 bg-dark-50 rounded-xl border border-dark-100 hover:border-primary-300 transition-all duration-300 hover:shadow-md"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${
                      exp.type === "lend" 
                        ? "bg-success-100 text-success-700" 
                        : "bg-danger-100 text-danger-700"
                    }`}>
                      {exp.type === "lend" ? "Lent" : "Borrowed"}
                    </span>
                  </div>
                  <p className="font-semibold text-dark-900">{exp.description}</p>
                  <p className="text-sm text-dark-500">{exp.friendId?.name} • {new Date(exp.datetime).toLocaleDateString()}</p>
                </div>
                <p className={`text-lg font-bold ${exp.type === "lend" ? "text-success-600" : "text-danger-600"}`}>
                  ₹{exp.amount}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-dark-500 font-medium">No transactions yet</p>
            <p className="text-dark-400 text-sm mt-1">Start adding expenses to see your transaction history</p>
          </div>
        )}
      </Card>
    </div>
  );
};

export default Dashboard;
