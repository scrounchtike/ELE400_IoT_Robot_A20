import React from "react";
import Navbar from 'react-bootstrap/Navbar'
import Nav from 'react-bootstrap/Nav'
import Badge from 'react-bootstrap/Badge'
/*import de Logo*/
import logo from './logo.png'; // Tell webpack this JS file uses this image
import Figure from 'react-bootstrap/Figure'
import FigureImage from 'react-bootstrap/FigureImage'
import { Link } from 'react-router-dom';

const NavbarReact = () => {
	return (
	<Navbar bg="light" expand="lg">
	  <Navbar.Brand>
	     <Link to="/"> 
		<Figure>
		    <Figure.Image
			width={75}
			height={105}
			alt="Logo"
			src={logo}
		    />
		</Figure>
	     </Link> 

	</Navbar.Brand>
	<Navbar.Toggle aria-controls="basic-navbar-nav"/>
		<Navbar.Collapse id="basic-navbar-nav">
			<Nav.Link as={ Link } to="/">Tableau de bord</Nav.Link>
			<Nav.Link as={ Link } to="/historique">Historique de commandes</Nav.Link>
		</Navbar.Collapse>
	<Navbar.Text>État du robot <Badge variant="secondary">Connecté</Badge></Navbar.Text>
    </Navbar> 
      
	);
};

export default NavbarReact;
