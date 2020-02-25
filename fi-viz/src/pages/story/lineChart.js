// import * as d3 from "d3";
import * as d3 from 'd3'

/********** Global Vars **********/
var node = document.createElement('div'); // export this
//var parentDiv = document.getElementById("lineChartBox"); // for parent margins
var year = [], fee = []
var lineData = [{}] // connects with server
var lineData2 = [ // manually made this data for testing
  {year: 2005, fee: 250}, 
  {year: 2006, fee: 250},
  {year: 2007, fee: 250},
  {year: 2008, fee: 250},
  {year: 2009, fee: 260},
  {year: 2010, fee: 260},
  {year: 2011, fee: 260},
  {year: 2012, fee: 260},
  {year: 2013, fee: 260},
  {year: 2014, fee: 260},
  {year: 2015, fee: 260},
  {year: 2016, fee: 260},
  {year: 2017, fee: 260},
  {year: 2018, fee: 260},
  {year: 2019, fee: 280},
  {year: 2020, fee: 316}, 
  {year: 2021, fee: 316}
]

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

      for (var i=0; i<year.length; i++){
        var d = {}
        d['year'] = parseInt(year[i]);
        d['fee'] = parseInt(fee[i]);
        lineData[i] = d
      } 

      /********** Use D3 To Populate SVG **********/
      var margin = {top: 50, right: 50, bottom: 50, left: 50},
          width = 960 - margin.left - margin.right,
          height = 500 - margin.top - margin.bottom;

      var svg = d3.select(node).append("svg")
              .attr("width", width + margin.left + margin.right)
              .attr("height", height + margin.top + margin.bottom)
              //.style("background-color", 'white')
            .append("g")
              .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

      // parse the date / time
      var parseTime = d3.timeParse("%Y")

      // Add X Axis
      var x = d3.scaleTime()
      .domain(d3.extent(lineData, function(d) { return parseTime(d.year) }))
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
      .attr("stroke-width", 2)
      .attr("d", d3.line()
      .x(function(d) { return x(parseTime(d.year)) })
      .y(function(d) { return y(d.fee) })
      );     
      
      // add title
      svg.append("text")
        .attr("x", (width / 2))             
        .attr("y", 0 - (margin.top / 2))
        .attr("text-anchor", "middle")  
        .style("font-size", "24px")  
        .style("font", "times") 
        .text("SLF Trend");
})

.catch(err => {
    console.log(err)
})



 
export default node