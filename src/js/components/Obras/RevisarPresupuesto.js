import React, { Component } from 'react';
import axios from 'axios';
import { UrlServer } from '../Utils/ServerUrlConfig'
import readXlsxFile from 'read-excel-file'
class RevisarPresupuesto extends Component {
	constructor() {
		super();
		this.state = {
			Obra: "",
			partidas: []
		};
	}
	componentWillMount() {
		var id_ficha = sessionStorage.getItem("idFicha")
		axios.post(`${UrlServer}/getObra`,
			{
				"id_ficha": id_ficha
			}
		)
			.then((res) => {
				// console.log(res.data);
				this.setState({
					Obra: res.data
				})
			})
			.catch((error) => {
				console.log('ERROR', error);
				alert('algo ha salido mal')
			});
		var id_ficha = sessionStorage.getItem("idFicha")
		axios.post(`${UrlServer}/getPartidasObra`,
			{
				"id_ficha": id_ficha
			}
		)
			.then((res) => {
				console.log(res.data);
				this.setState({
					partidas: res.data
				})
			})
			.catch((error) => {
				console.log('ERROR', error);
				alert('algo ha salido mal')
			});

	}
	Presupuesto() {
		const input = document.getElementById('Presupuesto')
		readXlsxFile(input.files[0]).then((rows) => {
			//buscamos la palabra item
			var row = 0
			var col = 0
			for (let i = 0; i < rows.length; i++) {
				const fila = rows[i];
				for (let j = 0; j < fila.length; j++) {
					const celda = fila[j];
					if ((String(celda)).toUpperCase() == "ITEM") {
						row = i
						col = j
						break
					}
				}
			}
			console.log("ITEM", row, col);
		})
	}
	render() {
		const { Obra, partidas } = this.state
		return (
			<div>
				<strong>{Obra.codigo + " " + Obra.g_meta}</strong>
				<hr />
				<legend><b>cargar datos del Presupuesto de Obra</b></legend>
				<input type="file" id="Presupuesto" onChange={this.Presupuesto} />
				<button onClick={this.Presupuesto} className="btn btn-success">RECARGAR</button>
				<hr />
				<table className="table-hover">
					<thead>
						<tr>
							<th>partidas</th>
							<th>Contact</th>
							<th>Country</th>
						</tr>
					</thead>
					<tbody>
						{partidas.map((partida, index) =>
							<tr key={index}>
								<td>{partida.item}</td>
								<td>{partida.descripcion}</td>
								<td>Germany</td>
							</tr>
						)}
						
					</tbody>

				</table>

			</div>
		);
	}
}
export default RevisarPresupuesto;