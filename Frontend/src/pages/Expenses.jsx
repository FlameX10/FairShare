import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
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
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Expenses</h1>
          <Link to="/expenses/add">
            <Button>➕ Add Expense</Button>
          </Link>
        </div>

        <div className="space-y-4">
          {expenses.length > 0 ? (
            expenses.map((expense) => (
              <ExpenseCard
                key={expense._id}
                friendName={expense.friendId?.name || "Unknown"}
                amount={expense.amount}
                description={expense.description}
                date={expense.createdAt}
              />
            ))
          ) : (
            <Card>
              <p className="text-gray-500 text-center">No expenses yet</p>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default Expenses;
