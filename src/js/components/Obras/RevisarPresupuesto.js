import React, { Component } from 'react';
import axios from 'axios';
import { UrlServer } from '../Utils/ServerUrlConfig'
import { formatoSoles } from '../Utils/Funciones'
import readXlsxFile from 'read-excel-file'
class RevisarPresupuesto extends Component {
	constructor() {
		super();
		this.state = {
			Obra: "",
			partidas: [],
			partidasPresupuesto: [],
			igualdadPartidas:[]
		};
		this.Presupuesto = this.Presupuesto.bind(this);
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
				for (let i = 0; i < res.data.length; i++) {
					const partida = res.data[i];
					partida.metrado = formatoSoles(partida.metrado)
					partida.costo_unitario = formatoSoles(partida.costo_unitario)
					partida.parcial = formatoSoles(partida.parcial)
				}
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
			var partidasPresupuesto = []
			for (let i = row + 1; i < rows.length; i++) {
				const fila = rows[i];

				//cargar los primeros 2 datos de cada fila
				var partida = {
					item: "",
					descripcion: "",
					metrado: "",
					costo_unitario: "",
					parcial: "",
				}
				var contDatos = 0
				for (let j = col; j < fila.length; j++) {
					const celda = fila[j];
					if (celda) {
						if (contDatos == 0) {
							partida.item = celda
						} else if (contDatos == 1) {
							partida.descripcion = celda
						} else {
							break
						}
						contDatos++
					}
				}
				var contDatos = 0
				for (let j = fila.length - 1; j >= 0; j--) {
					const celda = fila[j];
					if (celda) {
						if (contDatos == 0) {
							partida.parcial = formatoSoles(celda)
						} else if (contDatos == 1) {
							partida.costo_unitario = formatoSoles(celda)
						} else if (contDatos == 2) {
							partida.metrado = formatoSoles(celda)
						} else {
							// break
						}
						contDatos++
					}
				}
				partidasPresupuesto.push(partida)
			}
			console.log("presupuestos", partidasPresupuesto);
			//cargamo la data del sistema
			var partidasSistema = this.state.partidas
			var igualdadPartidas = []

			for (let i = 0; i < partidasSistema.length; i++) {
				var igualdadPartidasTemp = {
					metrado: false,
					costo_unitario: false,
					parcial: false,
				}
				const partidaSistema = partidasSistema[i];
				if (partidaSistema.item == partidasPresupuesto[i].item) {
					if (partidaSistema.tipo == "titulo") {
						partidasPresupuesto[i].metrado = "-"
						partidasPresupuesto[i].costo_unitario = "-"
						partidasPresupuesto[i].parcial = "-"
					}
					if(partidaSistema.metrado == partidasPresupuesto[i].metrado){
						igualdadPartidasTemp.metrado = true
					}
					if(partidaSistema.costo_unitario == partidasPresupuesto[i].costo_unitario){
						igualdadPartidasTemp.costo_unitario = true
					}
					if(partidaSistema.parcial == partidasPresupuesto[i].parcial){
						igualdadPartidasTemp.parcial = true
					}
					igualdadPartidas.push(igualdadPartidasTemp)
				} else {
					alert("error data no coincide")
					break
				}
				
			}
			console.log("igualdadPartidas",igualdadPartidas);
			
			this.setState(
				{
					partidasPresupuesto,
					igualdadPartidas
				}
			)

		})
	}
	render() {
		const { Obra, partidas, partidasPresupuesto,igualdadPartidas } = this.state
		return (
			<div>
				<strong>{Obra.codigo + " " + Obra.g_meta}</strong>
				<hr />
				<legend><b>cargar datos del Presupuesto de Obra</b></legend>
				<input type="file" id="Presupuesto" onChange={this.Presupuesto} />
				<button onClick={this.Presupuesto} className="btn btn-success">RECARGAR</button>
				<hr />
				<table className="table-hover table table-striped table-dark table-bordered table-sm table-responsive-sm">
					<thead>
						<tr>
							<th>ITEM</th>
							<th>DESCRIPCION</th>
							<th>UND</th>
							<th>METRADO</th>
							<th>PRECIO</th>
							<th>PARCIAL</th>
							<th>METRADO</th>
							<th>PRECIO</th>
							<th>PARCIAL</th>
						</tr>
					</thead>
					<tbody>
						{partidas.map((partida, index) =>
							<tr key={index}>
								<td>{partida.item}</td>
								<td>{partida.descripcion}</td>
								<td>{partida.unidad_medida}</td>
								<td className={igualdadPartidas[index]&&igualdadPartidas[index].metrado?"":"bg-danger text-white"}>
								{partida.metrado}
								</td>
								<td className={igualdadPartidas[index]&&igualdadPartidas[index].costo_unitario?"":"bg-danger text-white"}>
								{partida.costo_unitario}
								</td>
								<td className={igualdadPartidas[index]&&igualdadPartidas[index].parcial?"":"bg-danger text-white"}>
								{partida.parcial}
								</td>
								<td className={igualdadPartidas[index]&&igualdadPartidas[index].metrado?"":"bg-success text-white"}>
								{partidasPresupuesto[index] ? partidasPresupuesto[index].metrado : ""}
								</td>
								<td className={igualdadPartidas[index]&&igualdadPartidas[index].costo_unitario?"":"bg-success text-white"}>
								{partidasPresupuesto[index] ? partidasPresupuesto[index].costo_unitario : ""}
								</td>
								<td className={igualdadPartidas[index]&&igualdadPartidas[index].parcial?"":"bg-success text-white"}>
								{partidasPresupuesto[index] ? partidasPresupuesto[index].parcial : ""}
								</td>
							</tr>
						)}

					</tbody>

				</table>

			</div>
		);
	}
}
export default RevisarPresupuesto;