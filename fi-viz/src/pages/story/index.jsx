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
            .map((item, index) => [xAxis[index], item]) 
            .sort(([count1], [count2]) => count2 - count1) 
            .map(([, item]) => item); 
          
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

class Story extends Component {

  constructor(props) {
    super(props);
    this.state = {
      fiscal_year: 2020,
      MT_total: 273302.00,
      CB_total: 823527.27,
      Other_total: 400000.00,
      SLF: 316,
      total: "1.4 Million"
    };
  }

  componentDidMount() {
    this.getData();
  }

  getData = async () => {
    const response = await fetch('/api/budget_breakdown');
    const body = await response.json();
    if (response.status !== 200) throw Error(body.message);
    this.setState({ fiscal_year: body.budgets[0]["Fiscal Year"],
                    MT_total: body.budgets[0]["Mandatory Transfers Budget"],
                    CB_total : body.budgets[0]["Club Budget"],
                    Other_total : body.budgets[0]["Other"],
                    total: body.budgets[0]["Total"]});
  }

  render() {
    return (
      <div>
        <div className="story-page">
          <div className = "story-container box border">
              <div>
                <h1 className = "title">What is the <span className="red">Student Life Fee</span>?</h1>
                <p>Every WPI Student pays a small fee, through their tuition, so that the clubs on campus 
                  have funds to be run and mantained. 
                  The Student Goverment Association (SGA), handles these funds in order to give each club a budget, 
                  as well as to fulfill certain funding requests if they deem the club has an acceptable need.</p>
              </div>
            </div>
          <div className="padding-video">
            <figure className = "image is-16by9">
              <iframe className="has-ratio" frameBorder="0" src="https://biteable.com/watch/embed/sgafiviz-2439134" allowFullScreen={true} allow="autoplay"></iframe>
            </figure>
          </div> 
        </div>
      
        <div className = "padding-grey story-page2">
          <div className = "center">
            <h1 className = 'white title'>Where Does That Money Go?</h1>
            <h1 className = 'white subtitle is-4'>The Budget Breakdown</h1>
            <div className = "box">
              <div className = "columns">
                <div className = "column">
                  <h1 className = 'subtitle is-4 align-text black bold'>Current SLF is </h1><h1 className = "title red"><span class='numscroller' data-min='1' data-max='1000' data-delay='5' data-increment='10'>1000</span></h1>
                </div>
                <div className = "is-divider-vertical"></div>
                <div className = "column">
                    <h1 className = 'subtitle is-4 align-text black bold'>Total SGA Budget is </h1><h1 className = "title red">${this.state.total}</h1>
                </div>
              </div>
            </div>
          </div>
          <br></br>
          <br></br>
          <div className = "columns">
          <div className = "column">
            <div className = 'box align-text'>
              <h1 className = 'subtitle is-3'>Mandatory Transfers</h1>
              <h1 className = 'subtitle is-4'>${this.state.MT_total}</h1>
              <div>
              <p>Covers a variety of campus services such as Snap, Club Sports, Coaches, and Campus Labs. This budget also allows sports to get gym credit!</p>
            </div>
            </div>
          </div>
          <div className = "column">
            <div className = 'box align-text'>
              <h1 className = 'subtitle is-3'>Organization Budgets</h1>
              <h1 className = 'subtitle is-4'>${this.state.CB_total}</h1>
              <div>
                Organizations, such as clubs, can request an annual budget. SGA approves budgets that
                align with their bylaws.
              </div>
            </div>
          </div>
          <div className = "column">
            <div className = 'box align-text'>
              <h1 className = 'subtitle is-3'>Other</h1>
              <h1 className = 'subtitle is-4'>${this.state.Other_total}</h1>
              <div>
                <p className = "black">This budget is used for Funding Requests (FR). FRs are meants to supplement club budgets, or
                provide funds for organizations that do not receive an annual budget.</p>
              </div>
            </div>
          </div>
        </div>
        </div>
        
        <div className = 'columns'>
          <div className = "column">
            
          </div>
          <div className = "column">
            
          </div>
          <div className = "column">
            
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
        <BarChart/>  
        <LineChart/>
      </div>
    )
  }
}

export default Page;