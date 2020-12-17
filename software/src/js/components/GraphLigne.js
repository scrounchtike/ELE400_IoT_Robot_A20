import React, { Component } from 'react';
import Chart from 'chart.js';

class GraphLigne extends Component {
    constructor(props) {
    super(props);
    this.canvasRef = React.createRef();
  }
	
	componentDidUpdate() {
		if(this.props.title[0] == "Vitesse")
		{
			this.myChart.data.datasets[0].label = this.props.title[0];
			this.myChart.data.datasets[0].borderColor = this.props.color[0];
			this.myChart.data.datasets[0].data = this.props.data.map(d => d.value);
			this.myChart.data.labels = this.props.data.map(d => d.time);
			this.myChart.update();
		}
		else
		{	
			this.myChart.data.datasets[0].label = this.props.title[0];
			this.myChart.data.datasets[0].borderColor = this.props.color[0];
			this.myChart.data.datasets[0].data = this.props.data.map(d => d.valueX);
			this.myChart.data.datasets[1].label = this.props.title[1];
			this.myChart.data.datasets[1].borderColor = this.props.color[1];
			this.myChart.data.datasets[1].data = this.props.data.map(d => d.valueY);
			this.myChart.data.labels = this.props.data.map(d => d.time);
			this.myChart.update();
		}
	}

  componentDidMount() {
    this.myChart = new Chart(this.canvasRef.current, {
      type: 'line',
	    options: {
		animation: {
        		duration: 0
		}

	      /*
	scales: {
          xAxes: [
            {
              type: 'time',
              time: {
                unit: 'week'
              }
            }
          ],
          yAxes: [
            {
              ticks: {
                min: 0
              }
            }
          ]
	}
	      */
      },
      data: {
        //labels: this.props.data.map(d => d.label),
        labels: [], 
        datasets: [{
          label: "",
          //data: this.props.data.map(d => d.value),
          data: [],
          fill: 'none',
          //backgroundColor: this.props.color,
          //pointRadius: 2,
          borderColor: ""
          //borderWidth: 1,
          //lineTension: 0
	},
	{	
	  label: "",
          data: [],
          fill: 'none',
          borderColor: ""
	}]
      }
    });
  }

  render() {
    return <canvas ref={this.canvasRef} />;
  }
}

export default GraphLigne
