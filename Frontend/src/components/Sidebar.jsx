import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, LogOut, BarChart3, Users, Send } from "lucide-react";
import useAuth from "../hooks/useAuth";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(true);
  const location = useLocation();
  const { user, logout } = useAuth();

  const menuItems = [
    { icon: BarChart3, label: "Dashboard", path: "/dashboard" },
    { icon: Users, label: "Friends", path: "/friends" },
    { icon: Send, label: "UPI Requests", path: "/upi" },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div
        className={`${
          isOpen ? "w-64" : "w-20"
        } bg-gradient-to-b from-blue-600 to-blue-800 text-white transition-all duration-300 flex flex-col shadow-lg`}
      >
        {/* Logo */}
        <div className="p-6 flex items-center justify-between">
          {isOpen && <h1 className="text-2xl font-bold">FairShare</h1>}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 hover:bg-blue-700 rounded-lg transition"
          >
            {isOpen ? <Menu size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Menu Items */}
        <nav className="flex-1 px-3 py-6 space-y-3">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-4 px-4 py-3 rounded-lg transition-all ${
                  isActive(item.path)
                    ? "bg-white/20 border-l-4 border-white"
                    : "hover:bg-white/10"
                }`}
              >
                <Icon size={24} />
                {isOpen && <span className="font-medium">{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        {/* User Profile & Logout */}
        <div className="border-t border-blue-400 p-4 space-y-3">
          {isOpen && (
            <div className="text-sm">
              <p className="text-blue-100 text-xs">Logged in as</p>
              <p className="font-semibold truncate">{user?.name || "User"}</p>
              <p className="text-blue-200 text-xs truncate">{user?.email}</p>
            </div>
          )}
          <button
            onClick={logout}
            className="w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-2 rounded-lg transition-all flex items-center justify-center gap-2"
          >
            <LogOut size={20} />
            {isOpen && "Logout"}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        {/* Content will be rendered here */}
      </div>
    </div>
  );
};

export default Sidebar;
