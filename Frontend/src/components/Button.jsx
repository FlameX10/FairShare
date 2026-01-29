const Button = ({
  children,
  onClick,
  type = "button",
  variant = "primary",
  disabled = false,
  loading = false,
  size = "md",
  ...props
}) => {
  const variants = {
    primary: "bg-gradient-to-r from-primary-600 to-primary-700 text-white hover:from-primary-700 hover:to-primary-800 shadow-md hover:shadow-lg active:shadow-sm",
    secondary: "bg-dark-100 text-dark-900 hover:bg-dark-200 border border-dark-300 shadow-sm hover:shadow-md",
    danger: "bg-gradient-to-r from-danger-500 to-danger-600 text-white hover:from-danger-600 hover:to-danger-700 shadow-md hover:shadow-lg",
    success: "bg-gradient-to-r from-success-500 to-success-600 text-white hover:from-success-600 hover:to-success-700 shadow-md hover:shadow-lg",
    ghost: "text-primary-600 hover:bg-primary-50 active:bg-primary-100",
    outline: "border-2 border-primary-600 text-primary-600 hover:bg-primary-50",
  };

  const sizes = {
    sm: "px-3 py-1.5 text-sm font-medium",
    md: "px-6 py-2.5 text-sm font-medium",
    lg: "px-8 py-3 text-base font-semibold",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`rounded-lg transition-all duration-200 flex items-center justify-center gap-2 ${sizes[size]} ${variants[variant]} ${
        disabled || loading ? "opacity-60 cursor-not-allowed" : "cursor-pointer"
      }`}
      {...props}
    >
      {loading ? (
        <>
          <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Loading...
        </>
      ) : (
        children
      )}
    </button>
  );
};

export default Button;
