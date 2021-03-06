import React, { Component } from 'react';
import './App.css';
import { Provider } from 'react-redux';
import store from './store';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Home from './views/Home/Home';
import Dashboard from './views/Dashboard/Dashboard';
import Login from './views/Login/Login';
import Header from './views/Header/Header';

class App extends Component {
  render() {
    const App = () => (
      <div>
        <Header />
          <Switch>
            <Route exact path='/' component={Home} />
            <Route path='/dashboard' component={Dashboard} />
            <Route path='/login' component={Login} />
          </Switch>
      </div>
    )
    return (
      <Provider store={store}>
        <App />
      </Provider>
    );
  }
}

export default App;
