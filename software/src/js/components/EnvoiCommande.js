
const EnvoiCommande = (type, speed, distance) => {

	const donneeAEnvoyer =  {
	    type: type,
	    speed: speed,
	    distance: distance
	}

    const apiUrl = 'http://localhost:8080/api/command/call';
	  fetch(apiUrl, {
		  method: 'POST',
		  headers: {'Content-Type': 'application/json'},
		  body: JSON.stringify(donneeAEnvoyer)
	  })
      .then((response) => response.json())
      .then((data) => console.log('This is your data', data));
}

export default EnvoiCommande;

