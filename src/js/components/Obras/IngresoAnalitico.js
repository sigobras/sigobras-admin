import React, { Component } from 'react';
import { Modal, ModalBody } from 'reactstrap';
import axios from 'axios';
import { UrlServer } from '../Utils/ServerUrlConfig'
import { fechaLargaCorta, formatoSoles } from '../Utils/Funciones'
import readXlsxFile from 'read-excel-file'

class RevisarPresupuesto extends Component {
	constructor() {
		super();
		this.state = {
			Obra: "",
			resolucion: {},
			costosPresupuestales: [],
			clasificadoresPesupuestarios: [],
			presupuesto_analitico: [],
			presupuesto_analitico_preparado: [],
			CostosPresupuestalesMontos: [],
			modalResoluciones: false,
			resoluciones: []
		};
		this.CostosPresupuestalesMontos = this.CostosPresupuestalesMontos.bind(this);
		this.Analitico = this.Analitico.bind(this);
		this.guardarAnalitico = this.guardarAnalitico.bind(this);
		this.eliminarAnalitico = this.eliminarAnalitico.bind(this);
		this.modalResoluciones = this.modalResoluciones.bind(this);
		this.eliminarResolucion = this.eliminarResolucion.bind(this);
		this.cargandoResoluciones = this.cargandoResoluciones.bind(this);
	}
	CostosPresupuestalesMontos() {
		var id_ficha = sessionStorage.getItem("idFicha")
		axios.post(`${UrlServer}/getCostosPresupuestalesMontos`,
			{
				id_ficha
			}
		)
			.then((res) => {
				console.log("CostosPresupuestalesMontos", res.data);
				this.setState({
					CostosPresupuestalesMontos: res.data
				})

			})
			.catch((error) => {
				console.log('ERROR', error);
				alert('algo ha salido mal')
			});
	}
	componentWillMount() {
		var id_ficha = sessionStorage.getItem("idFicha")
		axios.post(`${UrlServer}/getObra`,
			{
				"id_ficha": id_ficha
			}
		)
			.then((res) => {
				this.setState({
					Obra: res.data
				})
			})
			.catch((error) => {
				console.log('ERROR', error);
				alert('algo ha salido mal')
			});
		//clasificadores
		axios.post(`${UrlServer}/getclasificadoresPesupuestarios`,
			{
				"todos": true
			}
		)
			.then((res) => {
				console.log("clasificadores", res.data);
				this.setState({
					clasificadoresPesupuestarios: res.data
				})
			})
			.catch((error) => {
				console.log('ERROR', error);
				alert('algo ha salido mal')
			});
		this.CostosPresupuestalesMontos()
	}
	Analitico() {
		var id_ficha = sessionStorage.getItem("idFicha")
		const input = document.getElementById('Analitico')
		readXlsxFile(input.files[0]).then((rows) => {
			//datos de resolucion
			console.log("fecha", rows[1][1]);
			var resolucion = {
				codigo: rows[0][1],
				fecha: fechaLargaCorta(rows[1][1]),
				nombre_corto: rows[2][1],
				fichas_id_ficha: id_ficha
			}
			console.log("resolucion", resolucion);
			this.setState({
				resolucion
			})
			//revisando costosPresupuestales
			var costosPresupuestales = []
			for (let i = 2; i < rows[3].length; i++) {
				const celda = rows[3][i];
				costosPresupuestales.push([celda, id_ficha])
			}
			console.log(costosPresupuestales);
			this.setState({
				costosPresupuestales
			})
			//seleccionar la data a ingresar
			var presupuesto_analitico = []
			for (let i = 4; i < rows.length; i++) {
				const fila = rows[i];
				for (let j = 2; j < fila.length; j++) {
					const celda = fila[j];
					if (celda && fila[0]) {
						// console.log("costos presupuestales",rows[2])
						presupuesto_analitico.push(
							[
								rows[3][j],
								fila[0],
								celda
							]
						)
					}
				}
			}
			console.log("presupuesto_analitico", presupuesto_analitico);
			this.setState({
				presupuesto_analitico
			})

			//formando data inicial con foreing key del clasificador
			var clasificadoresPesupuestarios = this.state.clasificadoresPesupuestarios
			var presupuesto_analitico_preparado = []
			for (let i = 0; i < presupuesto_analitico.length; i++) {
				const analitico = presupuesto_analitico[i];
				var index = clasificadoresPesupuestarios.findIndex(x => x.clasificador == analitico[1])
				presupuesto_analitico_preparado.push(
					[
						analitico[0],
						clasificadoresPesupuestarios[index].id_clasificador_presupuestario,
						analitico[2]
					]
				)
			}
			console.log("presupuesto_analitico_preparado", presupuesto_analitico_preparado);
			this.setState({
				presupuesto_analitico_preparado
			})
		})
	}
	guardarAnalitico() {
		var resolucion = this.state.resolucion
		var costosPresupuestales = this.state.costosPresupuestales
		var presupuesto_analitico_preparado = this.state.presupuesto_analitico_preparado
		var presupuesto_analitico = {
			resolucion,
			costosPresupuestales,
			presupuesto_analitico_preparado
		}
		axios.post(`${UrlServer}/postPresupuesto_analitico`,
			presupuesto_analitico
		)
			.then((res) => {
				console.log("clasificadores", res.data);
				this.CostosPresupuestalesMontos()
				alert("exito")
			})
			.catch((error) => {
				console.log('ERROR', error);
				alert('algo ha salido mal')
			});

	}
	cargandoResoluciones() {
		var id_ficha = sessionStorage.getItem("idFicha")
		axios.post(`${UrlServer}/getResoluciones`,
			{
				"id_ficha": id_ficha
			}
		)
			.then((res) => {
				console.log("resoluciones", res.data);
				this.setState({
					resoluciones: res.data
				})
			})
			.catch((error) => {
				console.log('ERROR', error);
				alert('algo ha salido mal')
			});
	}
	eliminarAnalitico() {
		this.cargandoResoluciones()
		this.modalResoluciones()
		console.log("eliminando");

	}
	modalResoluciones() {
		this.setState(prevState => ({
			modalResoluciones: !prevState.modalResoluciones
		}));
	}
	eliminarResolucion(id_resolucion) {
		console.log("eliminando", id_resolucion);
		axios.delete(`${UrlServer}/deleteResolucion`,
			{
				data:
				{
					"id_resolucion": id_resolucion
				}
			}
		)
			.then((res) => {
				console.log("deleteresolucion", res.data);
				this.cargandoResoluciones()
			})
			.catch((error) => {
				console.log('ERROR', error);
				alert('algo ha salido mal')
			});
	}

