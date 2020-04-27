import React, { Component } from "react";
import * as d3 from 'd3'

class ScatterPlot extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selected: [],
      height: 0, 
      width: 0,
    };
    this.chartRef = React.createRef();
  }

  componentDidMount() {
    let width = 900
    if (this.state.selected.length > 0) {
      width = this.getWidth();
    }

    this.setState(function (state, props) {
      return {
        selected: props.selected,
        width: width-60, 
        height: 700
      };
    });
    this.drawChart();

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
    var width = this.state.width + 60
    var height = this.state.height + 60
    try {
      width = this.getWidth();
      height = this.getHeight() - 175; // subtract 175 bc of weird offset issue
    
    }
    catch(error) {
      console.log(error)
      console.error("element dimension error, please refresh page")
      // width = this.state.width  + 60
      // height = this.state.height + 60
    }
    this.setState({width: width-60, height: height-60 });
    
    this.drawChart = this.drawChart.bind(this);
    this.drawChart();
  }

  componentDidUpdate(prevProps, prevState) {
    this.drawChart();
  }

  static getDerivedStateFromProps(props, current_state) {
    if (current_state.selected !== props.selected) {
      return {
        selected: props.selected,
      };
    }
    return null;
  }

  drawChart() {
    d3.select("#scatterplot").select("svg").remove();
    const data = this.state.selected;

    // X SCALE = STUDENT OCUNT
    // Y SCALE = BUDGEt

    // svg dimensions
    var MIN_STUDENTS = d3.min(data, function(d) {return d.active_members})
    var MAX_STUDENTS = d3.max(data, function(d) {return d.active_members})
    var MIN_BUDGET = d3.min(data, function(d) {return d.budget})
    var MAX_BUDGET = d3.max(data, function(d) {return d.budget})
    var CIRCLE_SIZE = 10
    var BORDER_SIZE = 1.5
    var BORDER_COLOR = "BLACK"

    // color scale
    var accent = d3.scaleOrdinal(d3.schemeSet2)
    .domain(["Academic", "Awareness", "Cultural", "Extracurricular", "Music and Arts", "Religious", "Sports"]);



    // set the dimensions and margins of the graph
    var margin = {top: 80, right: 200, bottom: 50, left: 80},
        width = this.state.width - margin.left - margin.right,
        height =  this.state.height - margin.top - margin.bottom;

    // append the svg object to the body of the page
    var svg = d3.select("#scatterplot")
        .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .attr("id", "scatterPlotSVG")
        .append("g")
            .attr("transform",
                "translate(" + margin.left + "," + margin.top + ")");

    // create scales
    var x = d3.scaleLinear()
        .domain([MIN_STUDENTS, MAX_STUDENTS])
        .range([0, width])
    svg.append('g')
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x));
    
    
    var y = d3.scaleLinear()
        .domain([MIN_BUDGET, MAX_BUDGET])
        .range([height, 0])
    svg.append('g')
        .call(d3.axisLeft(y))
 
    // x axis title
    svg.append("text")
        .attr("text-anchor", "end")
        .attr("x", width/2 + margin.left)
        .attr("y", height + margin.bottom)
        .attr('font-family', "Bebas Neue")
        .attr("font-size", "22px")
        .text("Number of Students");

    // y axis title
    svg.append("text")
        .attr("text-anchor", "end")
        .attr("x", 20)
        .attr("y", height/2- margin.left - 20)
        .attr("transform", `rotate(270, 20, ${height/2-35})`) // rotate takes the rotation, and then the x and y coord of the center of rotation. Make sure these coords are the same as the text
        .attr("font-family", "Bebas Neue")
        .attr("font-size", "22px")
        .text("Budget");

    // this group will save all our tooltips so they can be removed easily
    var tooltips = svg.append('g')


    // create scatter points
    svg.selectAll("circle")
        .data(data)
        .enter()
        .append("circle")
            .attr("transform", "translate(20, 0)") // move all circles to the right to make room for scales
            .attr("cx", function(d) {return x(d.active_members)-19})
            .attr("cy", function(d) {return y(d.budget)})
            .attr("r", CIRCLE_SIZE)
            .style('fill', function(d) {return accent(d.category)}) //--> Subgroup 
            .style('stroke', function(d) {return BORDER_COLOR})
            .style("stroke-width", function(d) {return BORDER_SIZE})
            .style("opacity", 0.5)
            .on("mouseenter", function(d) {
                // add the text for the tooltip
                tooltips.append("text")
                    .attr("x", x(d.active_members))
                    .attr("y", y(d.budget) - CIRCLE_SIZE - 48) // place the tooltip at the yvalue of the circle minus the radius of the circle
                    .attr('font-family', "Bebas Neue")
                    .attr("font-size", "16px")
                    .style("fill", accent(d.category)) 
                    .style("font-weight", "bold") 
                    .text(d.name)
                tooltips.append("text")
                    .attr("x", x(d.active_members))
                    .attr("y", y(d.budget) - CIRCLE_SIZE - 28) // place the tooltip at the yvalue of the circle minus the radius of the circle
                    .attr('font-family', "Bebas Neue")
                    .attr("font-size", "16px")
                    .style("fill", accent(d.category))  
                    .text("Budget: $" + d.budget)
                tooltips.append("text")
                    .attr("x", x(d.active_members))
                    .attr("y", y(d.budget) - CIRCLE_SIZE - 8) // place the tooltip at the yvalue of the circle minus the radius of the circle
                    .attr('font-family', "Bebas Neue")
                    .attr("font-size", "16px")
                    .style("fill", accent(d.category))  
                    .text("Students: " + d.active_members)
                // give hovering a little life
                d3.select(d3.event.target)
                    .transition()
                    .duration(200)
                    .style("opacity", "1")
                    .attr("r", CIRCLE_SIZE + 2)
            })
            .on("mouseout", function(d) {
                // return everything to normal
                tooltips.selectAll('text').remove()
                tooltips.selectAll('line').remove()
                d3.select(d3.event.target)
                    .transition()
                    .duration(200)
                    .style("opacity", "0.5")
                    .attr("r", CIRCLE_SIZE)
            })


    // draw legend
    var legend = svg.selectAll(".legend")
        .data(accent.domain())
        .enter().append("g")
        .attr("class", "legend")
        .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

    // draw legend colored rectangles
    legend.append("rect")
        .attr("x", width + 175)
        .attr("width", 18)
        .attr("height", 18)
        .style("fill", accent);

    // draw legend text
    legend.append("text")
        .attr("x", width + 169)
        .attr("y", 9)
        .attr("dy", ".35em")
        .style("text-anchor", "end")
        .text(function(d) { return d;})
  }

  getWidth(){
    if (this.state.selected.length > 0) {
      return this.chartRef.current.parentElement.offsetWidth;
    }
  }
  getHeight(){
      return this.chartRef.current.parentElement.offsetHeight;
  }

  render() {
    if (this.state.selected.length > 0) {
      return(
        <div>
            {/* chart description */}
            <div className= "multi-select-description box border has-background-light">
                <h1 className="title"> Chart Title </h1>
                <p> This a description for this beautiful chart that super cool and fun. </p>
            </div>
            {/* chart */}
            <div ref={this.chartRef} id="scatterplot" className = "intro-card box border"> </div>
        </div>
        ); 
      }

      return (
        <div>
                {this.props.alt != null ? "Alternate" : undefined} <span className="red">* Please select clubs to compare! *</span>
        </div>
      );
    }
}

export default ScatterPlot;
