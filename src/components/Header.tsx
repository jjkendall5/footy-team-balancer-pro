
import React from "react";

const Header: React.FC = () => {
  return (
    <header className="mb-8 text-center">
      <h1 className="text-3xl font-bold mb-2 text-blue-700">
        Balanced Football Teams Generator
      </h1>
      <p className="text-gray-600 max-w-lg mx-auto">
        Create perfectly balanced football teams based on player skill and teamwork ratings
      </p>
    </header>
  );
};

export default Header;
