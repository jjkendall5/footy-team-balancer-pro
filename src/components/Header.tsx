
import React from "react";

const Header: React.FC = () => {
  return (
    <header className="mb-8 text-center">
      <h1 className="text-3xl font-bold mb-2 text-blue-700">
        Baller Balancer
      </h1>
      <p className="text-gray-600 max-w-lg mx-auto">
        Create balanced football teams
      </p>
    </header>
  );
};

export default Header;
