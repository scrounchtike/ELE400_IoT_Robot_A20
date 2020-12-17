import React, { Component } from "react";
import EnvoiCommande from "./EnvoiCommande";
import GraphLigne from "./GraphLigne";
import Card from 'react-bootstrap/Card'
import CardDeck from 'react-bootstrap/CardDeck'
import Container from 'react-bootstrap/Container'
import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'

function extraireTemps(temps) { return	temps.substr(temps.indexOf("T") + 1, 8); }

function extraireSeconde(temps) {
	const chaine = extraireTemps(temps);
	const tableau = chaine.split(":").map(x=>+x);
	return tableau[2] + (tableau[1] * 60) + (tableau[0] * 3600);
}

function calculVitesse(distance, tempsDebut, tempsFin) {
	const debut = extraireSeconde(tempsDebut); 
	const fin = extraireSeconde(tempsFin); 
	if(fin < debut)
		fin += 86400;
	else if(fin == debut)
		return 0;
	return distance/(fin - debut);
}

function calculPositionXY(distance, angle) {
	const position = {
		x: distance * Math.cos(angle),
		y: distance * Math.sin(angle)
	};
	return position; 
}

function calculPointCardinal(angle) {
	
	let direction_chaine = "N/A";

	if(angle > 337.25 || angle <= 22.5)
	{
		direction_chaine = "N";
	}
	else if(angle > 292.5 && angle <= 337.25)
	{
		direction_chaine = "N-O";
	}
	else if(angle > 247.5 && angle <= 292.5)
	{
		direction_chaine = "O";
	}
	else if(angle > 202.5 && angle <= 247.5)
	{
		direction_chaine = "S-O";
	}
	else if(angle > 157.5 && angle <= 202.5)
	{
		direction_chaine = "S";
	}
	else if(angle > 112.5 && angle <= 157.5)
	{
		direction_chaine = "S-E";
	}
	else if(angle > 67.5 && angle <= 112.5)
	{
		direction_chaine = "E";
	}
	else if(angle > 22.5 && angle <= 67.5)
	{
		direction_chaine = "N-E";
	}

	return direction_chaine;
}

function calculInclinaison(accZ){	
	return Math.round(Math.acos(Math.abs(accZ) / 995));
}

function calculAngle(valx, valy) {

	const vallsb = 1;
	const valxGauss = valx * vallsb;
	const valyGauss = valy * vallsb;
	let angle = 0;

	if(valxGauss != 0)
	{
		angle = Math.atan(valyGauss/valxGauss) * (180/Math.PI);
	}
	else
	{
		if(valyGauss < 0)
		{
			angle = 90;
		}
		else
		{
			angle = 0;
		}
	}

	if(angle > 360)
	{
		angle = angle - 360;
	}
	else if(angle < 0)
	{
		angle = angle + 360;
	}

	return angle;
}

class TableauDeBord extends Component {
	constructor(props) {
		super(props);
		this.state = {
			titreVitesse: ["Vitesse"],
			couleurVitesse: ["#00A416"],
			titrePosition: ["Position X", "Position Y"],
			couleurPosition: ["#0082D0", "#D06C00"],
			vitesseTableau: [],
			positionTableau: [],
			inclinaison: 0,
			angle: 0,
			direction:"N/A",
			distance: 0,
			heure: ""
		};
	}

	componentDidMount() {
		window.setInterval(() => {
			this.getData(this.props.dist);
		}, 1000);
	}
	
