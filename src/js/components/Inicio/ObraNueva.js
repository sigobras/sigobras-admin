import React, { useState, useEffect } from 'react';
import axios from 'axios'
import { UrlServer } from '../Utils/ServerUrlConfig'
import { Redondea } from '../Utils/Funciones'
import { Card, Button, Modal, ModalBody, ModalFooter, ModalHeader, CardText, Spinner } from 'reactstrap';
import readXlsxFile from 'read-excel-file'
export default () => {
	useEffect(() => {

	}, []);
	//estados de obra
	const [EstadosObra, setEstadosObra] = useState([]);
	async function fetchEstadosObra() {
		var res = await axios.get(`${UrlServer}/listaEstados`)
		setEstadosObra(res.data)
	}
	const [EstadosObraSeleccionado, setEstadosObraSeleccionado] = useState(0);
	//tipos de obra
	const [TipoObras, setTipoObras] = useState([]);
	async function fetchTipoObras() {
		var res = await axios.get(`${UrlServer}/getTipoObras`)
		setTipoObras(res.data)
	}
	const [TipoObrasSeleccionado, setTipoObrasSeleccionado] = useState(0);
	//unidadades ejecutoras
	const [UnidadEjecutoras, setUnidadEjecutoras] = useState([]);
	async function fetchUnidadEjecutoras() {
		var res = await axios.get(`${UrlServer}/getUnidadEjecutoras`)
		setUnidadEjecutoras(res.data)
	}
	const [UnidadEjecutorasSeleccionado, setUnidadEjecutorasSeleccionado] = useState(0);
	//TipoAdministracion
	const [TipoAdministracion, setTipoAdministracion] = useState([]);
	async function fetchTipoAdministracion() {
		var res = await axios.get(`${UrlServer}/getTipoAdministracion`)
		setTipoAdministracion(res.data)
	}
	const [TipoAdministracionSeleccionado, setTipoAdministracionSeleccionado] = useState(0);
	//fichas
	const [Ficha, setFicha] = useState({});
	//componentes
	const [Componentes, setComponentes] = useState([]);
	//cargar datos
	function formatDate(f) {
		var date = new Date(f);
		var year = date.getFullYear();
		var month = date.getMonth() + 1;
		var dt = date.getDate();
		console.log(year + '-' + month + '-' + dt);
		return year + '-' + month + '-' + dt
	}
	async function CargaDatosExcelObra() {
		try {
			const input = document.getElementById('inputDatosObra')
			var rows = await readXlsxFile(input.files[0])
			var datosObra = {}
			datosObra.codigo = rows[0][1]
			datosObra.fecha_inicial = formatDate(rows[1][1])
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
			datosObra.modalidad_ejecutora = 1
			//fecha final
			datosObra.plazoEjecucion = {
				"FechaEjecucion": formatDate(rows[2][1])
			}
			datosObra.Historial = {
				"fecha_inicial": formatDate(rows[1][1])
			}
			setFicha(datosObra)
		} catch (error) {
			alert('algo salió mal')
			console.log(error);
		}

	}
	async function CargaDatosExcelComponentes() {
		try {
			const input = document.getElementById('inputComponentes')
			var rows = await readXlsxFile(input.files[0])
			var componentes = []
			for (let i = 0; i < rows.length; i++) {
				const fila = rows[i];
				componentes.push(
					[fila[0], fila[1], fila[2]]
				)
			}
			setComponentes(componentes)

		} catch (error) {
			alert('algo salió mal')
			console.log(error);
		}
	}
	async function saveObra() {
		try {
			var datosObra = Ficha
			datosObra.componentes = Componentes
			datosObra.Historial.Estados_id_estado = EstadosObraSeleccionado
			datosObra.tipoObras_id_tipoObra = TipoObrasSeleccionado
			datosObra.unidadEjecutoras_id_unidadEjecutora = UnidadEjecutorasSeleccionado
			datosObra.fichas_tipo_administracion_id = TipoAdministracionSeleccionado
			var res = await axios.post(`${UrlServer}/nuevaObra`,
				datosObra
			)
			sessionStorage.setItem("idFicha", res.data)
			sessionStorage.setItem('estado', 'oficial')
			if (TipoAdministracionSeleccionado == 1) {
				window.location.href = "/PartidasNuevas";
			} else if (TipoAdministracionSeleccionado == 2) {
				window.location.href = "/PartidasNuevasPorContrato";
			}
		} catch (error) {
			alert("ALGO SALIO MAN AL INGRESAR LOS DATOS DE LA OBRA")
			console.error('ALGO SALIO MAN AL INGRESAR LOS DATOS DE LA OBRA', error);
		}
	}
	//modal
	const [modal, setModal] = useState(false);

	const toggle = () => {
		if (!modal) {
			fetchEstadosObra()
			fetchTipoObras()
			fetchUnidadEjecutoras()
			fetchTipoAdministracion()
		}
		setModal(!modal)
	};

	return (
		[
			<Button
				outline
				color="danger"
				onClick={toggle}
			>
				NUEVA OBRA
			</Button>,
			<Modal isOpen={modal} toggle={toggle} size={"lg"}>
				<ModalHeader >
					INGRESAR DATOS DE OBRA{" "}
					<Button
						outline
						color="primary"
						onClick={() => saveObra()}
					>Guardar datos</Button>{' '}
					<Button outline color="secondary" onClick={toggle}>Cancel</Button>
				</ModalHeader>
				<ModalBody>
					<div className="float-right">
						<select
							className="form-control form-control-sm m-0"
							onChange={(e) => setEstadosObraSeleccionado(e.target.value)}
						>
							<option>Selecione</option>
							{EstadosObra.map((item, i) =>
								<option key={i} value={item.id_Estado}>{item.nombre}</option>
							)}
						</select>
						<select
							className="form-control form-control-sm m-0"
							onChange={(e) => setTipoObrasSeleccionado(e.target.value)}
						>
							<option>Selecione</option>
							{TipoObras.map((data, i) =>
								<option key={i} value={data.id_tipoObra}>{data.nombre}</option>
							)}
						</select>
						<select
							className="form-control form-control-sm m-0"
							onChange={(e) => setUnidadEjecutorasSeleccionado(e.target.value)}
						>
							<option>Selecione</option>
							{UnidadEjecutoras.map((data, i) =>
								<option key={i} value={data.id_unidadEjecutora}>{data.nombre}</option>
							)}
						</select>
						<select
							className="form-control form-control-sm m-0"
							onChange={(e) => setTipoAdministracionSeleccionado(e.target.value)}
						>
							<option>Selecione</option>
							{TipoAdministracion.map((data, i) =>
								<option key={i} value={data.id}>{data.nombre}</option>
							)}
						</select>
					</div>
					{EstadosObraSeleccionado === 0 || TipoObrasSeleccionado === 0 || UnidadEjecutorasSeleccionado === 0 || TipoAdministracionSeleccionado === 0
						?
						<span className="text-danger h4 text-center p-2">
							Selecione el estado actual de la obra
				</span>
						:
						[
							<fieldset key={1}>
								<legend>
									<b>
										Cargar informacion de Obra
								</b>
								</legend>
								<input
									type="file"
									id="inputDatosObra"
									onChange={() => CargaDatosExcelObra()}
								/>
								<code>
									<pre
										style={{
											color: "white"
										}}
									> {JSON.stringify(Ficha, null, ' ')}</pre>
								</code>
							</fieldset>
							,
							<fieldset
								key={2}
							>
								<legend>
									<b>
										Ingresar componentes
								</b>
								</legend>
								<input
									type="file"
									id="inputComponentes"
									onChange={() => CargaDatosExcelComponentes()}
								/>
								{Componentes.length > 0 &&

									<table
										className="table table-bordered table-sm small"
									>
										<thead>
											<tr>
												<th> N° de componente</th>
												<th> Nombre de componente</th>
												<th> presupuesto de componente</th>
											</tr>
										</thead>
										<tbody>
											{Componentes.map((item, i) =>
												<tr key={i}>
													<td><b>{item[0]}</b></td>
													<td>{item[1]}</td>
													<td>{item[2]}</td>
												</tr>
											)}
										</tbody>
									</table>

								}

							</fieldset>
						]
					}
				</ModalBody>
				<ModalFooter>
					<Button
						outline
						color="primary"
						onClick={() => saveObra()}
					>Guardar datos</Button>{' '}
					<Button outline color="secondary" onClick={toggle}>Cancel</Button>
				</ModalFooter>
			</Modal>
		]
	)
}