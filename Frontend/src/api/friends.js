import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000",
});

// Add token interceptor
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const addFriend = (name, upiId) =>
  API.post("/api/friends/add", { name, upiId });

export const getFriends = () => API.get("/api/friends/list");

export const updateFriendUpiId = (friendId, upiId) =>
  API.patch(`/api/friends/${friendId}/upi`, { upiId });
