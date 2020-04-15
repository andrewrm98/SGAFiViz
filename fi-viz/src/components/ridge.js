import * as d3 from "d3";

const draw = (props) => {
  d3.select(".ridge > *").remove();
  var categories = new Set();
  var data = {};

  var margin = { top: 80, right: 30, bottom: 50, left: 110 },
    width = 460 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

  // Code for Ridgeline chart adapted from: https://www.d3-graph-gallery.com/graph/ridgeline_basic.html
  const svg = d3
    .select(".ridge")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  fetch("/api/category_organization_numbers")
    .then((res) => res.json())
    .then(
      (result) => {
        var b = result.members;
        var i = 0;
        for (i = 0; i < b.length; i++) {
          var cat = b[i].Category;
          categories.add(cat);
          if (data[cat]) {
            data[cat].push(b[i]["Active Members"]);
          } else {
            data[cat] = [];
            data[cat].push(b[i]["Active Members"]);
          }
        }
        categories = Array.from(categories);
        var n = categories.length;
        var max = 0;
        for (const key in data) {
          if (data.hasOwnProperty(key)) {
            const values = data[key];
            var lm = Math.max(...values);
            max = lm > max ? lm : max;
          }
        }

        var x = d3.scaleLinear().domain([0, max]).range([0, width]);
        svg
          .append("g")
          .attr("transform", "translate(0," + height + ")")
          .call(d3.axisBottom(x));

        var y = d3.scaleLinear().domain([0, 0.4]).range([height, 0]);

        var yName = d3
          .scaleBand()
          .domain(categories)
          .range([0, height])
          .paddingInner(1);
        svg.append("g").call(d3.axisLeft(yName));

        var kde = kernelDensityEstimator(kernelEpanechnikov(7), x.ticks(40));
        var allDensity = [];
        for (let i = 0; i < n; i++) {
          var key = categories[i];
          var density = kde(data[key]);
          density.unshift([0, 0]);
          density.push([max, 0]);
          allDensity.push({ key: key, density: density });
        }

        svg
          .selectAll("areas")
          .data(allDensity)
          .enter()
          .append("path")
          .attr("transform", function (d) {
            return "translate(0," + (yName(d.key) - height) + ")";
          })
          .datum(function (d) {
            return d.density;
          })
          .attr("fill", "#9d1212")
          .attr("stroke", "#000")
          .attr("stroke-width", 1)
          .attr(
            "d",
            d3
              .line()
              .curve(d3.curveBasis)
              .x(function (d) {
                return x(d[0]);
              })
              .y(function (d) {
                return y(d[1]);
              })
          );
      },
      (error) => {
        console.log(error);
      }
    );

  function kernelDensityEstimator(kernel, X) {
    return function (V) {
      return X.map(function (x) {
        return [
          x,
          d3.mean(V, function (v) {
            return kernel(x - v);
          }),
        ];
      });
    };
  }
  function kernelEpanechnikov(k) {
    return function (v) {
      return Math.abs((v /= k)) <= 1 ? (0.75 * (1 - v * v)) / k : 0;
    };
  }
};
export default draw;
