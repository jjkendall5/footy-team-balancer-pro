
import React from "react";

const EmptyState: React.FC = () => {
  return (
    <div className="text-center p-8 border border-dashed rounded-lg">
      <p className="text-gray-500">No players added yet. Add your first player above.</p>
    </div>
  );
};

export default EmptyState;
