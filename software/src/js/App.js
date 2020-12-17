import React, { Component } from "react";
import "../css/App.css";
import NavbarReact from "./components/NavbarReact";
import Sidebar from "./components/Sidebar";
import TableauDeBord from "./components/TableauDeBord";
import ControlRobot from "./components/ControlRobot";
import Historique from "./components/Historique";
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'

function App() {	
	return (
	<Router>
		<div className="App">
			<NavbarReact />
			<Switch>
				<Route path="/historique" component={Historique} />
				<Route path="/" component={Home} />
			</Switch>
		</div>
	</Router>
	);
}

class Home extends Component {
	constructor(props) {
		super(props);
		this.state = { distance: 0 };
		this.onInputChange = this.onInputChange.bind(this);
	}
	
	onInputChange(value) {
		this.setState({ distance: value});
	}

	render() {
		return (
		<div className="container-fluid">
				<div className="row">
					<main role="main" className="col ">
						<TableauDeBord dist={this.state.distance}/>
						<br/>
						<br/>
						<ControlRobot onChange={this.onInputChange}/>
					</main>
					<Sidebar />
				</div>
		</div>
		);
	}
}

export default App;
