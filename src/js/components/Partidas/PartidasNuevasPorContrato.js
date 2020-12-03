import React, { useEffect, useState } from 'react'
import readXlsxFile from 'read-excel-file'
import { Card, Button, CardHeader, CardFooter, CardBody, Row, Col } from 'reactstrap';
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
		console.log(rowIndex, colIndex);
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

			if (esPartida(item)) {
				var componente = item.substring(0, item.indexOf("."));
				var CompontenteSeleccionado = Componentes.find(
					(item) => Number(item.numero) == Number(componente)
				)
				if (CompontenteSeleccionado == undefined) {
					componentesNoEncontrados.indexOf(componente) === -1 && componentesNoEncontrados.push(componente)
				} else {
					console.log(CompontenteSeleccionado);

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
	return (
		<div>
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

		</div>
	);
}

