import { useState, useEffect } from "react";
import { getExpenseSummary } from "../api/expenses";
import Card from "../components/Card";
import Loader from "../components/Loader";

const Summary = () => {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const response = await getExpenseSummary();
        setSummary(response.data);
      } catch (error) {
        console.error("Error fetching summary:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSummary();
  }, []);

  if (loading) return <Loader />;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Expense Summary</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <h3 className="text-gray-600 text-sm font-medium">Total Spent</h3>
            <p className="text-3xl font-bold text-blue-600 mt-2">₹{summary?.totalSpent || 0}</p>
          </Card>
          <Card>
            <h3 className="text-gray-600 text-sm font-medium">Total Owed to You</h3>
            <p className="text-3xl font-bold text-green-600 mt-2">₹{summary?.totalOwedToYou || 0}</p>
          </Card>
          <Card>
            <h3 className="text-gray-600 text-sm font-medium">Total You Owe</h3>
            <p className="text-3xl font-bold text-red-600 mt-2">₹{summary?.totalYouOwe || 0}</p>
          </Card>
        </div>

        {summary?.friendBalances && summary.friendBalances.length > 0 && (
          <Card>
            <h2 className="text-2xl font-bold mb-4">Balance with Friends</h2>
            <div className="space-y-3">
              {summary.friendBalances.map((balance) => (
                <div key={balance.friendId} className="flex justify-between items-center p-3 bg-gray-100 rounded">
                  <span className="font-medium">{balance.friendName}</span>
                  <span className={balance.balance > 0 ? "text-green-600" : "text-red-600"}>
                    {balance.balance > 0 ? "+" : ""}₹{balance.balance}
                  </span>
                </div>
              ))}
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Summary;
