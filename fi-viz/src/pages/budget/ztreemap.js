import * as d3 from 'd3'

// treemap example code
// http://bl.ocks.org/ganeshv/6a8e9ada3ab7f2d88022

var data = [
    {
      "key": "Asia",
      "values": [
            {
                "key": "India",
                "value": 1236670000
            },
            {
                "key": "China",
                "value": 1361170000
            },
        ]
    },
    {
      "key": "Africa",
      "values": [
            {
                "key": "Nigeria",
                "value": 173615000
            },
            {
                "key": "Egypt",
                "value": 83661000
            },
        ]
    },
  ]

var width = 500
var height = 500

var node = document.createElement('div'); // export this

var svg = d3.select(node).append('svg')
    .attr('width', width)
    .attr('height', height)

export default node