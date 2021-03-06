import React, { Component } from "react";
import * as d3 from 'd3'

/**
 * Component for showing a scatterpolot. Will require a display name if it is part of a multi select
 *
 *
 * @component
 * @example
 * 
 * return (
 *   <ScatterPlot/>
 * )
 * 
 * @example multi-select
 * 
 * return (
 *   <ScatterPLot displayName={"ScatterPlot"}/>
 * )
 */
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
      height = this.getHeight() - 200; // subtract 200 bc of weird offset issue
    }
    catch(error) {
      return
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
    d3.select("#scatterplot").select("*").remove();
    
    var plot_data;

    // show all data if no options are selected
    if (this.state.selected.length > 0) {
      plot_data = this.state.selected;
    }
    else {
      plot_data = this.props.allOptions;
    }

    const data = plot_data

    // X SCALE = STUDENT OCUNT
    // Y SCALE = BUDGEt

    // svg dimensions
    var MIN_STUDENTS = d3.min(data, function(d) {return d.active_members})
    var MAX_STUDENTS = d3.max(data, function(d) {return d.active_members})
    MAX_STUDENTS += MAX_STUDENTS * 0.1  //increase bounds slightly to fit full circle size
    MIN_STUDENTS -= MIN_STUDENTS * 0.1  //increase bounds slightly to fit full circle size
    var MIN_BUDGET = d3.min(data, function(d) {return d.budget})
    var MAX_BUDGET = d3.max(data, function(d) {return d.budget})
    MAX_BUDGET += MAX_BUDGET* 0.1 //increase bounds slightly to fit full circle size
    MIN_BUDGET -= MIN_BUDGET* 0.1 //increase bounds slightly to fit full circle size
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

    // create a clipping region 
    svg.append("defs").append("clipPath")
      .attr("id", "clip")
      .append("rect")
      .attr("width", width)
      .attr("height", height);
    
    // create scales
    var x = d3.scaleLinear()
        .domain([MIN_STUDENTS, MAX_STUDENTS])
        .range([0, width])
  
    var y = d3.scaleLinear()
        .domain([MIN_BUDGET, MAX_BUDGET])
        .range([height, 0])

     //create axes
     var xAxis = d3.axisBottom(x)
        .ticks(20, "s");
     var yAxis = d3.axisLeft(y)
        .ticks(20, "s");

    // Draw Axis
    var gX = svg.append('g')
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis);
    var gY = svg.append('g')
      .call(yAxis);
    
 
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
        .text("Budget ($)");

    d3.selection.prototype.moveToFront = function() {
      return this.each(function() {
        this.parentNode.appendChild(this);
      });
    }; 

    /// Pan and zoom
    var zoom = d3.zoom()
     .scaleExtent([.1, 100])
     .extent([[0, 0], [width, height]])
     .on("zoom", zoomed);

    // pan and zoom area
    svg.append("rect")
      .attr("width", width)
      .attr("height", height)
      .style("fill", "none") // shows zoom area
      .style("pointer-events", "all")
      .call(zoom);
    
    // Draw Datapoints
    var points_g = svg.append("g")
      .attr("clip-path", "url(#clip)")
      .classed("points_g", true);

    // create scatter points
    var points = points_g.selectAll("circle")
        .data(data)
        .enter()
        .append("circle")
            //.attr("transform", "translate(20, 0)") // move all circles to the right to make room for scales
            .attr("cx", function(d) {return x(d.active_members)})
            .attr("cy", function(d) {return y(d.budget)})
            .attr("r", CIRCLE_SIZE)
            .style('fill', function(d) {return accent(d.category)}) //--> Subgroup 
            .style('stroke', function(d) {return BORDER_COLOR})
            .style("stroke-width", function(d) {return BORDER_SIZE})
            .style("opacity", 0.5);

    // this group will save all our tooltips so they can be removed easily
    var tooltips = svg.append('g')

    points.data(data)
            .on("mouseenter", function(d) {
                // add the text for the tooltip
                tooltips.append("text")
                    .attr("x", x(d.active_members))
                    .attr("y", y(d.budget) - CIRCLE_SIZE - 48) // place the tooltip at the yvalue of the circle minus the radius of the circle
                    .attr('font-family', "Bebas Neue")
                    .attr("font-size", "16px")
                    .style("fill", "black") 
                    .style("font-weight", "bold") 
                    .text(d.name)
                tooltips.append("text")
                    .attr("x", x(d.active_members))
                    .attr("y", y(d.budget) - CIRCLE_SIZE - 28) // place the tooltip at the yvalue of the circle minus the radius of the circle
                    .attr('font-family', "Bebas Neue")
                    .attr("font-size", "16px")
                    .style("fill", "black")
                    .text("Budget: $" + d3.format(",.2f")(d.budget))
                tooltips.append("text")
                    .attr("x", x(d.active_members))
                    .attr("y", y(d.budget) - CIRCLE_SIZE - 8) // place the tooltip at the yvalue of the circle minus the radius of the circle
                    .attr('font-family', "Bebas Neue")
                    .attr("font-size", "16px")
                    .style("fill", "black") 
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
  
   function zoomed() {
     // create new scale ojects based on event
     var new_xScale = d3.event.transform.rescaleX(x);
     var new_yScale = d3.event.transform.rescaleY(y);
     // update axes
     gX.call(xAxis.scale(new_xScale));
     gY.call(yAxis.scale(new_yScale));
     points.data(data)
        .attr('cx', function(d) {return new_xScale(d.active_members)})
        .attr('cy', function(d) {return new_yScale(d.budget)})
        .on("mouseenter", function(d) {
          console.log(new_xScale(d.active_members))
          console.log(new_yScale(d.budget))
            // add the text for the tooltip
            tooltips.append("text")
                .attr("x", new_xScale(d.active_members))
                .attr("y", new_yScale(d.budget) - CIRCLE_SIZE - 48) // place the tooltip at the yvalue of the circle minus the radius of the circle
                .attr('font-family', "Bebas Neue")
                .attr("font-size", "16px")
                .style("fill", "black")
                .style("font-weight", "bold") 
                .text(d.name)
            tooltips.append("text")
                .attr("x", new_xScale(d.active_members))
                .attr("y", new_yScale(d.budget) - CIRCLE_SIZE - 28) // place the tooltip at the yvalue of the circle minus the radius of the circle
                .attr('font-family', "Bebas Neue")
                .attr("font-size", "16px")
                .style("fill", "black") 
                .text("Budget: $" + d3.format(",.2f")(d.budget))
            tooltips.append("text")
                .attr("x", new_xScale(d.active_members))
                .attr("y", new_yScale(d.budget) - CIRCLE_SIZE - 8) // place the tooltip at the yvalue of the circle minus the radius of the circle
                .attr('font-family', "Bebas Neue")
                .attr("font-size", "16px")
                .style("fill", "black") 
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
        });
    }

  }

  getWidth(){
      return this.chartRef.current.parentElement.offsetWidth;
  }
  getHeight(){
      return this.chartRef.current.parentElement.offsetHeight;
  }

  render() {
      return(
        <div>
            {/* chart description */}
            <div className= "multi-select-description box border has-background-light">
                <h1 className="title"> Club Budget vs. Membership </h1>
                <p> This <span className="red">scatterplot</span> reveals the correlation between club budgets and club membership. 
                  You can pan and zoom to narrow or widen your search as well as hover each circle for 
                  more information. You can also select specific clubs on the left for a clearer direct comparison.
                </p>
            </div>
            {/* chart */}
            <div ref={this.chartRef} id="scatterplot" className = "intro-card box border"> </div>
        </div>
        );
  }
}

export default ScatterPlot;
