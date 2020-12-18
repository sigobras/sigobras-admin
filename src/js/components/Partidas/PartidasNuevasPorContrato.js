import React, { useEffect, useState } from 'react'
import readXlsxFile from 'read-excel-file'
import { Table, Button, Collapse, CardFooter, CardBody, Row, Col } from 'reactstrap';
import axios from 'axios'
import { UrlServer } from '../Utils/ServerUrlConfig'
import ReactJson from 'react-json-view'
import { ToastContainer, toast } from "react-toastify";
export default () => {
	useEffect(() => {
		fetchObra()
		fetchComponentes()
		fetchComponentesIngresados()
	}, []);
	//fichas
	const [Obra, setObra] = useState([]);
	async function fetchObra() {
		var res = await axios.post(`${UrlServer}/getObra`,
			{
				"id_ficha": sessionStorage.getItem('idobra')
			}
		)
		setObra(res.data)
	}
	//componentes
	const [Componentes, setComponentes] = useState([]);
	async function fetchComponentes() {
		var res = await axios.post(`${UrlServer}/getComponentes`,
			{
				"id_ficha": sessionStorage.getItem('idobra')
			}
		)
		setComponentes(res.data)
	}
	//componentes ingreados
	const [ComponentesIngresados, setComponentesIngresados] = useState([]);
	async function fetchComponentesIngresados() {
		var res = await axios.post(`${UrlServer}/getComponentesPartidasIngresadas`,
			{
				"id_ficha": sessionStorage.getItem('idobra')
			}
		)
		setComponentesIngresados(res.data)
	}
	//funciones
	function itemStructure(data) {
		data = data.toString();
		var regla = /^\d{2}(\.\d{2})*$/
		return data.match(regla)
	}
	function esPartida(item) {
		return item != null && item.length > 2 && itemStructure(item)
	}
	//procesamiento de excel
	const [ComponentesNoEncontrados, setComponentesNoEncontrados] = useState([]);
	const [Partidas, setPartidas] = useState([]);
	async function CargarPartidasExcel() {
		const input = document.getElementById('PartidasExcel')
		var rows = await readXlsxFile(input.files[0])
		//encontramos item
		var rowIndex = 0
		var colIndex = 0
		try {
			rows.forEach((row, i) => {
				try {
					row.forEach((col, j) => {
						if (typeof col === 'string' && col.toUpperCase().trim() == "ITEM") {
							rowIndex = i
							colIndex = j
							throw "";
						}
					});
				} catch (error) {
					console.log(error);
					throw ""
				}
			});
		} catch (error) {
			console.log(error);
		}
		// console.log(rowIndex, colIndex);
		var componentesNoEncontrados = []
		var partidas = []
		for (let i = rowIndex + 1; i < rows.length; i++) {
			const row = rows[i];
			var item = row[colIndex]
			var tipo = row[colIndex + 2] ? "partida" : "titulo"
			var descripcion = row[colIndex + 1]
			var unidad_medida = row[colIndex + 2]
			var metrado = row[colIndex + 3]
			var costo_unitario = row[colIndex + 4]
			var componentes_presupuesto_calculado = []
			if (esPartida(item)) {
				var componente = item.substring(0, item.indexOf("."));
				var CompontenteSeleccionado = Componentes.find(
					(item) => Number(item.numero) == Number(componente)
				)
				if (CompontenteSeleccionado == undefined) {
					componentesNoEncontrados.indexOf(componente) === -1 && componentesNoEncontrados.push(componente)
				} else {
					// console.log(CompontenteSeleccionado);
					var actividades = tipo == "partida"
						?
						[
							{
								tipo: "subtitulo",
								nombre: "Actividad unica",
								veces: "",
								largo: "",
								ancho: "",
								alto: "",
								parcial: metrado
							}
						]
						:
						[]
					partidas.push(
						{
							componentes_id_componente: CompontenteSeleccionado.id_componente,
							tipo,
							item,
							descripcion,
							unidad_medida,
							metrado,
							costo_unitario,
							actividades
						}
					)
				}
			}
		}
		//calculando presupuesto de componente
		var cloneComponentes = [...Componentes]
		partidas.forEach(partida => {
			if (partida.tipo == "partida") {
				var indexComponente = Componentes.findIndex(
					(item2) => item2.id_componente == partida.componentes_id_componente
				)
				console.log("indexComponente", indexComponente);
				if (cloneComponentes[indexComponente].presupuesto_calculado != undefined) {
					console.log("existe");
					cloneComponentes[indexComponente].presupuesto_calculado += (partida.metrado * partida.costo_unitario)
					// cloneComponentes[indexComponente].presupuesto_calculado += 10
				} else {
					console.log("NO existe");
					cloneComponentes[indexComponente].presupuesto_calculado = (partida.metrado * partida.costo_unitario)
				}
				console.log("presupuesto_calculado", cloneComponentes[indexComponente].presupuesto_calculado);
			}
		});
		console.log("cloneComponentes", cloneComponentes);
		console.log("componentesNoEncontrados", componentesNoEncontrados);
		console.log("partidas", partidas);
		setComponentesNoEncontrados(componentesNoEncontrados)
		setPartidas(partidas)
	}
	async function savePartidas() {
		var res = await axios.post(`${UrlServer}/postPartidas`,
			{
				estado: sessionStorage.getItem("estado"),
				partidas: Partidas
			}
		)
		if (res.status == 200) {
			alert("exito")
		} else {
			alert("error")
		}
		fetchComponentesIngresados()
	}

	//generar partidas
	const [PartidasGeneradas, setPartidasGeneradas] = useState([])
	function generarPartidasByComponente() {
		console.log("se activa funcion");
		var partidas = []
		for (let i = 0; i < Componentes.length; i++) {
			const item = Componentes[i];
			partidas.push(
				{
					componentes_id_componente: item.id_componente,
					tipo: "partida",
					item: item.numero,
					descripcion: item.nombre,
					unidad_medida: "unidad",
					metrado: item.presupuesto,
					costo_unitario: 1,
					actividades:
						[
							{
								tipo: "subtitulo",
								nombre: "Actividad unica",
								veces: "",
								largo: "",
								ancho: "",
								alto: "",
								parcial: item.presupuesto,
							}
						]
				}
			)
		}
		setPartidasGeneradas(partidas)
	}
	async function savePartidasGeneradas() {
		var res = await axios.post(`${UrlServer}/postPartidas`,
			{
				estado: sessionStorage.getItem("estado"),
				partidas: PartidasGeneradas
			}
		)
		if (res.status == 200) {
			alert("exito")
		} else {
			alert("error")
		}
		fetchComponentesIngresados()
	}
	const [isOpen, setIsOpen] = useState(false);

	const toggle = () => setIsOpen(!isOpen);
	return (
		<div >

			<div >
				{Componentes.length &&
					<div>COMPONENTES REGISTRADOS</div>
				}

				<Table>
					<thead>
						<tr>
							<th>
								numero
							</th>
							<th>
								nombre
							</th>
							<th>
								presupuesto
							</th>
							<th>
								presupuesto (calculado)
							</th>
							<th>
								diferencia (calculado)
							</th>
						</tr>
					</thead>
					<tbody>
						{Componentes.map((item, i) =>
							<tr>
								<td>COMP {item.numero}</td>
								<td>{item.nombre}</td>
								<td>{item.presupuesto}</td>
								<td>{item.presupuesto_calculado}</td>
								<td>{(item.presupuesto- item.presupuesto_calculado)||""}</td>
							</tr>
						)}
					</tbody>
				</Table>
				<Button color="primary" onClick={toggle} style={{ marginBottom: '1rem' }}>Generacion de partidas</Button>
				<Collapse isOpen={isOpen}>
					<div>Generar partidas en base a componentes</div>
					<Button
						onClick={() => generarPartidasByComponente()}
					>
						Generar
				</Button>
					<Button
						onClick={() => savePartidasGeneradas()}
					>
						Guardar
				</Button>
					<div>ESTADO PARTIDAS {sessionStorage.getItem("estado")}</div>
					<Table>
						<thead>
							<tr>
								<th>item</th>
								<th>descripcion</th>
								<th>unidad_medida</th>
								<th>metrado</th>
								<th>costo_unitario</th>
							</tr>
						</thead>
						<tbody>
							{PartidasGeneradas.map((item, i) =>
								<tr>
									<td>{item.item}</td>
									<td>{item.descripcion}</td>
									<td>{item.unidad_medida}</td>
									<td>{item.metrado}</td>
									<td>{item.costo_unitario}</td>
								</tr>
							)}
						</tbody>
					</Table>


				</Collapse>
			</div>
			<div >
				{ComponentesIngresados.length &&
					<div>COMPONENTES INGRESADOS</div>
				}
				{ComponentesIngresados.map((item, i) =>
					<div key={i}>COMP {item.numero} - {item.nombre}</div>
				)}
				<input
					type="file"
					id="PartidasExcel"
					onChange={() => CargarPartidasExcel()}
				/>
				<button onClick={() => savePartidas()}>Guardar</button>
				{ComponentesNoEncontrados.length &&
					<div>COMPONENTES NO ENCONTRADOS</div>
				}
				{ComponentesNoEncontrados.map((item, i) =>
					<div key={i}>COMP {item}</div>
				)}
				<Table>
					<thead>
						<tr>
							<th>item</th>
							<th>descripcion</th>
							<th>unidad_medida</th>
							<th>metrado</th>
							<th>costo_unitario</th>
							<th>parcial (calculado)</th>
						</tr>
					</thead>
					<tbody>
						{Partidas.map((item, i) =>
							<tr>
								<td>{item.item}</td>
								<td>{item.descripcion}</td>
								<td>{item.unidad_medida}</td>
								<td>{item.metrado}</td>
								<td>{item.costo_unitario}</td>
								<td>{item.metrado * item.costo_unitario}</td>
							</tr>
						)}
					</tbody>
				</Table>
			</div>

		</div>
	);
}

