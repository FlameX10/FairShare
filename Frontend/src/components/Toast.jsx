import { useState, useEffect } from "react";
import { CheckCircle2, AlertCircle, X } from "lucide-react";

const Toast = ({ message, type = "success" }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(false), 3500);
    return () => clearTimeout(timer);
  }, []);

  if (!isVisible) return null;

  const bgColor = type === "success" 
    ? "bg-success-50 border-success-200" 
    : "bg-danger-50 border-danger-200";
  const textColor = type === "success" ? "text-success-700" : "text-danger-700";
  const Icon = type === "success" ? CheckCircle2 : AlertCircle;

  return (
    <div className={`fixed top-6 right-6 ${bgColor} border ${textColor} px-5 py-4 rounded-xl shadow-lg flex items-center gap-3 max-w-sm animate-in slide-in-from-top-5 duration-300`}>
      <Icon size={20} className="flex-shrink-0" />
      <span className="font-medium text-sm">{message}</span>
      <button
        onClick={() => setIsVisible(false)}
        className="ml-auto text-current hover:opacity-70 transition-opacity"
      >
        <X size={18} />
      </button>
    </div>
  );
};

export default Toast;
