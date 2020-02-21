// import * as d3 from "d3";
import * as d3 from 'd3'

/********** Global Vars **********/
var node = document.createElement('div'); // export this
var xAxis = [], yAxis = []
var lineData2 = [{}] // connects with server
var lineData = [ // manually made this data for testing
  {xAxis: 2005, yAxis: 250}, 
  {xAxis: 2006, yAxis: 250},
  {xAxis: 2007, yAxis: 250},
  {xAxis: 2008, yAxis: 250},
  {xAxis: 2009, yAxis: 260},
  {xAxis: 2010, yAxis: 260},
  {xAxis: 2011, yAxis: 260},
  {xAxis: 2012, yAxis: 260},
  {xAxis: 2013, yAxis: 260},
  {xAxis: 2014, yAxis: 260},
  {xAxis: 2015, yAxis: 260},
  {xAxis: 2016, yAxis: 260},
  {xAxis: 2017, yAxis: 260},
  {xAxis: 2018, yAxis: 260},
  {xAxis: 2019, yAxis: 280},
  {xAxis: 2020, yAxis: 316}, 
  {xAxis: 2021, yAxis: 316}
]

/********** Get Data ***********/
fetch('/api/slf')
  .then(response => response.json())
  .then(data => {
      var slf = data.slf
      
      // loop through elements in slf fee to construct x & y axix
      for (var i=0; i< slf.length; i++) {
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

      for (var i=0; i<xAxis.length; i++){
        var d = {}
        d['xAxis'] = parseInt(xAxis[i]);
        d['yAxis'] = parseInt(yAxis[i]);
        lineData2[i] = d
      } 
})

.catch(err => {
    console.log(err)
})


/********** Use D3 To Populate SVG **********/
var margin = {top: 50, right: 50, bottom: 50, left: 50},
  width = 600 - margin.left - margin.right,
  height = 450 - margin.top - margin.bottom;
  
var svg = d3.select(node).append("svg")
          .attr("width", width + margin.left + margin.right)
          .attr("height", height + margin.top + margin.bottom)
        .append("g")
          .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// Add X Axis
var x = d3.scaleLinear()
  .domain([d3.min(lineData, function(d) { return d.xAxis}),
      d3.max(lineData, function(d) { return d.xAxis })])
  .range([ 0, width ]);

svg.append("g")
  .attr("transform", "translate(0," + height + ")")
  .call(d3.axisBottom(x));

// Add Y Axis
var y = d3.scaleLinear()
  .domain([d3.min(lineData, function(d) { return d.yAxis}),
    d3.max(lineData, function(d) { return d.yAxis })])
  .range([ height, 0 ]);

svg.append("g")
  .call(d3.axisLeft(y));

// Add the line
svg.append("path")
  .datum(lineData)
  .attr("fill", "none")
  .attr("stroke", "steelblue")
  .attr("stroke-width", 1.5)
  .attr("d", d3.line()
  .x(function(d) { return x(d.xAxis) })
  .y(function(d) { return y(d.yAxis) })
  );  

export default node