import React, { Component } from "react";
import * as d3 from 'd3'
import mySankey from "./d3.sankey.js";

class Sankey extends Component {

    constructor(props) {
      super(props);
      this.state = {
        // counting up values on proper position
        didViewCountUp: false,
        height: 0, 
        width: 0
      }
      this.chartRef = React.createRef();
    }
  
    componentDidMount() {
      let width = this.getWidth();
      //let height = this.getHeight();
  
      this.setState({width: width-60, height: 600});
      this.drawChart();
  
      let resizedFn;
      window.addEventListener("resize", () => {
        clearTimeout(resizedFn);
        resizedFn = setTimeout(() => {
            this.redrawChart();
        }, 200)
      });
    }

    // Used to engage number countup when the section is visible 
    onVisibilityChange = isVisible => {
        if (isVisible) {
        this.setState({didViewCountUp: true});
        }
    }

  
    redrawChart() {
      let width = this.getWidth()
      let height = this.getHeight()
      this.setState({width: width-60, height: height-60});
      d3.select("#sankeyCanvas").remove();
      d3.select("#sankeySVG").remove();
      this.drawChart = this.drawChart.bind(this);
      this.drawChart();
    }
      
  
    componentWillUnmount() {
      this._isMounted = false;
    }
  
    drawChart() {
     
      /* Grab data and do some KFT sankey stuff */
      fetch('/api/sankey_data')
        .then(response => response.json())
        .then(data => {
  
          /* Setup D3 Environment */
  
          // var margin = {top: 1, right: 1, bottom: 6, left: 1},
          //     width = 1000 - margin.left - margin.right,
          //     height = 700 - margin.top - margin.bottom;
  
          var margin = {top: 1, right: 1, bottom: 6, left: 1},
              width = this.state.width - margin.left - margin.right,
              height = this.state.height - margin.top - margin.bottom;
  
          var formatNumber = d3.format(",.0f"),
              format = function(d) { return '$' + formatNumber(d); },
              color = d3.scaleOrdinal(d3.schemeCategory10);
  
          var canvas = d3.select(".sankey").append("canvas")  
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .attr("id", "sankeyCanvas")
            .attr("class", "canvas");
  
          var svg = d3.select(".sankey").append("svg")
              .attr("width", width + margin.left + margin.right)
              .attr("height", height + margin.top + margin.bottom)
              .attr("id", "sankeySVG")
              .attr("class", "svg")
            .append("g")
              .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

          mySankey
            .nodeWidth(15)
            .nodePadding(10)
            .size([width, height]);
  
          var path = mySankey.link(); 
          
          mySankey
            .nodes(data.nodes)
            .links(data.links)
            .layout(32);
  
          var link = svg.append("g").selectAll(".link")
              .data(data.links)
              .enter().append("path")
              .attr("class", "link")
              .attr("d", path)
              .style("stroke-width", function(d) { return Math.max(1, d.dy); })
              .sort(function(a, b) { return b.dy - a.dy; });
  
          link.append("title")
              .text(function(d) { return d.source.name + " → " + d.target.name + "\n" + format(d.value); });
  
          var node = svg.append("g").selectAll(".node")
              .data(data.nodes)
              .enter().append("g")
              .attr("class", "node")
              .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; })
              .call(d3.drag()
                  .subject(function(d) { return d; })
                  .on("start", function() { this.parentNode.appendChild(this); })
                  .on("drag", dragmove));
  
          node.append("rect")
              .attr("height", function(d) { return d.dy; })
              .attr("width", mySankey.nodeWidth())
              .style("fill", function(d) { return d.color = color(d.name.replace(/ .*/, "")); })
              .style("stroke", "none")
              .append("title")
              .text(function(d) { return d.name + "\n" + format(d.value); });
  
          node.append("text")
              .attr("x", -6)
              .attr("y", function(d) { return d.dy / 2; })
              .attr("dy", ".35em")
              .attr("text-anchor", "end")
              .attr("transform", null)
              .text(function(d) { return d.name; })
              .filter(function(d) { return d.x < width / 2; })
              .attr("x", 6 + mySankey.nodeWidth())
              .attr("text-anchor", "start");
  
          function dragmove(d) {
              d3.select(this).attr("transform", "translate(" + d.x + "," + (d.y = Math.max(0, Math.min(height - d.dy, d3.event.y))) + ")");
              mySankey.relayout();
              link.attr("d", path);
          }
  
          var linkExtent = d3.extent(data.links, function (d) {return d.value});
          var frequencyScale = d3.scaleLinear().domain(linkExtent).range([0.05,1]);
          // var particleSize = d3.scaleLinear().domain(linkExtent).range([1,5]);
  
  
          data.links.forEach(function (link) {
              link.freq = frequencyScale(link.value);
              link.particleSize = 3;
              link.particleColor = d3.scaleLinear().domain([0,1])
                  .range([link.source.color, link.target.color]);
          })
  
          d3.timer(tick, 1000);
          var particles = [];
  
          function tick(elapsed, time) {
  
              particles = particles.filter(function (d) {return d.current < d.path.getTotalLength()});
  
              d3.selectAll("path.link")
                  .each(
                      function (d) {
                          for (var x = 0;x<2;x++) {
                              var offset = (Math.random() - .5) * (d.dy - 4);
                              if (Math.random() < d.freq) {
                                  var length = this.getTotalLength();
                                  particles.push({link: d, time: elapsed, offset: offset, path: this, length: length, animateTime: length, speed: 2.5 + (Math.random())})
                              }
                          }
                      });
  
              particleEdgeCanvasPath(elapsed);
          }
  
          function particleEdgeCanvasPath(elapsed) {
              
             try {

                var context = canvas.node().getContext("2d")
  
                // this prevents moving particle buildup
                context.clearRect(0, 0, 2000, 2000);
  
                context.fillStyle = "gray";
                context.lineWidth = "1px";
                for (var x in particles) {
                    var currentTime = elapsed - particles[x].time;
                    particles[x].current = currentTime * 0.15 * particles[x].speed;
                    var currentPos = particles[x].path.getPointAtLength(particles[x].current);
                    context.beginPath();
                    context.fillStyle = particles[x].link.particleColor(0);
                    context.arc(currentPos.x, currentPos.y + particles[x].offset, particles[x].link.particleSize, 0, 2 * Math.PI);
                    context.fill();
                }
  
             } catch(error) {
               console.log(error)
             } 
              
          }
  
        })
        .catch(err => {
          console.log (err)
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
              <div ref={this.chartRef} className = "sankey has-text-centered">
              </div>
        );  
    }
  }

  export default Sankey;