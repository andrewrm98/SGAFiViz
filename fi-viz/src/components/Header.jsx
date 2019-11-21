import React from "react";
import { Link } from "react-router-dom";

const Header = () => {
  return (
    <div>
      <Link to="/">Home</Link>
      <Link to="/about">Show About Page</Link>
    </div>
  );
};

export default Header;