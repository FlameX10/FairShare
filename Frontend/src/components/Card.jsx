const Card = ({ children, className = "" }) => {
  return (
    <div
      className={`bg-white rounded-lg shadow-md p-6 border border-gray-100 ${className}`}
    >
      {children}
    </div>
  );
};

export default Card;
