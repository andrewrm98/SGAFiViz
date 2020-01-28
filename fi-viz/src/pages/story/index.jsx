import React, { Component } from 'react';
import "./story.css"
import Plot from 'react-plotly.js';

class LineChart extends Component {

  constructor(props) {
    super(props);
    this.state = {
      error: null,
      isLoaded: false,
      slf: []
    };
  }

  componentDidMount() {
    fetch("/api/slf")
      .then(res => res.json())
      .then(
        (result) => {
          this.setState({
            isLoaded: true,
            slf: result.slf
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
    const { error, isLoaded, slf } = this.state;
    if (error) {
      return <div>Error: {error.message}</div>;
    } else if (!isLoaded) {
      return <div>Loading...</div>;
    } else {

        // loop through elements in slf fee to construct x & y axis
        var xAxis = [], yAxis = [], i = 0
        for (i=0; i< slf.length; i++) {
          xAxis.push((slf[i])["Fiscal Year"])
          yAxis.push((slf[i])["SLF Amount"])
        } 

        const result = yAxis
            .map((item, index) => [xAxis[index], item]) // add the clickCount to sort by
            .sort(([count1], [count2]) => count2 - count1) // sort by the clickCount data
            .map(([, item]) => item); // extract the sorted items
          
        yAxis = result.reverse()
        xAxis = xAxis.sort((a, b) => a - b)


        return (

          <Plot className = "fill-space"
            data={[
              {
                x: xAxis,
                y: yAxis,
                type: 'scatter',
                mode: 'lines+points',
                marker: {color: 'red'},
              },
              
            ]}
            layout={ 
              {autosize: true, 
                title: 'Student Life Fee Trend',
                yaxis: {
                  title: 'Yearly Cost',
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
    fetch("/api/budgetBreakdown")
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
          name: "Club Budget",
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

class Story extends Component {

  constructor(props) {
    super(props);
    this.state = {
      budgets: [],
      fiscal_year: 2020,
      transferstotal: 273302.00,
      budgetstotal: 823527.27,
      requesttotal: 400000.00,
      SLF: 316,
      budget: "1.4 Million"
    };
  }

  componentDidMount() {
    this.getData();
  }

  getData = async () => {
    const response = await fetch('/api/slf');
    const body = await response.json();
    if (response.status !== 200) throw Error(body.message);
    console.log(body);
    this.setState({ budgets: body.slf });
  }

  render() {
    return (
      <div>
        <div className = "columns margin">
          <div className = "column story-container white notification is-half">
            <div>
              <h1 className = "title">What is the Student Life Fee (SLF)?</h1>
              <p>Every WPI Student pays a small fee, through their tuition, so that the clubs on campus 
                have funds to be run and mantained. 
                The Student Goverment Association (SGA), handles these funds in order to give each club a budget, 
                as well as to fulfill certain funding requests if they deem the club has an acceptable need.</p>
            </div>
            
          </div>
          <div className = "column is-half">
            Insert student life fee example image here
          </div>
        </div>

        <div className = "content divide notification">
          <h1 className = 'white title'>Where Does That Money Go?</h1>
          <h1 className = 'white subtitle is-4'>The Budget Breakdown</h1>
          <div className = "columns">
            <div className = "column">
              <div className = "notification has-background-white">
                <h1 className = 'subtitle is-4 align-text black bold'>Current Fiscal Year is {this.state.fiscal_year}</h1>
              </div>
            </div>
            <div className = "column">
              <div className = "notification has-background-white">
                <h1 className = 'subtitle is-4 align-text black bold'>Current Student Life Fee is ${this.state.SLF}</h1>
              </div>
            </div>
            <div className = "column">
              <div className = "notification has-background-white">
                <h1 className = 'subtitle is-4 align-text black bold'>Total SGA Budget is ${this.state.budget}</h1>
              </div>
            </div>
          </div>
        </div>

        <h1 className = 'subtitle is-4 align-text'>The overall budget is allocated among these three student services.</h1>
          

        <div className = "columns">
          <div className = "column">
            <div className = 'notification align-text is-danger'>
              <h1 className = 'subtitle is-3'>Mandatory Transfers</h1>
              <h1 className = 'subtitle is-4'>${this.state.transferstotal}</h1>
            </div>
          </div>
          <div className = "column">
            <div className = 'notification align-text is-warning'>
              <h1 className = 'subtitle is-3'>Organization Budgets</h1>
              <h1 className = 'subtitle is-4'>${this.state.budgetstotal}</h1>
            </div>
          </div>
          <div className = "column">
            <div className = 'notification align-text is-info'>
              <h1 className = 'subtitle is-3'>Sponsorship & Rollbacks</h1>
              <h1 className = 'subtitle is-4'>${this.state.requesttotal}</h1>
            </div>
          </div>
        </div>

        <div className = 'columns'>
          <div className = "column">
            <div className = "notification has-background-light">
              Covers a variety of widely-used campus services such as:
              <div className = 'list'>
                <div className = 'list-item'>SNAP</div>
                <div className = 'list-item'>Club Sports Coaches</div>
                <div className = 'list-item'>Campus Labs</div>
                <div className = 'list-item'>City Ride</div>
                <div className = 'list-item'>International and Leadership Programs</div>
                <div className = 'list-item'>SAO and Club Sport Interns</div>
                <div className = 'list-item'>Goat's Head Programming</div>
                <div className = 'list-item'>Greek Life Programming</div>
              </div>
              This funding also enables club sport participants to receive gym credit!
            </div>
          </div>
          <div className = "column">
            <div className = "notification has-background-light">
              Organizations can request an annual budget. SGA approves budgets that
              align with their bylaws, fit the purpose of the blub, and have been approved
              through a funding request. Organizations are filtered by class:
              <div className = "list">
                <div className = "list-item">
                  <h1 className = "bold">Class One:</h1>
                  <p>Special Interests (Hobbies/Community Outreach)</p>
                </div>
              </div>
              <div className = "list">
                <div className = "list-item">
                  <h1 className = "bold">Class Two:</h1>
                  <p>Club Sports</p>
                </div>
              </div>
              <div className = "list">
                <div className = "list-item">
                  <h1 className = "bold">Class Three:</h1>
                  <p>Clubs that provide programming or services to the entire campus</p>
                </div>
              </div>
            </div>
          </div>
          <div className = "column">
            <div className = "notification has-background-light">
              <p>The remaining SLF budget is allocated here, as Sponsorship, after Mandatory Transfers and Organization Budgets have
              been resolved. Rollbacks include any funds that were leftover from the previous fiscal year.</p>
              <br></br>
              <p>The combined sponsorship & rollbacks are used for Funding Requests (FR). FRs are meants to supplement club budgets, or
              provide funds for organizations that do not receive an annual budget. FRs are heard by the Financial Board, and are approved
              or denied based on the organization's need.</p>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

class Page extends Component {
  render() {
    return (
      <div>
        <Story/>
        <LineChart/>
        <BarChart/>
          
      </div>
    )
  }
}

export default Page;