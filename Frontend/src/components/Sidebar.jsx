import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, LogOut, BarChart3, Users, Send, X, Plus, Home } from "lucide-react";
import useAuth from "../hooks/useAuth";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(true);
  const location = useLocation();
  const { user, logout } = useAuth();

  const menuItems = [
    { icon: Home, label: "Dashboard", path: "/dashboard" },
    { icon: BarChart3, label: "Expenses", path: "/expenses" },
    { icon: Users, label: "Friends", path: "/friends" },
    { icon: Send, label: "UPI Requests", path: "/upi" },
  ];

  const secondaryMenuItems = [
    { icon: Plus, label: "Add Expense", path: "/expenses/add" },
    { icon: Plus, label: "Add Friend", path: "/friends/add" },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div
        className={`${
          isOpen ? "w-64" : "w-20"
        } bg-gradient-to-b from-primary-700 to-primary-900 text-white transition-all duration-300 flex flex-col shadow-xl border-r border-primary-600`}
      >
        {/* Logo Section */}
        <div className="p-6 flex items-center justify-between border-b border-primary-600">
          {isOpen && (
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-white to-primary-100 bg-clip-text text-transparent">
                FairShare
              </h1>
              <p className="text-xs text-primary-200">Smart Expense Sharing</p>
            </div>
          )}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 hover:bg-primary-600 rounded-lg transition-colors duration-200"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Main Menu Items */}
        <nav className="flex-1 px-3 py-6 space-y-2">
          <div className="mb-6">
            <p className="text-xs font-semibold text-primary-300 uppercase tracking-wider px-4 mb-3">
              {isOpen && "Main"}
            </p>
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-4 px-4 py-3 rounded-lg transition-all duration-200 text-white ${
                    isActive(item.path)
                      ? "bg-white/20 border-l-4 border-white shadow-lg"
                      : "hover:bg-white/10 border-l-4 border-transparent"
                  }`}
                >
                  <Icon size={22} />
                  {isOpen && <span className="font-medium text-sm">{item.label}</span>}
                </Link>
              );
            })}
          </div>

          {/* Secondary Menu */}
          <div>
            <p className="text-xs font-semibold text-primary-300 uppercase tracking-wider px-4 mb-3">
              {isOpen && "Quick Actions"}
            </p>
            {secondaryMenuItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className="flex items-center gap-4 px-4 py-2.5 rounded-lg transition-all duration-200 text-white hover:bg-primary-600/50"
                >
                  <Icon size={20} />
                  {isOpen && <span className="font-medium text-sm">{item.label}</span>}
                </Link>
              );
            })}
          </div>
        </nav>

        {/* User Profile & Logout */}
        <div className="border-t border-primary-600 p-4 space-y-3">
          {isOpen && (
            <div className="bg-primary-600/50 rounded-lg p-3 backdrop-blur-sm">
              <p className="text-primary-200 text-xs font-semibold">Logged in as</p>
              <p className="font-bold text-white truncate text-sm">{user?.name || "User"}</p>
              <p className="text-primary-300 text-xs truncate">{user?.email}</p>
            </div>
          )}
          <button
            onClick={logout}
            className="w-full bg-gradient-to-r from-danger-500 to-danger-600 hover:from-danger-600 hover:to-danger-700 text-white font-semibold py-2.5 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
          >
            <LogOut size={20} />
            {isOpen && "Logout"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
