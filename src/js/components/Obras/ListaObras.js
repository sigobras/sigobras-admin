import React, { Component } from 'react';
import axios from 'axios'
import { Card, Button, CardHeader, FormGroup, CardBody, Input, Label, Table, Modal, Form, ModalBody, ModalFooter } from 'reactstrap';
import { UrlServer } from '../Utils/ServerUrlConfig'
console.log("UrlServersdfs", UrlServer);
class ListaObras extends Component {
	constructor() {
		super()
		this.state = {
			listaObras: [],
			DataUsuarios: [],
			modal: false,
			modal2: false,
			modal3: false,
			IdObra: '',
			idUser: '',
			Componentes: [],
			modalPersonal: false,
			DataPersonal: [],
		}
		this.Modal = this.Modal.bind(this)
		this.CapturarIdObra = this.CapturarIdObra.bind(this)
		this.GuardarDatos = this.GuardarDatos.bind(this)
		this.ModalComponentes = this.ModalComponentes.bind(this)
		this.ListarComponentesPorId = this.ListarComponentesPorId.bind(this)
		this.apiComponentes = this.apiComponentes.bind(this)
		this.VerificacionValorizacion = this.VerificacionValorizacion.bind(this)
		this.PersonalObra = this.PersonalObra.bind(this)
		this.CompletarPartidas = this.CompletarPartidas.bind(this)
		this.RevisarPresupuesto = this.RevisarPresupuesto.bind(this)
		this.IngresoAnalitico = this.IngresoAnalitico.bind(this)
		
	}
	componentWillMount() {
		axios.get(`${UrlServer}/listaObras`)
			.then((res) => {
				// console.log(res.data);
				this.setState({
					listaObras: res.data
				})
			})
			.catch((error) => {
				console.log('ERROR', error);
				alert('algo ha salido mal')
			})
	}
	Modal() {
		this.setState(prevState => ({
			modal: !prevState.modal
		}));
	}
	CapturarIdObra(id_ficha) {
		axios.post(`${UrlServer}/getUsuariosConAcceso`,
			{
				id_ficha: id_ficha
			}
		)
			.then((res) => {
				this.setState({
					DataUsuarios: res.data
				})
			})
			.catch((error) => {
				console.log('ERROR', error);
				alert('algo ha salido mal')
			})
		this.setState({
			IdObra: id_ficha
		})
		this.Modal()
	}
	ModalComponentes() {
		this.setState(prevState => ({
			modal2: !prevState.modal2
		}));
	}
	ListarComponentesPorId(id_ficha) {
		sessionStorage.setItem('idFicha', id_ficha)
		sessionStorage.setItem('estado', 'Partida Nueva')
		window.location.href = "/PartidasNuevas";
	}
	CompletarPartidas(id_ficha) {
		sessionStorage.setItem('idFicha', id_ficha)
		sessionStorage.setItem('estado', 'oficial')
		window.location.href = "/PartidasNuevas";
	}
	PersonalObra(id_ficha) {
		if (this.state.modalPersonal == false) {
			axios.post(`${UrlServer}/getPersonalObra`,
				{
					"id_ficha": id_ficha
				}
			)
				.then((res) => {
					console.log(res.data);
					this.setState({
						DataPersonal: res.data
					})
				})
				.catch((error) => {
					console.log('ERROR', error);
					alert('algo ha salido mal')
				})
		}
		this.setState(prevState => ({
			modalPersonal: !prevState.modalPersonal
		}));
	}
	apiComponentes(id_ficha) {
		axios.post(`${UrlServer}/listaComponentesPorId`, {
			"id_ficha": id_ficha
		})
			.then((res) => {
				this.setState({
					Componentes: res.data
				})
				console.log("componentes", res.data);
			})
			.catch((error) => {
				alert("ERROR")
				console.log(error);
			})
	}
	ingresarComponentes(id_ficha, g_meta) {
		sessionStorage.setItem('idFicha', id_ficha)
		window.location.href = "/ComponentesNuevos";
	}
	IngresarCuadroMetrados(id_ficha, g_meta) {
		sessionStorage.setItem('idFicha', id_ficha)
		window.location.href = "/IngresoCudroMetradosEjecutados";
	}
	VerificacionValorizacion(id_ficha) {
		sessionStorage.setItem('idFicha', id_ficha)
		window.location.href = "/VerificacionValorizacion";
	}
	HistorialObra(id_ficha) {
		sessionStorage.setItem('idFicha', id_ficha)
		window.location.href = "/HistorialObra";
	}
	GuardarDatos() {
		axios.post(`${UrlServer}/asignarObra`, {
			Accesos_id_acceso: this.state.idUser,
			Fichas_id_ficha: this.state.IdObra
		})
			.then((res) => {
				alert('exito ')
			})
			.catch((error) => {
				console.log('ERROR', error);
				alert('algo ha salido mal')
			})
		this.Modal()
	}
	RevisarPresupuesto(id_ficha) {
		sessionStorage.setItem('idFicha', id_ficha)
		window.location.href = "/RevisarPresupuesto";
	}
	IngresoAnalitico(id_ficha) {
		sessionStorage.setItem('idFicha', id_ficha)
		window.location.href = "/IngresoAnalitico";
	}
	render() {
		const { listaObras, DataUsuarios, Componentes, DataPersonal } = this.state
		return (
			<div>
				<table className="table table-bordered table-hover table-sm">
					<thead>
						<tr>
							<th>ID</th>
							<th>Codigo</th>
							<th>Asignar Acceso a usuario</th>
							<th>Partidas nuevas</th>
							<th>Componentes nuevos</th>
							<th>Completar Partidas</th>
							<th>Metrados</th>
							<th>valorizacion</th>
							<th>Crear historial</th>
							<th>Personal de la obra</th>
							<th>Revisar Presupuesto</th>
						</tr>
					</thead>
					<tbody>
						{listaObras === undefined ? 'cargando' : listaObras.map((obra, index) =>
							<tr key={index}>
								<td>{obra.id_ficha}</td>	
								<td>{obra.codigo}</td>
								<td>
									<button className="btn btn-outline-success" onClick={(e) => this.CapturarIdObra(obra.id_ficha)}>acceso</button>
								</td>
								<td>
									<button className="btn btn-outline-success" onClick={(e) => this.ListarComponentesPorId(obra.id_ficha)}> P.N.</button>
								</td>
								<td>
									<button className="btn btn-outline-success" onClick={(e) => this.ingresarComponentes(obra.id_ficha)}> C.N.</button>
								</td>
								<td>
									<button className="btn btn-outline-success" onClick={(e) => this.CompletarPartidas(obra.id_ficha)}> Comp Pa.</button>
								</td>
								<td>
									<button className="btn btn-outline-success" onClick={(e) => this.IngresarCuadroMetrados(obra.id_ficha)}>M</button>
								</td>
								<td>
									<button className="btn btn-outline-success" onClick={(e) => this.VerificacionValorizacion(obra.id_ficha)}>val</button>
								</td>
								<td>
									<button className="btn btn-outline-success" onClick={(e) => this.HistorialObra(obra.id_ficha)}>Hist</button>
								</td>
								<td>
									<button className="btn btn-outline-success" onClick={() => this.PersonalObra(obra.id_ficha)}>Pers</button>
								</td>
								<td>
									<button className="btn btn-outline-success" onClick={() => this.RevisarPresupuesto(obra.id_ficha)}>Rev presu.</button>
								</td>
								<td>
									<button className="btn btn-outline-success" onClick={() => this.IngresoAnalitico(obra.id_ficha)}>Ingreso de analitico</button>
								</td>
							</tr>
						)}
					</tbody>
				</table>
				<Modal isOpen={this.state.modal}
					toggle={this.Modal} className={this.props.className}>
					<Form onSubmit={this.GuardarDatos}>
						<ModalBody>
							<FormGroup>
								<Label for="exampleSelect">SELECCIONE EL USUARIO {this.state.idUser}</Label>
								<Input type="select" onChange={(e) => this.setState({ idUser: e.target.value })}>
									<option>SELECCIONE</option>
									{DataUsuarios.map((usuarios, iusuers) =>
										<option key={iusuers} value={usuarios.id_acceso}>DNI : {usuarios.dni}  Nombre: {usuarios.nombre} {usuarios.apellido_paterno} {usuarios.apellido_materno} </option>
									)}
								</Input>
							</FormGroup>
						</ModalBody>
						<ModalFooter>
							<Button color="primary" type="submit">Guardar</Button>{' '}
							<Button color="secondary" onClick={this.Modal}>Cancelar</Button>
						</ModalFooter>
					</Form>
				</Modal>
				{/* Modal que muestra el Personal Obra */}
				<Modal modal-dark isOpen={this.state.modalPersonal} toggle={this.PersonalObra} size="lg">
					<ModalBody>
						<Table className="table table-bordered table-hover table-sm table-dark "  >
							<thead >
								<tr>
									<th><center>N°</center></th>
									<th><center> Cargo</center></th>
									<th><center>Nombres y Apellidos</center>  </th>
									<th><center> DNI</center></th>
									<th><center> CPT</center></th>
									<th><center> Celular</center></th>
									<th><center> E-mail</center></th>
								</tr>
							</thead>
							<tbody>
								{DataPersonal.map((usuarios, index) =>
									<tr>
										<td><center>{index + 1}</center></td>
										<td> {usuarios.cargo}</td>
										<td> {usuarios.nombre} {usuarios.apellido_paterno} {usuarios.apellido_materno} </td>
										<td> {usuarios.dni}</td>
										<td> {usuarios.cpt}</td>
										<td> {usuarios.celular}</td>
										<td> {usuarios.email}</td>
									</tr>
								)}
							</tbody>
						</Table>
					</ModalBody>
				</Modal>
			</div>
		);
	}
}
export default ListaObras;