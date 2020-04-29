import React, { Component } from "react";
import PropTypes from "prop-types";

/**
 * Component for showing a tabbed list of components that selection data from the Select component gets passed into.
 *
 * @prop {array} selected The selected objects to show in each component.
 * @prop {element} children The child element(s) to have that the user can select between. Needs a displayName prop in each child to show in the tabbed list of components.
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
 *   <ComponentSwitcher selected={options}>
 *      <ExampleSelectChart displayName="Example" />
 *   </ComponentSwitcher>
 * )
 */
class ComponentSwitcher extends Component {
  constructor(props) {
    super(props);
    this.state = {
      componentNum: 0,
    };
    this.changeComponent = this.changeComponent.bind(this);
    this.getComponentList = this.getComponentList.bind(this);
  }

  changeComponent(selected) {
    this.setState({
      componentNum: selected,
    });
  }

  getComponentList() {
    const listComponents = this.props.children.map((component, index) => {
      return (
        <li
          key={component.props.displayName.toString()}
          className={this.state.componentNum === index ? "is-active" : "has-background-light"}
          onClick={() => this.changeComponent(index)}
        >
           <div>{
              //eslint-disable-next-line react/jsx-no-target-blank
              }
            <a>
              <span>{component.props.displayName}</span>
            </a>
          </div>
        </li>
      );
    });
    return (
      <div className="tabs is-toggle is-toggle">
        <ul>{listComponents}</ul>
      </div>
    );
  }

  render() {
    return (
      <div className="multi-select">
        {this.getComponentList()}

        {React.cloneElement(this.props.children[this.state.componentNum], {
          selected: this.props.selected,
        })}
      </div>
    );
  }
}

ComponentSwitcher.propTypes = {
  /**
   * The options for the multi select component to show.
   */
  options: PropTypes.array,

  /**
   * The child element(s) to have in the Select component to pass the selected options as props to.
   */
  children: PropTypes.element.isRequired,
};

export default ComponentSwitcher;
