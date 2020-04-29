import React, { Component } from "react";
import PropTypes from "prop-types";

/**
 * Example for a component that uses the multi-select data
 *
 * @prop {array} selected The selected obects from the @external Select.jsx component
 * @prop {element} alt If we want an 'alternate' component for comparison
 *
 * @component
 * @example
 * const options = {
 *    name: "Cyber Security Club",
 *    category: "Academic",
 *    budget: "15000",
 *    active_members: 23,
 * }
 * return (
 *   <ExampleSelectChart selected={options} />
 * )
 */
class ExampleSelectChart extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selected: [],
    };
  }

  componentDidMount() {
    this.setState(function (state, props) {
      return {
        selected: props.selected,
      };
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
          {club.name} - {club.category}: ${club.budget} -_- Members:{" "}
          {club.active_members}
        </li>
      ));
      return (
        <div className="columns">
          <div className="column is-three-quarters">
            {this.props.alt ? "Alternate" : undefined}
            <ul>{listItems}</ul>
          </div>
          <div className="column">
            <p>Description of Chart</p>
          </div>
        </div>
      );
    }
    return (
      <div>
        {this.props.alt ? "Alternate" : undefined} Nothing Selected, select
        clubs on the left to see more information!
      </div>
    );
  }
}

ExampleSelectChart.propTypes = {
  /**
   * selected The selected obects from the @external Select component
   */
  selected: PropTypes.array,

  /**
   * If we want an 'alternate' component for comparison
   */
  alt: PropTypes.bool,
};

export default ExampleSelectChart;
