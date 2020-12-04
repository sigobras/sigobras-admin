import React, { Component, useEffect, useState } from 'react'
import readXlsxFile from 'read-excel-file'
import { Card, Button, CardHeader, CardFooter, CardBody, Row, Col } from 'reactstrap';
import axios from 'axios'
import { UrlServer } from '../Utils/ServerUrlConfig'
import ReactJson from 'react-json-view'
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
	const [ComponenteSeleccionado, setComponenteSeleccionado] = useState(-1);

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
	const [CostosUnitarios, setCostosUnitarios] = useState([]);
	const [RecursosErroresTamanyo, setRecursosErroresTamanyo] = useState([]);
	const [ItemsErroneos, setItemsErroneos] = useState([]);
	const [ErroresSecuenciaItems, setErroresSecuenciaItems] = useState([]);
	const [PlanillaMetrados, setPlanillaMetrados] = useState([]);
	const [DataPlanilla, setDataPlanilla] = useState([]);
	const [ErroresSuma, setErroresSuma] = useState([]);
	const [Errores1, setErrores1] = useState([]);
	const [Errores2, setErrores2] = useState([]);
	const [ErroresEncontrado, setErroresEncontrado] = useState([]);
	const [DataFinal, setDataFinal] = useState([]);

	function CostosUnitarios1() {
		const input = document.getElementById('inputCostoUnitario')
		readXlsxFile(input.files[0]).then((rows) => {
			var CostosUnitarios = []
			var partida = {}
			var ObRecurso = {}
			var zonaRecursos = false
			var tipoRecurso = null
			for (let index = 0; index < rows.length; index++) {
				// busca el texto Partida
				if (rows[index][0] === "Partida") {
					CostosUnitarios.push(partida)
					partida = {}
					partida.recursos = []
					partida.item = rows[index][1]
					partida.descripcion = rows[index][3]
				} else if (rows[index][0] === "Rendimiento") {
					console.log(rows[index]);
					// busca unidad de medida, eq y costo unitario
					partida.unidad_medida = rows[index][1]
					if (rows[index][6] == null) {
						partida.costo_unitario = rows[index][8]
					} else {
						partida.costo_unitario = rows[index][7]
					}
					for (let i = 0; i < rows[index].length; i++) {
						if (rows[index][i] === "EQ.") {
							if (rows[index][i + 1] === null) {
								partida.equipo = 1
							} else {
								partida.equipo = rows[index][i + 1]
							}
						}
					}
					if (rows[index][1] === "GLB/DIA" && rows[index][2] === null) {
						partida.rendimiento = 1;
					} else if (rows[index][2] === "MO.") {
						partida.rendimiento = rows[index][3]
					} else {
						partida.rendimiento = rows[index][2]
					}
				} else if (rows[index][0] === "Código") {
					//buscamos el nombre del recurso
					index++
					for (let i = 0; i < rows[index].length; i++) {
						if (rows[index][i] !== null) {
							tipoRecurso = rows[index][i]
						}
					}
					zonaRecursos = true
					// zona de recursos
				} else if (zonaRecursos === true) {
					// busca el tipo de material
					var valorExiste = 0
					var temp = ''
					for (let k = 0; k < rows[index].length; k++) {
						const element = rows[index][k];
						if (element !== null && typeof element !== 'number') {
							temp = element
							valorExiste++
						}
					}
					if (valorExiste === 1) {
						tipoRecurso = temp
					}
					if (rows[index][0] !== null) {
						ObRecurso.tipo = tipoRecurso
						ObRecurso.codigo = rows[index][0]
						var columnaRecurso = 2
						// revisa toda la fila de izquierda a derecha
						for (let i = 1; i < rows[index].length; i++) {
							if (rows[index][i] !== null) {
								if (columnaRecurso === 2) {
									ObRecurso.descripcion = rows[index][i]
									columnaRecurso++
								} else if (columnaRecurso === 3) {
									ObRecurso.unidad = rows[index][i]
									columnaRecurso++
									break
								}
							}
						}
						columnaRecurso = 1
						// revisa toda la fila de derecha a izquierda
						for (let i = rows[index].length - 1; i >= 0; i--) {
							if (rows[index][i] !== null) {
								if (columnaRecurso === 4) {
									if (!isNaN(rows[index][i])) {
										ObRecurso.cuadrilla = rows[index][i]
									}
									columnaRecurso++
									break
								} else if (columnaRecurso === 3) {
									ObRecurso.cantidad = rows[index][i]
									columnaRecurso++
								} else if (columnaRecurso === 2) {
									ObRecurso.precio = rows[index][i]
									columnaRecurso++
								} else if (columnaRecurso === 1) {
									ObRecurso.parcial = rows[index][i]
									columnaRecurso++
								}
							}
						}
						partida.recursos.push(ObRecurso)
						ObRecurso = {}
					} else if (rows[index][0] === null && rows[index][2] !== null) {
						tipoRecurso = rows[index][2]
					}
				}
			}
			CostosUnitarios.push(partida)
			CostosUnitarios = CostosUnitarios.slice(1, CostosUnitarios.length)
			console.log('CostosUnitarios > ', CostosUnitarios)
			var recursosErroresTamanyo = []
			for (let i = 0; i < CostosUnitarios.length; i++) {
				const acu = CostosUnitarios[i];
				for (let j = 0; j < acu.recursos.length; j++) {
					const recurso = acu.recursos[j];
					if (!recurso.cantidad || !recurso.precio || !recurso.parcial) {
						recursosErroresTamanyo.push(
							{
								"item": acu.item,
								"recurso": recurso
							}
						)
					}
				}
			}
			setCostosUnitarios(CostosUnitarios)
			setRecursosErroresTamanyo(recursosErroresTamanyo)
		})
			.catch((error) => {
				alert('algo salió mal')
				console.log(error);
			})
	}
	async function CostosUnitariosDelphi() {
		try {
			const input = document.getElementById('inputCostoUnitario')
			var rows = await readXlsxFile(input.files[0])
			var CostosUnitarios = []
			var partida = {}
			for (let index = 0; index < rows.length; index++) {
				const row = rows[index];
				if (row[0] == "Partida:") {
					CostosUnitarios.push(partida)
					partida = {}
					partida.recursos = []
					if (partida.item == null) {
						partida.item = row[2]
					} else {
						partida.item = row[1]
					}

					partida.descripcion = row[3]
					if (row[8] == null) {
						row[8] = row[6]
					}
					var rendimiento = row[8] ? row[8].replace('Rendimiento:', '') : ""
					rendimiento = rendimiento.trim()
					rendimiento = rendimiento.split(" ")
					if (rendimiento.length == 2) {
						rendimiento = rendimiento[0]
					} else {
						rendimiento = 1
					}
					partida.rendimiento = rendimiento
					if (rows[index + 1][8] == null) {
						rows[index + 1][8] = rows[index + 1][6]
					}
					//find unidad medidad
					var unidad_medida = null
					for (let i = 0; i < rows[index + 1].length; i++) {
						const element = rows[index + 1][i];
						if (element != null) {
							unidad_medida = element
							break;
						}

					}
					partida.unidad_medida = unidad_medida.replace('Costo unitario por', '').trim()
					partida.costo_unitario = rows[index + 1][rows[index + 1].length - 1] || rows[index + 1][rows[index + 1].length - 2]
					partida.equipo = rendimiento
				} else if (row[0] == "Código" || row[0] == "Ind.") {
					//zona de recursos
					index++
					var tipo = "inicio"

					while (index < rows.length) {
						var col0 = rows[index][0]

						if (col0 == "Partida:") {
							index--;
							break
						}
						if (typeof col0 == "string") {
							tipo = col0

						} else if (typeof col0 == "number") {
							var recurso = {
								tipo: tipo,
								codigo: col0
							}
							var iterator = 1
							rows[index].forEach(item => {
								if (iterator == 1 && item) {
									iterator++
									return
								}
								if (iterator == 2 && item) {
									iterator++
									recurso.descripcion = item
									return
								}
								if (iterator == 3 && item) {
									iterator++
									recurso.unidad = item
									return
								}
								if (iterator == 4 && item) {
									iterator++
									recurso.cuadrilla = item
									return
								}
								if (iterator == 5 && item) {
									iterator++
									recurso.cantidad = item
									return
								}
								if (iterator == 6 && item) {
									iterator++
									recurso.precio = item
									return
								}
								if (iterator == 7 && item) {
									iterator++
									recurso.parcial = item
									return
								}
							});

							partida.recursos.push(recurso)
						}
						index++
					}
				}
			}
			CostosUnitarios.push(partida)
			CostosUnitarios = CostosUnitarios.slice(1, CostosUnitarios.length)
			setCostosUnitarios(CostosUnitarios)
		} catch (error) {
			console.log("error ", error);
		}

	}
	function PlanillaMetrados1() {
		const input = document.getElementById('inputPlanillaMetrados')
		var temp = 0
		var PlanillaMetrados = []
		var tipo = ""
		var obPlanilla = {}
		if (input.files[0].type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
			readXlsxFile(input.files[0]).then((rows) => {
				var fila = 0
				var columna = 0
				// UBICANDO LA POSICION DE LA PALABRA ITEM
				var itemEncontrado = false
				for (let index = 0; index < rows.length; index++) {
					if (!itemEncontrado) {
						for (let i = 0; i < rows[index].length; i++) {
							var item = rows[index][i]
							if (typeof item === 'string') {
								item = item.toLowerCase()
							}
							if (item === 'item' || item === 'Partida') {
								columna = i
								itemEncontrado = true
								console.log('palabra item fila : %s columna %s', index + 1, columna + 1)
								break
							}
						}
					} else {
						if (rows[index][columna] != null) {
							fila = index
							console.log('primer dato fila: %s columna %s', fila + 1, columna + 1)
							break;
						}
					}
				}
				//revisando items bien estructurados y secuencia de items
				function itemStructure(data) {
					data = data.toString();
					var regla = /^\d{2}(\.\d{2})*$/
					return data.match(regla)
				}
				function predecirItem(data) {
					var listaNumeros = data.split(".")
					var opciones = []
					var numTemp = ""
					for (let i = 0; i < listaNumeros.length; i++) {
						const numero = listaNumeros[i];
						if (i == 0) {
							numTemp += numero
						} else {
							numTemp += "." + numero
						}
						var last2 = numTemp.slice(-2)
						last2 = Number(last2)
						last2++
						last2 = "0" + last2
						var numTemp2 = numTemp.slice(0, numTemp.length - 2) + last2.slice(-2)
						opciones.push(numTemp2)
					}
					numTemp += ".01"
					opciones.push(numTemp)
					return opciones
				}
				var itemsErroneos = []
				var erroresSecuenciaItems = []
				var opciones = [rows[fila][columna]]
				var itemPrevio = rows[fila][columna]
				console.log("test");
				for (let index = fila; index < rows.length; index++) {
					const row = rows[index];
					if (row[columna] != null && !itemStructure(row[columna])) {
						console.log("itemsErroneos");
						itemsErroneos.push(
							{
								item: row[columna],
								descripcion: row[columna + 1],
								fila: index
							}
						)
					}
					if (row[columna]) {
						if (opciones.indexOf(row[columna].toString()) == -1) {
							// console.log("opciones",opciones);
							// console.log("item",row[columna]);
							// console.log("indexof",opciones.indexOf(row[columna]));
							erroresSecuenciaItems.push(
								{
									itemPrevio: itemPrevio,
									itemActual: row[columna]
								}
							)
						}
						opciones = predecirItem(row[columna].toString())
						itemPrevio = row[columna]
					}
				}
				setItemsErroneos(itemsErroneos)
				setErroresSecuenciaItems(erroresSecuenciaItems)
				//--------------------------------------------------------// 
				function Redondear(data) {
					data = Math.round(data * 10000000000) / 10000000000
					data = Math.round(data * 100) / 100
					return data
				}
				// CREAMOS EL DATA DE PLANILLA DE METRADOS 
				var obActividades = {}
				for (let index = fila; index < rows.length; index++) {
					temp = rows[index]
					if ((rows[index][columna + 6] !== null || rows[index][columna + 7] !== null) && rows[index][columna] !== null) {
						tipo = "partida"
						// si la columna total tiene un valor
						PlanillaMetrados.push(obPlanilla)
						obPlanilla = {}
						obPlanilla.tipo = "partida"
						obPlanilla.item = rows[index][columna]
						obPlanilla.descripcion = rows[index][columna + 1]
						obPlanilla.actividades = []
						obPlanilla.veces = rows[index][columna + 2]
						obPlanilla.largo = rows[index][columna + 3]
						obPlanilla.ancho = rows[index][columna + 4]
						obPlanilla.alto = rows[index][columna + 5]
						// obPlanilla.parcial = rows[index][columna + 6]
						obPlanilla.metrado = Redondear(rows[index][columna + 7])
					} else if (rows[index][columna] === null && (rows[index][columna + 6] !== null) || (rows[index][columna + 7] !== null)) {
						tipo = "actividad subtitulo"
						var obActividades = {}
						// titulo                            
						obActividades.tipo = "subtitulo"
						// nombre                            
						obActividades.nombre = rows[index][columna + 1]
						// veces
						obActividades.veces = rows[index][columna + 2]
						// largo
						obActividades.largo = rows[index][columna + 3]
						// ancho
						obActividades.ancho = rows[index][columna + 4]
						// alto
						obActividades.alto = rows[index][columna + 5]
						// parcial
						if (rows[index][columna + 7] !== null) {
							obActividades.parcial = Redondear(rows[index][columna + 7])
						} else {
							obActividades.parcial = Redondear(rows[index][columna + 6])
						}
						console.log("obActividades", obActividades);

						obPlanilla.actividades.push(obActividades)
					} else if (rows[index][columna] !== null && rows[index][columna + 1] !== null) {
						// TITULOS
						tipo = "titulo"
						PlanillaMetrados.push(obPlanilla)
						obPlanilla = {}
						obPlanilla.tipo = "titulo"
						obPlanilla.item = rows[index][columna]
						obPlanilla.descripcion = rows[index][columna + 1]
					} else if (rows[index][columna + 1] !== null) {
						tipo = "actividad titulo"
						var obActividades = {}
						// titulo                            
						obActividades.tipo = "titulo"
						// nombre                            
						obActividades.nombre = rows[index][columna + 1]
						obPlanilla.actividades.push(obActividades)
					}
				}
				PlanillaMetrados.push(obPlanilla)
				PlanillaMetrados = PlanillaMetrados.slice(1, PlanillaMetrados.length)
				// insertando actividades unicas
				for (let j = 0; j < PlanillaMetrados.length; j++) {
					tipo = "actividades unicas"
					if (typeof PlanillaMetrados[j].actividades !== 'undefined' && PlanillaMetrados[j].actividades.length === 0) {
						var obActividades = {}
						// convertimos variable si no es null
						var veces = PlanillaMetrados[j].veces
						var largo = PlanillaMetrados[j].largo
						var alto = PlanillaMetrados[j].alto
						var ancho = PlanillaMetrados[j].ancho
						var metrado = PlanillaMetrados[j].metrado
						// veces = (veces === null) ? veces : Number(veces).toFixed(2)
						// largo = (largo === null) ? largo : Number(largo).toFixed(2)
						// alto = (alto === null) ? alto : Number(alto).toFixed(2)
						// ancho = (ancho === null) ? ancho : Number(ancho).toFixed(2)
						// metrado = (metrado === null) ? metrado : Number(metrado.toFixed(2)) 
						// console.log('verifica >', typeof veces ,'>' , veces) 
						obActividades.tipo = "subtitulo"
						obActividades.nombre = "Actividad unica"
						obActividades.veces = veces
						obActividades.largo = largo
						obActividades.ancho = ancho
						obActividades.alto = alto
						obActividades.parcial = metrado
						PlanillaMetrados[j].actividades.push(obActividades)
					}
					delete PlanillaMetrados[j].veces
					delete PlanillaMetrados[j].largo
					delete PlanillaMetrados[j].alto
					delete PlanillaMetrados[j].ancho
				}
				console.log("PlanillaMetrados", PlanillaMetrados);

				//revisando sumatorias de actividades
				var erroresSuma = []
				for (let index = 0; index < PlanillaMetrados.length; index++) {
					const partida = PlanillaMetrados[index];
					var suma = 0;
					if (partida.tipo == "partida") {
						for (let j = 0; j < partida.actividades.length; j++) {
							const parcial = partida.actividades[j].parcial;
							if (parcial) {
								suma += parcial
							}
						}
						// console.log("comp suma",partida.item,PlanillaMetrados[index].metrado,suma.toFixed(2)); 
						if (PlanillaMetrados[index].metrado != suma.toFixed(2)) {
							erroresSuma.push(
								{
									"item": PlanillaMetrados[index].item,
									"total": Number(PlanillaMetrados[index].metrado),
									"suma": suma.toFixed(2)
								}
							)
						}
					}
				}

				setPlanillaMetrados(PlanillaMetrados)
				setDataPlanilla(PlanillaMetrados)
				setErroresSuma(erroresSuma)
			})
				.catch((error) => {
					alert('algo salió mal')
					console.log(error);
					console.log("PlanillaMetrados", PlanillaMetrados);
					var DataErrores = []
					DataErrores.push(PlanillaMetrados[PlanillaMetrados.length - 1].tipo + " ? => " + PlanillaMetrados[PlanillaMetrados.length - 1].item + " " + PlanillaMetrados[PlanillaMetrados.length - 1].descripcion,
						obPlanilla.tipo + " ? =>  " + obPlanilla.item + " " + obPlanilla.descripcion, tipo + " ? => " + temp[0] + " ?" + temp[1] + " ? " + temp[2] + " ? " + temp[3])
					alert('algo salió mal')
					console.log(DataErrores);
				})
		} else {
			alert('tipo de archivo no admitido cargue solo archivos con extension .xlsx')
		}
	}
	async function PlanillaMetradosDelphi() {
		try {
			var rows = await readXlsxFile(document.getElementById('inputPlanillaMetrados').files[0])
			console.log("rows", rows);
			var temp = 0
			var PlanillaMetrados = []
			var tipo = ""
			var obPlanilla = {}
			var fila = 0
			var columna = 0
			// UBICANDO LA POSICION DE LA PALABRA ITEM
			var itemEncontrado = false
			for (let index = 0; index < rows.length; index++) {
				if (!itemEncontrado) {
					for (let i = 0; i < rows[index].length; i++) {
						var item = rows[index][i]
						if (typeof item === 'string') {
							item = item.toLowerCase()
						}
						if (item === 'item' || item === 'Partida') {
							columna = i
							itemEncontrado = true
							console.log('palabra item fila : %s columna %s', index + 1, columna + 1)
							break
						}
					}
				} else {
					if (rows[index][columna] != null) {
						fila = index
						console.log('primer dato fila: %s columna %s', fila + 1, columna + 1)
						break;
					}
				}
			}

			//revisando items bien estructurados y secuencia de items
			function itemStructure(data) {
				data = data.toString();
				var regla = /^\d{1,2}(\.\d{1,2})*$/
				return data.match(regla)
			}
			function predecirItem(data) {
				var listaNumeros = data.split(".")
				var opciones = []
				var numTemp = ""
				for (let i = 0; i < listaNumeros.length; i++) {
					const numero = listaNumeros[i];
					var last2 = Number(numero)
					last2++
					var numTemp2 = numTemp + "." + last2
					if (i == 0) {
						numTemp2 = numTemp2.substr(1);
						numTemp = Number(numero)
					} else {
						numTemp += "." + Number(numero)
					}
					opciones.push(numTemp2)
				}
				numTemp += ".1"
				opciones.push(numTemp)
				return opciones
			}
			var itemsErroneos = []
			var erroresSecuenciaItems = []
			var opciones = [rows[fila][columna].toString()]
			var itemPrevio = rows[fila][columna]
			for (let index = fila; index < rows.length; index++) {
				const row = rows[index];
				if (row[columna] != null && !itemStructure(row[columna])) {
					itemsErroneos.push(
						{
							item: row[columna],
							descripcion: row[columna + 1],
							fila: index
						}
					)
				}
				if (row[columna]) {
					if (opciones.indexOf(row[columna].toString()) == -1) {
						erroresSecuenciaItems.push(
							{
								itemPrevio: itemPrevio,
								itemActual: row[columna]
							}
						)
					}
					opciones = predecirItem(row[columna].toString())
					itemPrevio = row[columna]
				}
			}
			setItemsErroneos(itemsErroneos)
			setErroresSecuenciaItems(erroresSecuenciaItems)
			//--------------------------------------------------------// 
			function Redondear(data) {
				data = Math.round(data * 10000000000) / 10000000000
				data = Math.round(data * 100) / 100
				return data
			}
			// CREAMOS EL DATA DE PLANILLA DE METRADOS 
			var obActividades = {}
			for (let index = fila; index < rows.length; index++) {
				temp = rows[index]
				if ((rows[index][columna + 6] !== null || rows[index][columna + 7] !== null) && rows[index][columna] !== null) {
					tipo = "partida"
					// si la columna total tiene un valor
					PlanillaMetrados.push(obPlanilla)
					obPlanilla = {}
					obPlanilla.tipo = "partida"
					obPlanilla.item = rows[index][columna]
					obPlanilla.descripcion = rows[index][columna + 1]
					obPlanilla.actividades = []
					obPlanilla.veces = rows[index][columna + 2]
					obPlanilla.largo = rows[index][columna + 3]
					obPlanilla.ancho = rows[index][columna + 4]
					obPlanilla.alto = rows[index][columna + 5]
					// obPlanilla.parcial = rows[index][columna + 6]
					obPlanilla.metrado = Redondear(rows[index][columna + 7])
				} else if (rows[index][columna] === null && (rows[index][columna + 6] !== null) || (rows[index][columna + 7] !== null)) {
					tipo = "actividad subtitulo"
					var obActividades = {}
					// titulo                            
					obActividades.tipo = "subtitulo"
					// nombre                            
					obActividades.nombre = rows[index][columna + 1]
					// veces
					obActividades.veces = rows[index][columna + 2]
					// largo
					obActividades.largo = rows[index][columna + 3]
					// ancho
					obActividades.ancho = rows[index][columna + 4]
					// alto
					obActividades.alto = rows[index][columna + 5]
					// parcial
					if (rows[index][columna + 7] !== null) {
						obActividades.parcial = Redondear(rows[index][columna + 7])
					} else {
						obActividades.parcial = Redondear(rows[index][columna + 6])
					}

					obPlanilla.actividades.push(obActividades)
				} else if (rows[index][columna] !== null && rows[index][columna + 1] !== null) {
					// TITULOS
					tipo = "titulo"
					PlanillaMetrados.push(obPlanilla)
					obPlanilla = {}
					obPlanilla.tipo = "titulo"
					obPlanilla.item = rows[index][columna]
					obPlanilla.descripcion = rows[index][columna + 1]
				} else if (rows[index][columna + 1] !== null) {
					tipo = "actividad titulo"
					var obActividades = {}
					// titulo                            
					obActividades.tipo = "titulo"
					// nombre                            
					obActividades.nombre = rows[index][columna + 1]
					obPlanilla.actividades.push(obActividades)
				}
			}
			PlanillaMetrados.push(obPlanilla)
			PlanillaMetrados = PlanillaMetrados.slice(1, PlanillaMetrados.length)
			// insertando actividades unicas
			for (let j = 0; j < PlanillaMetrados.length; j++) {
				tipo = "actividades unicas"
				if (typeof PlanillaMetrados[j].actividades !== 'undefined' && PlanillaMetrados[j].actividades.length === 0) {
					var obActividades = {}
					// convertimos variable si no es null
					var veces = PlanillaMetrados[j].veces
					var largo = PlanillaMetrados[j].largo
					var alto = PlanillaMetrados[j].alto
					var ancho = PlanillaMetrados[j].ancho
					var metrado = PlanillaMetrados[j].metrado
					// veces = (veces === null) ? veces : Number(veces).toFixed(2)
					// largo = (largo === null) ? largo : Number(largo).toFixed(2)
					// alto = (alto === null) ? alto : Number(alto).toFixed(2)
					// ancho = (ancho === null) ? ancho : Number(ancho).toFixed(2)
					// metrado = (metrado === null) ? metrado : Number(metrado.toFixed(2)) 
					// console.log('verifica >', typeof veces ,'>' , veces) 
					obActividades.tipo = "subtitulo"
					obActividades.nombre = "Actividad unica"
					obActividades.veces = veces
					obActividades.largo = largo
					obActividades.ancho = ancho
					obActividades.alto = alto
					obActividades.parcial = metrado
					PlanillaMetrados[j].actividades.push(obActividades)
				}
				delete PlanillaMetrados[j].veces
				delete PlanillaMetrados[j].largo
				delete PlanillaMetrados[j].alto
				delete PlanillaMetrados[j].ancho
			}

			//revisando sumatorias de actividades
			var erroresSuma = []
			for (let index = 0; index < PlanillaMetrados.length; index++) {
				const partida = PlanillaMetrados[index];
				var suma = 0;
				if (partida.tipo == "partida") {
					for (let j = 0; j < partida.actividades.length; j++) {
						const parcial = partida.actividades[j].parcial;
						if (parcial) {
							suma += parcial
						}
					}
					if (PlanillaMetrados[index].metrado != suma.toFixed(2)) {
						erroresSuma.push(
							{
								"item": PlanillaMetrados[index].item,
								"total": Number(PlanillaMetrados[index].metrado),
								"suma": suma.toFixed(2)
							}
						)
					}
				}
			}
			setPlanillaMetrados(PlanillaMetrados)
			setDataPlanilla(PlanillaMetrados)
			setErroresSuma(erroresSuma)

		} catch (error) {
			alert('algo salió mal')
			console.log("error presentado ",error);
			console.log("planilla",PlanillaMetrados);
			console.log("ultimo planilla procesado ",PlanillaMetrados[PlanillaMetrados.length-1]);
		}
	}

	function verificarDatos() {
		var Errores = 0
		var ErroresArray1 = []
		var ErroresArray2 = []
		var DataPlanillaTemp = [...DataPlanilla]
		// eliminamos los titulo del  array 
		console.log("DataPlanilla",DataPlanillaTemp);
		
		console.log("eliminando titulos");
		for (let i = 0; i < PlanillaMetrados.length; i++) {
			console.log("for");
			const tipo = PlanillaMetrados[i].tipo;
			if (tipo === 'titulo') {
				PlanillaMetrados.splice(i, 1)
				i--
			}
		}
		console.log("DataPlanilla",DataPlanillaTemp);
		// verifica que sean del mismo tamaño los datas de Costos unitarios y Planilla de metrados 
		if (CostosUnitarios.length !== PlanillaMetrados.length) {
			if (CostosUnitarios.length >= PlanillaMetrados.length) {
				for (let i = 0; i < CostosUnitarios.length; i++) {
					var data = CostosUnitarios[i]
					var encontrado = false
					for (let j = 0; j < PlanillaMetrados.length; j++) {
						if (data.item === PlanillaMetrados[j].item) {
							encontrado = true
							break
						}
					}
					if (!encontrado) {
						ErroresArray1.push(data)
					}
				}
			} else {
				for (let i = 0; i < PlanillaMetrados.length; i++) {
					var data = PlanillaMetrados[i]
					var encontrado = false
					for (let j = 0; j < CostosUnitarios.length; j++) {
						if (data.item === CostosUnitarios[j].item) {
							encontrado = true
							break
						}
					}
					if (!encontrado) {
						ErroresArray1.push(data)
					}
				}

			}

			Errores = 'tamaños diferentes'
		} else {
			for (let index = 0; index < CostosUnitarios.length; index++) {
				var CostosUnitariosTemp = CostosUnitarios[index].item || CostosUnitarios[index].item.trim()
				var PlanillaMetradosTemp = PlanillaMetrados[index].item || PlanillaMetrados[index].item.trim()
				if (CostosUnitariosTemp == PlanillaMetradosTemp) {
					// console.log('coincide')
				} else {
					console.log('algo no coincide')
					Errores++
					// console.log(CostosUnitarios[index] ,  PlanillaMetrados[index])
					alert("ACU" + CostosUnitarios[index].item + " - planilla " + PlanillaMetrados[index].item)
					ErroresArray1.push(CostosUnitarios[index])
					ErroresArray2.push(PlanillaMetrados[index])
				}
			}
		}
		// console.log('errores encontrados', Errores)
		// uniendo planilla de datos y acu 
		if (Errores === 0) {
			var indexData1 = 0
			for (let i = 0; i < DataPlanillaTemp.length; i++) {
				if (DataPlanillaTemp[i].tipo === 'partida') {
					delete DataPlanillaTemp[i]['nombre']
					DataPlanillaTemp[i].item = CostosUnitarios[indexData1].item
					DataPlanillaTemp[i].descripcion = CostosUnitarios[indexData1].descripcion
					DataPlanillaTemp[i].unidad_medida = CostosUnitarios[indexData1].unidad_medida
					DataPlanillaTemp[i].costo_unitario = CostosUnitarios[indexData1].costo_unitario
					DataPlanillaTemp[i].equipo = CostosUnitarios[indexData1].equipo
					DataPlanillaTemp[i].rendimiento = CostosUnitarios[indexData1].rendimiento
					DataPlanillaTemp[i].recursos = CostosUnitarios[indexData1].recursos
					indexData1++
				}
				DataPlanillaTemp[i].componentes_id_componente = ComponenteSeleccionado
				// DataPlanillaTemp[i].presupuestos_id_presupuesto = idPresupuesto 
			}
		}
		// console.log('data modificada DataPlanillaTemp', DataPlanillaTemp) 
		setErrores1(ErroresArray1)
		setErrores2(ErroresArray2)
		setErroresEncontrado('Errores encontrados : ' + Errores)
		setDataFinal((Errores == 'tamaños diferentes' || Errores > 0) ? ErroresArray1 : DataPlanillaTemp)
	}
	function EnviarDatos() {

		var data = {
			"estado": sessionStorage.getItem("estado"),
			"partidas": DataFinal
		}
		if (confirm('Estas seguro de enviar las partidas !este proceso es irreversible')) {
			axios.post(`${UrlServer}/nuevasPartidas`,
				data
			)
				.then((res) => {
					console.log(res)
					fetchComponentesIngresados()
					alert("exito")
					setCostosUnitarios([])
					setPlanillaMetrados([])
				})
				.catch((err) => {
					alert('errores al ingresar los datos')
					console.log(err)
				})
		}
	}
	return (
		<div>
			<CardHeader className="p-2">
				{ComponentesIngresados.length > 0 &&
					<strong>Componentes Partidas Ingresados</strong>
				}
				<table>
					<thead>
						<tr>
							<th>
								numero
							</th>
							<th>
								nombre
							</th>
							<th>
								recursos
							</th>
						</tr>
					</thead>
					<tbody>
						{ComponentesIngresados.map((compomente, i) =>
							<tr>
								<td>
									{compomente.numero}
								</td>
								<td>
									{compomente.nombre}
								</td>
								<td>
									{compomente.recurso_descripcion == null
										?
										"sin recursos"
										:
										"con recursos"}
								</td>
							</tr>
						)}
					</tbody>
				</table>
				<br />
				<div className="float-left">
					<select className="form-control form-control-sm m-0"
						onChange={e => setComponenteSeleccionado(e.target.value)}
					>
						<option>Selecione</option>
						{Array.isArray(Componentes) && Componentes.map((componente, i) =>
							<option key={i} value={componente.id_componente}>
								{componente.numero + " " + componente.nombre}
							</option>
						)}
					</select>
				</div>
				<br />
				<br />
			</CardHeader>
			<Row>
				<Col sm="4">
					<fieldset>
						<legend><b>cargar datos de Costos unitarios</b></legend>
						<input type="file" id="inputCostoUnitario" />
						<Button outline onClick={CostosUnitarios1} color="success" size="sm">FORMATO S10</Button>
						<Button outline onClick={CostosUnitariosDelphi} color="success" size="sm">FORMATO DELPHI</Button>
						{RecursosErroresTamanyo.map((err, i) =>
							<label key={i} className="text-danger">
								el siguiente recurso tiene errores {err.item + " " + err.recurso.tipo + " " + err.recurso.descripcion + " " + err.recurso.unidad}
							</label>
						)}
						<code>
							<ReactJson src={CostosUnitarios} name="CostosUnitarios" theme="monokai" collapsed={2} displayDataTypes={false} />
						</code>
					</fieldset>
				</Col>
				<Col sm="4">
					<fieldset>
						<legend><b>cargar datos de Planilla de metrados</b></legend>
						<input type="file" id="inputPlanillaMetrados" />
						<Button outline onClick={PlanillaMetrados1} color="success" size="sm">FORMATO S10</Button>
						<Button outline onClick={PlanillaMetradosDelphi} color="success" size="sm">FORMATO DELPHI</Button>
						<hr />
						{ItemsErroneos.map((err) =>
							<label className="text-danger">Item mal escrito {err.item} - {err.descripcion} fila: {err.fila}</label>
						)}
						<hr />
						{ErroresSecuenciaItems.map((err) =>
							<label className="text-danger"> {"item previo " + err.itemPrevio + " item actual " + err.itemActual} </label>
						)}
						{ErroresSuma.map((err) =>
							<div>
								<label className="text-danger">{err.item + " total partida: " + err.total + " suma actividades: " + err.suma}</label><br />
							</div>
						)}
						<code className="small">
							<ReactJson src={PlanillaMetrados} name="PlanillaMetrados" theme="monokai" collapsed={2} displayDataTypes={false} />
						</code>
					</fieldset>
				</Col>
				{ComponenteSeleccionado > 0 &&
					< Col sm="4">
						<fieldset>
							<legend><b>Opciones de manejo de los datos cargados</b></legend>
							<Button outline color="warning" onClick={verificarDatos}> verificar datos</Button>
							<i>{ErroresEncontrado}</i>
							<Button outline color="warning" onClick={EnviarDatos}> Guardar datos </Button>
							<code>
								<ReactJson src={DataFinal} name="DataFinal" theme="monokai" collapsed={2} displayDataTypes={false} />
							</code>
						</fieldset>
					</Col>
				}

			</Row>
		</div >
	)

}