/*App.js*/
import React, { Component } from "react";
import "./App.css";
//Import all needed Component for this tutorial
import { BrowserRouter as Router, Route } from "react-router-dom";
import StoryPage from "./pages/story";
import AboutPage from "./pages/about";
import BudgetPage from "./pages/budget";
import Header from "./components/Header/Header.jsx";
import Footer from "./components/Footer/Footer.jsx";
import "./sass/mystyles.scss";

/**
 * The component containing the main application.
 *
 * @component
 * @example
 * return (
 *   <App />
 * )
 */
class App extends Component {
  render() {
    return (
      <div>
        <Router>
          <Header />
          <Route exact path="/" component={StoryPage} />
          <Route path="/about" component={AboutPage} />
          <Route path="/budget" component={BudgetPage} />
          <Footer />
        </Router>
      </div>
    );
  }
}

export default App;