	async getData(distanceParcouru) {
		const url = "http://localhost:8080/api/cosmosdb/telemetry";
		const donnee = await fetch(url, 
						  {
						      headers: 
						        {
							'Content-Type': 'application/json',
							'Accept': 'application/json'
						        }
		                                 })
		const telemetry = await donnee.json();

		//DEBUG: On met la date actuel a la place de celle de la commande pour tester
		telemetry[0].ts = new Date(new Date().toString().split('GMT')[0]+' UTC').toISOString().split('.')[0]; 

		if(telemetry[0].ts != this.state.heure)
		{
		//on obtient les donner de la télémetrie recu
		const distanceNouveau = distanceParcouru + this.state.distance;
		const angleNouveau = calculAngle(telemetry[0].magnetometerX, telemetry[0].magnetometerY);
		const positionNouveau = calculPositionXY(distanceParcouru, angleNouveau);
		let nouveauVitesseTableau = []
		if(this.state.heure != "")
		{
			nouveauVitesseTableau = this.state.vitesseTableau.concat({
				time: extraireTemps(telemetry[0].ts),
				value: calculVitesse(distanceParcouru, this.state.heure, telemetry[0].ts) 
			});
			if (nouveauVitesseTableau.length > 20) {
				nouveauVitesseTableau.shift();
			}
		}
		else
		{
			nouveauVitesseTableau = this.state.vitesseTableau.concat({
				time: " ",
				value: 0 
			});
		}
		// si on recoit un raz du robot 
		if(telemetry[0].raz == "true")
		{
			distanceNouveau = 0;
			positionNouveau = [];
			nouveauVitesseTableau = [];
		}
		
		const inclinaisonNouveau = calculInclinaison(telemetry[0].accelerometerZ);
		const nouveauPositionTableau = this.state.positionTableau.concat({
			time: extraireTemps(telemetry[0].ts),
			valueX: Math.round(positionNouveau.x),
			valueY:	Math.round(positionNouveau.y) 
		});
		if (nouveauPositionTableau.length > 20) {
			nouveauPositionTableau.shift();
		}
		this.setState({ 
			vitesseTableau: nouveauVitesseTableau,
			positionTableau: nouveauPositionTableau,
			inclinaison: inclinaisonNouveau,
			angle: angleNouveau,
			direction: calculPointCardinal(angleNouveau),
			distance: distanceNouveau,
			heure: telemetry[0].ts
		});
		}
	}

	onClick() {
		EnvoiCommande("reset", 0, 0);
		this.setState({ 
			vitesseTableau: [],
			positionTableau:[],
			distance: 0,
		});
	}

	render() {
		return (
			<div>
				<div
					className="d-flex 
								justify-content-between 
								flex-wrap flex-md-nowrap 
								align-items-center 
								pt-3 
								pb-2 
								mb-3 
								border-bottom">
					<h1 className="h2">Tableau de bord</h1>
					<div className="btn-toolbar mb-2 mb-md-0">
						<div className="btn-group mr-2">
							<button
								type="button"
								className="btn btn-sm btn-outline-secondary"
								onClick={() =>
									this.onClick()
								}>
								Remise à zéro
							</button>
						</div>
					</div>
				</div>
			
				<CardDeck>

				<Card> 		
    				<Card.Body>
      					<Card.Title>Distance</Card.Title>
      					<Card.Text>
						{this.state.distance} cm
      					</Card.Text>
    				</Card.Body>
  				</Card>

  				<Card>
    			<Card.Body>
      				<Card.Title>Inclinaison</Card.Title>
      					<Card.Text>
						{this.state.inclinaison} °
      					</Card.Text>
    			</Card.Body>
  				</Card>

  				<Card>
    				<Card.Body>
      				<Card.Title>Direction</Card.Title>
      					<Card.Text>
						{this.state.direction}
						<br/>
						{Math.round(this.state.angle)} °
      					</Card.Text>
    				</Card.Body>
  				</Card>
			  </CardDeck>
				<Container>
				<Col xs={9}>
				<Row>
					<GraphLigne data={this.state.vitesseTableau}
						    title={this.state.titreVitesse}
						    color={this.state.couleurVitesse}
					/>
				</Row>
				<Row>
					<GraphLigne data={this.state.positionTableau}
						    title={this.state.titrePosition}
						    color={this.state.couleurPosition}
					/>
				</Row>
				</Col>
				</Container>
			</div>
		);
	}
}

export default TableauDeBord;
