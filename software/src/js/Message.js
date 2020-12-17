
import React from 'react'

export const populateDeviceList = () => {
    fetch('/api/devices/list')
        .then((res) => res.json())
        .then((list) => {
        if (!list.length) 
            return
        const options = list.map((d) => `<option>${d}</option>`); 
        //$select.innerHTML = options.join('\n');
        return options.join('\n')
    })
    .catch(console.error);
}

const Message = () => {
    return (
        <div className="content">
            <h1>Rexpack</h1>
            <p className="description">React, Express, and Webpack Boilerplate Application</p>
            <div className="awful-selfie"></div>
        </div>
    )
}
export default Message