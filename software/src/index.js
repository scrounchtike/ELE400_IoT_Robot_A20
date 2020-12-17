import React from 'react'
import ReactDOM from 'react-dom'
import Message from './js/Message'
import './css/style.css'
import App from './js/App';
//import './css/index.css';
import './css/bootstrap.min.css'

//ReactDOM.render(
//  <Message />,
//  document.getElementById('react-container')
//)
ReactDOM.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>,
    document.getElementById('root')
);

// Needed for Hot Module Replacement
if(typeof(module.hot) !== 'undefined') {
  module.hot.accept()
}
