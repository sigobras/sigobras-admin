import React, { Component } from 'react';
import axios from 'axios'
import { UrlServer } from '../Utils/ServerUrlConfig'
import { Redondea } from '../Utils/Funciones'
import { Card, Button, CardHeader, CardFooter, CardBody, CardTitle, CardText, Spinner } from 'reactstrap';
import readXlsxFile from 'read-excel-file'

class ObraNueva extends Component {
	constructor() {
		super()
		this.state = {
			estados: [],
			TipoObras: [],
			UnidadEjecutoras: [],
			datosObra: {},
			componentes: [],
			id_Estado: '',
			id_tipoObra: '',
			id_unidadEjecutora: ''
		}
		this.formatDate = this.formatDate.bind(this)
		this.CargaDatosExcelObra = this.CargaDatosExcelObra.bind(this)
		this.handleSubmit = this.handleSubmit.bind(this)
		this.CargaDatosExcelComponentes = this.CargaDatosExcelComponentes.bind(this)
	}

	componentWillMount() {
		axios.get(`${UrlServer}/listaEstados`)
			.then((res) => {
				console.log(res.data);
				this.setState({
					estados: res.data
				})
			})
			.catch((error) =>
				console.error('falló al obtener los datos del servidor', error)
			)
		axios.get(`${UrlServer}/getTipoObras`)
			.then((res) => {
				console.log(res.data);
				this.setState({
					TipoObras: res.data
				})
			})
			.catch((error) =>
				console.error('falló al obtener los datos del servidor', error)
			)
		axios.get(`${UrlServer}/getUnidadEjecutoras`)
			.then((res) => {
				console.log(res.data);
				this.setState({
					UnidadEjecutoras: res.data
				})
			})
			.catch((error) =>
				console.error('falló al obtener los datos del servidor', error)
			)
	}

	formatDate(f) {
		var date = new Date(f);
		var year = date.getFullYear();
		var month = date.getMonth() + 1;
		var dt = date.getDate();
		console.log(year + '-' + month + '-' + dt);
		return year + '-' + month + '-' + dt
	}

	CargaDatosExcelObra() {
		const input = document.getElementById('inputDatosObra')
		readXlsxFile(input.files[0]).then((rows) => {
			var datosObra = {}
			datosObra.codigo = rows[0][1]
			datosObra.fecha_inicial = this.formatDate(rows[1][1])
			datosObra.g_sector = rows[3][1]
			datosObra.g_pliego = rows[4][1]
			datosObra.g_func = rows[6][1]
			datosObra.g_prog = rows[7][1]
			datosObra.g_subprog = rows[8][1]
			datosObra.g_tipo_act = rows[9][1]
			datosObra.g_tipo_comp = rows[10][1]
			datosObra.g_meta = rows[11][1]
			datosObra.g_snip = rows[12][1]
			datosObra.g_total_presu = rows[13][1]
			datosObra.g_local_dist = rows[14][1]
			datosObra.g_local_reg = rows[15][1]
			datosObra.g_local_prov = rows[16][1]
			datosObra.f_fuente_finan = rows[17][1]
			datosObra.f_entidad_finan = rows[18][1]
			datosObra.f_entidad_ejec = rows[19][1]
			datosObra.tiempo_ejec = rows[20][1]
			datosObra.modalidad_ejec = rows[21][1]
			//fecha final
			datosObra.plazoEjecucion = {
				"FechaEjecucion": this.formatDate(rows[2][1])
			},
			datosObra.Historial = {
				"fecha_inicial": this.formatDate(rows[1][1])
			},

			this.setState({
				datosObra
			})
		})
			.catch((error) => {
				alert('algo salió mal')
				console.log(error);
			})
	}
	CargaDatosExcelComponentes() {
		const input = document.getElementById('inputComponentes')
		readXlsxFile(input.files[0]).then((rows) => {
			var componentes = []
			for (let i = 0; i < rows.length; i++) {
				const fila = rows[i];
				componentes.push(
					[fila[0], fila[1], fila[2]]
				)
			}
			this.setState({
				componentes
			})
		})
			.catch((error) => {
				alert('algo salió mal')
				console.log(error);
			})
	}
	handleSubmit(e) {
		e.preventDefault()
		var datosObra = this.state.datosObra
		var componentes = this.state.componentes
		var id_estado = this.state.id_Estado
		var id_tipoObra = this.state.id_tipoObra
		var id_unidadEjecutora = this.state.id_unidadEjecutora
		datosObra.componentes = componentes
		datosObra.Historial.Estados_id_estado = id_estado
		datosObra.tipoObras_id_tipoObra = id_tipoObra
		datosObra.unidadEjecutoras_id_unidadEjecutora = id_unidadEjecutora
		console.log(datosObra);
		axios.post(`${UrlServer}/nuevaObra`,
			datosObra
		)
			.then((res) => {
				console.log(res);
				sessionStorage.setItem("idFicha", res.data)
				sessionStorage.setItem('estado', 'oficial')
				window.location.href = "/PartidasNuevas";
			})
			.catch((error) => {
				alert("ALGO SALIO MAN AL INGRESAR LOS DATOS DE LA OBRA")
				console.error('ALGO SALIO MAN AL INGRESAR LOS DATOS DE LA OBRA', error);
			});
	}


