import React, { Component } from 'react';
import Plot from 'react-plotly.js';

class BarChart extends Component {

    constructor(props) {
      super(props);
      this.state = {
        error: null,
        isLoaded: false,
        budgets: []
      };
    }
  
    componentDidMount() {
      fetch("/api/budget_breakdown")
        .then(res => res.json())
        .then(
          (result) => {
            this.setState({
              isLoaded: true,
              budgets: result.budgets
            });
          },
          // Note: it's important to handle errors here
          // instead of a catch() block so that we don't swallow
          // exceptions from actual bugs in components.
          (error) => {
            this.setState({
              isLoaded: true,
              error
            });
          }
        )
    }
  
    render() {
      const { error, isLoaded, budgets } = this.state;
      if (error) {
        return <div>Error: {error.message}</div>;
      } else if (!isLoaded) {
        return <div>Loading...</div>;
      } else {
  
          // extract data from json
          var xAxis = [], yMT = [], yCB = [], yTotal =[], yOther = [], i = 0
          for (i=0; i< budgets.length; i++) {
            xAxis.push((budgets[i])["Fiscal Year"])
            yMT.push((budgets[i])["Mandatory Transfers Budget"])
            yCB.push((budgets[i])["Club Budget"])
            yTotal.push((budgets[i])["Total"])
            yOther.push((budgets[i])["Other"])
          }
  
          var trace1 = {
            x: xAxis,
            y: yMT,
            name: "Mandatory Transfers",
            type: "bar",
            marker: {
              color: 'rgb(241, 70, 104)'}
          };
          var trace2 = {
            x: xAxis,
            y: yCB,
            name: "Organization Budgets",
            type: "bar",
            marker: {
              color: 'rgb(255, 221, 87)'}
          };
          var trace3 = {
            x: xAxis,
            y: yOther,
            name: "Other",
            type: "bar",
            marker: {
              color: 'rgb(49, 152, 219)'}
          };
  
          return (
            <Plot className = "fill-space"
            data = {[trace1, trace2, trace3]}
            layout = {{barmode: "stack",
                      autosize: true, 
                        title: 'Total Budget by Allocation Type',
                        yaxis: {
                          title: 'Total Budget',
                          showline: false
                        },
                        xaxis: {
                          title: 'Fiscal Year',
                          showline: false}
                      }}
            useResizeHandler={true}
            />
        );
      }
    }
  }

  export default BarChart;