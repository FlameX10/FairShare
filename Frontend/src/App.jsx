import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import useAuth from "./hooks/useAuth";

// Pages
import Register from "./pages/Register";
import VerifyOtp from "./pages/VerifyOtp";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Friends from "./pages/Friends";
import AddFriend from "./pages/AddFriend";
import Expenses from "./pages/Expenses";
import AddExpense from "./pages/AddExpense";
import Summary from "./pages/Summary";
import UPI from "./pages/UPI";
import SendUPI from "./pages/SendUPI";
import Reports from "./pages/Reports";

function App() {
  const { token } = useAuth();

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/verify-otp" element={<VerifyOtp />} />
        <Route path="/login" element={<Login />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/friends" element={<Friends />} />
          <Route path="/friends/add" element={<AddFriend />} />
          <Route path="/expenses" element={<Expenses />} />
          <Route path="/expenses/add" element={<AddExpense />} />
          <Route path="/expenses/summary" element={<Summary />} />
          <Route path="/upi" element={<UPI />} />
          <Route path="/upi/send" element={<SendUPI />} />
          <Route path="/reports" element={<Reports />} />
        </Route>

        <Route path="/" element={<Navigate to={token ? "/dashboard" : "/login"} />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
