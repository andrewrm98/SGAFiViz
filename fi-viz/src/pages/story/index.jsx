import React, { Component } from 'react';


class StoryPage extends Component {

  constructor(props) {
    super(props);
    this.state = {
      budgets: []
    };
  }

  componentDidMount() {
    this.getData();
  }

  getData = async () => {
    const response = await fetch('/api/home');
    const body = await response.json();
    if (response.status !== 200) throw Error(body.message);
    this.setState({ budgets: body.budgets });
  }

  render() {
    return (
      <div>
        <h1>Story Page</h1>
      </div>
    );
  }

}

export default StoryPage;