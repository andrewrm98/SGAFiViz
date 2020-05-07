import React from "react";
import { withRouter } from "react-router";
import "./Footer.css";

/**
 * Footer for our webite. Shows authors and github link 
 *
 * @component
 * @example
 * return (
 *   <Footer />
 * )
 */
class Footer extends React.Component {
  render() {
    return (
      <footer className="footer">
        <br></br>
        <br></br>
        <br></br>
        <hr
          className="footer-line"
          style={{
            color: "#464646",
            backgroundColor: "#464646",
            height: 0.5,
            borderColor: "#464646 ",
          }}
        />
        <div className="content has-text-centered">
          <strong>This website was created as part of a MQP</strong>
          <p>
            By Peter Christakos, Andrew Morrison, Julian Pinzer, Katherine
            Thompson, and Lane Harrison (Advisor)
          </p>

          <div className="center-content">
            <figure className="image is-64x64">
              <a href="https://github.com/andrewrm98/SGAFiViz">
                <img
                  className="center-footer"
                  src={require("./github.png")}
                  alt=""
                ></img>
              </a>
            </figure>
            <figure className="image is-64x64">
              <a href="/docs">
                <img
                  className="center-footer"
                  src={require("./github.png")}
                  alt=""
                ></img>
              </a>
            </figure>
          </div>
        </div>
      </footer>
    );
  }
}

export default withRouter(Footer);
