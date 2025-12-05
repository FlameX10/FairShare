const Button = ({
  children,
  onClick,
  type = "button",
  variant = "primary",
  disabled = false,
  loading = false,
  ...props
}) => {
  const variants = {
    primary: "bg-blue-600 text-white hover:bg-blue-700",
    secondary: "bg-gray-300 text-gray-800 hover:bg-gray-400",
    danger: "bg-red-600 text-white hover:bg-red-700",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`px-6 py-2 rounded-lg font-medium transition-all ${variants[variant]} ${
        disabled || loading ? "opacity-50 cursor-not-allowed" : ""
      }`}
      {...props}
    >
      {loading ? "Loading..." : children}
    </button>
  );
};

export default Button;
