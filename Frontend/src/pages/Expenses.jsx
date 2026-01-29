import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Plus, Receipt } from "lucide-react";
import { getExpenses } from "../api/expenses";
import Button from "../components/Button";
import Card from "../components/Card";
import ExpenseCard from "../components/ExpenseCard";
import Loader from "../components/Loader";

const Expenses = () => {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const response = await getExpenses();
        setExpenses(response.data);
      } catch (error) {
        console.error("Error fetching expenses:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchExpenses();
  }, []);

  if (loading) return <Loader />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-50 via-white to-primary-50 p-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent flex items-center gap-2">
              <Receipt size={36} />
              Expenses
            </h1>
            <p className="text-dark-600 mt-2">Track and manage all your shared expenses</p>
          </div>
          <Link to="/expenses/add">
            <Button variant="primary" size="lg">
              <Plus size={20} />
              Add Expense
            </Button>
          </Link>
        </div>

        {/* Expenses List */}
        <div className="space-y-4">
          {expenses.length > 0 ? (
            expenses.map((expense) => (
              <ExpenseCard
                key={expense._id}
                friendName={expense.friendId?.name || "Unknown"}
                amount={expense.amount}
                description={expense.description}
                date={expense.createdAt}
                type={expense.type}
              />
            ))
          ) : (
            <Card variant="elevated" className="text-center py-12">
              <Receipt size={48} className="mx-auto text-dark-400 mb-4 opacity-50" />
              <p className="text-dark-600 text-lg font-semibold">No expenses yet</p>
              <p className="text-dark-500 mt-2">Start adding expenses to track your shared costs</p>
              <Link to="/expenses/add" className="mt-4 inline-block">
                <Button variant="primary">
                  Add Your First Expense
                </Button>
              </Link>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default Expenses;
