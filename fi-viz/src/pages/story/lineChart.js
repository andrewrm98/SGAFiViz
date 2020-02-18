// import * as d3 from "d3";
import * as d3 from 'd3'

/********** Global Vars **********/
var node = document.createElement('div'); // export this
var xAxis = [], yAxis = []
var data = {xAxis, yAxis}


/********** Get Data ***********/
fetch('/api/slf')
.then(response => response.json())
.then(data => {
    var slf = data.slf
    
    // loop through elements in slf fee to construct x & y axis
    var i = 0
    for (i=0; i< slf.length; i++) {
      xAxis.push((slf[i])["Fiscal Year"])
      yAxis.push((slf[i])["SLF Amount"])
    } 

    // properly order the data
    const result = yAxis
        .map((item, index) => [xAxis[index], item]) 
        .sort(([count1], [count2]) => count2 - count1) 
        .map(([, item]) => item); 
      
    yAxis = result.reverse()
    xAxis = xAxis.sort((a, b) => a - b)

})
.catch(err => {
    console.log(err)
})


/********** Use D3 To Populate SVG **********/
var margin = {top: 10, right: 30, bottom: 30, left: 60},
    width = 460 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;
    
var svg = d3.select(node).append("svg")
              .attr("width", width + margin.left + margin.right)
              .attr("height", height + margin.top + margin.bottom)
              .append("g")
              .attr("transform",
                    "translate(" + margin.left + "," + margin.top + ")");

// Add X axis
var x = d3.scaleLinear()
  .domain([0, d3.max(data, function(d) { return +d.xAxis; })])
  .range([ 0, width ]);
svg.append("g")
  .attr("transform", "translate(0," + height + ")")
  .call(d3.axisBottom(x));

// Add Y axis
var y = d3.scaleLinear()
  .domain([0, d3.max(data, function(d) { return +d.yAxis; })])
  .range([ height, 0 ]);
svg.append("g")
  .call(d3.axisLeft(y));

// Add the line
svg.append("path")
  .datum(data)
  .attr("fill", "none")
  .attr("stroke", "steelblue")
  .attr("stroke-width", 1.5)
  .attr("d", d3.line()
    .x(function(d) { return x(d.xAxis) })
    .y(function(d) { return y(d.yAxis) })
  );


export default node