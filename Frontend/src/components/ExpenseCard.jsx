import Card from "./Card";
import { Calendar, User, Tag } from "lucide-react";

const ExpenseCard = ({ friendName, amount, description, date, type = "lend" }) => {
  return (
    <Card variant="elevated" className="flex justify-between items-center hover:shadow-lg transition-all duration-300 group">
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-2">
          <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${
            type === "lend" 
              ? "bg-success-100 text-success-700" 
              : "bg-danger-100 text-danger-700"
          }`}>
            {type === "lend" ? "Lent" : "Borrowed"}
          </span>
        </div>
        <h3 className="font-bold text-dark-900 text-base">{friendName}</h3>
        <p className="text-dark-600 text-sm mt-1 flex items-center gap-1">
          <Tag size={14} />
          {description}
        </p>
        <p className="text-dark-500 text-xs mt-2 flex items-center gap-1">
          <Calendar size={13} />
          {new Date(date).toLocaleDateString('en-IN', { 
            year: 'numeric', 
            month: 'short', 
            day: 'numeric' 
          })}
        </p>
      </div>
      <div className={`text-2xl font-bold group-hover:scale-105 transition-transform ${
        type === "lend" ? "text-success-600" : "text-danger-600"
      }`}>
        ₹{amount}
      </div>
    </Card>
  );
};

export default ExpenseCard;
