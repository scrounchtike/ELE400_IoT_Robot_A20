import React from 'react';
import GetDataArray from './GetDataArray';

const Sidebar = () => {
	return (
		<nav id="sidebarMenu" className="col-3 bg-light sidebar ">
	      <div className="sidebar-sticky pt-2">
		<div className="row justify-content-center">
			<h2>Tâches</h2>
		</div>
		<GetDataArray/>
	      </div>
	    </nav>
	);
}

export default Sidebar 
