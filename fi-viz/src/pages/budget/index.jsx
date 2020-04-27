import React, { Component } from "react";
import "./budget.css";
import RidgeChart from "./Ridge.jsx";
import Select from "../../components/multi-select/Select";
import ComponentSwitcher from "../../components/multi-select/ComponentSwitcher";
import SunburstChart from "./Sunburst";
import LollipopSelect from "../../components/multi-select/LollipopSelect";
import BarChart from "../../components/multi-select/BarChart";
import ScatterPlot from "../../components/multi-select/ScatterPlot";
import RawDataTable from "../../components/multi-select/RawDataTable";
import TotalLineChart from "./totalLineChart"

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
      <div>

        {/* Intro Section - Budgets Summary*/}

        <div className="story-intro">
          <div className = "intro-card box border">
              <div>
                <h1 className = "title"> Budgets Page Title </h1>
                <p>Budgets description</p>
              </div>
          </div>
        </div>

        <div className = "total-line-chart box" id="lineChartBox">
            <TotalLineChart/>
        </div>
        <br></br>
        <br></br>
        <br></br>

        <div className="b-slanted light-red-bg">
          <br></br>
          <br></br>
          <div className="budget-container">
            <Select options={this.state.options}>
              <ComponentSwitcher>
                <RawDataTable allOptions={this.state.allOptions} displayName={"Raw Data"} />
                <LollipopSelect displayName={"Lollipop"} />
                <ScatterPlot allOptions={this.state.allOptions} displayName={"Scatterplot"} />
                <BarChart displayName={"BarChart"}/>
              </ComponentSwitcher>
            </Select>
            <br></br>
            <br></br>
            <br></br>
            <br></br>
          </div>
          <div className="b-slanted b-red-bg">
            <br></br>
            <br></br>
            <div className= "chart-columns box border has-background-light">
              <h1 className="title"> Categorical Budget Sunburst </h1>
              <p> This interactive sunburst diagram shows
                a total breakdown of budget allocations. This goes from top level (overarching categories) 
                to the low level (type of club).
              </p>
              <br></br>
              <br></br>
              <SunburstChart />
            </div>
            <br></br>
            <br></br>
            <div className=  "chart-columns box border has-background-light">
              <h1 className="title"> Active Club Members Ridge Chart  </h1>
              <p> The peaks in each category show the frequency of clubs with a certain amount of students. </p>
              <br></br>
              <RidgeChart/>  
            </div>
            <br></br>
            <br></br>
          </div>
        </div>
      </div>
    );
  }
}

export default BudgetPage;
