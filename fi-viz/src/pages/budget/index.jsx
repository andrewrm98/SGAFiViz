import React, { Component } from "react";
import "./budget.css";
import RidgeChart from "../../components/Ridge.jsx";
import Select from "../../components/Select";
import ExampleSelectChart from "../../components/ExampleSelectChart";
import RadarChart from "./radarChart.jsx";
import ComponentSwitcher from "../../components/ComponentSwitcher";
import SunburstChart from "./Sunburst";
import LollipopSelect from "../../components/LollipopSelect";

class BudgetPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      error: null,
      isLoaded: false,
      options: [],
    };
  }

  componentDidMount() {
    fetch("/api/selection_options")
      .then((res) => res.json())
      .then(
        (result) => {
          console.log(result.options);
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
      <div style={{ marginLeft: "15%", marginRight: "15%" }}>
        <Select options={this.state.options}>
          <ComponentSwitcher>
            <ExampleSelectChart displayName={"Test Example Chart"} />
            <ExampleSelectChart
              displayName={"Alternate Example Chart"}
              alt={2}
            />
              <LollipopSelect displayName={"Lollipop"}/>
          </ComponentSwitcher>
        </Select>
        <RadarChart></RadarChart>
        <SunburstChart />
        <RidgeChart />
        {/*<div className="flourish-embed" data-src="visualisation/1338475"/>/*}
        {/* <div style={{marginLeft: '15%', marginRight: '15%'}} className="flourish-embed" data-src="visualisation/1338248"/> */}
      </div>
    );
  }
}

export default BudgetPage;
