import React, { Component } from 'react';
import "./story.css"
import Plot from 'react-plotly.js';
import CountUp, {startAnimation} from 'react-countup';  
import VisibilitySensor from 'react-visibility-sensor';
import rd3 from 'react-d3-library';
import sankeyNode from './d3.sankey.js';
import node from './lineChart.js';
import * as d3 from 'd3';


const RD3Component = rd3.Component;
class LineChart extends Component {
  _isMounted = false;

  constructor(props) {
    super(props);
    this.state = {
      d3: '',
      height: 0,
      width: 0
    }
    this.chartRef = React.createRef();
  }

  componentDidMount() {
    let width = this.getWidth();
    let height = this.getHeight();
    this._isMounted = true;
    if (this._isMounted) {
      this.setState({width: width, height: 500});
      this.drawChart();
    }
    let resizedFn;
    window.addEventListener("resize", () => {
      clearTimeout(resizedFn);
      resizedFn = setTimeout(() => {
          this.redrawChart();
      }, 200)
    });
  }

  redrawChart() {
    let width = this.getWidth()
    let height = this.getHeight()
    this.setState({width: width-10, height: height-50});
    d3.select(".lineChart svg").remove();
    this.drawChart = this.drawChart.bind(this);
    this.drawChart();
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  drawChart() {
    //var node = document.createElement('div'); // export this
    //var parentDiv = document.getElementById("lineChartBox"); // for parent margins
    var year = [], fee = []
    var lineData = [{}] // connects with server
    // parse the date / time
    var parseTime = d3.timeParse("%Y"),
          bisectDate = d3.bisector(function(d) { return d.year; }).left;

    /********** Get Data ***********/
    fetch('/api/slf')
      .then(response => response.json())
      .then(data => {
          var slf = data.slf
          
          // loop through elements in slf fee to construct x & y axix
          for (var i=0; i< slf.length; i++) {
            year.push((slf[i])["Fiscal Year"])
            fee.push((slf[i])["SLF Amount"])
          } 

          // properly order the data
          const result = fee
              .map((item, index) => [year[index], item]) 
              .sort(([count1], [count2]) => count2 - count1) 
              .map(([, item]) => item); 
            
          fee = result.reverse()
          year = year.sort((a, b) => a - b)

          for (i=0; i<year.length; i++){
            var d = {}
            d['year'] = parseTime(parseInt(year[i]));
            d['fee'] = +parseInt(fee[i]);
            lineData[i] = d
          } 

          /********** Use D3 To Populate SVG **********/
          var margin = {top: 50, right: 50, bottom: 50, left: 50},
              width = this.state.width - margin.left - margin.right,
              height = this.state.height - margin.top - margin.bottom;

          var svg = d3.select(".lineChart").append("svg")
                  .attr("width", width + margin.left + margin.right)
                  .attr("height", height + margin.top + margin.bottom)
                  .attr("id", "lineChart")
                .append("g")
                  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

          // Add X Axis
          var x = d3.scaleTime()
              .domain(d3.extent(lineData, function(d) { return (d.year) }))
              .range([ 0, width ]);
          svg.append("g")
              .style("font", "14px times")
              .attr("transform", "translate(0," + height + ")")
              .call(d3.axisBottom(x));

          // Add Y Axis
          var y = d3.scaleLinear()
              .domain([d3.min(lineData, function(d) { return d.fee}),
                d3.max(lineData, function(d) { return d.fee })])
              .range([ height, 0 ]);
          svg.append("g")
              .style("font", "14px times")
              .call(d3.axisLeft(y));

          // Add the line
          svg.append("path")
            .datum(lineData)
            .attr("fill", "none")
            .attr("stroke", "rgb(172, 43, 55)")
            .attr("stroke-width", 2.5)
            .attr("d", d3.line() 
            .x(function(d) { return x((d.year)) }) 
            .y(function(d) { return y(d.fee) }));

        // tooltip
        var focus = svg.append("g")
            .attr("class", "focus")
            .style("display", "none");

        focus.append("line")
            .attr("class", "x-hover-line hover-line")
            .attr("y1", 0)
            .attr("y2", height);

        focus.append("line")
            .attr("class", "y-hover-line hover-line")
            .attr("x1", width)
            .attr("x2", width);

        focus.append("circle")
            .attr("r", 7.5);

        focus.append("text")
            .attr("x", -25)
            .attr("y", -15);

        svg.append("rect")
            //.attr("transform", "translate(" + margin.left + "," + margin.top + ")")
            .attr("class", "overlay")
            .attr("width", width)
            .attr("height", height)
            .on("mouseover", function() { 
              focus.style("display", null); 
            })
            .on("mouseout", function() { 
              focus.style("display", "none"); 
            })
            .on("mousemove", mousemove);

        function mousemove() {
          var x0 = x.invert(d3.mouse(this)[0]),
            i = bisectDate(lineData, x0, 1),
            d0 = lineData[i - 1],
            d1 = lineData[i],
            d = x0 - d0.year > d1.year - x0 ? d1 : d0;
          focus.attr("transform", "translate(" + x(d.year) + "," + y(d.fee) + ")");
          focus.select("text").text(function() {
            return d.fee; 
          });
          focus.select(".x-hover-line").attr("y2", height - y(d.fee));
          focus.select(".y-hover-line").attr("x2", width + width);
        }
          
          // add title
          svg.append("text")
            .attr("x", (width / 2))             
            .attr("y", 0 - (margin.top / 2))
            .attr("text-anchor", "middle")  
            .style("font-size", "24px")  
            .style("font", "times") 
            .text("Student Life Fee Trend");
    })

    .catch(err => {
        console.log(err)
    })
  }

  getWidth(){
    return this.chartRef.current.parentElement.offsetWidth;
  }
  getHeight(){
      return this.chartRef.current.parentElement.offsetHeight;
  }

  render() {
        return (

            <div ref={this.chartRef} className = " lineChart has-text-centered">
            </div>
      );  
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

class Sankey extends Component {
  _isMounted = false;

  constructor(props) {
    super(props);
    this.state = {d3: ''}
  }

  componentDidMount() {
    this._isMounted = true;
    if (this._isMounted) {
      this.setState({d3: sankeyNode});
      console.log(this.state.d3)
    }
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  render() {
        return (

            <div>
              <RD3Component width= {window.innerWidth} height= {window.innerHeight} data={this.state.d3}/>
            </div>
      );  
  }
}

class Story extends Component {

  constructor(props) {
    super(props);
    this.state = {
      // budget breakdown
      fiscal_year: 2020,
      MT_total: 273302.00,
      CB_total: 823527.27,
      Other_total: 400000.00,
      SLF: 316,
      total: 1400000,
      // SLF Trend Data
      organizations: 39,
      tuition_inc: 0.007, // %
      budget_cuts: 25,  // %
      new_clubs: 80,
      // counting up values on proper position
      didViewCountUp: false,
      pHeight: 50,
      pWidth: 50
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

  // Used to engage number countup when the section is visible 
  onVisibilityChange = isVisible => {
    if (isVisible) {
      this.setState({didViewCountUp: true});
    }
  }

  render() {
    return (
      
      <div>

        {/* Intro Section - Contains SLF Summary and Video */}

        <div className="story-intro">
          <div className = "intro-card box border">
              <div>
                <h1 className = "title">What is the <span className="red">Student Life Fee</span>?</h1>
                <p>Every WPI Student pays a small fee, through their tuition, so that the clubs on campus 
                  have funds to be run and mantained. 
                  The Student Goverment Association (SGA), handles these funds in order to give each club a budget, 
                  as well as to fulfill certain funding requests if they deem the club has an acceptable need.</p>
              </div>
          </div>
          <div className="video">
            <figure className = "image is-16by9">
              <iframe title="introVideo" className="has-ratio" frameBorder="0" src="https://biteable.com/watch/embed/sgafiviz-2439134" allowFullScreen={true} allow="autoplay"></iframe>
            </figure>
          </div> 
        </div>

        {/* SLF Section - Header */}

        <div className = "story-slf slanted light-red-bg">
          <div className = "box border-black margin-slf">
            <h1 className = "title"><span className="red">Raising</span> the Student Life Fee</h1>
            <p>The student life fee increases routinely in order to satisfy to the rapid expansion of
              WPI's underguate student body and proportionate increase of student clubs and expenses.</p>
          </div>
            
        {/* SLF Section - Columns */}
        
          <div className = "slf-padding columns">
            <div className = "column">
              <div className = "box border-black max-height align-text">
                <p><span className="red">{this.state.organizations}</span> more organizations since 2015 </p>
              </div>
            </div>
            <div className = "column">
              <div className = "box border-black max-height align-text">
                <p><span className="red">{this.state.tuition_inc}%</span> increase in tuition from FY19</p>
              </div>
            </div>
            <div className = "column">
              <div className = "box border-black max-height align-text">
                <p> <span className="red">{this.state.budget_cuts}%</span> of total budgets had to be cut in FY19 </p>
              </div>
            </div>
            <div className = "column">
              <div className = "box border-black max-height align-text">
                <p> <span className="red">{this.state.new_clubs}</span> new clubs since 2010 </p>
              </div>
            </div>
            <div className = "column">
              <div className = "box border-black max-height align-text">
                <p> SLF made <span className="red">{this.state.SLF}</span> to account for inflation </p>
              </div>
            </div>
          </div>

          {/* SLF Section - LineChart */}
          <div className = "box border-black" id="lineChartBox">
            <LineChart/>
          </div>
          
        </div>

        {/* Story Budget Breakdown Section - Header */}
      
        <div className = "story-budget-break slanted red-bg">
          <div className = "center">
            <h1 className = 'white title'>Where Does That Money Go?</h1>
            <h1 className = 'white subtitle is-4'>The Budget Breakdown</h1>
            <div className = "box">
              <div className = "columns">
                <div className = "column">
                  <h1 className = 'subtitle is-4 align-text black bold'>Current SLF is </h1><h1 className = "title red">
                    <VisibilitySensor onChange={this.onVisibilityChange} offset={{
                      top:
                        10
                    }} delayedCall>
                      <CountUp end={this.state.didViewCountUp ? this.state.SLF : 0} duration={1.5} prefix="$" decimals={2} decimal="." ref={countUp => { this.myCountUp = countUp; }}/>
                    </VisibilitySensor>
                  </h1>
                </div>
                <div className = "is-divider-vertical"></div>
                <div className = "column">
                    <h1 className = 'subtitle is-4 align-text black bold'>Total SGA Budget is </h1><h1 className = "title red"><CountUp end={this.state.didViewCountUp ? this.state.total : 0} duration={1.5} prefix="$" separator=","  decimals={2} decimal="."></CountUp></h1>
                </div>
              </div>
            </div>
          </div>
          <br></br>
          <br></br>

          {/* Story Budget Breakdown Section - Columns */}

          <div className = "columns">
            <div className = "column">
              <div className = 'box align-text max-height'>
                <h1 className = 'subtitle is-3 black'>Mandatory Transfers</h1>
                <h1 className = 'subtitle is-4'><CountUp className="red" end={this.state.didViewCountUp ? this.state.MT_total : 0} duration={1.5} prefix="$" separator=","  decimals={2} decimal="."></CountUp></h1>
                <div>
                <p>Covers a variety of campus services such as Snap, Club Sports, Coaches, and Campus Labs. This budget also allows sports to get gym credit!</p>
              </div>
              </div>  
            </div>
            <div className = "column">
              <div className = 'box align-text max-height'>
                <h1 className = 'subtitle is-3 black'>Organization Budgets</h1>
                <h1 className = 'subtitle is-4'><CountUp className="red" end={this.state.didViewCountUp ? this.state.CB_total : 0} duration={1.5} prefix="$" separator=","  decimals={2} decimal="."></CountUp></h1>
                <div>
                  Organizations, such as clubs, can request an annual budget. SGA approves budgets that
                  align with their bylaws.
                </div>
                <br></br>
              </div>
            </div>
            <div className = "column">
              <div className = 'box align-text max-height'>
                <h1 className = 'subtitle is-3 black'>Other</h1>
                <h1 className = 'subtitle is-4'><CountUp className="red" end={this.state.didViewCountUp ? this.state.Other_total : 0} duration={1.5} prefix="$" separator=","  decimals={2} decimal="."></CountUp></h1>
                <div>
                  <p className = "black">This budget is used for Funding Requests (FR). FRs are meants to supplement club budgets, or
                  provide funds for organizations that do not receive an annual budget.</p>
                </div>
              </div>
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
        {/* <BarChart/> */}
        {/* <Sankey/> */}
      </div>
    )
  }
}

export default Page;