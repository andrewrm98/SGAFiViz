import React, { Component } from "react";
import * as d3 from "d3";

class BarChart extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selected: [],
        };
    }

    componentDidMount() {
        this.setState(function (state, props) {
            return {
                selected: props.selected,
            };
        });
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
            width = 860 - margin.left - margin.right,
            height = 800 - margin.top - margin.bottom;

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

    render() {
        if (this.state.selected.length > 0) {
            return <div id="bar"> </div>;
        }
        return (
            <div>
                {this.props.alt != null ? "Alternate" : undefined} Nothing Selected!
            </div>
        );
    }
}

export default BarChart;