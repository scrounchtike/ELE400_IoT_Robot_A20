import React, { Component } from 'react';
import ListGroup from 'react-bootstrap/ListGroup';

const TaskItem = (props) => {
	return (
		<ListGroup.Item>
			<p>commandName : {props.commandname}</p>
			<p>commandStatus : {props.commandstatus}</p>
			<p>requestStatus : {props.requeststatus}</p>
			{/*<p>time : {props.time}</p>*/}
		</ListGroup.Item>
	);
};

class GetDataArray extends Component {

	constructor() {
		super()
		this.state = {
			commandobject1: {}, 
			commandobject2: {}, 
			commandobject3: {}, 
			commandobject4: {} 
		}
	}

	componentDidMount() {
		window.setInterval(() => {
			this.getData();
		}, 1000);
	}

	async getData() {
		const url = 'http://localhost:8080/api/cosmosdb/jobs';
		const donnee = await fetch(url, 
						{
						  headers : 
						    { 
						    'Content-Type': 'application/json',
						    'Accept': 'application/json'
					            }
						})
		const items = await donnee.json();
		this.setState({ 
			commandobject1: items[0],
			commandobject2: items[1],
			commandobject3: items[2],
			commandobject4: items[3]
		});
	}


	render() {
		return(
			<div>
				<ListGroup>
					<TaskItem 
						commandname={this.state.commandobject1.commandName}
						commandstatus={this.state.commandobject1.commandStatus} 
						requeststatus={this.state.commandobject1.requestStatus} 
						//time={this.state.commandobject1._ts}
					/>
					<TaskItem 
						commandname={this.state.commandobject2.commandName}
						commandstatus={this.state.commandobject2.commandStatus} 
						requeststatus={this.state.commandobject2.requestStatus} 
						//time={this.state.commandobject2._ts}
					/>
					<TaskItem 
						commandname={this.state.commandobject3.commandName}
						commandstatus={this.state.commandobject3.commandStatus} 
						requeststatus={this.state.commandobject3.requestStatus} 
						//time={this.state.commandobject1._ts}
					/>
					<TaskItem 
						commandname={this.state.commandobject4.commandName}
						commandstatus={this.state.commandobject4.commandStatus} 
						requeststatus={this.state.commandobject4.requestStatus} 
						//time={this.state.commandobject4._ts}
					/>
				</ListGroup>
			</div>
		)
	}

}

export default GetDataArray
