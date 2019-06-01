import React, { Component } from 'react';
import axios from 'axios';
import { UrlServer } from '../Utils/ServerUrlConfig'
import readXlsxFile from 'read-excel-file'
class clasificadorGastos extends Component {
	constructor() {
		super();
		this.state = {
			clasificadorGastos:[]
		};
		this.clasificadorGastos = this.clasificadorGastos.bind(this)
		this.submitclasificadorGastos = this.submitclasificadorGastos.bind(this)
	}
	componentWillMount() {	
		
	}
	clasificadorGastos() {
		const input = document.getElementById('clasificadorGastos')
		readXlsxFile(input.files[0]).then((rows) => {
			//buscamos la palabra item	
			var row = 0
			var col = 0
			var clasificadorGastos = []
			for (let i = 1; i < rows.length; i++) {
				const fila = rows[i];
				clasificadorGastos.push(
					[fila[0],fila[1],fila[2],fila[3]]
				)
			}
			console.log("clasificadorGastos",clasificadorGastos);
			this.setState(
				{
					clasificadorGastos
				}
			)
		})
	}
	submitclasificadorGastos(){
		var clasificadorGastos = this.state.clasificadorGastos
		console.log("clasificadorGastos",clasificadorGastos);
		
		axios.post(`${UrlServer}/postclasificadoresPresupuestarios`,
		clasificadorGastos
	)
		.then((res) => {
			console.log(res.data)
			alert("exito al ingresar los datos")
		})
		.catch((error) => {
			console.log("ERROR",error)
			alert('errores al ingresar los datos')
		})
	}
	render() {
		const {clasificadorGastos} = this.state
		return (
			<div>
				<legend><b>cargar datos del clasificador de gastos</b></legend>
				<input type="file" id="clasificadorGastos" onChange={this.clasificadorGastos} />
				<hr/>
				<strong>{clasificadorGastos.length} datos cargados</strong>
				<hr/>
				<button className="btn btn-outline-success" onClick={this.submitclasificadorGastos}> Guardar datos </button>
				
			</div>
		);
	}
}
export default clasificadorGastos;