import React, { Component } from "react";
import * as d3 from "d3";

class LollipopSelect extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selected: [],
        };
    }

    componentDidMount() {
        this.setState({
            selected: this.props.selected,
        });
        this.drawLollipop();
    }

    static getDerivedStateFromProps(props, current_state) {
        if (current_state.selected !== props.selected) {
            return {
                selected: props.selected,
            };
        }
        return null;
    }

    drawLollipop () {

        const data1 = [
            { name: "Cyber Security Club", category: "Academic", budget: "15000", active_members: 23 },
            { name: "The Alliance", category: "Awareness", budget: "3550", active_members: 43 },
            {name: "Colleges Against Cancer", category: "Community Service", budget: "70000", active_members: 75},
            {name: "Habitat For Humanity", category: "Community Service", budget: "13505", active_members: 30},
            { name: "Hillel", category: "Cultural", budget: "2500" },
            {name: "Game Development Club", category: "Extracurricular", budget: "300", active_members: 35},
        ];
        const data = this.state.selected;

        var Lolmargin = {top: 30, right: 30, bottom: 70, left: 60},
            Lolwidth = 900 - Lolmargin.left - Lolmargin.right,
            Lolheight = 740 - Lolmargin.top - Lolmargin.bottom;

        var div = d3.select("#lollipop").append("div")
            //.attr("class", "tooltip")
            .style("opacity", 0);

        // append the svg object to the body of the page
        var Lolsvg = d3.select("#lollipop")
            .append("svg")
            .attr("width", Lolwidth + Lolmargin.left + Lolmargin.right)
            .attr("height", Lolheight + Lolmargin.top + Lolmargin.bottom)
            .append("g")
            .attr("transform", "translate(" + Lolmargin.left + "," + Lolmargin.top + ")");

        data.forEach(function (d) {

            // Initialize the X axis
            var x = d3.scaleBand()
                .range([ 0, Lolwidth ])
                .padding(1);
            var xAxis = Lolsvg.append("g")
                .attr("transform", "translate(0," + Lolheight + ")");

            // Initialize the Y axis
            var y = d3.scaleLinear()
                .range([ Lolheight, 0]);
            var yAxis = Lolsvg.append("g")
                .attr("class", "myYaxis");

            // X axis
            x.domain(data.map(function(d) { return d.name; }))
            xAxis.transition().duration(1000).call(d3.axisBottom(x));

            // Add Y axis
            y.domain([0, d3.max(data, function(d) { return d.budget}) ]);
            yAxis.transition().duration(1000).call(d3.axisLeft(y));

            // variable u: map data to existing circle
            var j = Lolsvg.selectAll(".myLine")
                .data(data);
            // update lines
            j
                .enter()
                .append("line")
                .attr("class", "myLine")
                .merge(j)
                .transition()
                .duration(1000)
                .attr("x1", function(d) { return x(d.name); })
                .attr("x2", function(d) { return x(d.name); })
                .attr("y1", y(0))
                .attr("y2", function(d) { return y(d.budget); })
                .attr("stroke", "grey");

            // variable u: map data to existing circle
            var u = Lolsvg.selectAll("circle")
                .data(data);
            // update bars
            u
                .enter()
                .append("circle")
                .merge(u)
                .transition()
                .duration(1000)
                .attr("cx", function(d) { return x(d.name); })
                .attr("cy", function(d) { return y(d.budget); })
                .attr("r", 8)
                .attr("fill", "#e06377");
            Lolsvg
                .selectAll("circle")
                .data(data);

        });

        //basaic bar chart below
        /*
        const data = [12, 5, 6, 6, 9, 10];

        const svg = d3.select("#lollipop")
            .append("svg")
            .attr("width", 500)
            .attr("height", 500)
            .style("margin-left", 100);

        svg.selectAll("rect")
            .data(data)
            .enter()
            .append("rect")
            .attr("x", (d, i) => i * 70)
            .attr("y", (d, i) => 500 - 10 * d)
            .attr("width", 65)
            .attr("height", (d, i) => d * 10)
            .attr("fill", "green")

         */
    }

    render() {
        if (this.state.selected.length > 0) {
            return (
                <div id="lollipop"> </div>
            );
        }
        return (
            <div>
                {this.props.alt != null ? "Alternate" : undefined} Nothing Selected!
            </div>
        );
    }
}

export default LollipopSelect;
