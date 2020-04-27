import React, { Component } from "react";
import updateRadar from './radarChart.js';
import * as d3 from 'd3'
import data from './data/FinalDataVis.csv'

class RadarChart extends Component {

  constructor(props) {
    super(props);
    this.state = {
      d3: '',
      height: 0,
      width: 0
    }
    this.chartRef = React.createRef();
  }

  componentDidMount() {
    updateRadar(data, 'ME') // looping a bunch of times?
  }
  componentDidUpdate() {
    //updateRadar('ME');
  }

  render() { return <div id="radar"></div> }
}


export default RadarChart;
