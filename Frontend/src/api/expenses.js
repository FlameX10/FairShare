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

export const addExpense = (friendId, amount, description) =>
  API.post("/api/expense/add", { friendId, amount, description });

export const getExpenses = () => API.get("/api/expense/list");

export const getExpenseSummary = () => API.get("/api/expense/summary");
