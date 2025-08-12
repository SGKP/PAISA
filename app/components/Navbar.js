import React from "react";

const Navbar = () => {
  return (
    <div>
      <nav className="bg-gray-800 text-white flex justify-between px-4 h-16 items-center">
        <div className="logo font-bold text-xl">
         Get-me-a-chai
        </div>
        <ul className="flex justify-between gap-4">
          <li>Home</li>
          <li>About</li>
          <li>Projects</li>
          <li>Sign in</li>
          <li>Login</li>
        </ul>
      </nav>
    </div>
  );
};

export default Navbar;
