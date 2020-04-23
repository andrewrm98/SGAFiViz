import React, { Component } from "react";
import 'react-tabulator/lib/styles.css'; // required styles
import 'react-tabulator/lib/css/tabulator.min.css'; // theme
import { ReactTabulator } from 'react-tabulator'; // for React 15.x, use import { React15Tabulator }
import { Redirect } from "react-router-dom";

class RawDataTable extends Component {
    constructor(props) {
      super(props);
      this.state = {
        selected: [],
        columns : [
            {title: 'Name', field: 'name'},
            {title: 'Category', field: 'category'},
            {title: 'Budget', field: 'budget'},
            {title: 'Members', field: 'active_members'}
        ]
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
          return <ReactTabulator columns={this.state.columns} data={this.state.selected} />
        }
        return (
          <div>
            {this.props.alt != null ? "Alternate" : undefined} Nothing Selected!
          </div>
        );
      }
  }
  
  export default RawDataTable;
  
