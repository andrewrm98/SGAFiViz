import React, { Component } from "react";

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
      // console.log(component);
      return (
        <li
          key={component.props.displayName.toString()}
          className={this.state.componentNum === index ? "is-active" : ""}
          onClick={() => this.changeComponent(index)}
        >
          <a>
            <span> {component.props.displayName}</span>
          </a>
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

export default ComponentSwitcher;
