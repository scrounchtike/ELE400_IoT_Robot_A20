import React, { Component } from "react";
import EnvoiCommande from "./EnvoiCommande";

class ControlRobot extends Component {
    constructor(props) {
    super(props);
    this.state = {
      vitesseAngulaire: 0,
      vitesseLineaire: 0,
      angle: 0,
      distance: 0
    };
	    this.handleChange = this.handleChange.bind(this);
	    this.handleSubmitLinear = this.handleSubmitLinear.bind(this);
	    this.handleSubmitAngular = this.handleSubmitAngular.bind(this);
  }

  handleChange(event) {
    const target = event.target;
    const name = target.name;
    const value = target.value;
    this.setState({
      [name]: value
    });
  }

  handleSubmitLinear(event) {
	  event.preventDefault();
	  EnvoiCommande('linear', parseInt(this.state.vitesseLineaire), parseInt(this.state.distance));
	  this.props.onChange(parseInt(this.state.distance));
  }
  handleSubmitAngular(event) {
	  event.preventDefault();
	  EnvoiCommande('angular', parseInt(this.state.vitesseAngulaire), parseInt(this.state.angle));
  }

  render() {
    return (
      <form onSubmit={this.handleSubmitLinear}>
        <div>
          <input
		        name="distance"
            type="text"
            id="weight"
            placeholder="Distance en centimètre"
            onChange={this.handleChange}
          />
          <input
            name="vitesseLineaire"
            type="text"
            id="weight"
            placeholder="Vitesse en cm/s"
            onChange={this.handleChange}
          />
          <input
            name="avancer"
            type="submit"
            className="btn btn-sm btn-outline-secondary"
            value="Avancer"
          />
        </div>
        <br />
        <br />
        <div>
          <input
            name="angle"
            type="text"
            id="weight"
            placeholder="Rotation en degree"
            onChange={this.handleChange}
          />
          <input
            name="vitesseAngulaire"
            type="text"
            id="weight"
            placeholder="Vitesse en degree/s"
            onChange={this.handleChange}
          />
          <button
		        name="tourner"
		        type="button"
		        className="btn btn-sm btn-outline-secondary"
		        onClick={this.handleSubmitAngular}
	        >Tourner
	        </button>
        </div>
      </form>
    );
  }
}

export default ControlRobot;
