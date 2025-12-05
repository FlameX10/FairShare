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

export const sendUpiRequest = (friendId, amount, note) =>
  API.post("/api/upi/send", { friendId, amount, note });

export const getUpiRequests = () => API.get("/api/upi/list");
