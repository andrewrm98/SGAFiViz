import React, { Component } from "react";

class ExampleSelectChart extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selected: []
    };
  }

  componentDidMount() {
    this.setState({
      selected: this.props.selected
    });
  }

  static getDerivedStateFromProps(props, current_state) {
    if (current_state.selected !== props.selected) {
      return {
        selected: props.selected
      };
    }
    return null;
  }

  render() {
    if (this.state.selected.length > 0) {
      const listItems = this.state.selected.map(club => (
        <li key={club.name.toString()}>
          {" "}
          {club.name} - {club.category}: ${club.budget} -_- Members:{" "}
          {club.active_members}
        </li>
      ));
      return <ul>{listItems}</ul>;
    }
    return <div>Nothing Selected!</div>;
  }
}

export default ExampleSelectChart;