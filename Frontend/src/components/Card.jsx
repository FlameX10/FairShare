const Card = ({ children, className = "", variant = "default" }) => {
  const variants = {
    default: "bg-white rounded-xl shadow-md border border-dark-200 hover:shadow-lg transition-shadow duration-300",
    elevated: "bg-white rounded-xl shadow-lg border border-dark-100 hover:shadow-xl transition-shadow duration-300",
    gradient: "bg-white rounded-xl shadow-md border border-dark-200",
    transparent: "bg-white/80 backdrop-blur-sm rounded-xl shadow-sm border border-dark-100/50",
  };

  return (
    <div className={`p-6 ${variants[variant]} ${className}`}>
      {children}
    </div>
  );
};

export default Card;
