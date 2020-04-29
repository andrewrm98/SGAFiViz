import React, { Component } from "react";
import 'react-tabulator/lib/styles.css'; // required styles
import 'react-tabulator/lib/css/tabulator.min.css'; // theme
import { ReactTabulator } from 'react-tabulator'; // for React 15.x, use import { React15Tabulator }


class RawDataTable extends Component {
    constructor(props) {
      super(props);
      this.state = {
        selected: [],
        columns : [
            {title: 'Name', field: 'name'},
            {title: 'Category', field: 'category'},
            {title: 'Budget', field: 'budget', formatter:"money", bottomCalc:"sum", bottomCalcFormatter: "money",
              bottomCalcFormatterParams:  {
                decimal: ".",
                thousand: ",",
                symbol: "$"
              }, formatterParams: {
                decimal: ".",
                thousand: ",",
                symbol: "$"
            }},
            {title: 'Members', field: 'active_members', bottomCalc:"sum"}
        ],
        tableOptions: {
          pagination: 'local', 
          paginationSize: '20',
          responsiveLayout:"hide",  //hide columns that dont fit on the table
          tooltips:true,            //show tool tips on cells
          movableColumns:true,      //allow column order to be changed
          resizableRows:true,       //allow row order to be changed
          initialSort:[             //set the initial sort order of the data
            {column:"name", dir:"asc"},
          ],
        },
        table_size: 0,
      };
    }
  
    componentDidMount() { 
      this.setState(function (state, props) {
        return {
          selected: props.selected,
          table_size: props.selected.length,
        };
      });
      
    }

    componentDidUpdate(prevProps, prevState) {    
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
        return (
          <div>
            <ReactTabulator 
                columns={this.state.columns} 
                data={this.state.selected}
                options={this.state.tableOptions}
              />
          </div>
        );
      }
      return (
        <div>    
          <ReactTabulator 
              columns={this.state.columns} 
              data={this.props.allOptions}
              options={this.state.tableOptions}
            />
        </div>
      );
    }
  }
  
  export default RawDataTable;
  
