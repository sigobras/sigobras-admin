import React from "react";
import ReactDOM from "react-dom";
import AppAng from './js/components/App';
import Login from './js/components/Login/Login';
import 'bootstrap/dist/css/bootstrap.min.css';
import './css/style.css';
import './css/bs4.css';
import 'react-table/react-table.css'

const wrapper = document.getElementById("zoe");
// wrapper ? ReactDOM.render(<AppAng />, wrapper) : 'cargarndo desde el componente de react false';
if(sessionStorage.getItem("idacceso") === null){
	ReactDOM.render(<Login />, wrapper)
}else{
	wrapper ? ReactDOM.render(<AppAng />, wrapper) : false;
}