import React, { Component } from "react";
import * as d3 from 'd3'

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
      //let height = this.getHeight();
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
      // save past dimensions
      let width = this.state.width + 10 
      let height = this.state.height + 50
      try {
        width = this.getWidth();
        height = this.getHeight();
      }
      catch(error) {
        console.log(error)
        console.error("element dimension error, please refresh page")
      }
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

  export default LineChart;