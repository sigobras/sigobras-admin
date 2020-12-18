import React, { useEffect, useState, Fragment, forwardRef, useImperativeHandle, useRef } from 'react';
import { InputGroupAddon, InputGroupText, InputGroup, Nav, NavItem, NavLink, Input, Row, Col, Form, Label, FormGroup, Button, ButtonGroup, Container, ModalBody, ModalHeader, ModalFooter, Modal, Table, CustomInput, ButtonToggle } from 'reactstrap';
import axios from 'axios';
import { UrlServer } from '../Utils/ServerUrlConfig';

export default () => {

	useEffect(() => {
		fetchEstadosObras()
		fetchDataHistorialObra()
		return () => {

		}
	}, [])
	const [EstadosObras, setEstadosObras] = useState([])
	async function fetchEstadosObras() {
		const res = await axios.post(`${UrlServer}/estadosObra`,

		)
		console.log("poropopo", res.data);
		setEstadosObras(res.data)
	}

	const handleInputChange = (event, index) => {
		console.log("data", index, event.target.name, event.target.value);
		var clone = [...DataHistorialObra]
		clone[index][event.target.name] = event.target.value
		setDataHistorialObra(
			clone
		)
		console.log("clone", clone);
	}

	const [DataHistorialObra, setDataHistorialObra] = useState([])
	async function fetchDataHistorialObra() {
		const res = await axios.get(`${UrlServer}/historialEstados`,
			{
				params: {
					id_ficha: sessionStorage.getItem("idobra")
				}
			}

		)
		console.log("poropopo 2", res.data);
		setDataHistorialObra(res.data)
	}

	function agregarFila() {
		var clone = [...DataHistorialObra]
		// clone[event.target.name] = event.target.value
		clone.push(
			{
				"Estados_id_Estado": "",
				"fecha_inicial": "",
				"Fichas_id_ficha": sessionStorage.getItem("idobra")
			}
		)
		console.log("clone push", clone);
		setDataHistorialObra(
			clone
		)
	}

	function quitarFila(index) {
		var clone = [...DataHistorialObra]
		clone.splice(index, 1)
		console.log("clone splice", clone);
		setDataHistorialObra(
			clone
		)
	}

	async function saveData(event) {
		event.preventDefault()
		console.log("Guardar");
		var clone = [...DataHistorialObra]
		clone.sort(
			(a, b) => new Date(a.fecha_inicial) - new Date(b.fecha_inicial)
		);
		//Agregando fechas finales
		for (let i = 0; i < clone.length; i++) {
			const item = clone[i];
			if (i < clone.length - 1) {
				item.fecha_final = clone[i + 1].fecha_inicial
			} else {
				item.fecha_final = "2030-12-31"
			}
		}
		console.log("clone0", clone);
		
		const res = await axios.post(`${UrlServer}/historialEstados`,
			clone
		)
		alert("Datos guardados exitosamente")
		fetchDataHistorialObra()
	}
	return (
		<div>


			<Form onSubmit={saveData}>
				<Button
					color="primary"
					type="button"
					onClick={() => agregarFila()}
				>Agregar</Button>
				<Button
					color="success"
				>Guardar</Button>
				<Table>
					<thead>
						<tr>
							<th>FECHA INICIAL</th>
							<th>ESTADO</th>
							<th>OPCIONES</th>
							{/* <th>Permitir editar en la interfaz fecha inicial y estado de obra</th>
							<th>Data lista y al presionar guardar 1) Ordenar todas las fechas iniciales 2) despues generar las fehas finales</th> */}

						</tr>
					</thead>
					<tbody>
						{
							DataHistorialObra.map((item, i) =>
								<tr>
									<td>
										<Input
											type="date"
											name="fecha_inicial"
											value={item.fecha_inicial}
											onChange={(event) => handleInputChange(event, i)}
											required
										/>
									</td>
									<td>
										<Input
											type="select"
											name="Estados_id_Estado"
											onChange={(event) => handleInputChange(event, i)}
											value={item.Estados_id_Estado}
											required
										>
											<option value="">SELECCIONAR</option>
											{
												EstadosObras.map((item, i) =>
													<option
														value={item.id_Estado}
													>{item.nombre}</option>
												)
											}

										</Input>
									</td>
									<td>
										<Button
											color="danger"
											onClick={() => quitarFila(i)}
										>-</Button>
									</td>
								</tr>
							)
						}
					</tbody>
				</Table>
			</Form >
		</div>

	)
}