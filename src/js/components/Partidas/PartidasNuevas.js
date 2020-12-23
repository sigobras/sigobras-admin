import React, { useEffect, useState } from 'react'
import readXlsxFile from 'read-excel-file'
import { Button, CardHeader, Row, Col, Collapse } from 'reactstrap';
import axios from 'axios'
import { UrlServer } from '../Utils/ServerUrlConfig'
import ReactJson from 'react-json-view'
export default () => {
	useEffect(() => {
		fetchComponentes()
		fetchComponentesIngresados()

	}, []);
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
		}

	}
	async function PlanillaMetrados1() {
		try {
			var seguimientoProceso = ["inicio"]
			const input = document.getElementById('inputPlanillaMetrados')
			var temp = 0
			var PlanillaMetrados = []
			var tipo = ""
			var obPlanilla = {}
			var rows = await readXlsxFile(input.files[0])
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
							// console.log('palabra item fila : %s columna %s', index + 1, columna + 1)
							break
						}
					}
				} else {
					if (rows[index][columna] != null) {
						fila = index
						// console.log('primer dato fila: %s columna %s', fila + 1, columna + 1)
						break;
					}
				}
			}
			seguimientoProceso.push("se econtro item")
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
			seguimientoProceso.push("inicio - revision estructura de itemas")
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
			seguimientoProceso.push("fin - revision extructura de items")
			setItemsErroneos(itemsErroneos)
			setErroresSecuenciaItems(erroresSecuenciaItems)
			//--------------------------------------------------------// 
			function Redondear(data) {
				data = Math.round(data * 10000000000) / 10000000000
				data = Math.round(data * 100) / 100
				return data
			}
			seguimientoProceso.push("inicio - creacion de planilla de metrados")
			var debug = false
			// CREAMOS EL DATA DE PLANILLA DE METRADOS 
			var obActividades = {}
			for (let index = fila; index < rows.length; index++) {
				temp = rows[index]
				if (
					(
						rows[index][columna + 6] !== null
						||
						rows[index][columna + 7] !== null
					)
					&&
					rows[index][columna] !== null
				) {
					if (debug) {
						console.log("debug partida");
					}
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
					if (debug) {
						console.log("debug actividad subititulo");
					}
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
					if (debug) {
						console.log("debug titulo");
					}
					// TITULOS
					tipo = "titulo"
					PlanillaMetrados.push(obPlanilla)
					obPlanilla = {}
					obPlanilla.tipo = "titulo"
					obPlanilla.item = rows[index][columna]
					obPlanilla.descripcion = rows[index][columna + 1]
				} else if (rows[index][columna + 1] !== null) {
					if (debug) {
						console.log("debug actividad titulo");
					}
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
			seguimientoProceso.push("fin - creacion de planilla de metrados")
			seguimientoProceso.push("inicio - insertando actividades unicas")
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
			seguimientoProceso.push("fin - insertando actividades unicas")
			seguimientoProceso.push("inicio - revisando sumatorias")
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
			seguimientoProceso.push("fin - revisando sumatorias")

			setPlanillaMetrados(PlanillaMetrados)
			setDataPlanilla(PlanillaMetrados)
			setErroresSuma(erroresSuma)


		} catch (error) {
			console.log("error presentado", error);
			console.log("PlanillaMetrados", PlanillaMetrados);
			console.log("ultima planilla", PlanillaMetrados[PlanillaMetrados.length - 1]);
			console.log(PlanillaMetrados[PlanillaMetrados.length - 1].tipo + " ? => " + PlanillaMetrados[PlanillaMetrados.length - 1].item + " " + PlanillaMetrados[PlanillaMetrados.length - 1].descripcion,
				obPlanilla.tipo + " ? =>  " + obPlanilla.item + " " + obPlanilla.descripcion, tipo + " ? => " + temp[0] + " ?" + temp[1] + " ? " + temp[2] + " ? " + temp[3])
			console.log("seguimiento ", seguimientoProceso);
			alert('algo salió mal')

		}


	}
	const [PlanillaProceso, setPlanillaProceso] = useState([])
	const [DataCategorizada, setDataCategorizada] = useState([])
	const [UltimoTitulo, setUltimoTitulo] = useState("")
	const [UltimaPartida, setUltimaPartida] = useState("")
	const [ErroresEstructuraCategorias, setErroresEstructuraCategorias] = useState([])
	async function PlanillaMetrados2() {
		var seguimientoProceso = ["inicio"]
		var inputPlanillaMetrados = document.getElementById('inputPlanillaMetrados')
		var rows = await readXlsxFile(inputPlanillaMetrados.files[0])
		console.log("inputPlanillaMetrados ", inputPlanillaMetrados);
		try {
			setPlanillaProceso(seguimientoProceso)
			var PlanillaMetrados = []
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
			seguimientoProceso.push("se econtro item")
			setPlanillaProceso(seguimientoProceso)
			//revisando items bien estructurados y secuencia de items
			function itemStructure(data) {
				data = data.toString();
				var regla = /^\d{1,2}(\.\d{1,2})*$/
				return data.match(regla)
			}
			function predecirItem(data) {
				var listaNumeros = data.split(".")
				console.log("listaNumeros", listaNumeros);
				var opciones = []
				var numTemp = ""
				for (let i = 0; i < listaNumeros.length; i++) {
					const numero = listaNumeros[i];
					var temp = numTemp
					if (i == 0) {
						numTemp = numero
					} else {
						var op1 = temp + "." + (parseInt(numero) + 1)
						opciones.push(op1)
						opciones.push(op1 + ".0")
						numTemp += "." + numero
					}
				}
				numTemp += ".1"
				opciones.push(numTemp)
				opciones.push(numTemp += ".0")
				return opciones
			}
			function removeLeadingZeros(item) {
				var itemArray = item.split(".")
				itemArray.forEach((item, i) => {
					itemArray[i] = Number(item)
				});
				return itemArray.join(".")
			}
			var itemsErroneos = []
			var erroresSecuenciaItems = []
			var opciones = [removeLeadingZeros(rows[fila][columna])]
			var itemPrevio = removeLeadingZeros(rows[fila][columna])
			seguimientoProceso.push("inicio - revision estructura de itemas")
			setPlanillaProceso(seguimientoProceso)

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
					console.log("opciones", opciones);
					console.log("buscado ", removeLeadingZeros(row[columna].toString()));
					if (opciones.indexOf(removeLeadingZeros(row[columna].toString())) == -1) {
						erroresSecuenciaItems.push(
							{
								itemPrevio: itemPrevio,
								itemActual: row[columna]
							}
						)
					}
					opciones = predecirItem(removeLeadingZeros(row[columna].toString()))
					itemPrevio = row[columna]
				}
			}
			seguimientoProceso.push("fin - revision extructura de items")
			setPlanillaProceso(seguimientoProceso)
			setItemsErroneos(itemsErroneos)
			setErroresSecuenciaItems(erroresSecuenciaItems)
			//--------------------------------------------------------// 
			function Redondear(data) {
				data = Math.round(data * 10000000000) / 10000000000
				data = Math.round(data * 100) / 100
				return data
			}
			seguimientoProceso.push("inicio - creacion de planilla de metrados")
			setPlanillaProceso(seguimientoProceso)
			var debug = false
			// CREAMOS EL DATA DE PLANILLA DE METRADOS 
			var obActividades = {}
			function compareTwoArrays(array1, condicion) {
				for (var i = 0; i < array1.length; i++) {
					if (array1[i] != condicion[i]) {
						if (condicion[i] != "2") {
							return false;
						}
					}
				}
				return true;
			}
			function revisarEstructura(row, estructuras) {
				var rowTemp = [...row]
				rowTemp.forEach((item, i) => {
					if (item != null || isNaN(item)) {
						rowTemp[i] = 1
					}
					else {
						rowTemp[i] = 0
					}
				})
				// var rowText = rowTemp.toString()
				for (let i = 0; i < estructuras.length; i++) {
					const estruct = estructuras[i];
					// var estructuraText = estruct.toString()
					if (compareTwoArrays(rowTemp, estruct)) {
						return true;
					}
					// if (rowText.includes(estructuraText)) {
					// 	estado = true
					// }
				}
				return false;
			}
			var tituloEstructura = [
				[1, 1, 0, 0, 0, 0, 0, 0]
			]
			var partidaEstructura = [
				[1, 1, 2, 2, 2, 0, 2, 1]
			]
			var actividadTituloEstructura = [
				[0, 1, 0, 0, 0, 0, 2, 2]
			]
			var actividadSubtituloEstructura = [
				[0, 2, 2, 2, 2, 2, 1, 2]
			]
			var dataCategorizada = []
			var erroresEstructuraCategorias = []
			var ultimaCategoria = ""
			// categorizando 
			for (let index = fila; index < rows.length; index++) {
				var tempObject = {}
				if (revisarEstructura(rows[index], tituloEstructura)) {
					tempObject.categoria = "titulo"
					ultimaCategoria = "titulo"
				} else if (revisarEstructura(rows[index], partidaEstructura)) {
					tempObject.categoria = "partida"
					ultimaCategoria = "partida"
				} else if (revisarEstructura(rows[index], actividadTituloEstructura)) {

					if (ultimaCategoria == "titulo") {
						erroresEstructuraCategorias.push(
							{
								categoriaAnterior: ultimaCategoria,
								categoriaActual: "actividad titulo",
								item: rows[index][columna],
								descripcion: rows[index][columna + 1]
							}
						)
					}
					tempObject.categoria = "actividad titulo"
					ultimaCategoria = "actividad titulo"
				} else if (revisarEstructura(rows[index], actividadSubtituloEstructura)) {
					if (ultimaCategoria == "titulo") {
						erroresEstructuraCategorias.push(
							{
								categoriaAnterior: ultimaCategoria,
								categoriaActual: "actividad subtitulo",
								item: rows[index][columna],
								descripcion: rows[index][columna + 1]
							}
						)
					}
					tempObject.categoria = "actividad subtitulo"
					ultimaCategoria = "actividad subtitulo"
				} else {
					tempObject.categoria = "ninguno"
				}
				tempObject.item = rows[index][columna]
				tempObject.descripcion = rows[index][columna + 1]

				//a texto
				var rowTemp = [...rows[index]]
				rowTemp.forEach((item, i) => {
					if (item || isNaN(item)) {
						rowTemp[i] = 1
					}
					else {
						rowTemp[i] = 0
					}
				})
				tempObject.estructura = rowTemp.toString()
				dataCategorizada.push(tempObject)
			}
			setDataCategorizada(dataCategorizada)
			setErroresEstructuraCategorias(erroresEstructuraCategorias)

			//estructura json
			for (let index = fila; index < rows.length; index++) {
				if (revisarEstructura(rows[index], tituloEstructura)) {
					if (debug) {
						console.log("debug titulo");
					}
					PlanillaMetrados.push(obPlanilla)
					obPlanilla = {}
					obPlanilla.tipo = "titulo"
					obPlanilla.item = rows[index][columna]
					obPlanilla.descripcion = rows[index][columna + 1]
					setUltimoTitulo(obPlanilla.item + " - " + obPlanilla.descripcion)
				} else if (revisarEstructura(rows[index], partidaEstructura)) {
					if (debug) {
						console.log("debug partida");
					}
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
					setUltimaPartida(obPlanilla.item + " - " + obPlanilla.descripcion)
				} else if (revisarEstructura(rows[index], actividadTituloEstructura)) {
					if (debug) {
						console.log("debug actividad titulo");
					}
					var obActividades = {}
					// titulo                            
					obActividades.tipo = "titulo"
					// nombre                            
					obActividades.nombre = rows[index][columna + 1]
					obPlanilla.actividades.push(obActividades)
				} else if (revisarEstructura(rows[index], actividadSubtituloEstructura)) {
					if (debug) {
						console.log("debug actividad subititulo");
					}
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
				}
			}
			PlanillaMetrados.push(obPlanilla)
			PlanillaMetrados = PlanillaMetrados.slice(1, PlanillaMetrados.length)
			seguimientoProceso.push("fin - creacion de planilla de metrados")
			setPlanillaProceso(seguimientoProceso)
			seguimientoProceso.push("inicio - insertando actividades unicas")
			setPlanillaProceso(seguimientoProceso)
			// insertando actividades unicas
			for (let j = 0; j < PlanillaMetrados.length; j++) {
				if (typeof PlanillaMetrados[j].actividades !== 'undefined' && PlanillaMetrados[j].actividades.length === 0) {
					var obActividades = {}
					var veces = PlanillaMetrados[j].veces
					var largo = PlanillaMetrados[j].largo
					var alto = PlanillaMetrados[j].alto
					var ancho = PlanillaMetrados[j].ancho
					var metrado = PlanillaMetrados[j].metrado
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
			seguimientoProceso.push("fin - insertando actividades unicas")
			setPlanillaProceso(seguimientoProceso)
			seguimientoProceso.push("inicio - revisando sumatorias")
			setPlanillaProceso(seguimientoProceso)
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
			seguimientoProceso.push("fin - revisando sumatorias")
			setPlanillaProceso(seguimientoProceso)
			setPlanillaMetrados(PlanillaMetrados)
			setDataPlanilla(PlanillaMetrados)
			setErroresSuma(erroresSuma)


		} catch (error) {
			alert('algo salió mal')
			console.log(error);
		}
	}
	async function PlanillaMetradosDelphi() {
		try {
			var seguimientoProceso = ["inicio"]
			var rows = await readXlsxFile(document.getElementById('inputPlanillaMetrados').files[0])
			var PlanillaMetrados = []
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
							// console.log('palabra item fila : %s columna %s', index + 1, columna + 1)
							break
						}
					}
				} else {
					if (rows[index][columna] != null) {
						fila = index
						// console.log('primer dato fila: %s columna %s', fila + 1, columna + 1)
						break;
					}
				}
			}
			seguimientoProceso.push("se encontro item")
			//revisando items bien estructurados y secuencia de items
			function removeLeadingZeros(item) {
				var itemArray = item.split(".")
				itemArray.forEach((item, i) => {
					itemArray[i] = Number(item)
				});
				return itemArray.join(".")
			}
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
					if (opciones.indexOf(removeLeadingZeros(row[columna].toString())) == -1) {
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
			seguimientoProceso.push("estructura de items verificada")
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
				if ((rows[index][columna + 6] !== null || rows[index][columna + 7] !== null) && rows[index][columna] !== null) {
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
					PlanillaMetrados.push(obPlanilla)
					obPlanilla = {}
					obPlanilla.tipo = "titulo"
					obPlanilla.item = rows[index][columna]
					obPlanilla.descripcion = rows[index][columna + 1]
				} else if (rows[index][columna + 1] !== null) {
					var obActividades = {}
					// titulo                            
					obActividades.tipo = "titulo"
					// nombre                            
					obActividades.nombre = rows[index][columna + 1]
					obPlanilla.actividades.push(obActividades)
				}
			}
			seguimientoProceso.push("se creo la daa de planillas")
			PlanillaMetrados.push(obPlanilla)
			PlanillaMetrados = PlanillaMetrados.slice(1, PlanillaMetrados.length)
			// insertando actividades unicas
			for (let j = 0; j < PlanillaMetrados.length; j++) {
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
			seguimientoProceso.push("se inserto actividades unicas")

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
			seguimientoProceso.push("se reviso sumatorias de actividades")
			setPlanillaMetrados(PlanillaMetrados)
			setDataPlanilla(PlanillaMetrados)
			setErroresSuma(erroresSuma)

		} catch (error) {
			alert('algo salió mal')
			// console.log("error presentado ", error);
			// console.log("planilla", PlanillaMetrados);
			// console.log("ultimo planilla procesado ", PlanillaMetrados[PlanillaMetrados.length - 1]);
			// console.log("seguimiento ", seguimientoProceso);
		}
	}

	function verificarDatos() {

		var DataPlanillaTemp = [...DataPlanilla]
		// eliminamos los titulo del  array 
		for (let i = 0; i < PlanillaMetrados.length; i++) {
			const tipo = PlanillaMetrados[i].tipo;
			if (tipo === 'titulo') {
				PlanillaMetrados.splice(i, 1)
				i--
			}
		}
		var ErroresArray1 = []
		function removeLeadingZeros(item) {
			if(typeof item != "string"){
				item = item.toString();
			}
			var itemArray = item.split(".")
			itemArray.forEach((item, i) => {
				itemArray[i] = Number(item)
			});
			return itemArray.join(".")
		}
		for (let i = 0; i < CostosUnitarios.length; i++) {
			var CU = CostosUnitarios[i]
			var encontrado = PlanillaMetrados.find(element =>
				removeLeadingZeros(element.item) == removeLeadingZeros(CU.item)
			)
			if (!encontrado) {
				ErroresArray1.push({ "tipo": "CU", "item": CU.item })
			}
		}
		var indexData1 = 0
		for (let i = 0; i < DataPlanillaTemp.length; i++) {
			if (DataPlanillaTemp[i].tipo === 'partida') {
				var PM = DataPlanillaTemp[i]
				var encontrado = CostosUnitarios.find(element =>
					removeLeadingZeros(element.item) == removeLeadingZeros(PM.item)
				)
				if (!encontrado) {
					ErroresArray1.push({ "tipo": "PM", "item": CU.item })
				}
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
		}
		setDataFinal(DataPlanillaTemp)
		setErrores1(ErroresArray1)
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
					fetchComponentesIngresados()
					alert("exito")
					setCostosUnitarios([])
					setPlanillaMetrados([])
				})
				.catch((err) => {
					alert('errores al ingresar los datos')
				})
		}
	}
	const [CollapseProcesamiento, setCollapseProcesamiento] = useState(false)
	return (
		<div>

			<Row>
				<Col sm={12}>
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
							{ComponentesIngresados.map((compomente) =>
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
				</Col>

			</Row>
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
						<Button outline onClick={PlanillaMetrados2} color="success" size="sm">FORMATO S10-2</Button>
						<Button outline onClick={PlanillaMetradosDelphi} color="success" size="sm">FORMATO DELPHI</Button>
						<Button color="primary" onClick={() => setCollapseProcesamiento(!CollapseProcesamiento)} style={{ marginBottom: '1rem' }}>Procesamieno</Button>
						<Collapse isOpen={CollapseProcesamiento}>
							{PlanillaProceso.length > 0 && "lista de procesos"}
							<table class="table">
								<tbody>
									{PlanillaProceso.map((item, i) =>
										<tr>
											<td>{i + " - " + item}</td>
										</tr>
									)}
								</tbody>
							</table>

						</Collapse>
						<div>
							Ultima titulo {UltimoTitulo}
						</div>
						<div>
							Ultima partida {UltimaPartida}
						</div>
						{ErroresEstructuraCategorias.map((item, i) =>
							<label className="text-danger">
								{"fila=->" + item.item + " - " + item.descripcion + " | categoria anterior=>" + item.categoriaAnterior + " | categoria actual=>" + item.categoriaActual}
							</label>
						)}
						{ErroresEstructuraCategorias.length > 0 &&
							<div>
								===========================================================
						</div>
						}

						{ItemsErroneos.map((err) =>
							<label className="text-danger">Item mal escrito {err.item} - {err.descripcion} fila: {err.fila}</label>
						)}
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
					<table class="table">
						<tbody>
							{
								DataCategorizada.map((item, i) =>
									<tr>
										<td>{item.categoria}</td>
										<td>{item.item}</td>
										<td>{item.descripcion}</td>
										<td>{item.estructura}</td>
									</tr>
								)
							}
						</tbody>
					</table>

				</Col>
				{ComponenteSeleccionado > 0 &&
					< Col sm="4">
						<fieldset>
							<legend><b>Opciones de manejo de los datos cargados</b></legend>
							<Button outline color="warning" onClick={verificarDatos}> verificar datos</Button>
							<Button outline color="warning" onClick={EnviarDatos}> Guardar datos </Button>
							{Errores1.length > 0 && "ITEMS FALTANTES"}
							{Errores1.map((item) =>
								<div>
									{item.tipo} - {item.item}

								</div>
							)
							}
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