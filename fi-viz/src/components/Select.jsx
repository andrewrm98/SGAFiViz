import React, { Component } from "react";
import { Multiselect } from "multiselect-react-dropdown";

class Select extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selected: [],
    };
    this.onSelect = this.onSelect.bind(this);
    this.onRemove = this.onRemove.bind(this);
  }

  componentDidMount() {}

  componentDidUpdate(prevProps) {}

  onSelect(selected) {
    console.log(selected);
    this.setState({
      selected: selected,
    });
  }

  onRemove(selected) {
    console.log(selected);
    this.setState({
      selected: selected,
    });
  }

  render() {
    // const children = React.Children.map(this.props.children, child => {
    //   return React.cloneElement(child, {
    //     data: undefined
    //   });
    // });
    return (
      <div className="columns">
        <div className="column is-one-quarter">
          <Multiselect
            options={this.props.options} // Options to display in the dropdown
            groupBy="category" // Value to group options by
            onSelect={this.onSelect} // Function will trigger on select event
            onRemove={this.onRemove} // Function will trigger on remove event
            displayValue="name" // Property name to display in the dropdown options
          />
        </div>
        <div className="column">
          {React.cloneElement(this.props.children, {
            selected: this.state.selected,
          })}
        </div>
      </div>
    );
  }
}

export default Select;
