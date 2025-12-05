import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import { getExpenses, getExpenseSummary } from "../api/expenses";
import { getUpiRequests } from "../api/upi";
import { getFriends } from "../api/friends";
import Button from "../components/Button";
import Card from "../components/Card";
import ExpenseCard from "../components/ExpenseCard";
import Loader from "../components/Loader";

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
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
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-md p-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-blue-600">Expense Tracker</h1>
        <div className="flex items-center gap-4">
          <span className="text-gray-700">Welcome, {user?.name}</span>
          <Button variant="danger" onClick={() => { logout(); navigate("/login"); }}>
            Logout
          </Button>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <h3 className="text-gray-600 text-sm font-medium">Total Spent</h3>
            <p className="text-3xl font-bold text-blue-600 mt-2">₹{stats.totalSpent}</p>
          </Card>
          <Card>
            <h3 className="text-gray-600 text-sm font-medium">Pending UPI</h3>
            <p className="text-3xl font-bold text-orange-600 mt-2">{stats.pendingUpi}</p>
          </Card>
          <Card>
            <h3 className="text-gray-600 text-sm font-medium">Friends</h3>
            <p className="text-3xl font-bold text-green-600 mt-2">{stats.friendsCount}</p>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Recent Expenses</h2>
                <Link to="/expenses">
                  <Button variant="secondary">View All</Button>
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
                  <p className="text-gray-500">No expenses yet</p>
                )}
              </div>
            </Card>
          </div>

          <div className="space-y-4">
            <Card>
              <Link to="/expenses/add" className="block">
                <Button className="w-full">➕ Add Expense</Button>
              </Link>
            </Card>
            <Card>
              <Link to="/friends" className="block">
                <Button className="w-full">👥 Friends</Button>
              </Link>
            </Card>
            <Card>
              <Link to="/upi" className="block">
                <Button className="w-full">💳 UPI</Button>
              </Link>
            </Card>
            <Card>
              <Link to="/reports" className="block">
                <Button className="w-full">📄 Reports</Button>
              </Link>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
