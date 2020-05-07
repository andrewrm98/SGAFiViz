import React from "react";
import { Link } from "react-router-dom";
import { withRouter } from "react-router";
import './Header.css';

/**
 * Header for our webite. Covers WPI logo through to the 3 tabs for each page. 
 *
 * @component
 * @example
 * return (
 *   <Header />
 * )
 */
class Header extends React.Component {

  constructor(props) {
    super(props);
    let active = props.location.pathname.substring(1);
    if (!active) {
      active = "story";
    }
    this.state = {
      active: active
    }
  }

  render() {
    return (
      <section className="hero has-bg-img is-small">
        {/*  Hero head: will stick at the top */}
        <div className="hero-head">
        </div>

        {/* Hero content: will be in the middle */}
        <div className="hero-body has-text-centered">
        <img className = "center" src={require('./wpilogo-edited.png')} width="100" height="200" alt = ""/>
        </div>
        <br></br>

        {/* Hero footer: will stick at the bottom */}
        <div className="hero-foot">
          <nav className="tabs is-boxed is-fullwidth">
            <div className="container">
              <ul>
                <li onClick={() => { this.setState({ active: 'story' }) }} id="one" className={this.state.active === 'story' ? 'mytabs is-active' : 'mytabs'}><Link className={this.state.active === 'story' ? 'subtitle red ' : 'subtitle white'} to="/">Story</Link></li>
                <li onClick={() => { this.setState({ active: 'budget' }) }} id="two" className={this.state.active === 'budget' ? 'mytabs is-active' : 'mytabs'}><Link className={this.state.active === 'budget' ? 'subtitle red' : 'subtitle white'} to="/budget">Budget</Link></li>
                <li onClick={() => { this.setState({ active: 'about' }) }} id="three" className={this.state.active === 'about' ? 'mytabs is-active' : 'mytabs is-family-monospace'}><Link className={this.state.active === 'about' ? 'subtitle red' : 'subtitle white'} to="/about">About</Link></li>
              </ul>
            </div>
          </nav>
        </div>
      </section>
    );
  }

};



export default withRouter(Header);

// <Link to="/">Home</Link>
//       <Link to="/about">Show About Page</Link>