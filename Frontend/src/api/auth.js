import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

export const registerUser = (name, email, password) =>
  API.post("/api/auth/register", { name, email, password });

export const verifyOtpAPI = (email, otp) =>
  API.post("/api/auth/verify-otp", { email, otp });

export const loginUser = (email, password) =>
  API.post("/api/auth/login", { email, password });
