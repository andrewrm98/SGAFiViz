import React, { Component } from "react";
import { Multiselect } from "multiselect-react-dropdown";

class Select extends Component {
  options = [
    {
      name: "Cyber Security Club",
      category: "Academic",
      budget: "15000",
      active_members: 23,
    },
    {
      name: "The Alliance",
      category: "Awareness",
      budget: "3550",
      active_members: 43,
    },
    {
      name: "Colleges Against Cancer",
      category: "Community Service",
      budget: "70000",
      active_members: 75,
    },
    {
      name: "Habitat For Humanity",
      category: "Community Service",
      budget: "13505",
      active_members: 30,
    },
    { name: "Hillel", category: "Cultural", budget: "2500" },
    {
      name: "Game Development Club",
      category: "Extracurricular",
      budget: "300",
      active_members: 35,
    },
  ];
  constructor(props) {
    super(props);
    this.state = {
      selected: [],
    };
    this.onSelect = this.onSelect.bind(this);
    this.onRemove = this.onRemove.bind(this);
  }

  onSelect(selected) {
    this.setState({
      selected: selected,
    });
  }

  onRemove(selected) {
    this.setState({
      selected: selected,
    });
  }

  render() {
    return (
      <div className="columns">
        <div className="column is-one-third">
          <Multiselect
            options={this.props.options} // Options to display in the dropdown
            groupBy="category" // Value to group options by
            placeholder="Select Club(s)"
            onSelect={this.onSelect} // Function will trigger on select event
            onRemove={this.onRemove} // Function will trigger on remove event
            displayValue="name" // Property name to display in the dropdown options
            style={{
              chips: { background: "#9D1212" },
              searchBox: {
                "background": "white",
                "borderBottom": "1px solid #9D1212",
                "borderRadius": "0px",
                // "border": "none",
              },
            }}
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
