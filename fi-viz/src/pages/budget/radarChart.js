import * as d3 from 'd3';

// function radarGroup(dataset, radarData, majors, subgroups, currMajor) {
//     // for every year in years...
//   var grouped = majors.map(function(major) {
//       var entry = {}
//         entry['Major'] = major.split('-', 1)[0]
//       // for every group in subgroups...
//       var groups =  subgroups.map(function(subgroup) {
//           // get the sum of this subgroup for this year
//           var sum = d3.sum(radarData.map(function(d) {
//               // return the # for current subgroup if its in the right year
//               if (d.Major == major) {
//               //console.log(d[subgroup])
//               return d[subgroup]
//               } 
//           }))
//           entry[subgroup] = sum
//           return sum
//       })
//       dataset.push(entry)
        
//   })
//   var list = (d3.map(dataset, function(d){return(d.Major)}).keys());
//       //console.log(list)
//       return list.indexOf(currMajor)   
  
//   }
  
  function updateRadar(radarData, major) {
      console.log('made it')
      console.log(radarData)
      d3.select('#radar').append('svg')
    {/*var currMajor = major;
    var selection = ""
    if (major == 'LS&T') {
      var selection = 'Learning Sciences and Technologies'
    }
    if (major == 'UX') {
      var selection = "User Experience"
    }
    else {
      var selection = major + "r"
    }
  
    d3.select('#radar').selectAll('svg').remove('g');
  
    console.log(radarData)
    var width = 600;
    var height = 600;
  var dataset = [];
  
  // get all subgroups
  var subgroups = radarData.columns.slice(6,16);
  
  // get all majors
  var majors = (d3.map(radarData, function(d){return(d.Major)}).keys());
    var majorIndex = radarGroup(dataset, radarData, majors, subgroups, currMajor);
    // /console.log(majorIndex)
    
  
  var cfg = {
    radius: 5,
    w: 600,
    h: 600,
    factor: 1,
    factorLegendX: .65,
    factorLegendY: .85,
    levels: 7,
    maxValue: 0,
    radians: 2 * Math.PI,
    opacityArea: 0.5,
    ToRight: 5,
    TranslateX: 80,
    TranslateY: 30,
    ExtraWidthX: 100,
    ExtraWidthY: 100,
    color: d3.scaleOrdinal().range(["#6F257F", "#CA0D59"])
   };
  
  var allAxis = ['Academic', 'Cultural', 'Sports', 'MusicArts', 'Awareness', 'CommunityService', 'Religious', 'Paid', 'Greek', 'Other']
      var total = allAxis.length;
      var radius = cfg.factor*Math.min(cfg.w/2, cfg.h/2);
      var Format = d3.format('%');
    
  // All the values (for the current major) in the correct format
  var values = []
            for(var j=0; j<allAxis.length; j++) {
                var area = allAxis[j]
                values.push({ area: area, value: dataset[majorIndex][area]})
            }
  
  // Append the SVG
  console.log('appending svg')
  var g = d3.select('#radar').append('svg')
    .attr('width', width)
    .attr('height', height)
  
    console.log('hello')
  
     // Create shape of levels
      for(var j=0; j<cfg.levels; j++){
        var levelFactor = cfg.factor*radius*((j+1)/cfg.levels);
        g.selectAll(".levels")
         .data(allAxis)
         .enter()
         .append("svg:line")
         .attr("x1", function(d, i){return levelFactor*(1-cfg.factor*Math.sin(i*cfg.radians/total));})
         .attr("y1", function(d, i){return levelFactor*(1-cfg.factor*Math.cos(i*cfg.radians/total));})
         .attr("x2", function(d, i){return levelFactor*(1-cfg.factor*Math.sin((i+1)*cfg.radians/total));})
         .attr("y2", function(d, i){return levelFactor*(1-cfg.factor*Math.cos((i+1)*cfg.radians/total));})
         .attr("class", "line")
         .style("stroke", "grey")
         .style("stroke-opacity", "0.75")
         .style("stroke-width", "0.3px")
         .attr("transform", "translate(" + (cfg.w/2-levelFactor) + ", " + (cfg.h/2-levelFactor) + ")");
      }
  
      // Text indicating at what % each level is
      for(var j=0; j<cfg.levels; j++){
        var levelFactor = cfg.factor*radius*((j+1)/cfg.levels);
        g.selectAll(".levels")
         .data([1]) //dummy data
         .enter()
         .append("text")
         .attr("x", function(d){return levelFactor*(1-cfg.factor*Math.sin(0));})
         .attr("y", function(d){return levelFactor*(1-cfg.factor*Math.cos(0));})
         .attr("class", "legend")
         .style("font-family", "sans-serif")
         .style("font-size", "14px")
         .attr("transform", "translate(" + (cfg.w/2-levelFactor + cfg.ToRight) + ", " + (cfg.h/2-levelFactor) + ")")
         .attr("fill", "#737373")
         .text(j+1);
      }
  
      var axis = g.selectAll(".axis")
          .data(allAxis)
          .enter()
          .append("g")
          .attr("class", "axis");
  
          // Lines from the center to the edges of the shape
        axis.append("line")
          .attr("x1", cfg.w/2)
          .attr("y1", cfg.h/2)
          .attr("x2", function(d, i){return cfg.w/2*(1-cfg.factor*Math.sin(i*cfg.radians/total));})
          .attr("y2", function(d, i){return cfg.h/2*(1-cfg.factor*Math.cos(i*cfg.radians/total));})
          .attr("class", "line")
          .style("stroke", "grey")
          .style("stroke-width", "1px");
  
          axis.append("text")
          .attr("class", "legend")
          .text(function(d){return d})
          .style("font-family", "sans-serif")
          .style("font-size", "14px")
          .style('font-weight', 'bold')
          .attr("text-anchor", "middle")
          .attr("dy", "1.5em")
          .attr("transform", function(d, i){return "translate(0, -10)"})
          .attr("x", function(d, i){return cfg.w/2*(1-cfg.factorLegendX*Math.sin(i*cfg.radians/total))-60*Math.sin(i*cfg.radians/total);})
          .attr("y", function(d, i){return cfg.h/2*(1-cfg.factorLegendY*Math.cos(i*cfg.radians/total))-20*Math.cos(i*cfg.radians/total);});
        
          
  
        var poly = []
  
        for(var i = 0; i < 10; i++) {
            var d = (300/7) * values[i]['value']
            var x1 = 300 + cfg.w/2*Math.sin(i*cfg.radians/total) * (d/300)
            var y1 = 300 - cfg.h/2*Math.cos(i*cfg.radians/total) * (d/300)
            poly.push({'x': x1, 'y': y1})
        }
  
            g.selectAll('.area')
                .data([poly])
                .enter()
                .append('polygon')
                .style('stroke', 'steelblue')
                .style('fill', 'red')
                .style('stroke-width', '2px')
                .style('opacity', 0.5)
                .attr('points', function(d) {
                    return d.map(function(d) {
                        return [d.x,d.y].join(",");
                    }).join(" ");
                }); */}
  
  }

  export default updateRadar;