	render() {
		const { estados, TipoObras, UnidadEjecutoras, id_Estado, id_tipoObra, id_unidadEjecutora, datosObra, componentes } = this.state
		return (
			<div>
				<Card>
					<CardHeader>
						Ingreso de obra Nueva
						<div className="float-right">
							<select className="form-control form-control-sm m-0" onChange={e => this.setState({ id_Estado: e.target.value })}>
								<option>Selecione</option>
								{estados.map((EstadosObra, i) =>
									<option key={i} value={EstadosObra.id_Estado}>{EstadosObra.nombre}</option>
								)}
							</select>
							<select className="form-control form-control-sm m-0" onChange={e => this.setState({ id_tipoObra: e.target.value })}>
								<option>Selecione</option>
								{TipoObras.map((data, i) =>
									<option key={i} value={data.id_tipoObra}>{data.nombre}</option>
								)}
							</select>
							<select className="form-control form-control-sm m-0" onChange={e => this.setState({ id_unidadEjecutora: e.target.value })}>
								<option>Selecione</option>
								{UnidadEjecutoras.map((data, i) =>
									<option key={i} value={data.id_unidadEjecutora}>{data.nombre}</option>
								)}
							</select>
						</div>
					</CardHeader>
					{id_Estado === '' || id_tipoObra === '' || id_unidadEjecutora === '' ? <span className="text-danger h4 text-center p-2">Selecione el estado actual de la obra</span> :
						<CardBody>
							<fieldset>
								<legend><b>Cargar archivo excel con datos de la obra</b></legend>
								<input type="file" id="inputDatosObra" onChange={this.CargaDatosExcelObra} />
								<code>
									<pre> {JSON.stringify(datosObra, null, ' ')}</pre>
								</code>
							</fieldset>
							<fieldset>
								<legend><b>Datos de componentes</b></legend>
								<input type="file" id="inputComponentes" onChange={this.CargaDatosExcelComponentes} />
								<table className="table table-bordered table-sm small">
									<thead>
										<tr>
											<th> N° de componente</th>
											<th> Nombre de componente</th>
											<th> presupuesto de componente</th>
										</tr>
									</thead>
									<tbody>
										{componentes.map((Fila1, FilaIndex) =>
											<tr key={FilaIndex}>
												<td><b>{Fila1[0]}</b></td>
												<td>{Fila1[1]}</td>
												<td>{Fila1[2]}</td>
											</tr>
										)}
									</tbody>
								</table>
							</fieldset>
							<button onClick={(e) => this.handleSubmit(e)} className="btn btn-outline-success"> Guardar datos</button>
						</CardBody>
					}
				</Card>
			</div>
		);
	}
}

export default ObraNueva;