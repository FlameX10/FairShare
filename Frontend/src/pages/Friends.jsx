import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getFriends } from "../api/friends";
import Button from "../components/Button";
import Card from "../components/Card";
import FriendCard from "../components/FriendCard";
import Loader from "../components/Loader";

const Friends = () => {
  const [friends, setFriends] = useState([]);
  const [loading, setLoading] = useState(true);

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

  if (loading) return <Loader />;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Friends</h1>
          <Link to="/friends/add">
            <Button>➕ Add Friend</Button>
          </Link>
        </div>

        <div className="space-y-4">
          {friends.length > 0 ? (
            friends.map((friend) => (
              <FriendCard key={friend._id} name={friend.name} upiId={friend.upiId} />
            ))
          ) : (
            <Card>
              <p className="text-gray-500 text-center">No friends added yet</p>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default Friends;
