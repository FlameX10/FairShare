const Loader = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-dark-50">
      <div className="flex flex-col items-center gap-4">
        {/* Animated Spinner */}
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 rounded-full border-4 border-primary-100"></div>
          <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-primary-600 border-r-primary-500 animate-spin"></div>
          <div className="absolute inset-2 rounded-full border-4 border-transparent border-b-primary-400 animate-spin" style={{ animationDirection: 'reverse' }}></div>
        </div>
        
        {/* Loading Text */}
        <div className="text-center">
          <p className="text-dark-600 font-semibold">Loading...</p>
          <p className="text-dark-500 text-sm mt-1">Please wait a moment</p>
        </div>
      </div>
    </div>
  );
};

export default Loader;