	render() {
		const { Obra, presupuesto_analitico, CostosPresupuestalesMontos, modalResoluciones, resoluciones } = this.state
		return (
			<div>
				<strong>{Obra.codigo + " " + Obra.g_meta}</strong>
				<hr />
				<legend><b>cargar datos del Analitico</b></legend>
				<input type="file" id="Analitico" onChange={this.Analitico} />
				<button onClick={this.Analitico} className="btn btn-success">RECARGAR</button>
				<button onClick={this.guardarAnalitico} className="btn btn-primary">GUARDAR ANALITICO</button>
				<button onClick={this.eliminarAnalitico} className="btn btn-danger">ELIMINAR ANALITICO</button>
				<hr />
				<table className="table-hover table table-striped table-dark table-bordered table-sm table-responsive-sm">
					<thead>
						<tr>
							<th> COSTO</th>
							<th> MONTO</th>
						</tr>
					</thead>
					<tbody>
						{CostosPresupuestalesMontos.map((costo, index) =>
							<tr key={index}>
								<td>
									{costo.nombre}
								</td>
								<td>
									{formatoSoles(costo.monto)}
								</td>
							</tr>
						)}
					</tbody>
				</table>
				<hr />
				<table className="table-hover table table-striped table-dark table-bordered table-sm table-responsive-sm">
					<thead>
						<tr>
							<th> COSTO</th>
							<th> CLASIFICADOR</th>
							<th> MONTO</th>
						</tr>
					</thead>
					<tbody>
						{presupuesto_analitico.map((analitico, index) =>
							<tr key={index}>
								{analitico.map((celda, index) =>
									<td key={index}>{celda}</td>
								)
								}
							</tr>
						)}
					</tbody>
				</table>
				<Modal isOpen={modalResoluciones} toggle={e => this.modalResoluciones()} size="lg">
					<ModalBody>
						<table className="table-hover table table-striped table-dark table-bordered table-sm table-responsive-sm">
							<thead>
								<tr>
									<th> CODIGO RESOLUCION</th>
									<th> FECHA</th>
									<th> NOMBRE CORTO</th>
									<th> </th>
								</tr>
							</thead>
							<tbody>
								{resoluciones.map((resolucion, index) =>
									<tr key={index}>
										<td>
											{resolucion.codigo}
										</td>
										<td>
											{resolucion.fecha}
										</td>
										<td>
											{resolucion.nombre_corto}
										</td>
										<td>
											<button onClick={e => this.eliminarResolucion(resolucion.id_resolucion)} className="btn btn-danger">ELIMINAR</button>
										</td>

									</tr>
								)}
							</tbody>
						</table>
					</ModalBody>
				</Modal>
			</div>
		);
	}
}
export default RevisarPresupuesto;