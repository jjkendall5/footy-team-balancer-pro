
import React from "react";

const Header: React.FC = () => {
  return (
    <header className="py-4 mb-6">
      <h1 className="text-3xl font-bold text-center text-blue-800">
        Football Team Generator
      </h1>
      <p className="text-center text-gray-600 mt-2">
        Create balanced 8-a-side football teams
      </p>
    </header>
  );
};

export default Header;
