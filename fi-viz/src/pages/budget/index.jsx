import React, { Component } from "react";
import "./budget.css";
import RidgeChart from "../../components/Ridge.jsx";
import Select from "../../components/Select";
import ExampleSelectChart from "../../components/ExampleSelectChart";
import RadarChart from "./radarChart.jsx";
import ComponentSwitcher from "../../components/ComponentSwitcher";
import SunburstChart from "./Sunburst";
import LollipopSelect from "../../components/LollipopSelect";
import BarChart from "../../components/BarChart";
import ScatterPlot from "../../components/ScatterPlot";
import RawDataTable from "../../components/RawDataTable";

class BudgetPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      error: null,
      isLoaded: false,
      options: [],
      allOptions: [],
    };
  }

  componentDidMount() {
    fetch("/api/selection_options")
      .then((res) => res.json())
      .then(
        (result) => {
          // console.log(result.options);
          var options = result.options.map(function (obj) {
            return {
              name: obj.Name,
              category: obj.Category,
              fiscal_year: obj["Fiscal Year"],
              budget: obj["Total Budget"],
              active_members: parseInt(obj["Active Members"]),
            };
          });
          this.setState({
            isLoaded: true,
            options: options,
            allOptions: options,
          });
        },
        // Note: it's important to handle errors here
        // instead of a catch() block so that we don't swallow
        // exceptions from actual bugs in components.
        (error) => {
          this.setState({
            isLoaded: true,
            error,
          });
        }
      );
  }
  render() {
    return (
      <div className="budget-container">
        <Select options={this.state.options}>
          <ComponentSwitcher>
            <RawDataTable allOptions={this.state.allOptions} displayName={"Raw Data"} />
            {/* <ExampleSelectChart displayName={"Raw Data2"} />
            <ExampleSelectChart
              displayName={"Alternate Example Chart"}
              alt={2}
            /> */}
            <LollipopSelect displayName={"Lollipop"} />
            <ScatterPlot displayName={"Scatterplot"} />
            <BarChart displayName={"BarChart"}/>
          </ComponentSwitcher>
        </Select>
        <br></br>
        <br></br>
        <br></br>
        <br></br>
        <div className= "columns">
          <div className= "column chart-columns box border has-background-light ">
            <h1 className="title"> Chart Title </h1>
            <p> This a description for this beautiful chart that super cool and fun. </p>
            <br></br>
            <br></br>
            <SunburstChart />
          </div>
          <br></br>
          <br></br>
          <div className=  "column chart-columns box border has-background-light">
            <h1 className="title"> Chart Title </h1>
            <p> This a description for this beautiful chart that super cool and fun. </p>
            <br></br>
            <br></br>
            <RidgeChart/>  
          </div>
        </div>
        {/*<div className="flourish-embed" data-src="visualisation/1338475"/>/*}
        {/* <div style={{marginLeft: '15%', marginRight: '15%'}} className="flourish-embed" data-src="visualisation/1338248"/> */}
      </div>
    );
  }
}

export default BudgetPage;
