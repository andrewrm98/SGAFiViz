import React, { Component } from "react";
import * as d3 from "d3";

class BarChart extends Component {
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
        let width = 860
        if (this.state.selected.length > 0) {
        width = this.getWidth();
        }

        this.setState(function (state, props) {
            return {
                selected: props.selected,
                width: width-60, 
                height: 800
            };
        });
        this.drawScatter();

        
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
        let width = this.state.width + 60
        let height = this.state.height + 60
        try {
          width = this.getWidth();
          height = this.getHeight();
        }
        catch(error) {
          console.log(error)
          console.error("element dimension error, please refresh page")
          // width = this.state.width  + 60
          // height = this.state.height + 60
        }
        this.setState({width: width-60, height: height-60});
        
        this.drawScatter = this.drawScatter.bind(this);
        this.drawScatter();
      }

    componentDidUpdate(prevProps, prevState) {
        this.drawScatter();
    }

    static getDerivedStateFromProps(props, current_state) {
        if (current_state.selected !== props.selected) {
            return {
                selected: props.selected,
            };
        }
        return null;
    }

    drawScatter() {
        d3.select("#bar").select("svg").remove();
        const data = this.state.selected;

        // set the dimensions and margins of the graph
        var margin = {top: 20, right: 20, bottom: 40, left: 300},
            width = this.state.width - margin.left - margin.right,
            height = this.state.height - margin.top - margin.bottom;

        // append the svg object to the body of the page
        var Barsvg = d3.select("#bar")
            .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform",
                "translate(" + margin.left + "," + margin.top + ")");

        // Parse the Data
        data.forEach(function (d) {
            // Add X axis
            var x = d3.scaleLinear()
                .domain([0, 300])
                .range([ 0, width]);
            Barsvg.append("g")
                .attr("transform", "translate(0," + height + ")")
                .call(d3.axisBottom(x))
                .selectAll("text")
                .attr("transform", "translate(-10,0)rotate(-45)")
                .style("text-anchor", "end");

            // Y axis
            var y = d3.scaleBand()
                .range([ 0, height ])
                .domain(data.map(function(d) { return d.name; }))
                .padding(.1);
            Barsvg.append("g")
                .call(d3.axisLeft(y))

            //Bars
            Barsvg.selectAll("myRect")
                .data(data)
                .enter()
                .append("rect")
                .attr("x", x(0) )
                .attr("y", function(d) { return y(d.name); })
                .attr("width", function(d) { return x(d.active_members); })
                .attr("height", y.bandwidth() )
                .attr("fill", "#AC2B37")
        })
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
                    <div ref={this.chartRef} id="bar" className = "intro-card box border"> </div>
                </div>
                ); 
        }
        return (
            <div>
                {this.props.alt != null ? "Alternate" : undefined} Please select clubs to compare!
            </div>
        );
    }
}

export default BarChart;