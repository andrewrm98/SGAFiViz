import React, { Component } from "react";

class ExampleSelectChart extends Component {
  static displayName = "Example Chart";
  constructor(props) {
    super(props);
    this.state = {
      selected: [],
    };
  }

  componentDidMount() {
    this.setState({
      selected: this.props.selected,
    });
  }

  static getDerivedStateFromProps(props, current_state) {
    if (current_state.selected !== props.selected) {
      return {
        selected: props.selected,
      };
    }
    return null;
  }

  render() {
    if (this.state.selected.length > 0) {
      const listItems = this.state.selected.map((club) => (
        <li key={club.name.toString()}>
          {" "}
          {club.name} - {club.category}: ${club.budget} -_- Members:{" "}
          {club.active_members}
        </li>
      ));
      return (
        <div>
          {this.props.alt != null ? "Alternate" : undefined}
          <ul>{listItems}</ul>
        </div>
      );
    }
    return (
      <div>
        {this.props.alt != null ? "Alternate" : undefined} Nothing Selected!
      </div>
    );
  }
}

export default ExampleSelectChart;
