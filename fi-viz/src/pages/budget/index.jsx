import React, { Component } from "react";
import './budget.css'
import Plot from 'react-plotly.js';
import Funnel from "../../components/Funnel";
import RidgeChart from "../../components/Ridge";
import rd3 from 'react-d3-library';
import node from './ztreemap.js';
const RD3Component = rd3.Component;

class SunburstChart extends Component {
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
    console.log(this.state.mandatory_transfers);
    return (
      <Plot className="fill-space"
        data={[
          {
            type: "sunburst",
            labels: ["FY 20", "Mandatory Transfers", "Clubs", "Other"].concat(this.state.categories.map(a => a.Category)),
            parents: ["", "FY 20", "FY 20", "FY 20"].concat(this.state.categories.map(a => "Clubs")),
            // values: [3, 1, 1 , 1],
            values: [this.state.data.Total, this.state.data["Mandatory Transfers Budget"], this.state.data["Club Budget"], this.state.data.Other].concat(this.state.categories.map(a => a.Total)),
            outsidetextfont: { size: 20, color: "#377eb8" },
            hovertemplate: `Budget: %{value:$,.0f}<extra></extra>`,
            // leaf: { opacity: 0.4 },
            marker: { line: { width: 2 } },
            branchvalues: 'total'
          },
        ]}
        layout={{
          margin: { l: 0, r: 0, b: 0, t: 0 },
          sunburstcolorway: [
            "#636efa", "#EF553B", "#00cc96", "#ab63fa", "#19d3f3",
            "#e763fa", "#FECB52", "#FFA15A", "#FF6692", "#B6E880"
          ],
          extendsunburstcolorway: true,
           title: 'A Fancy Plot'
        }}
        useResizeHandler={true}
        onClick={this.plotlyClickHandler}
      />
    );
  }
}

class ZTreeMap extends Component {
  _isMounted = false;

  constructor(props) {
    super(props);
    this.state = {d3: ''}
  }

  componentDidMount() {
    this._isMounted = true;
    if (this._isMounted) {
      this.setState({d3: node});
    }
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  render() {
        return (

            <div>
              <RD3Component data={this.state.d3}/>
            </div>
      );  
  }
}

/* We simply can use an array and loop and print each user */
class Budget extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      error: null,
      isLoaded: false,
      budgets: []
    };
  }

  componentDidMount() {
    fetch("/api/budgets")
      .then(res => res.json())
      .then(
        (result) => {
          console.log(result.budgets);
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
      return (
        <div className='budget-container center-text'>
        </div>
      );
    }
  }
}

class BudgetPage extends Component {
  render() {
    return (
      <div style={{marginLeft: '15%', marginRight: '15%'}}>
        <Budget />
        <SunburstChart />
        {/* <RidgeChart /> */}
        <Funnel />
        <div className="flourish-embed" data-src="visualisation/1338475"/>
        <div style={{marginLeft: '15%', marginRight: '15%'}} className="flourish-embed" data-src="visualisation/1338248"/>
        <ZTreeMap />
      </div>
    )
  }
}

export default BudgetPage;