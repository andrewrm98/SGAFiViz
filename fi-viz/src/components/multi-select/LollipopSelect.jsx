import React, { Component } from "react";
import * as d3 from "d3";

class LollipopSelect extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selected: [],
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
        height: 740
      };
    });
    this.drawLollipop();

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
      height = this.getHeight() - 175; // subtract 175 bc of weird offset issue
    }
    catch(error) {
      console.log(error)
      console.error("element dimension error, please refresh page")
      // width = this.state.width  + 60
      // height = this.state.height + 60
    }
    this.setState({width: width-60, height: height-60});
    
    this.drawLollipop = this.drawLollipop.bind(this);
    this.drawLollipop();
  }

  componentDidUpdate(prevProps, prevState) {
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

  drawLollipop() {
    d3.select("#lollipop").select("svg").remove();
    const data = this.state.selected;

    var Lolmargin = { top: 30, right: 30, bottom: 70, left: 60 },
      Lolwidth = this.state.width - Lolmargin.left - Lolmargin.right,
      Lolheight = this.state.height - Lolmargin.top - Lolmargin.bottom;

    d3
      .select("#lollipop")
      .append("div")
      //.attr("class", "tooltip")
      .style("opacity", 0);

    // append the svg object to the body of the page
    var Lolsvg = d3
      .select("#lollipop")
      .append("svg")
      .attr("width", Lolwidth + Lolmargin.left + Lolmargin.right)
      .attr("height", Lolheight + Lolmargin.top + Lolmargin.bottom)
      .append("g")
      .attr(
        "transform",
        "translate(" + Lolmargin.left + "," + Lolmargin.top + ")"
      );

    data.forEach(function (d) {
      // Initialize the X axis
      var x = d3.scaleBand().range([0, Lolwidth]).padding(1);
      var xAxis = Lolsvg.append("g").attr(
        "transform",
        "translate(0," + Lolheight + ")"
      );

      // Initialize the Y axis
      var y = d3.scaleLinear().range([Lolheight, 0]);
      var yAxis = Lolsvg.append("g").attr("class", "myYaxis");

      // X axis
      x.domain(
        data.map(function (d) {
          return d.name;
        })
      );
      xAxis.transition().duration(1000).call(d3.axisBottom(x));

      // Add Y axis
      y.domain([
        0,
        d3.max(data, function (d) {
          return d.budget;
        }),
      ]);
      yAxis.transition().duration(1000).call(d3.axisLeft(y));

      // variable u: map data to existing circle
      var j = Lolsvg.selectAll(".myLine").data(data);
      // update lines
      j.enter()
        .append("line")
        .attr("class", "myLine")
        .merge(j)
        .transition()
        .duration(1000)
        .attr("x1", function (d) {
          return x(d.name);
        })
        .attr("x2", function (d) {
          return x(d.name);
        })
        .attr("y1", y(0))
        .attr("y2", function (d) {
          return y(d.budget);
        })
        .attr("stroke", "grey");

      // variable u: map data to existing circle
      var u = Lolsvg.selectAll("circle").data(data);
      // update bars
      u.enter()
        .append("circle")
        .merge(u)
        .transition()
        .duration(1000)
        .attr("cx", function (d) {
          return x(d.name);
        })
        .attr("cy", function (d) {
          return y(d.budget);
        })
        .attr("r", 8)
        .attr("fill", "#AC2B37");
      Lolsvg.selectAll("circle").data(data);
    });
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
                <h1 className="title"> Individual Club Budgets </h1>
                <p> The lollipop chart shows an idea of what each club has as a yearly working budget. As you select more clubs on the left you can show multiple club budgets in comparison to each other. </p>
            </div>
            {/* chart */}
            <div ref={this.chartRef} id="lollipop" className = "intro-card box border"> </div>
        </div>
        );
    }

    return (
      <div>
        {this.props.alt != null ? "Alternate" : undefined} <span className="red error-msg">* Please select clubs to compare! *</span>
      </div>
    );
  }
}

export default LollipopSelect;
