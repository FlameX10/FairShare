const Input = ({
  label,
  type = "text",
  placeholder,
  value,
  onChange,
  error,
  icon: Icon,
  variant = "default",
  ...props
}) => {
  const variants = {
    default: "border-dark-300 focus:border-primary-500 focus:ring-primary-200",
    subtle: "border-dark-200 focus:border-primary-400 focus:ring-primary-100",
  };

  return (
    <div className="mb-6">
      {label && (
        <label className="block text-sm font-semibold text-dark-900 mb-2.5">
          {label}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <Icon className="absolute left-3.5 top-3.5 text-dark-400 pointer-events-none" size={18} />
        )}
        <input
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          className={`w-full px-4 py-2.5 ${Icon ? 'pl-10' : 'px-4'} border-2 rounded-lg focus:outline-none focus:ring-2 transition-all text-sm bg-white ${
            error
              ? "border-danger-300 focus:border-danger-500 focus:ring-danger-200 bg-danger-50"
              : `border-dark-300 focus:border-primary-500 focus:ring-primary-200 hover:border-dark-400`
          }`}
          {...props}
        />
      </div>
      {error && (
        <div className="flex items-center gap-1.5 text-danger-600 text-xs mt-2 font-medium">
          <span>•</span>
          <p>{error}</p>
        </div>
      )}
    </div>
  );
};

export default Input;
