import Card from "./Card";

const ExpenseCard = ({ friendName, amount, description, date }) => {
  return (
    <Card className="flex justify-between items-center">
      <div>
        <h3 className="font-semibold text-lg">{friendName}</h3>
        <p className="text-gray-500 text-sm">{description}</p>
        <p className="text-gray-400 text-xs">{new Date(date).toLocaleDateString()}</p>
      </div>
      <div className="text-lg font-bold text-blue-600">₹{amount}</div>
    </Card>
  );
};

export default ExpenseCard;
