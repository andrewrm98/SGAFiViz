import React, { Component } from "react";
import Plot from 'react-plotly.js';

class RidgeChart extends Component {
  constructor(props) {
    super(props);
    this.state = {
      error: null,
      isLoaded: false,
      data: {},
      clubBudgets: [],
      categories: [],
      mandatory_transfers: []
    };
  }

  componentDidMount() {
    fetch("/api/sunburst")
      .then(res => res.json())
      .then(
        (result) => {
          // console.log(result.data);
          this.setState({
            isLoaded: true,
            data: result.data
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
    fetch("/api/club_budgets")
      .then(res => res.json())
      .then(
        (result) => {
          // console.log(result.budgets);
          this.setState({
            isLoaded: true,
            clubBudgets: result.budgets
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
    fetch("/api/categories_budgets")
      .then(res => res.json())
      .then(
        (result) => {
          // console.log(result.budgets);
          this.setState({
            isLoaded: true,
            categories: result.budgets
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

    fetch("/api/mandatory_transfers")
      .then(res => res.json())
      .then(
        (result) => {
          // console.log(result.mandatory);
          this.setState({
            isLoaded: true,
            mandatory_transfers: result.mandatory
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

  plotlyClickHandler(data) {
    console.log("plotlyClickHandler");
    console.log(data);
  }

  render() {
    // var data = [{
    //   type: 'violin',
    //   x: unpack(rows, 'day'),
    //   y: unpack(rows, 'total_bill'),
    //   legendgroup: 'Yes',
    //   scalegroup: 'Yes',
    //   name: 'Yes',
    //   side: 'negative',
    //   box: {
    //     visible: true
    //   },
    //   line: {
    //     color: 'blue',
    //     width: 2
    //   },
    //   meanline: {
    //     visible: true
    //   }
    // }, {
    //   type: 'violin',
    //   x: unpack(rows, 'day'),
    //   y: unpack(rows, 'total_bill'),
    //   legendgroup: 'No',
    //   scalegroup: 'No',
    //   name: 'No',
    //   side: 'positive',
    //   box: {
    //     visible: true
    //   },
    //   line: {
    //     color: 'green',
    //     width: 2
    //   },
    //   meanline: {
    //     visible: true
    //   }
    // }]

    // var layout = {
    //   title: "Split Violin Plot",
    //   yaxis: {
    //     zeroline: false
    //   },
    //   violingap: 0,
    //   violingroupgap: 0,
    //   violinmode: "overlay",
    // }

    return (
    //   <Plot className="fill-space"
    //     data={[
    //       {
    //         type: "violin",
    //         x: ,
    //         y: ,
    //         legendgroup: 'Yes',
    //         scalegroup: 'Yes',
    //         name: 'Yes',
    //         side: 'negative',
    //         box: {
    //           visible: true
    //         },
    //         line: {
    //           color: 'blue',
    //           width: 2
    //         },
    //         meanline: {
    //           visible: true
    // //   }
    //       },
    //     ]}
    //     layout={{
    //       margin: { l: 0, r: 0, b: 0, t: 0 },
    //       sunburstcolorway: [
    //         "#636efa", "#EF553B", "#00cc96", "#ab63fa", "#19d3f3",
    //         "#e763fa", "#FECB52", "#FFA15A", "#FF6692", "#B6E880"
    //       ],
    //       extendsunburstcolorway: true,
    //       title: 'A Fancy Plot'
    //     }}
    //     useResizeHandler={true}
    //     onClick={this.plotlyClickHandler}
    //   />
    );
  }
}



export default RidgeChart;
