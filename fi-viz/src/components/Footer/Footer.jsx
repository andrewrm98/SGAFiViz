import React from "react";
import { withRouter } from "react-router";
import './Footer.css';

class Header extends React.Component {

    render() {
        return (
            <footer className="footer">
                <div className="content has-text-centered">

                    <strong>This website was created as part of a MQP</strong>
                    <p>By Peter Christakos, Andrew Morrison, Julian Pinzer, Katherine Thompson, and Lane Harrison (Advisor)</p>

                    <div className="center-content">
                        <figure className="image is-64x64">
                            <a href="https://github.com/andrewrm98/SGAFiViz"><img className="center-footer" src={require("./github.png")} alt=""></img></a>
                        </figure>
                    </div>
                </div>
            </footer>
        );
    }

};



export default withRouter(Header);