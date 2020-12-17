import React, { Component } from 'react';
import Table from 'react-bootstrap/Table';
import Container from 'react-bootstrap/Container';

function tempsEpoch(temps) {
	let d = new Date(temps);
	return d.toLocaleDateString();
}

class Historique extends Component {
	constructor(props) {
		super(props)
		this.state = {
			donneeTableau: []
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
			donneeTableau: items
		});
	}

	render() {
	    return(
		<Container>
			<div className="d-flex 
					justify-content-between 
					flex-wrap flex-md-nowrap 
					align-items-center 
					pt-3 
					pb-2 
					mb-3 
					border-bottom">
				<h1 className="h2">Historique de commandes</h1>
			</div>

			<Table striped bordered hover size="sm">
			  <thead>
			    <tr>
				  <th>#</th>
			      <th>Command Name</th>
			      <th>Command Status</th>
				  <th>Request Status</th>
			      <th>Distance</th>
			      <th>Speed</th>
				  <th>Time</th>	
			    </tr>
			  </thead>
			  <tbody>
				{
					this.state.donneeTableau.map((pItem, index) =>
						<tr>
							<td>{ index + 1 }</td>
							<td>{ pItem.commandName }</td>
							<td>{ pItem.commandStatus }</td>
							<td>{ pItem.requestStatus }</td>
							<td>{ pItem.payload.distance }</td>
							<td>{ pItem.payload.speed }</td>
							<td>{ pItem._ts }</td>
						</tr>
					)
				}
			  </tbody>
			</Table>
		</Container>  
	    );
	}
}

export default Historique;
