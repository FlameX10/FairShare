const Card = ({ children, className = "", variant = "default" }) => {
  const variants = {
    default: "bg-white rounded-xl shadow-md-custom border border-dark-200 hover:shadow-lg-custom transition-shadow duration-300",
    elevated: "bg-white rounded-xl shadow-lg-custom border border-dark-100 hover:shadow-elevated transition-shadow duration-300",
    gradient: "bg-gradient-to-br from-white to-dark-50 rounded-xl shadow-md-custom border border-dark-200",
    transparent: "bg-white/80 backdrop-blur-sm rounded-xl shadow-sm-custom border border-dark-100/50",
  };

  return (
    <div className={`p-6 ${variants[variant]} ${className}`}>
      {children}
    </div>
  );
};

export default Card;
