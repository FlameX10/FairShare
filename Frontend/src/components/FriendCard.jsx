import Card from "./Card";
import { User, Mail, Smartphone } from "lucide-react";

const FriendCard = ({ name, upiId, email, balance = 0 }) => {
  const isPositive = balance > 0;
  const isNeutral = balance === 0;

  return (
    <Card variant="elevated" className="hover:shadow-lg transition-all duration-300 group">
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-400 to-secondary-400 flex items-center justify-center">
              <User size={18} className="text-white" />
            </div>
            <div>
              <h3 className="font-bold text-dark-900 text-base">{name}</h3>
              {email && (
                <p className="text-dark-600 text-xs flex items-center gap-1">
                  <Mail size={12} />
                  {email}
                </p>
              )}
            </div>
          </div>
          
          {upiId && (
            <p className="text-dark-600 text-sm flex items-center gap-2 mt-3 bg-dark-50 rounded-lg px-3 py-2 w-fit">
              <Smartphone size={14} />
              {upiId}
            </p>
          )}
        </div>

        {balance !== undefined && (
          <div className={`text-right font-bold text-lg group-hover:scale-105 transition-transform ${
            isNeutral 
              ? "text-dark-500" 
              : isPositive 
                ? "text-success-600" 
                : "text-danger-600"
          }`}>
            {isNeutral ? "Settled" : isPositive ? `+₹${balance}` : `-₹${Math.abs(balance)}`}
          </div>
        )}
      </div>
    </Card>
  );
};

export default FriendCard;
