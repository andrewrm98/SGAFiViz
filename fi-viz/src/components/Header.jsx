import React from "react";
import { Link } from "react-router-dom";
import './Header.css';

const Header = () => {
  return (
  <section className="hero has-bg-img">

    {/*  Hero head: will stick at the top */}
    <div className="hero-head">
      
    </div>

    {/* Hero content: will be in the middle */}
    <div className="hero-body has-text-centered">
      <h1 className="is-family-monospace title is-1 has-text-white">
        WPI Student Life Fee
      </h1> 
      <figure className = "image is-128x128 center">
        {/* Must use require() so that webpack can process the image*/}
        <img className = "center" src={require('./wpi-logo.png')} />
      </figure>
      
    </div>

    {/* Hero footer: will stick at the bottom */}
    <div className="hero-foot">
      <nav className="tabs is-boxed is-fullwidth">
        <div className="container">
          <ul>
            <li id = "tab-1" className = "is-family-monospace is-active"><Link className = "subtitle red" to="/story">Story</Link></li>
            <li id = "tab-2"><Link className = "is-family-monospace subtitle white" to="/budget">Budget</Link></li>
            <li id = "tab-3"><Link className = "is-family-monospace subtitle white" to="/about">About</Link></li>
          </ul>
        </div>
      </nav>
    </div>
  </section>
  );
};



export default Header;

// <Link to="/">Home</Link>
//       <Link to="/about">Show About Page</Link>