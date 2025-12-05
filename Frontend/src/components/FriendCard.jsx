import Card from "./Card";

const FriendCard = ({ name, upiId }) => {
  return (
    <Card className="flex justify-between items-center">
      <div>
        <h3 className="font-semibold text-lg">{name}</h3>
        <p className="text-gray-500 text-sm">{upiId}</p>
      </div>
    </Card>
  );
};

export default FriendCard;
