import React from "react";
import { Link } from "react-router-dom";
import './Header.css';
import { tsConstructorType } from "@babel/types";

class Header extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      active : 'tab-1'
    }
  }
W
  render() {
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
                <li onClick = { () => { this.setState({ active: 'tab-1' })} } id = "one" className = {this.state.active === 'tab-1' ? 'mytabs is-family-monospace is-active' : 'mytabs is-family-monospace'}><Link  className = {this.state.active === 'tab-1' ? 'subtitle red' : 'subtitle white'} to="/">Story</Link></li>
                <li onClick = { () => { this.setState({ active: 'tab-2' })} } id = "two" className = {this.state.active === 'tab-2' ? 'mytabs is-family-monospace is-active' : 'mytabs is-family-monospace'}><Link className = {this.state.active === 'tab-2' ? 'subtitle red' : 'subtitle white'} to="/budget">Budget</Link></li>
                <li onClick = { () => { this.setState({ active: 'tab-3' })} } id = "three" className = {this.state.active === 'tab-3' ? 'mytabs is-family-monospace is-active' : 'mytabs is-family-monospace'}><Link className = {this.state.active === 'tab-3' ? 'subtitle red' : 'subtitle white'} to="/about">About</Link></li>
              </ul>
            </div>
          </nav>
        </div>
      </section>
      );
  }
  
};



export default Header;

// <Link to="/">Home</Link>
//       <Link to="/about">Show About Page</Link>