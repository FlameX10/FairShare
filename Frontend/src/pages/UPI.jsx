import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getUpiRequests } from "../api/upi";
import Button from "../components/Button";
import Card from "../components/Card";
import Loader from "../components/Loader";

const UPI = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const response = await getUpiRequests();
        setRequests(response.data);
      } catch (error) {
        console.error("Error fetching UPI requests:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, []);

  if (loading) return <Loader />;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">UPI Requests</h1>
          <Link to="/upi/send">
            <Button>💳 Send UPI</Button>
          </Link>
        </div>

        <div className="space-y-4">
          {requests.length > 0 ? (
            requests.map((req) => (
              <Card key={req._id} className="flex justify-between items-center">
                <div>
                  <h3 className="font-semibold text-lg">{req.friendId?.name}</h3>
                  <p className="text-gray-500 text-sm">{req.note}</p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-blue-600">₹{req.amount}</p>
                  <p className={`text-sm ${req.status === "Pending" ? "text-orange-600" : "text-green-600"}`}>
                    {req.status}
                  </p>
                </div>
              </Card>
            ))
          ) : (
            <Card>
              <p className="text-gray-500 text-center">No UPI requests</p>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default UPI;
