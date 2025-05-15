
import React from "react";

const LoadingState: React.FC = () => {
  return (
    <div className="text-center p-8">
      <div className="animate-spin h-8 w-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
      <p>Loading players...</p>
    </div>
  );
};

export default LoadingState;
